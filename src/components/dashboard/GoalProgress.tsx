
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CalendarDays } from "lucide-react";

type Goal = {
  id: number;
  title: string;
  currentValue: number;
  targetValue: number;
  unit: string;
};

type GoalProgressProps = {
  goals: Goal[];
};

const GoalProgress = ({ goals }: GoalProgressProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-lg font-medium">
          Daily Goals
        </CardTitle>
        <CalendarDays className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal) => {
            const percentComplete = Math.min(
              Math.round((goal.currentValue / goal.targetValue) * 100),
              100
            );

            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{goal.title}</span>
                  <span className="text-muted-foreground">
                    {goal.currentValue}/{goal.targetValue} {goal.unit}
                  </span>
                </div>
                <Progress
                  value={percentComplete}
                  className="h-2 bg-slate-100 dark:bg-slate-800"
                  indicatorClassName={
                    percentComplete >= 100 
                      ? "bg-studyspark-teal"
                      : "bg-studyspark-purple"
                  }
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalProgress;
