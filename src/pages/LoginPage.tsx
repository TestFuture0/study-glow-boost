
import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const LoginPage = () => {
  const { user, isLoading } = useAuth();

  // If user is already authenticated, redirect to dashboard
  if (user && !isLoading) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      {isLoading ? (
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-studyspark-purple" />
          <p className="text-lg font-medium text-muted-foreground">Loading...</p>
        </div>
      ) : (
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-studyspark-purple text-white">
              <span className="text-xl font-bold">S</span>
            </div>
            <h1 className="text-2xl font-bold text-studyspark-purple">
              StudySpark
            </h1>
            <p className="text-sm text-muted-foreground">
              AI-powered study tools for competitive exams
            </p>
          </div>
          <AuthForm />
        </div>
      )}
    </div>
  );
};

export default LoginPage;
