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
        console.log("No points history found for user, setting to empty array.");
        setPointsHistory([]);
      }
    } catch (err) {
      console.error("Error fetching points history:", err);
      setError(err instanceof Error ? err : new Error("An unknown error occurred"));
      setPointsHistory([]);
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
