
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

export type SubscriptionStatus = {
  isSubscribed: boolean;
  plan: 'free' | 'basic' | 'pro';
  expiresAt: string | null;
  isLoading: boolean;
};

export const useSubscription = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<SubscriptionStatus>({
    isSubscribed: false,
    plan: 'free',
    expiresAt: null,
    isLoading: true,
  });

  const checkSubscription = useCallback(async () => {
    if (!user) {
      setStatus({
        isSubscribed: false,
        plan: 'free',
        expiresAt: null,
        isLoading: false
      });
      return;
    }

    try {
      setStatus(prev => ({ ...prev, isLoading: true }));
      
      // In a real app, this would call an edge function that verifies with Stripe
      // For now, we'll just check the database
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking subscription:', error);
      }
      
      // If subscription exists and is active
      if (data && new Date(data.expires_at) > new Date()) {
        setStatus({
          isSubscribed: true,
          plan: data.plan_type,
          expiresAt: data.expires_at,
          isLoading: false
        });
      } else {
        setStatus({
          isSubscribed: false,
          plan: 'free',
          expiresAt: null,
          isLoading: false
        });
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      setStatus({
        isSubscribed: false,
        plan: 'free',
        expiresAt: null,
        isLoading: false
      });
    }
  }, [user]);

  // Function to handle subscription checkout
  const handleSubscribe = async (planType: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to subscribe",
        variant: "destructive"
      });
      return Promise.reject(new Error("Authentication required"));
    }
    
    try {
      // In a real app, this would call a Stripe checkout session
      // For now, we'll simulate a subscription
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1); // Expires in 1 month
      
      const { error } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          plan_type: planType as 'free' | 'basic' | 'pro',
          status: 'active',
          expires_at: expiresAt.toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
        
      if (error) throw error;
      
      toast({
        title: "Subscription Activated",
        description: `You are now subscribed to the ${planType} plan!`,
      });
      
      // Return the updated status
      const updatedStatus = {
        isSubscribed: true,
        plan: planType as 'free' | 'basic' | 'pro',
        expiresAt: expiresAt.toISOString(),
        isLoading: false
      };
      
      // Update the local state
      setStatus(updatedStatus);
      
      return updatedStatus;
    } catch (error) {
      console.error('Error subscribing:', error);
      toast({
        title: "Subscription failed",
        description: "There was an error processing your subscription",
        variant: "destructive"
      });
      return Promise.reject(error);
    }
  };

  // Check subscription on mount and when user changes
  useEffect(() => {
    checkSubscription();
  }, [user, checkSubscription]);

  return {
    ...status,
    checkSubscription,
    handleSubscribe
  };
};
