
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, CreditCard } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

// This is a mock for pro status check
// In a real app, this would be connected to auth and subscription state
const useProStatus = () => {
  return { isPro: false };
};

const ConceptExplainer = () => {
  const [concept, setConcept] = useState("");
  const [complexityLevel, setComplexityLevel] = useState("regular");
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanation, setExplanation] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isPro } = useProStatus();

  const handleExplain = async () => {
    if (!concept.trim()) {
      toast({
        variant: "destructive",
        title: "Concept required",
        description: "Please enter a concept to explain.",
      });
      return;
    }

    if (!isPro) {
      toast({
        title: "Pro Feature",
        description: "Concept Explainer is only available for Pro users.",
        action: (
          <Button 
            variant="default" 
            size="sm" 
            className="bg-studyspark-purple hover:bg-studyspark-purple/80"
            onClick={() => navigate("/pro")}
          >
            Upgrade
          </Button>
        ),
      });
      return;
    }

    setIsExplaining(true);
    setExplanation("");

    try {
      // Mock API call - replace with actual OpenAI/Claude call when integrated
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock response
      const mockExplanation = `
## Quantum Entanglement

Quantum entanglement is a phenomenon in quantum physics where two or more particles become correlated in such a way that the quantum state of each particle cannot be described independently of the others, regardless of the distance separating them.

### Key Points:

- When particles are entangled, measuring one particle instantly affects its entangled partner
- Einstein referred to this as "spooky action at a distance"
- Entanglement is fundamental to quantum computing and quantum information theory
- It has been experimentally verified many times

### Practical Applications:

- Quantum cryptography
- Quantum teleportation
- Quantum computing algorithms
- Advanced sensing technologies

This phenomenon demonstrates that quantum mechanics fundamentally challenges our classical intuitions about locality and separability in physics.
      `;

      setExplanation(mockExplanation);
      
      toast({
        title: "Explanation generated!",
        description: `Your explanation for "${concept}" is ready.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "There was an error generating the explanation. Please try again.",
      });
      console.error(error);
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Enter the concept you'd like explained
          </label>
          <Input
            placeholder="e.g., Quantum Entanglement, Photosynthesis, Calculus Derivatives"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Explanation Level</label>
          <Select 
            value={complexityLevel} 
            onValueChange={setComplexityLevel}
            disabled={!isPro}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose complexity level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="elementary">Elementary (Simple Terms)</SelectItem>
              <SelectItem value="regular">Standard (Balanced)</SelectItem>
              <SelectItem value="advanced">Advanced (Detailed)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button
          className="w-full studyspark-gradient"
          onClick={handleExplain}
          disabled={isExplaining || concept.trim().length === 0}
        >
          {isExplaining ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Explain This Concept"
          )}
        </Button>
        
        {!isPro && (
          <div className="rounded-md border border-studyspark-purple/30 bg-purple-50 p-4 dark:bg-purple-900/20">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-studyspark-purple p-2 text-white">
                <CreditCard size={16} />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-studyspark-purple">Pro Feature</p>
                <p className="text-sm text-muted-foreground">
                  The Concept Explainer is available only for Pro users.
                </p>
              </div>
            </div>
            <Button
              className="mt-4 w-full bg-studyspark-purple hover:bg-studyspark-purple/80"
              onClick={() => navigate("/pro")}
            >
              Upgrade to Pro
            </Button>
          </div>
        )}
      </div>
      
      {explanation && (
        <Card>
          <CardContent className="pt-6">
            <div className="prose max-w-none dark:prose-invert">
              {explanation.split('\n').map((line, index) => {
                if (line.startsWith('## ')) {
                  return <h2 key={index} className="text-xl font-bold">{line.replace('## ', '')}</h2>;
                } else if (line.startsWith('### ')) {
                  return <h3 key={index} className="text-lg font-semibold">{line.replace('### ', '')}</h3>;
                } else if (line.startsWith('- ')) {
                  return <li key={index} className="ml-6">{line.replace('- ', '')}</li>;
                } else if (line.trim() === '') {
                  return <br key={index} />;
                } else {
                  return <p key={index}>{line}</p>;
                }
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConceptExplainer;
