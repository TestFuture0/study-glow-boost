
import MainLayout from "@/components/layout/MainLayout";
import PlanSelection from "@/components/pro/PlanSelection";

const ProPage = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PlanSelection />
      </div>
    </MainLayout>
  );
};

export default ProPage;
