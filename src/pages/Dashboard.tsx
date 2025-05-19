
import MainLayout from "@/components/layout/MainLayout";
import GoalProgress from "@/components/dashboard/GoalProgress";
import RecentActivity from "@/components/dashboard/RecentActivity";
import StudyStreaks from "@/components/dashboard/StudyStreaks";
import PointsSummary from "@/components/dashboard/PointsSummary";

const Dashboard = () => {
  // Mock data for dashboard components
  const goals = [
    { id: 1, title: "Study Hours", currentValue: 4, targetValue: 6, unit: "hours" },
    { id: 2, title: "Flashcards Reviewed", currentValue: 30, targetValue: 50, unit: "cards" },
    { id: 3, title: "Quizzes Completed", currentValue: 2, targetValue: 3, unit: "quizzes" },
  ];

  const activities = [
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
  ];

  const streakData = {
    currentStreak: 5,
    longestStreak: 14,
    lastWeek: [2, 4, 0, 1, 3, 5, 2], // Hours studied per day
  };

  const pointsData = {
    totalPoints: 1250,
    level: 4,
    pointsToNextLevel: 350,
    totalPointsForNextLevel: 1000,
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">
            Here's an overview of your study progress
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <GoalProgress goals={goals} />
          </div>
          <div className="md:row-span-2">
            <PointsSummary {...pointsData} />
          </div>
          <div>
            <StudyStreaks {...streakData} />
          </div>
          <div>
            <RecentActivity activities={activities} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
