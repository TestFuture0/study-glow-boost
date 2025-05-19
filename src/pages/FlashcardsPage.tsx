
import MainLayout from "@/components/layout/MainLayout";
import FlashcardGenerator from "@/components/ai-tools/FlashcardGenerator";

const FlashcardsPage = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">AI Flashcard Generator</h1>
          <p className="text-muted-foreground">
            Create flashcards from your notes or any text with AI assistance
          </p>
        </div>

        <FlashcardGenerator />
      </div>
    </MainLayout>
  );
};

export default FlashcardsPage;
