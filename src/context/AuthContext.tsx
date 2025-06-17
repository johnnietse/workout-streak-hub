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
        }
      });

      if (error) {
        console.error("Signup error:", error);
        throw error;
      }

      console.log("Signup response:", data);
      
      // Handle different signup scenarios
      if (data.user && !data.session) {
        // Email confirmation required
        if (data.user.email_confirmed_at) {
          toast({
            title: "Account created",
            description: "Your account has been created successfully. You can now sign in."
          });
        } else {
          toast({
            title: "Account created - Email confirmation needed",
            description: "Please check your email and click the confirmation link to activate your account. Note: Due to current email settings, confirmation emails may not be delivered. You can try signing in directly."
          });
        }
      } else if (data.user && data.session) {
        // User is immediately signed in (email confirmation disabled)
        toast({
          title: "Account created successfully",
          description: "Welcome to FitTrack! You're now signed in."
        });
        // The auth state change listener will handle navigation
      } else if (data.user) {
        // User exists but needs confirmation
        toast({
          title: "Please check your email",
          description: "A confirmation link has been sent to your email address. If you don't receive it, you can try signing in directly."
        });
      }
      
    } catch (error: any) {
      console.error("Sign up error:", error);
      
      // Handle specific error cases
      if (error?.message?.includes("User already registered")) {
        toast({
          title: "Account already exists",
          description: "An account with this email already exists. Please sign in instead.",
          variant: "destructive"
        });
      } else if (error?.message?.includes("Email sending failed") || error?.message?.includes("Error sending confirmation email")) {
        toast({
          title: "Account created with email issues",
          description: "Your account was created but we couldn't send a confirmation email. You can try signing in directly.",
        });
      } else {
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
        throw error;
      }

      console.log("Sign in success:", data.user?.email);
      // Navigation is handled by the auth state change listener
    } catch (error: any) {
      console.error("Sign in error:", error);
      let errorMessage = "Invalid email or password. Please try again.";
      
      if (error?.message?.includes("Email not confirmed")) {
        errorMessage = "Your email hasn't been confirmed yet. Due to current email settings, you may try signing in anyway or contact support.";
      } else if (error?.message?.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password. Please check your credentials and try again.";
      }
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive"
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
