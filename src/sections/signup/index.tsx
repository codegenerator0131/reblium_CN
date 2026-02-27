"use client";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import SignupFormContent from "./components/SignupFormContent";
import AuthDescriptionComponent from "@/components/AuthDescriptionComponent";
import { UserContext } from "@/provider/UserContext";
import tmoApi from "@/lib/tmoApi";

const LocalSignUpView: React.FC = () => {
  const router = useRouter();
  const { login, isAuthenticated } = useContext(UserContext);
  const [signupMessage, setSignupMessage] = useState<string>("");

  useEffect(() => {
    const verificationFailed = localStorage.getItem("verificationFailed");
    if (verificationFailed === "true") {
      setSignupMessage(
        "Email verification failed. Please try signing up again."
      );
      localStorage.removeItem("verificationFailed");
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/projects");
    }
  }, [isAuthenticated, router]);

  const handleSignupSuccess = async (token: string) => {
    setSignupMessage("Registration successful! Logging you in...");
    // Store token and redirect
    tmoApi.setTMOToken(token);
    login(token);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full">
      <AuthDescriptionComponent />

      <div className="w-full md:w-1/2 xl:w-1/3 flex items-center justify-center py-10 px-6">
        <div className="w-full max-w-md">
          <SignupFormContent
            onSignupSuccess={handleSignupSuccess}
            signupMessage={signupMessage}
            setSignupMessage={setSignupMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default LocalSignUpView;
