
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useProfile } from "@/hooks/useProfile";
import { Skeleton } from "@/components/ui/skeleton";

const PointsSummary = () => {
  const { profile, isLoading } = useProfile();

  // Calculate progress percentage for the progress bar
  const percentToNextLevel = profile ? 
    Math.round(((profile.total_points_for_next_level - profile.points_to_next_level) / profile.total_points_for_next_level) * 100) : 0;

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-lg font-medium">Points & Level</CardTitle>
          <Star className="w-5 h-5 text-amber-400" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center">
            <Skeleton className="h-24 w-24 rounded-full" />
          </div>
          <div className="space-y-2 text-center">
            <Skeleton className="h-8 w-20 mx-auto" />
            <Skeleton className="h-4 w-24 mx-auto" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-lg font-medium">Points & Level</CardTitle>
        <Star className="w-5 h-5 text-amber-400" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-studyspark-purple bg-background">
            <div className="text-center">
              <p className="text-2xl font-bold text-studyspark-purple">{profile.level}</p>
              <p className="text-xs text-muted-foreground">Level</p>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-center">
          <p className="text-xl font-bold">{profile.points}</p>
          <p className="text-xs text-muted-foreground">Total Points</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Progress to Level {profile.level + 1}</span>
            <span>{profile.points_to_next_level} points needed</span>
          </div>
          <Progress 
            value={percentToNextLevel} 
            className="h-2 bg-slate-100 dark:bg-slate-800"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PointsSummary;
