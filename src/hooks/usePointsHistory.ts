
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
  const [isMounted, setIsMounted] = useState(true);

  const fetchPointsHistory = useCallback(async (forceRefresh = false) => {
    if (!user || !isMounted) return;
    
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
        
        if (isMounted) {
          setPointsHistory(formattedData);
          setIsLoading(false);
        }
      } else {
        console.log("No points history found for user, setting to empty array.");
        // Cache empty array too to prevent unnecessary fetches
        cachedPointsHistory[userId] = {
          data: [],
          timestamp: now
        };
        
        if (isMounted) {
          setPointsHistory([]);
          setIsLoading(false);
        }
      }
    } catch (err) {
      console.error("Error fetching points history:", err);
      if (isMounted) {
        setError(err instanceof Error ? err : new Error("An unknown error occurred"));
        setPointsHistory([]);
        setIsLoading(false);
      }
    }
  }, [user, isMounted]);
  
  useEffect(() => {
    setIsMounted(true);
    
    // Set initial data from cache or fetch if needed
    if (user && cachedPointsHistory[user.id]) {
      console.log("Using cached points history data on mount");
      setPointsHistory(cachedPointsHistory[user.id].data);
      setIsLoading(false);
    } else {
      fetchPointsHistory();
    }
    
    // Set up event listeners for both window focus and visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log("Document visible, refreshing points history");
        fetchPointsHistory();
      }
    };
    
    const handleFocus = () => {
      console.log("Window focused, refreshing points history");
      fetchPointsHistory();
    };
    
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      setIsMounted(false);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchPointsHistory, user]);

  return { 
    pointsHistory, 
    isLoading, 
    error,
    refreshHistory: () => fetchPointsHistory(true) // Force refresh when called directly
  };
}
