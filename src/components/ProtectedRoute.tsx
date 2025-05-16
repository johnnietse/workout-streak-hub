
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading, session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("ProtectedRoute auth state:", { user: !!user, isLoading, session: !!session });
    
    // If we're not loading and there's no user, redirect to auth page
    if (!isLoading && !user) {
      console.log("No authenticated user, redirecting to /auth");
      navigate('/auth', { replace: true });
    }
  }, [user, isLoading, navigate, session]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Use simple condition - if no user, redirect
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
