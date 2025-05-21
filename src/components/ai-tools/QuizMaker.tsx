import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/lib/supabase";

type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
};

const QuizMaker = () => {
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState("5");
  const [difficulty, setDifficulty] = useState("medium");
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { addPoints, profile } = useProfile();

  const generateQuiz = async () => {
    if ((!content.trim() && !topic.trim())) {
      toast({
        variant: "destructive",
        title: "Content or topic required",
        description: "Please enter either study content or a topic name.",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Mock API call - replace with actual OpenAI/Claude call when integrated
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock response
      const mockQuestions: QuizQuestion[] = [
        {
          id: 1,
          question: "Which of the following is NOT a type of chemical bond?",
          options: ["Ionic bond", "Covalent bond", "Magnetic bond", "Hydrogen bond"],
          correctAnswer: 2,
        },
        {
          id: 2,
          question: "What is the molecular formula for glucose?",
          options: ["C6H12O6", "C12H22O11", "CH3COOH", "NaCl"],
          correctAnswer: 0,
        },
        {
          id: 3,
          question: "Which subatomic particle has a positive charge?",
          options: ["Electron", "Neutron", "Proton", "Photon"],
          correctAnswer: 2,
        },
      ];

      setQuestions(mockQuestions);
      setSelectedAnswers({});
      setQuizSubmitted(false);
      setCurrentQuestionIndex(0);
      
      toast({
        title: "Quiz generated!",
        description: `Created ${mockQuestions.length} questions about ${topic || 'your content'}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "There was an error generating the quiz. Please try again.",
      });
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerIndex,
    });
  };

  const awardQuizMasterBadge = async () => {
    if (!user || !profile) return;
    const quizMasterBadgeId = 1;

    try {
      const { data: existingUserBadge, error: fetchError } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', user.id)
        .eq('badge_id', quizMasterBadgeId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingUserBadge && !existingUserBadge.earned) {
        const { error: updateError } = await supabase
          .from('user_badges')
          .update({ progress: 100, earned: true, earned_at: new Date().toISOString() })
          .eq('user_id', user.id)
          .eq('badge_id', quizMasterBadgeId);
        if (updateError) throw updateError;
        toast({ title: "Badge Updated!", description: "You've earned the Quiz Master badge!" });
      } else if (!existingUserBadge) {
        const { error: insertError } = await supabase
          .from('user_badges')
          .insert({
            user_id: user.id,
            badge_id: quizMasterBadgeId,
            progress: 100,
            earned: true,
            earned_at: new Date().toISOString(),
          });
        if (insertError) throw insertError;
        toast({ title: "Badge Awarded!", description: "Quiz Master badge achieved!" });
      }
    } catch (error) {
      console.error("Error awarding Quiz Master badge:", error);
      toast({ title: "Badge Error", description: "Could not award Quiz Master badge.", variant: "destructive" });
    }
  };

  const submitQuiz = async () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      toast({
        variant: "destructive",
        title: "Incomplete quiz",
        description: "Please answer all questions before submitting.",
      });
      return;
    }

    setQuizSubmitted(true);

    // Calculate score
    const correctAnswers = questions.filter(
      (q) => selectedAnswers[q.id] === q.correctAnswer
    ).length;
    const score = Math.round((correctAnswers / questions.length) * 100);

    toast({
      title: `Quiz Score: ${score}%`,
      description: `You got ${correctAnswers} out of ${questions.length} questions correct!`,
    });

    // Award points
    if (user && addPoints) {
      try {
        await addPoints(10, `Completed quiz on ${topic || 'custom content'}`);
        
        // Also log this as an activity
        const { error: activityError } = await supabase.from('activity').insert({
          user_id: user.id,
          action: 'Completed Quiz',
          subject: topic || 'custom content'
        });
        if (activityError) {
          console.error("Error logging activity:", activityError);
          // Decide if you want to toast this error or handle otherwise
        }

      } catch (error) {
        console.error("Failed to add points or log activity:", error);
      }
    }

    // Award Quiz Master Badge if score is >= 80%
    if (score >= 80) {
      await awardQuizMasterBadge();
    }
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setCurrentQuestionIndex(0);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Quiz</TabsTrigger>
          <TabsTrigger value="take" disabled={questions.length === 0}>
            Take Quiz
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Topic (Optional)</label>
              <Input
                placeholder="e.g., Organic Chemistry, Electromagnetism"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Enter a specific topic or leave empty if pasting content
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Number of Questions</label>
                <Select 
                  value={numQuestions} 
                  onValueChange={setNumQuestions}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Number of questions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Difficulty</label>
                <Select 
                  value={difficulty} 
                  onValueChange={setDifficulty}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Difficulty level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Study Material (Optional)
            </label>
            <Textarea
              placeholder="Paste your study notes or any text content here..."
              className="min-h-[200px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Either enter a topic above or paste content here
            </p>
          </div>
          
          <Button
            className="w-full studyspark-gradient"
            onClick={generateQuiz}
            disabled={isGenerating || (content.trim().length === 0 && topic.trim().length === 0)}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Quiz...
              </>
            ) : (
              "Generate Quiz"
            )}
          </Button>
        </TabsContent>
        
        <TabsContent value="take">
          {questions.length > 0 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <p className="text-base font-medium">
                      {questions[currentQuestionIndex].question}
                    </p>
                    
                    <RadioGroup
                      value={
                        selectedAnswers[questions[currentQuestionIndex].id]?.toString() || ""
                      }
                      onValueChange={(value) =>
                        handleAnswerSelect(questions[currentQuestionIndex].id, parseInt(value))
                      }
                    >
                      {questions[currentQuestionIndex].options.map((option, index) => (
                        <div 
                          key={index} 
                          className={`flex items-center space-x-2 rounded-md border p-3 ${
                            quizSubmitted
                              ? index === questions[currentQuestionIndex].correctAnswer
                                ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                : selectedAnswers[questions[currentQuestionIndex].id] === index
                                  ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                  : ""
                              : ""
                          }`}
                        >
                          <RadioGroupItem
                            value={index.toString()}
                            id={`option-${index}`}
                            disabled={quizSubmitted}
                          />
                          <Label
                            htmlFor={`option-${index}`}
                            className="flex-1 cursor-pointer"
                          >
                            {option}
                          </Label>
                          {quizSubmitted && index === questions[currentQuestionIndex].correctAnswer && (
                            <span className="text-xs text-green-600 dark:text-green-400">
                              Correct
                            </span>
                          )}
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex flex-wrap justify-between gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>
                
                <div className="flex flex-wrap gap-2">
                  {quizSubmitted ? (
                    <Button onClick={resetQuiz}>Reset Quiz</Button>
                  ) : (
                    <Button
                      className="studyspark-gradient"
                      onClick={submitQuiz}
                      disabled={Object.keys(selectedAnswers).length < questions.length}
                    >
                      Submit Quiz
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentQuestionIndex(
                        Math.min(questions.length - 1, currentQuestionIndex + 1)
                      )
                    }
                    disabled={currentQuestionIndex === questions.length - 1}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuizMaker;
