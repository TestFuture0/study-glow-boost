import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for active session on mount
    const getSession = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error fetching session:', error);
        toast({
          title: 'Authentication Error',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        setSession(data.session);
        setUser(data.session?.user || null);
      }
      
      setIsLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user || null);
        setIsLoading(false);

        if (event === 'SIGNED_IN') {
          // If user profile doesn't exist yet, create it
          if (session?.user) {
            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (error || !data) {
              // Create user profile
              const { error: insertError } = await supabase
                .from('profiles')
                .insert([{ id: session.user.id, points: 0, last_active: new Date().toISOString() }]);

              if (insertError) {
                console.error('Error creating user profile:', insertError);
              }
            }
          }
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [toast]);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      toast({
        title: 'Welcome back!',
        description: 'Successfully signed in',
      });
      
      navigate('/');
    } catch (error: unknown) {
      toast({
        title: 'Sign in failed',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      
      const { error: signUpError, data } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: name,
          },
        }
      });
      
      if (signUpError) throw signUpError;
      
      toast({
        title: 'Account created!',
        description: 'Please check your email for verification instructions.',
      });
      
      // For development convenience, auto sign-in
      if (import.meta.env.DEV) {
        await signIn(email, password);
      }
    } catch (error: unknown) {
      toast({
        title: 'Sign up failed',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    console.log("Attempting to sign out...");
    try {
      setIsLoading(true);
      
      toast({
        title: 'Signing out...',
        description: 'Please wait while we log you out',
      });
      
      console.log("Calling supabase.auth.signOut()...");
      const { error } = await supabase.auth.signOut();
      console.log("supabase.auth.signOut() completed. Error:", error);
      
      if (error) throw error;
      
      console.log("Clearing local user/session state...");
      setUser(null);
      setSession(null);
      
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out',
      });
      
      console.log("Navigating to /login...");
      navigate('/login');
      console.log("Navigation to /login attempted.");
    } catch (error: unknown) {
      toast({
        title: 'Sign out failed',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
