"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Github,
  Chrome,
  ArrowLeft,
  Sparkles,
  Shield,
  Zap,
  Loader2,
} from "lucide-react";
import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Check authentication status without SessionProvider
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await getSession();
        if (session) {
          setIsAuthenticated(true);
          router.push("/dashboard"); // Change this to your desired redirect path
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  // Show loading spinner while checking authentication status
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render login form if user is authenticated
  if (isAuthenticated) {
    return null;
  }

  const handleGitHubLogin = async () => {
    setIsLoading("github");
    try {
      await signIn("github");
    } catch (error) {
      console.error("GitHub login failed:", error);
    } finally {
      setIsLoading(null);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading("google");
    try {
      await signIn("google");
    } catch (error) {
      console.error("Google login failed:", error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-violet-100 blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-purple-100 blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-violet-100 blur-2xl opacity-20"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back to Home Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-violet-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>

        {/* Main Login Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl">
          <CardHeader className="text-center space-y-4">
            {/* Logo */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-2 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-700 bg-clip-text text-transparent">
                Kalana App
              </span>
            </div>

            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-gray-800">
                Welcome
              </CardTitle>
              <CardDescription className="text-gray-600">
                Sign to your account to continue your productivity journey
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Authentication Buttons */}
            <div className="space-y-3">
              {/* GitHub Login */}
              <Button
                onClick={handleGitHubLogin}
                disabled={isLoading !== null}
                className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white border-0 relative overflow-hidden group"
              >
                {isLoading === "github" ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Connecting to GitHub...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Github className="h-5 w-5" />
                    <span className="font-medium">Continue with GitHub</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </Button>

              {/* Google Login */}
              <Button
                onClick={handleGoogleLogin}
                disabled={isLoading !== null}
                variant="outline"
                className="w-full h-12 border-gray-300 hover:bg-gray-50 hover:border-gray-400 relative overflow-hidden group"
              >
                {isLoading === "google" ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-400 border-t-transparent"></div>
                    <span className="text-gray-700">
                      Connecting to Google...
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Chrome className="h-5 w-5 text-gray-700" />
                    <span className="font-medium text-gray-700">
                      Continue with Google
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </Button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  Secure authentication
                </span>
              </div>
            </div>

            {/* Security Features */}
            <div className="grid-cols-2 gap-4 justify-between items-center flex">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Secure OAuth</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Zap className="h-4 w-4 text-violet-600" />
                <span>Quick Setup</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
