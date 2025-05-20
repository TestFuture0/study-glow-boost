
import { useState, useEffect } from "react";
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

  useEffect(() => {
    const fetchPointsHistory = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
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
      } catch (err) {
        console.error("Error fetching points history:", err);
        setError(err instanceof Error ? err : new Error("An unknown error occurred"));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPointsHistory();
  }, [user]);

  return { pointsHistory, isLoading, error };
}
