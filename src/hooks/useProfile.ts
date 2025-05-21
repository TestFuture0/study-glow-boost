import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

export type UserProfile = {
  id: string;
  points: number;
  level: number;
  points_to_next_level: number;
  total_points_for_next_level: number;
  streak_current: number;
  streak_longest: number;
  last_active: string;
  is_pro: boolean;
};

// Cache for profile data
const profileCache: Record<string, {
  data: UserProfile;
  timestamp: number;
}> = {};

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (forceRefresh = false) => {
    if (!user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    const userId = user.id;
    const now = Date.now();
    
    // Check cache first unless force refreshing
    if (!forceRefresh && 
        profileCache[userId] && 
        now - profileCache[userId].timestamp < CACHE_DURATION) {
      console.log("Using cached profile data");
      setProfile(profileCache[userId].data);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log("Fetching profile for user:", userId);

      // First try to get the profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.log("Profile error:", profileError);
        
        // If profile doesn't exist, create it
        if (profileError.code === 'PGRST116') {
          console.log("Creating new profile for user");
          
          const defaultProfile = {
            id: userId,
            points: 0,
            level: 1,
            streak_current: 0,
            streak_longest: 0,
            last_active: new Date().toISOString(),
            is_pro: false,
          };

          const { error: insertError } = await supabase
            .from('profiles')
            .insert([defaultProfile]);

          if (insertError) {
            console.error("Error creating profile:", insertError);
            throw insertError;
          }

          // Process and set the default profile
          const processedProfile = processProfileData(defaultProfile);
          
          // Cache the new profile
          profileCache[userId] = {
            data: processedProfile,
            timestamp: now
          };
          
          setProfile(processedProfile);
          console.log("New profile created:", processedProfile);
        } else {
          throw profileError;
        }
      } else {
        // Calculate level and points to next level
        const processedProfile = processProfileData(profileData);
        
        // Cache the profile
        profileCache[userId] = {
          data: processedProfile,
          timestamp: now
        };
        
        setProfile(processedProfile);
        console.log("Existing profile loaded:", processedProfile);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      toast({
        title: "Error fetching profile",
        description: err instanceof Error ? err.message : "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
    
    // Set up event listeners for window focus
    const handleFocus = () => {
      console.log("Window focused, refreshing profile");
      fetchProfile(false); // Use cache if available
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchProfile]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return null;
    
    try {
      console.log("Updating profile with:", updates);
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      const updatedProfile = processProfileData(data);
      
      // Update cache with new profile data
      profileCache[user.id] = {
        data: updatedProfile,
        timestamp: Date.now()
      };
      
      setProfile(updatedProfile);
      console.log("Profile updated:", updatedProfile);
      return updatedProfile;
    } catch (err) {
      console.error("Error updating profile:", err);
      toast({
        title: "Update failed",
        description: err instanceof Error ? err.message : "Failed to update profile",
        variant: "destructive",
      });
      return null;
    }
  };

  const addPoints = async (points: number, action: string) => {
    if (!user || !profile) return null;
    
    try {
      console.log(`Adding ${points} points for ${action}`);
      
      // First update the profile with new points
      const newTotalPoints = profile.points + points;
      const updatedProfile = await updateProfile({ points: newTotalPoints });
      
      // Then record the points history
      const { error } = await supabase
        .from('points_history')
        .insert({
          user_id: user.id,
          action,
          points,
          date: new Date().toISOString()
        });

      if (error) throw error;
      
      toast({
        title: `+${points} points`,
        description: `You earned points for: ${action}`,
      });
      
      return updatedProfile;
    } catch (err) {
      console.error("Error adding points:", err);
      toast({
        title: "Failed to add points",
        description: err instanceof Error ? err.message : "An error occurred",
        variant: "destructive",
      });
      return null;
    }
  };

  const processProfileData = (data: any): UserProfile => {
    // Calculate level based on points
    const levelThresholds = [0, 250, 500, 1000, 2000, 3500, 5000, 7000, 10000];
    let level = 1;
    
    for (let i = 1; i < levelThresholds.length; i++) {
      if (data.points >= levelThresholds[i - 1]) {
        level = i;
      } else {
        break;
      }
    }
    
    // Calculate points needed for next level
    const nextLevelThreshold = level < levelThresholds.length ? levelThresholds[level] : levelThresholds[levelThresholds.length - 1] * 1.5;
    const pointsToNextLevel = Math.max(0, nextLevelThreshold - data.points);
    const totalPointsForNextLevel = nextLevelThreshold - (level > 0 ? levelThresholds[level - 1] : 0);
    
    return {
      ...data,
      level,
      points_to_next_level: pointsToNextLevel,
      total_points_for_next_level: totalPointsForNextLevel
    };
  };

  return { 
    profile, 
    isLoading, 
    error, 
    updateProfile, 
    addPoints,
    refreshProfile: () => fetchProfile(true) // Force refresh when called directly
  };
}
