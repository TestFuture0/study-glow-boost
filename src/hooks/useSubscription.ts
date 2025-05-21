
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

export type SubscriptionStatus = {
  isSubscribed: boolean;
  plan: 'free' | 'basic' | 'pro';
  expiresAt: string | null;
  isLoading: boolean;
};

export const useSubscription = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<SubscriptionStatus>({
    isSubscribed: false,
    plan: 'free',
    expiresAt: null,
    isLoading: true,
  });

  // Use cache to prevent excessive loading
  const [lastChecked, setLastChecked] = useState<number | null>(null);
  const CHECK_INTERVAL = 60000; // 1 minute

  const checkSubscription = useCallback(async () => {
    if (!user) {
      setStatus({
        isSubscribed: false,
        plan: 'free',
        expiresAt: null,
        isLoading: false
      });
      return;
    }

    // Check if we've checked recently (within the last minute)
    const now = Date.now();
    if (lastChecked && (now - lastChecked) < CHECK_INTERVAL) {
      // We checked recently, don't check again
      return;
    }

    try {
      setStatus(prev => ({ ...prev, isLoading: true }));
      
      // Call the check-subscription edge function
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error('Error checking subscription:', error);
        throw error;
      }
      
      if (data.error) {
        console.error('Subscription check error:', data.error);
        throw new Error(data.error);
      }
      
      setLastChecked(now);
      setStatus({
        isSubscribed: data.isSubscribed,
        plan: data.plan,
        expiresAt: data.expiresAt,
        isLoading: false
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
      
      // Fall back to database check
      try {
        const { data, error: dbError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (dbError && dbError.code !== 'PGRST116') {
          console.error('Database fallback error:', dbError);
        }
        
        // If subscription exists and is active
        if (data && data.status === 'active' && new Date(data.expires_at) > new Date()) {
          setStatus({
            isSubscribed: true,
            plan: data.plan_type,
            expiresAt: data.expires_at,
            isLoading: false
          });
        } else {
          setStatus({
            isSubscribed: false,
            plan: 'free',
            expiresAt: null,
            isLoading: false
          });
        }
      } catch (dbError) {
        console.error('Database fallback error:', dbError);
        setStatus({
          isSubscribed: false,
          plan: 'free',
          expiresAt: null,
          isLoading: false
        });
      }
    }
  }, [user, lastChecked]);

  // Function to handle subscription checkout
  const handleSubscribe = async (planType: string, billingCycle: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to subscribe",
        variant: "destructive"
      });
      return Promise.reject(new Error("Authentication required"));
    }
    
    try {
      // Call create-checkout edge function
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planType, billingCycle }
      });
      
      if (error) {
        console.error('Error creating checkout session:', error);
        throw error;
      }
      
      if (data.error) {
        console.error('Checkout error:', data.error);
        throw new Error(data.error);
      }
      
      // Redirect to Stripe checkout
      window.location.href = data.url;
      
      return { success: true };
    } catch (error) {
      console.error('Error subscribing:', error);
      toast({
        title: "Subscription failed",
        description: "There was an error processing your subscription",
        variant: "destructive"
      });
      return Promise.reject(error);
    }
  };

  // Function to open customer portal
  const openCustomerPortal = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to manage your subscription",
        variant: "destructive"
      });
      return Promise.reject(new Error("Authentication required"));
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) {
        console.error('Error opening customer portal:', error);
        throw error;
      }
      
      if (data.error) {
        console.error('Customer portal error:', data.error);
        throw new Error(data.error);
      }
      
      // Open customer portal in new tab
      window.open(data.url, '_blank');
      
      return { success: true };
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "There was an error opening the subscription management portal",
        variant: "destructive"
      });
      return Promise.reject(error);
    }
  };

  // Check subscription on mount and when user changes
  useEffect(() => {
    checkSubscription();
  }, [user, checkSubscription]);

  return {
    ...status,
    checkSubscription,
    handleSubscribe,
    openCustomerPortal
  };
};
