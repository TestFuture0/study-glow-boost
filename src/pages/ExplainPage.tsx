
import MainLayout from "@/components/layout/MainLayout";
import ConceptExplainer from "@/components/ai-tools/ConceptExplainer";

const ExplainPage = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">AI Concept Explainer</h1>
          <p className="text-muted-foreground">
            Get detailed explanations of complex topics using AI
          </p>
        </div>

        <ConceptExplainer />
      </div>
    </MainLayout>
  );
};

export default ExplainPage;
