
import MainLayout from "@/components/layout/MainLayout";
import GoalProgress from "@/components/dashboard/GoalProgress";
import RecentActivity from "@/components/dashboard/RecentActivity";
import StudyStreaks from "@/components/dashboard/StudyStreaks";
import PointsSummary from "@/components/dashboard/PointsSummary";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

type Goal = {
  id: number;
  title: string;
  currentValue: number;
  targetValue: number;
  unit: string;
};

type ActivityItem = {
  id: number;
  action: string;
  subject: string;
  timestamp: string;
  icon: string;
};

const Dashboard = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    longestStreak: 0,
    lastWeek: [0, 0, 0, 0, 0, 0, 0],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Get user's goals
        const { data: goalsData } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', user.id);
          
        if (goalsData && goalsData.length > 0) {
          setGoals(goalsData.map(goal => ({
            id: goal.id,
            title: goal.title,
            currentValue: goal.current_value,
            targetValue: goal.target_value,
            unit: goal.unit
          })));
        } else {
          // Set default goals if none exist
          setGoals([
            { id: 1, title: "Study Hours", currentValue: 4, targetValue: 6, unit: "hours" },
            { id: 2, title: "Flashcards Reviewed", currentValue: 30, targetValue: 50, unit: "cards" },
            { id: 3, title: "Quizzes Completed", currentValue: 2, targetValue: 3, unit: "quizzes" },
          ]);
        }
        
        // Get recent activity
        const { data: activityData } = await supabase
          .from('activity')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(4);
          
        if (activityData && activityData.length > 0) {
          setActivities(activityData.map((activity, index) => ({
            id: activity.id,
            action: activity.action,
            subject: activity.subject,
            timestamp: formatTimestamp(activity.created_at),
            icon: getIconForActivity(activity.action),
          })));
        } else {
          // Set default activities if none exist
          setActivities([
            {
              id: 1,
              action: "Completed Quiz",
              subject: "Organic Chemistry",
              timestamp: "10 minutes ago",
              icon: "📝",
            },
            {
              id: 2,
              action: "Reviewed Flashcards",
              subject: "Cell Biology",
              timestamp: "1 hour ago",
              icon: "🧠",
            },
            {
              id: 3,
              action: "Earned Badge",
              subject: "Quiz Master",
              timestamp: "2 hours ago",
              icon: "✨",
            },
            {
              id: 4,
              action: "Created Study Notes",
              subject: "Physics Mechanics",
              timestamp: "Yesterday",
              icon: "📊",
            },
          ]);
        }
        
        // Get profile for streak data
        const { data: profileData } = await supabase
          .from('profiles')
          .select('streak_current, streak_longest')
          .eq('id', user.id)
          .single();
          
        if (profileData) {
          // Get study hours for last week
          const lastWeek = [];
          const today = new Date();
          
          for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            const { data: studyData } = await supabase
              .from('study_sessions')
              .select('duration')
              .eq('user_id', user.id)
              .gte('date', dateStr + 'T00:00:00')
              .lt('date', dateStr + 'T23:59:59');
              
            const hoursStudied = studyData ? 
              studyData.reduce((sum, session) => sum + (session.duration || 0), 0) / 60 : 0;
              
            lastWeek.push(Math.round(hoursStudied));
          }
          
          setStreakData({
            currentStreak: profileData.streak_current || 0,
            longestStreak: profileData.streak_longest || 0,
            lastWeek
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);
  
  // Helper function to format timestamps
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Helper function to get icon for activity type
  const getIconForActivity = (action: string): string => {
    if (action.includes('Quiz')) return '📝';
    if (action.includes('Flashcard')) return '🧠';
    if (action.includes('Badge')) return '✨';
    if (action.includes('Note')) return '📊';
    return '📚';
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}!</h1>
          <p className="text-muted-foreground">
            Here's an overview of your study progress
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <GoalProgress goals={goals} />
            )}
          </div>
          <div className="md:row-span-2">
            <PointsSummary />
          </div>
          <div>
            {isLoading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <StudyStreaks 
                currentStreak={streakData.currentStreak}
                longestStreak={streakData.longestStreak}
                lastWeek={streakData.lastWeek}
              />
            )}
          </div>
          <div>
            {isLoading ? (
              <Skeleton className="h-[250px] w-full" />
            ) : (
              <RecentActivity activities={activities} />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
