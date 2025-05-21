
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

// Store cached data between renders/focus
const cachedPointsHistory: Record<string, {
  data: PointsHistoryItem[];
  timestamp: number;
}> = {};

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

export function usePointsHistory() {
  const { user } = useAuth();
  const [pointsHistory, setPointsHistory] = useState<PointsHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPointsHistory = useCallback(async (forceRefresh = false) => {
    if (!user) return;
    
    const userId = user.id;
    const now = Date.now();
    
    // Check cache first unless force refreshing
    if (!forceRefresh && 
        cachedPointsHistory[userId] && 
        now - cachedPointsHistory[userId].timestamp < CACHE_DURATION) {
      console.log("Using cached points history data");
      setPointsHistory(cachedPointsHistory[userId].data);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Fetching points history for user:", userId);
      
      const { data, error } = await supabase
        .from('points_history')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        console.log("Points history data received:", data.length, "items");
        
        const formattedData = data.map(item => ({
          id: item.id,
          action: item.action,
          points: item.points,
          date: formatDate(item.date),
        }));
        
        // Update the cache
        cachedPointsHistory[userId] = {
          data: formattedData,
          timestamp: now
        };
        
        setPointsHistory(formattedData);
      } else {
        console.log("No points history found for user, setting to empty array.");
        // Cache empty array too to prevent unnecessary fetches
        cachedPointsHistory[userId] = {
          data: [],
          timestamp: now
        };
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
    
    // Set up event listeners for both window focus and visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log("Document visible, refreshing points history");
        fetchPointsHistory(true); // Force refresh when document becomes visible
      }
    };
    
    const handleFocus = () => {
      console.log("Window focused, refreshing points history");
      fetchPointsHistory(true); // Always refresh on focus - this is more reliable
    };
    
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchPointsHistory]);

  return { 
    pointsHistory, 
    isLoading, 
    error,
    refreshHistory: () => fetchPointsHistory(true) // Force refresh when called directly
  };
}
