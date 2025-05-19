
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

type StreakProps = {
  currentStreak: number;
  longestStreak: number;
  lastWeek: number[];
};

const StudyStreaks = ({ currentStreak, longestStreak, lastWeek }: StreakProps) => {
  // Calculate the maximum value in the lastWeek array for scaling
  const maxValue = Math.max(...lastWeek, 1);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-lg font-medium">Study Streaks</CardTitle>
        <TrendingUp className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 rounded-md border p-3 text-center">
              <p className="text-xs text-muted-foreground">Current Streak</p>
              <p className="text-2xl font-bold text-studyspark-purple">
                {currentStreak}
                <span className="ml-1 text-xs font-normal">days</span>
              </p>
            </div>
            <div className="space-y-1 rounded-md border p-3 text-center">
              <p className="text-xs text-muted-foreground">Longest Streak</p>
              <p className="text-2xl font-bold text-studyspark-blue">
                {longestStreak}
                <span className="ml-1 text-xs font-normal">days</span>
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Last 7 days</p>
            <div className="flex h-16 items-end justify-between gap-1">
              {lastWeek.map((day, index) => {
                const height = (day / maxValue) * 100;
                const isToday = index === lastWeek.length - 1;
                return (
                  <div key={index} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-sm ${
                        isToday ? "bg-studyspark-purple" : "bg-studyspark-blue/60"
                      }`}
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-xs text-muted-foreground">
                      {getDayLabel(index)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to get day labels (M, T, W, etc.)
function getDayLabel(index: number): string {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  return days[index];
}

export default StudyStreaks;
