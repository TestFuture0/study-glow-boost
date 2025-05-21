
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { useEffect } from "react";

const levelRequirements = [0, 250, 500, 1000, 2000, 3500, 5000, 7000, 10000];

const PointsOverview = () => {
  const { profile, isLoading, error, refreshProfile } = useProfile();

  // Refresh data when the component mounts
  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-studyspark-purple" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !profile) {
    return (
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
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-md border p-4 text-center">
            <p className="text-sm font-medium text-muted-foreground">Total Points</p>
            <p className="mt-1 text-3xl font-bold text-studyspark-purple">
              {profile.points}
            </p>
          </div>
          <div className="rounded-md border p-4 text-center">
            <p className="text-sm font-medium text-muted-foreground">Current Level</p>
            <p className="mt-1 text-3xl font-bold text-studyspark-blue">
              {profile.level}
            </p>
          </div>
          <div className="rounded-md border p-4 text-center">
            <p className="text-sm font-medium text-muted-foreground">Points to Level {profile.level + 1}</p>
            <p className="mt-1 text-3xl font-bold text-studyspark-teal">
              {profile.points_to_next_level}
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Progress to Level {profile.level + 1}</span>
            <span className="text-muted-foreground">
              {profile.total_points_for_next_level - profile.points_to_next_level}/{profile.total_points_for_next_level} points
            </span>
          </div>
          <Progress
            value={((profile.total_points_for_next_level - profile.points_to_next_level) / profile.total_points_for_next_level) * 100}
            className="h-2 bg-slate-100 dark:bg-slate-800"
          />
        </div>
        
        <Card className="bg-muted">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Level Requirements</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex justify-between px-6 py-2 text-xs text-muted-foreground">
              <span>Level</span>
              <span>Points Required</span>
            </div>
            {levelRequirements.map((points, index) => (
              <div
                key={index}
                className={`flex justify-between border-t px-6 py-2 ${
                  index === profile.level ? "bg-studyspark-purple/10 font-medium" : ""
                }`}
              >
                <span>Level {index}</span>
                <span>{points.toLocaleString()} points</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default PointsOverview;
