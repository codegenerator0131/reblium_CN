import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import tmoApi from "@/lib/tmoApi";
import { realSignIn } from "@/lib/mockTrpc";
import { Loader2 } from "lucide-react";

export default function WeChatCallback() {
  const [, navigate] = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token =
      params.get("token") ||
      params.get("access_token") ||
      params.get("customer_token");
    const socialOid = params.get("social_oid");
    const socialUid = params.get("social_uid");
    const errorParam = params.get("error");

    if (errorParam) {
      setError("WeChat authentication failed. Please try again.");
      return;
    }

    if (!token && !socialOid && !socialUid) {
      setError("No authentication token received.");
      return;
    }

    const handleAuth = async () => {
      try {
        if (token) {
          const cleanToken = token.replace(/^"|"$/g, "");
          tmoApi.setTMOToken(cleanToken);

          // Bind WeChat social attributes if provided alongside token
          if (socialOid || socialUid) {
            const socialAttributes: Array<{ attribute_code: string; value: string }> = [];
            if (socialOid) socialAttributes.push({ attribute_code: "social_oid", value: socialOid });
            if (socialUid) socialAttributes.push({ attribute_code: "social_uid", value: socialUid });

            try {
              await tmoApi.updateProfile(
                { customer: { custom_attributes: socialAttributes } },
                cleanToken
              );
            } catch {
              // Non-fatal: sign in even if binding fails
            }
          }

          await realSignIn(cleanToken);
          navigate("/");
        } else if (socialOid || socialUid) {
          // New user: no token — redirect to landing page to sign in or register
          navigate("/");
        }
      } catch {
        setError("Failed to authenticate. Please try again.");
      }
    };

    handleAuth();
  }, [navigate]);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md p-6">
          <p className="text-destructive font-medium">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="text-primary hover:underline text-sm"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="text-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="text-sm text-muted-foreground">Authenticating...</p>
      </div>
    </div>
  );
}
