
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award } from "lucide-react";

type Badge = {
  id: number;
  name: string;
  description: string;
  progress: number;
  icon: string;
  earned: boolean;
};

const badges: Badge[] = [
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

const AchievementsPage = () => {
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
