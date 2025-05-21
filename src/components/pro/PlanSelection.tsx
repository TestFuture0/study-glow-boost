
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Check, CreditCard, Loader2, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const PlanSelection = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const { toast } = useToast();
  const { isSubscribed, plan, expiresAt, isLoading, handleSubscribe, openCustomerPortal, checkSubscription } = useSubscription();
  const { user } = useAuth();
  const [showTestCardDialog, setShowTestCardDialog] = useState(false);

  // Check subscription status on mount and when user changes
  useEffect(() => {
    if (user) {
      checkSubscription();
    }
  }, [user, checkSubscription]);

  // Show formatted expiration date
  const formattedExpiresAt = expiresAt 
    ? new Date(expiresAt).toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : null;

  const handleSubscribeClick = async (planType: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to subscribe",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);

    try {
      await handleSubscribe(planType, billingCycle);
      // No need for toast here as we will be redirected to Stripe
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Subscription failed",
        description: "There was an error processing your subscription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      await openCustomerPortal();
    } catch (error) {
      console.error("Error opening customer portal:", error);
    }
  };

  const monthlyPrice = 9.99;
  const annualPrice = 99.99;
  const annualSavings = Math.round(((monthlyPrice * 12 - annualPrice) / (monthlyPrice * 12)) * 100);

  return (
    <div className="space-y-6">
      {isSubscribed && plan === 'pro' && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-md mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-green-800">You're subscribed to StudySpark Pro!</h3>
              {formattedExpiresAt && (
                <p className="text-sm text-green-700">
                  Your subscription renews on {formattedExpiresAt}
                </p>
              )}
            </div>
            <Button
              variant="outline"
              className="border-green-500 text-green-700 hover:bg-green-50"
              onClick={handleManageSubscription}
            >
              <Settings className="mr-2 h-4 w-4" />
              Manage Subscription
            </Button>
          </div>
        </div>
      )}

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

            {plan === 'pro' ? (
              <Button
                className="w-full"
                variant="outline"
                onClick={handleManageSubscription}
              >
                <Settings className="mr-2 h-4 w-4" />
                Manage Subscription
              </Button>
            ) : (
              <Button
                className="w-full studyspark-gradient"
                onClick={() => handleSubscribeClick("pro")}
                disabled={isProcessing || isLoading}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Upgrade Now
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mx-auto max-w-md text-center text-sm text-muted-foreground">
        <p className="mb-2">
          Secure payment processed by Stripe. You can cancel your subscription at any time.
        </p>
        <Button 
          variant="link" 
          size="sm" 
          onClick={() => setShowTestCardDialog(true)}
        >
          Use a test card
        </Button>
      </div>

      {/* Test Card Dialog */}
      <Dialog open={showTestCardDialog} onOpenChange={setShowTestCardDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Card Details</DialogTitle>
            <DialogDescription>
              Use these test card details to try out the subscription process in Stripe's test environment.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input 
                id="cardNumber" 
                value="4242 4242 4242 4242" 
                readOnly 
                onClick={(e) => e.currentTarget.select()}
              />
              <p className="text-xs text-muted-foreground">This is a Visa test card that will succeed</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input 
                  id="expiryDate" 
                  value="Any future date" 
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input 
                  id="cvc" 
                  value="Any 3 digits" 
                  readOnly
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowTestCardDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlanSelection;
