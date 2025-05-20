
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Check, CreditCard, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSubscription } from "@/hooks/useSubscription";

const PlanSelection = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const { toast } = useToast();
  const { isSubscribed, plan, isLoading, handleSubscribe } = useSubscription();

  const handleSubscribeClick = (planType: string) => {
    setIsProcessing(true);

    // Call subscription handler
    handleSubscribe(planType).finally(() => {
      setIsProcessing(false);
    });
  };

  const monthlyPrice = 9.99;
  const annualPrice = 99.99;
  const annualSavings = Math.round(((monthlyPrice * 12 - annualPrice) / (monthlyPrice * 12)) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-center text-2xl font-bold">Upgrade to StudySpark Pro</h2>
        <p className="text-center text-muted-foreground">
          Unlock all features and maximize your study potential
        </p>
      </div>

      <Tabs
        defaultValue="monthly"
        value={billingCycle}
        onValueChange={setBillingCycle}
        className="mx-auto w-fit"
      >
        <TabsList>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="annual">Annual <span className="ml-1 rounded bg-studyspark-purple px-1.5 py-0.5 text-xs text-white">Save {annualSavings}%</span></TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className={plan === 'free' ? 'border-green-500' : ''}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Free Plan</CardTitle>
              {plan === 'free' && (
                <span className="rounded-full bg-green-500 px-3 py-1 text-xs text-white">
                  CURRENT PLAN
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <span className="text-3xl font-bold">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Basic dashboard access</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Create up to 50 flashcards</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Generate 5 quizzes per day</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Track basic study progress</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              disabled={true}
            >
              Current Plan
            </Button>
          </CardContent>
        </Card>

        <Card className={`${plan === 'pro' ? 'border-studyspark-purple' : ''} bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-slate-900`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pro Plan</CardTitle>
              {plan === 'pro' ? (
                <span className="rounded-full bg-studyspark-purple px-3 py-1 text-xs text-white">
                  CURRENT PLAN
                </span>
              ) : (
                <span className="rounded-full bg-studyspark-purple px-3 py-1 text-xs text-white">
                  RECOMMENDED
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <span className="text-3xl font-bold text-studyspark-purple">
                ${billingCycle === "monthly" ? monthlyPrice : (annualPrice / 12).toFixed(2)}
              </span>
              <span className="text-muted-foreground">/month</span>
              {billingCycle === "annual" && (
                <div className="mt-1 text-sm text-muted-foreground">
                  Billed as ${annualPrice}/year
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="font-medium">Everything in Free, plus:</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Unlimited flashcards</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Unlimited AI quizzes</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>AI Concept Explainer</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Advanced progress analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Priority support</span>
              </div>
            </div>

            <Button
              className="w-full studyspark-gradient"
              onClick={() => handleSubscribeClick("pro")}
              disabled={isProcessing || isLoading || plan === 'pro'}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : plan === 'pro' ? (
                "Current Plan"
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Upgrade Now
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mx-auto max-w-md text-center text-sm text-muted-foreground">
        <p>
          Secure payment processed by Stripe. You can cancel your subscription at any time.
        </p>
      </div>
    </div>
  );
};

export default PlanSelection;
