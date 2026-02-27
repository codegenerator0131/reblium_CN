"use client";

import { useEffect, useState, useContext, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { UserContext } from "@/provider/UserContext";
import tmoApi from "@/lib/tmoApi";

function WeChatCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useContext(UserContext);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processCallback = async () => {
      // TMO backend redirects with token in the URL after successful WeChat login
      // The token could be in different query parameter names
      const token = searchParams.get("token") ||
                   searchParams.get("access_token") ||
                   searchParams.get("customer_token");

      // Check for error from TMO
      const errorParam = searchParams.get("error") || searchParams.get("message");

      if (errorParam) {
        setError(errorParam);
        setIsProcessing(false);
        return;
      }

      if (!token) {
        // Log all params for debugging
        console.log("WeChat callback params:", Object.fromEntries(searchParams.entries()));

        setError("No authentication token received. Please try again.");
        setIsProcessing(false);
        return;
      }

      try {
        // We have a token directly from TMO redirect
        console.log("WeChat login successful, token received");
        tmoApi.setTMOToken(token);
        login(token);

        // Redirect to projects page on success
        router.push("/projects");
      } catch (err) {
        console.error("WeChat callback error:", err);
        setError(err instanceof Error ? err.message : "WeChat login failed. Please try again.");
        setIsProcessing(false);
      }
    };

    processCallback();
  }, [searchParams, login, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8 max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-foreground mb-2">
            Login Failed
          </h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
        <h1 className="text-xl font-semibold text-foreground mb-2">
          Completing WeChat Login
        </h1>
        <p className="text-muted-foreground">Please wait...</p>
      </div>
    </div>
  );
}

export default function WeChatCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      }
    >
      <WeChatCallbackContent />
    </Suspense>
  );
}
