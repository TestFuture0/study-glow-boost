
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type Badge = {
  id: number;
  name: string;
  description: string;
  progress: number;
  icon: string;
  earned: boolean;
};

// Default badges if database isn't available
const defaultBadges: Badge[] = [
  {
    id: 1,
    name: "Quiz Master",
    description: "Complete 10 quizzes with 90% or higher score",
    progress: 70,
    icon: "🏆",
    earned: false,
  },
  {
    id: 2,
    name: "Streak Champion",
    description: "Maintain a 7-day study streak",
    progress: 100,
    icon: "🔥",
    earned: true,
  },
  {
    id: 3,
    name: "Flashcard Pro",
    description: "Create and review 100 flashcards",
    progress: 45,
    icon: "🧠",
    earned: false,
  },
  {
    id: 4,
    name: "Early Bird",
    description: "Complete 5 study sessions before 9 AM",
    progress: 80,
    icon: "🌅",
    earned: false,
  },
  {
    id: 5,
    name: "Night Owl",
    description: "Complete 5 study sessions after 10 PM",
    progress: 100,
    icon: "🌙",
    earned: true,
  },
  {
    id: 6,
    name: "Speed Learner",
    description: "Complete a quiz in under 2 minutes with 80% score",
    progress: 100,
    icon: "⚡",
    earned: true,
  },
];

// Fixed interface for user badge data from Supabase
interface UserBadge {
  id: number;
  progress: number;
  earned: boolean;
  badge: {
    id: number;
    name: string;
    description: string;
    icon: string;
  };
}

const AchievementsPage = () => {
  const { user } = useAuth();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBadges = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Check if the badges table exists by querying it
        const { error: tableCheckError } = await supabase
          .from('badges')
          .select('count', { count: 'exact', head: true });
          
        // If there's an error (likely table doesn't exist), use default badges
        if (tableCheckError) {
          console.log("Using default badges because:", tableCheckError.message);
          setBadges(defaultBadges);
          return;
        }
        
        // Query user badges if table exists
        const { data: userBadges, error: badgesError } = await supabase
          .from('user_badges')
          .select(`
            id,
            progress,
            earned,
            badge:badges (
              id,
              name,
              description,
              icon
            )
          `)
          .eq('user_id', user.id);
          
        if (badgesError) throw badgesError;
        
        if (userBadges && userBadges.length > 0) {
          console.log("Fetched badges data:", JSON.stringify(userBadges, null, 2));
          
          // Map the badges data, ensuring correct type handling
          const mappedBadges: Badge[] = [];
          
          for (const item of userBadges) {
            // Ensure item.badge is not an array but an object with the expected properties
            if (item && item.badge && typeof item.badge === 'object' && !Array.isArray(item.badge)) {
              mappedBadges.push({
                id: item.badge.id,
                name: item.badge.name,
                description: item.badge.description,
                progress: item.progress,
                icon: item.badge.icon,
                earned: item.earned,
              });
            } else {
              console.warn("Skipping invalid badge data:", item);
            }
          }
          
          if (mappedBadges.length > 0) {
            setBadges(mappedBadges);
          } else {
            console.log("No valid badges found, using default badges");
            setBadges(defaultBadges);
          }
        } else {
          // No badges found for user, use defaults
          console.log("No badges found for user, using defaults");
          setBadges(defaultBadges);
        }
      } catch (err) {
        console.error("Error fetching badges:", err);
        setError(err instanceof Error ? err : new Error("An unknown error occurred"));
        setBadges(defaultBadges); // Fallback to defaults on error
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBadges();
  }, [user]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Achievements & Badges</h1>
              <p className="text-muted-foreground">
                Track your progress and earn badges for your accomplishments
              </p>
            </div>
            <div className="rounded-full border-2 border-studyspark-purple bg-white p-3 dark:bg-slate-800">
              <Award className="h-6 w-6 text-studyspark-purple" />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-2 w-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  // Show a nice error state
  if (error && badges.length === 0) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Achievements & Badges</h1>
              <p className="text-muted-foreground">
                Track your progress and earn badges for your accomplishments
              </p>
            </div>
            <div className="rounded-full border-2 border-studyspark-purple bg-white p-3 dark:bg-slate-800">
              <Award className="h-6 w-6 text-studyspark-purple" />
            </div>
          </div>

          <Card className="p-6">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <AlertTriangle className="h-12 w-12 text-amber-500" />
              <h2 className="text-xl font-semibold">Database Setup Required</h2>
              <p className="max-w-md text-muted-foreground">
                It looks like your Supabase database tables haven't been created yet. 
                Please run the migrations in the <code className="bg-muted px-1 py-0.5 rounded text-sm">supabase/migrations/</code> folder to set up the necessary tables.
              </p>
              <Button 
                onClick={() => {
                  toast({
                    title: "Setup instructions",
                    description: "Check the README.md file for setup instructions or run the SQL migrations manually in your Supabase project.",
                  });
                }}
              >
                Learn More
              </Button>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Show badges (either from database or defaults)
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Achievements & Badges</h1>
            <p className="text-muted-foreground">
              Track your progress and earn badges for your accomplishments
            </p>
          </div>
          <div className="rounded-full border-2 border-studyspark-purple bg-white p-3 dark:bg-slate-800">
            <Award className="h-6 w-6 text-studyspark-purple" />
          </div>
        </div>

        {/* Show warning if using default badges */}
        {error && (
          <Card className="mb-6 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
              <p className="text-sm text-amber-800 dark:text-amber-300">
                Using demo data. Set up your database for real achievements tracking.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {badges.map((badge) => (
            <Card
              key={badge.id}
              className={`card-hover ${
                badge.earned
                  ? "border-studyspark-purple/30 bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-slate-900"
                  : ""
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-medium">{badge.name}</CardTitle>
                  <div
                    className={`rounded-full p-2 text-xl ${
                      badge.earned ? "badge-glow" : "bg-muted"
                    }`}
                  >
                    {badge.icon}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {badge.description}
                </p>
                <div className="space-y-1">
                  <Progress
                    value={badge.progress}
                    className="h-2 bg-slate-100 dark:bg-slate-800"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{badge.progress}% complete</span>
                    {badge.earned && (
                      <span className="text-studyspark-purple dark:text-purple-300">
                        Earned
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default AchievementsPage;
