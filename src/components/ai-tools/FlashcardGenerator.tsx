
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

type Flashcard = {
  id: number;
  question: string;
  answer: string;
};

const FlashcardGenerator = () => {
  const [content, setContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [activeFlashcard, setActiveFlashcard] = useState<number | null>(null);
  const [flipped, setFlipped] = useState(false);
  const { toast } = useToast();

  const generateFlashcards = async () => {
    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "Content required",
        description: "Please enter some content to generate flashcards.",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Mock API call - replace with actual OpenAI/Claude call when integrated
      // Simulating a delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock response
      const mockFlashcards: Flashcard[] = [
        {
          id: 1,
          question: "What is Newton's First Law of Motion?",
          answer: "An object at rest stays at rest, and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an external force."
        },
        {
          id: 2,
          question: "What is the formula for kinetic energy?",
          answer: "KE = (1/2)mv² where m is mass and v is velocity."
        },
        {
          id: 3,
          question: "What are the key principles of thermodynamics?",
          answer: "The first law (conservation of energy), the second law (entropy), and the third law (absolute zero)."
        }
      ];

      setFlashcards(mockFlashcards);
      setActiveFlashcard(0);
      
      toast({
        title: "Flashcards generated!",
        description: `Created ${mockFlashcards.length} flashcards from your content.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "There was an error generating flashcards. Please try again.",
      });
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNextCard = () => {
    setFlipped(false);
    if (activeFlashcard !== null && activeFlashcard < flashcards.length - 1) {
      setActiveFlashcard(activeFlashcard + 1);
    } else {
      setActiveFlashcard(0); // Loop back to the first card
    }
  };

  const handlePrevCard = () => {
    setFlipped(false);
    if (activeFlashcard !== null && activeFlashcard > 0) {
      setActiveFlashcard(activeFlashcard - 1);
    } else {
      setActiveFlashcard(flashcards.length - 1); // Loop to the last card
    }
  };

  const toggleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Flashcards</TabsTrigger>
          <TabsTrigger value="review" disabled={flashcards.length === 0}>
            Review Flashcards
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Enter your notes or paste text to generate flashcards
            </label>
            <Textarea
              placeholder="Paste your study notes or any text content here..."
              className="min-h-[200px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          
          <Button
            className="w-full studyspark-gradient"
            onClick={generateFlashcards}
            disabled={isGenerating || content.trim().length === 0}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Flashcards"
            )}
          </Button>
        </TabsContent>
        
        <TabsContent value="review">
          {activeFlashcard !== null && flashcards.length > 0 && (
            <div className="space-y-6">
              <div 
                className="mx-auto aspect-[3/2] w-full max-w-lg cursor-pointer rounded-lg border bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-slate-900"
                onClick={toggleFlip}
              >
                <div className="relative h-full w-full">
                  <div
                    className={`absolute h-full w-full backface-hidden rounded-lg transition-transform duration-500 ${
                      flipped ? "rotate-y-180 opacity-0" : "opacity-100"
                    }`}
                  >
                    <div className="flex h-full flex-col items-center justify-center p-6">
                      <div className="absolute top-3 left-3 rounded-full bg-studyspark-purple px-2 py-1 text-xs text-white">
                        {activeFlashcard + 1} / {flashcards.length}
                      </div>
                      <p className="text-lg font-medium">
                        {flashcards[activeFlashcard].question}
                      </p>
                      <p className="mt-4 text-sm text-muted-foreground">
                        Tap to reveal answer
                      </p>
                    </div>
                  </div>
                  
                  <div
                    className={`absolute h-full w-full backface-hidden rounded-lg transition-transform duration-500 ${
                      !flipped ? "rotate-y-180 opacity-0" : "opacity-100"
                    }`}
                  >
                    <div className="flex h-full flex-col items-center justify-center p-6">
                      <p className="text-base">{flashcards[activeFlashcard].answer}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <Button variant="outline" onClick={handlePrevCard}>
                  Previous
                </Button>
                <Button variant="outline" onClick={toggleFlip}>
                  {flipped ? "Show Question" : "Show Answer"}
                </Button>
                <Button variant="default" onClick={handleNextCard}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FlashcardGenerator;
