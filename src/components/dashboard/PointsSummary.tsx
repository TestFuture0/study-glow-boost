
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type PointsSummaryProps = {
  totalPoints: number;
  level: number;
  pointsToNextLevel: number;
  totalPointsForNextLevel: number;
};

const PointsSummary = ({ 
  totalPoints, 
  level, 
  pointsToNextLevel,
  totalPointsForNextLevel
}: PointsSummaryProps) => {
  const percentToNextLevel = Math.round(
    ((totalPointsForNextLevel - pointsToNextLevel) / totalPointsForNextLevel) * 100
  );

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
              <p className="text-2xl font-bold text-studyspark-purple">{level}</p>
              <p className="text-xs text-muted-foreground">Level</p>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-center">
          <p className="text-xl font-bold">{totalPoints}</p>
          <p className="text-xs text-muted-foreground">Total Points</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Progress to Level {level + 1}</span>
            <span>{pointsToNextLevel} points needed</span>
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
