
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

type ActivityItem = {
  id: number;
  action: string;
  subject: string;
  timestamp: string;
  icon: string;
};

type RecentActivityProps = {
  activities: ActivityItem[];
};

const RecentActivity = ({ activities }: RecentActivityProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
        <Activity className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {activities.map((activity) => (
            <div 
              key={activity.id} 
              className="flex items-start gap-3 border-b p-4 last:border-0"
            >
              <div className={`rounded-full p-2 text-white ${getIconColorClass(activity.icon)}`}>
                <span className="text-sm">{activity.icon}</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.action}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activity.subject}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activity.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to get color class based on activity type
function getIconColorClass(icon: string): string {
  switch (icon) {
    case '📝':
      return 'bg-blue-500';
    case '🧠':
      return 'bg-purple-500';
    case '📊':
      return 'bg-green-500';
    case '✨':
      return 'bg-amber-500';
    default:
      return 'bg-slate-500';
  }
}

export default RecentActivity;
