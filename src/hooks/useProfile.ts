
import { useState, useEffect } from "react";
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

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // First try to get the profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          // If profile doesn't exist, create it
          if (profileError.code === 'PGRST116') {
            const defaultProfile = {
              id: user.id,
              points: 0,
              level: 1,
              points_to_next_level: 250,
              total_points_for_next_level: 250,
              streak_current: 0,
              streak_longest: 0,
              last_active: new Date().toISOString(),
              is_pro: false,
            };

            const { error: insertError } = await supabase
              .from('profiles')
              .insert([defaultProfile]);

            if (insertError) {
              throw insertError;
            }

            setProfile(defaultProfile);
          } else {
            throw profileError;
          }
        } else {
          // Calculate level and points to next level
          const processedProfile = processProfileData(profileData);
          setProfile(processedProfile);
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
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      const updatedProfile = processProfileData(data);
      setProfile(updatedProfile);
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

  return { profile, isLoading, error, updateProfile, addPoints };
}
