
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { usePointsHistory } from "@/hooks/usePointsHistory";
import { useEffect } from "react";

const PointsHistory = () => {
  const { pointsHistory, isLoading, error, refreshHistory } = usePointsHistory();

  // Refresh data when the component mounts
  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  if (isLoading) {
    return (
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
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Points History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
            <AlertTriangle className="h-8 w-8 text-amber-500" />
            <p className="text-sm text-muted-foreground">
              Couldn't load points history. Please make sure your database is set up correctly.
            </p>
            <Button 
              size="sm"
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
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Points History</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {pointsHistory.length > 0 ? (
            pointsHistory.map((item) => (
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
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No points history found. Complete activities to earn points!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PointsHistory;
