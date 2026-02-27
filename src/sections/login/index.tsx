"use client";

import { useState } from "react";
import LoginForm from "./components/LoginForm";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import SocialLoginButtons from "./components/SocialLoginButtons";
import AuthDescriptionComponent from "@/components/AuthDescriptionComponent";

export default function LocalLoginView() {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleBack = () => {
    setShowForgotPassword(false);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full">
      {/* LEFT SIDE */}
      <AuthDescriptionComponent />

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2 xl:w-1/3 flex items-center justify-center py-10 px-6">
        <div className="w-full max-w-md">
          {showForgotPassword ? (
            <ForgotPasswordForm onBack={handleBack} />
          ) : (
            <>
              <LoginForm onForgotPassword={() => setShowForgotPassword(true)} />
              <hr className="my-4 border-gray-300 w-full" />
              <SocialLoginButtons />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
