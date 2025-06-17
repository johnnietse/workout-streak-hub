import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/sonner";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.email);
        
        // Keep track of previous state to prevent unnecessary rerenders
        setSession(prevSession => {
          if (prevSession?.user?.id === currentSession?.user?.id) {
            return prevSession;
          }
          return currentSession;
        });
        
        setUser(currentSession?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          toast("Welcome back!", {
            description: "You have successfully signed in."
          });
        } else if (event === 'SIGNED_OUT') {
          toast("Signed out", {
            description: "You have been signed out successfully."
          });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession?.user?.email);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });

      if (error) {
        throw error;
      }

      console.log("Sign up response:", data);
      
      if (data.user && !data.session) {
        toast("Check your email", {
          description: "Please check your email for a confirmation link to complete your registration."
        });
      } else {
        toast("Account created successfully", {
          description: "Welcome to FitTrack! You can now start tracking your workouts."
        });
      }
      
    } catch (error: any) {
      toast("Registration failed", {
        description: error?.message || "Failed to create account. Please try again."
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      console.log("Sign in success:", data.user?.email);
      navigate('/', { replace: true });
    } catch (error: any) {
      toast("Login failed", {
        description: error?.message || "Invalid email or password. Please try again."
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      navigate('/auth', { replace: true });
    } catch (error: any) {
      toast("Sign out failed", {
        description: error?.message || "Failed to sign out. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    session,
    user,
    isLoading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
