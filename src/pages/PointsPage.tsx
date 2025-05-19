
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, TrendingUp } from "lucide-react";

type PointsHistoryItem = {
  id: number;
  action: string;
  points: number;
  date: string;
};

const pointsHistory: PointsHistoryItem[] = [
  {
    id: 1,
    action: "Completed Quiz - Organic Chemistry",
    points: 50,
    date: "Today, 12:30 PM",
  },
  {
    id: 2,
    action: "Maintained 5-Day Streak",
    points: 100,
    date: "Today, 9:15 AM",
  },
  {
    id: 3,
    action: "Created 15 Flashcards",
    points: 30,
    date: "Yesterday, 4:45 PM",
  },
  {
    id: 4,
    action: "Completed 100% of Daily Goals",
    points: 80,
    date: "Yesterday, 10:20 AM",
  },
  {
    id: 5,
    action: "Earned 'Speed Learner' Badge",
    points: 200,
    date: "Apr 18, 2023",
  },
];

const pointsData = {
  totalPoints: 1250,
  level: 4,
  pointsToNextLevel: 350,
  totalPointsForNextLevel: 1000,
  levelRequirements: [0, 250, 500, 1000, 2000, 3500, 5000, 7000, 10000],
};

const PointsPage = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Points & Levels</h1>
            <p className="text-muted-foreground">
              Track your progress and points earned through your study journey
            </p>
          </div>
          <div className="rounded-full border-2 border-amber-400 bg-white p-3 dark:bg-slate-800">
            <Star className="h-6 w-6 text-amber-400" />
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="overview" className="w-full">Overview</TabsTrigger>
            <TabsTrigger value="history" className="w-full">Points History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 pt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-md border p-4 text-center">
                    <p className="text-sm font-medium text-muted-foreground">Total Points</p>
                    <p className="mt-1 text-3xl font-bold text-studyspark-purple">
                      {pointsData.totalPoints}
                    </p>
                  </div>
                  <div className="rounded-md border p-4 text-center">
                    <p className="text-sm font-medium text-muted-foreground">Current Level</p>
                    <p className="mt-1 text-3xl font-bold text-studyspark-blue">
                      {pointsData.level}
                    </p>
                  </div>
                  <div className="rounded-md border p-4 text-center">
                    <p className="text-sm font-medium text-muted-foreground">Points to Level {pointsData.level + 1}</p>
                    <p className="mt-1 text-3xl font-bold text-studyspark-teal">
                      {pointsData.pointsToNextLevel}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Progress to Level {pointsData.level + 1}</span>
                    <span className="text-muted-foreground">
                      {pointsData.totalPointsForNextLevel - pointsData.pointsToNextLevel}/{pointsData.totalPointsForNextLevel} points
                    </span>
                  </div>
                  <Progress
                    value={((pointsData.totalPointsForNextLevel - pointsData.pointsToNextLevel) / pointsData.totalPointsForNextLevel) * 100}
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
                    {pointsData.levelRequirements.map((points, index) => (
                      <div
                        key={index}
                        className={`flex justify-between border-t px-6 py-2 ${
                          index === pointsData.level ? "bg-studyspark-purple/10 font-medium" : ""
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
          </TabsContent>
          
          <TabsContent value="history" className="pt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Points History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {pointsHistory.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">{item.action}</p>
                        <p className="text-sm text-muted-foreground">{item.date}</p>
                      </div>
                      <div className="flex items-center font-medium text-studyspark-purple">
                        +{item.points}
                        <Star className="ml-1 h-4 w-4 text-amber-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default PointsPage;
