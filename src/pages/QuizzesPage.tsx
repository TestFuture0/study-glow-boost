
import MainLayout from "@/components/layout/MainLayout";
import QuizMaker from "@/components/ai-tools/QuizMaker";

const QuizzesPage = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">AI Quiz Generator</h1>
          <p className="text-muted-foreground">
            Generate customized quizzes based on your study material
          </p>
        </div>

        <QuizMaker />
      </div>
    </MainLayout>
  );
};

export default QuizzesPage;
