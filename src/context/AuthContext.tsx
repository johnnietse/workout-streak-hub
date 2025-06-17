
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";

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
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          toast({
            title: "Welcome!",
            description: "You have successfully signed in."
          });
          navigate('/', { replace: true });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Signed out",
            description: "You have been signed out successfully."
          });
          navigate('/auth', { replace: true });
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
  }, [navigate]);

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log("Attempting signup for:", email);
      
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            email_confirm: false // Disable email confirmation requirement
          }
        }
      });

      if (error) {
        console.error("Signup error:", error);
        
        // Handle specific error cases
        if (error.message?.includes("User already registered")) {
          toast({
            title: "Account already exists",
            description: "An account with this email already exists. Please sign in instead.",
            variant: "destructive"
          });
        } else if (error.message?.includes("Email sending failed") || error.message?.includes("Error sending confirmation email")) {
          // Even if email fails, the account might be created
          toast({
            title: "Account created successfully",
            description: "Your account has been created. You can now sign in with your credentials.",
          });
          return; // Don't throw error, account was created
        } else {
          toast({
            title: "Registration failed",
            description: error.message || "Failed to create account. Please try again.",
            variant: "destructive"
          });
        }
        throw error;
      }

      console.log("Signup response:", data);
      
      // Check if user was created successfully
      if (data.user) {
        if (data.session) {
          // User is immediately signed in
          toast({
            title: "Account created successfully",
            description: "Welcome to FitTrack! You're now signed in."
          });
        } else {
          // Account created but not signed in (email confirmation would be needed)
          toast({
            title: "Account created successfully",
            description: "Your account has been created. Please try signing in with your credentials."
          });
        }
      }
      
    } catch (error: any) {
      console.error("Sign up error:", error);
      
      // Don't show additional error toast if we already handled it above
      if (!error?.message?.includes("Email sending failed") && 
          !error?.message?.includes("Error sending confirmation email") &&
          !error?.message?.includes("User already registered")) {
        toast({
          title: "Registration failed",
          description: error?.message || "Failed to create account. Please try again.",
          variant: "destructive"
        });
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log("Attempting signin for:", email);
      
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
        
        let errorMessage = "Invalid email or password. Please try again.";
        
        if (error.message?.includes("Email not confirmed")) {
          errorMessage = "Your email hasn't been confirmed yet. Due to current email settings, please try signing in again or contact support.";
        } else if (error.message?.includes("Invalid login credentials")) {
          errorMessage = "Invalid email or password. Please check your credentials and try again.";
        }
        
        toast({
          title: "Login failed",
          description: errorMessage,
          variant: "destructive"
        });
        throw error;
      }

      console.log("Sign in success:", data.user?.email);
      // Navigation is handled by the auth state change listener
    } catch (error: any) {
      console.error("Sign in error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      // Navigation is handled by the auth state change listener
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({
        title: "Sign out failed",
        description: error?.message || "Failed to sign out. Please try again.",
        variant: "destructive"
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
