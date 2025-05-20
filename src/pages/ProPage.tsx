
import { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PlanSelection from "@/components/pro/PlanSelection";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/context/AuthContext";

const ProPage = () => {
  const { user } = useAuth();
  const { checkSubscription } = useSubscription();
  
  // Check subscription status whenever the page loads
  useEffect(() => {
    if (user) {
      checkSubscription();
    }
  }, [user, checkSubscription]);

  return (
    <MainLayout>
      <div className="container mx-auto max-w-5xl py-8 space-y-6">
        <h1 className="text-3xl font-bold text-center">StudySpark Pro</h1>
        <PlanSelection />
      </div>
    </MainLayout>
  );
};

export default ProPage;
