
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, TrendingUp, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { Skeleton } from "@/components/ui/skeleton";

type PointsHistoryItem = {
  id: number;
  action: string;
  points: number;
  date: string;
};

const PointsPage = () => {
  const { user } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const [pointsHistory, setPointsHistory] = useState<PointsHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPointsHistory = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('points_history')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .limit(10);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setPointsHistory(data.map(item => ({
            id: item.id,
            action: item.action,
            points: item.points,
            date: formatDate(item.date),
          })));
        } else {
          // Set default points history if none exists
          setPointsHistory([
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
          ]);
        }
      } catch (error) {
        console.error("Error fetching points history:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPointsHistory();
  }, [user]);
  
  // Helper function to format dates
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();
    
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;
    
    if (isToday) {
      return `Today, ${timeString}`;
    } else if (isYesterday) {
      return `Yesterday, ${timeString}`;
    } else {
      return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
  };

  const levelRequirements = [0, 250, 500, 1000, 2000, 3500, 5000, 7000, 10000];

  if (profileLoading || isLoading) {
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
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-studyspark-purple" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history" className="pt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Points History</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-studyspark-purple" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </MainLayout>
    );
  }

  if (!profile) {
    return null;
  }

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
