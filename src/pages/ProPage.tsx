
import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PlanSelection from "@/components/pro/PlanSelection";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams, useNavigate } from "react-router-dom";

const ProPage = () => {
  const { user } = useAuth();
  const { checkSubscription } = useSubscription();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCanceled, setShowCanceled] = useState(false);
  
  // Check if the URL contains success or canceled parameters
  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");
    
    if (success === "true") {
      setShowSuccess(true);
      toast({
        title: "Subscription successful!",
        description: "Thank you for subscribing to StudySpark Pro.",
        duration: 5000,
      });
      
      // Remove query params after showing toast
      setTimeout(() => {
        navigate("/pro", { replace: true });
      }, 300);
    }
    
    if (canceled === "true") {
      setShowCanceled(true);
      toast({
        title: "Subscription canceled",
        description: "Your subscription process was canceled.",
        variant: "destructive",
      });
      
      // Remove query params after showing toast
      setTimeout(() => {
        navigate("/pro", { replace: true });
      }, 300);
    }
  }, [searchParams, toast, navigate]);

  // Check subscription status when the page loads or after successful payment
  useEffect(() => {
    if (user) {
      checkSubscription();
    }
  }, [user, checkSubscription, showSuccess]);

  return (
    <MainLayout>
      <div className="container mx-auto max-w-5xl py-8 space-y-6">
        <h1 className="text-3xl font-bold text-center">StudySpark Pro</h1>
        
        {/* Success message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <p className="text-green-800">
              Your subscription was successful! You now have access to all Pro features.
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-auto"
              onClick={() => setShowSuccess(false)}
            >
              Dismiss
            </Button>
          </div>
        )}
        
        {/* Canceled message */}
        {showCanceled && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <p className="text-amber-800">
              Your subscription process was canceled. No charges were made.
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-auto"
              onClick={() => setShowCanceled(false)}
            >
              Dismiss
            </Button>
          </div>
        )}
        
        <PlanSelection />
      </div>
    </MainLayout>
  );
};

export default ProPage;
