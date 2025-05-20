
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { formatDate } from "@/utils/dateFormatter";

export type PointsHistoryItem = {
  id: number;
  action: string;
  points: number;
  date: string;
};

export function usePointsHistory() {
  const { user } = useAuth();
  const [pointsHistory, setPointsHistory] = useState<PointsHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPointsHistory = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Fetching points history for user:", user.id);
      
      const { data, error } = await supabase
        .from('points_history')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        console.log("Points history data received:", data.length, "items");
        
        setPointsHistory(data.map(item => ({
          id: item.id,
          action: item.action,
          points: item.points,
          date: formatDate(item.date),
        })));
      } else {
        console.log("No points history found, using demo data");
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
    } catch (err) {
      console.error("Error fetching points history:", err);
      setError(err instanceof Error ? err : new Error("An unknown error occurred"));
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  useEffect(() => {
    fetchPointsHistory();
  }, [fetchPointsHistory]);

  return { 
    pointsHistory, 
    isLoading, 
    error,
    refreshHistory: fetchPointsHistory
  };
}
