
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Use service role for writing to database
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");
    
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not set");
    logStep("Stripe key verified");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Check if customer exists in Stripe
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      // No customer record found - user is not subscribed
      await supabaseAdmin.from("subscriptions").upsert({
        user_id: user.id,
        plan_type: "free",
        status: "inactive",
        expires_at: null,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
      
      logStep("No customer found, set as free plan", { userId: user.id });
      return new Response(JSON.stringify({ 
        isSubscribed: false,
        plan: "free", 
        expiresAt: null 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Customer found", { customerId });

    // Check for active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      expand: ["data.default_payment_method"],
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      // No active subscription
      await supabaseAdmin.from("subscriptions").upsert({
        user_id: user.id,
        plan_type: "free",
        status: "inactive",
        expires_at: null,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

      logStep("No active subscription found", { userId: user.id });
      return new Response(JSON.stringify({ 
        isSubscribed: false,
        plan: "free", 
        expiresAt: null 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Active subscription found
    const subscription = subscriptions.data[0];
    const expiresAt = new Date(subscription.current_period_end * 1000).toISOString();
    const interval = subscription.items.data[0]?.plan.interval || "month";
    
    // Create subscription history entry
    const subscriptionHistory = {
      user_id: user.id,
      plan_type: "pro", // Assuming all paid subscriptions are "pro" level
      status: "active",
      action: "verified",
      payment_amount: subscription.items.data[0]?.plan.amount || 0,
      created_at: new Date().toISOString()
    };
    
    await supabaseAdmin.from("subscription_history").insert(subscriptionHistory);
    
    // Update subscription status
    await supabaseAdmin.from("subscriptions").upsert({
      user_id: user.id,
      plan_type: "pro",
      status: "active",
      interval: interval,
      expires_at: expiresAt,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });

    logStep("Active subscription verified", { 
      userId: user.id, 
      expiresAt, 
      interval 
    });

    return new Response(JSON.stringify({ 
      isSubscribed: true,
      plan: "pro", 
      expiresAt
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
