"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { RiLockPasswordLine } from "react-icons/ri";
import { BsShieldLock } from "react-icons/bs";
import IconInput from "@/components/IconInput";
import MobileInput from "@/components/MobileInput";
import { Button } from "@/components/Button";
import tmoApi from "@/lib/tmoApi";
import { useTranslation } from "react-i18next";

interface ForgotPasswordFormProps {
  onBack: () => void;
}

type ResetStep = "mobile" | "verification" | "newPassword" | "success";

const ForgotPasswordForm = ({ onBack }: ForgotPasswordFormProps) => {
  const { t } = useTranslation("common");
  const [step, setStep] = useState<ResetStep>("mobile");
  const [mobile, setMobile] = useState("");
  const [mobilePrefix, setMobilePrefix] = useState("86");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [smsCountdown, setSmsCountdown] = useState(0);
  const [debugCode, setDebugCode] = useState<string | null>(null);

  // SMS countdown timer
  useEffect(() => {
    if (smsCountdown > 0) {
      const timer = setTimeout(() => setSmsCountdown(smsCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [smsCountdown]);

  const handleSendSMS = async () => {
    if (!mobile) {
      setMessage(t("forgotPassword.enterMobile"));
      return;
    }

    setIsLoading(true);
    setMessage("");
    setDebugCode(null);

    try {
      // check=2 is for password reset
      const response = await tmoApi.sendSMSCode(2, mobile, mobilePrefix);
      setSmsCountdown(60);
      setStep("verification");

      // Check if debug mode returned a code
      if (response.code) {
        setDebugCode(response.code);
        setMessage(t("forgotPassword.codeSent") + ` (Debug: ${response.code})`);
      } else {
        setMessage(t("forgotPassword.codeSent"));
      }
    } catch (error) {
      console.error("Send SMS error:", error);
      setMessage(
        error instanceof Error ? error.message : t("forgotPassword.sendFailed")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length < 4) {
      setMessage(t("forgotPassword.enterValidCode"));
      return;
    }
    // Move to password entry step
    setMessage("");
    setStep("newPassword");
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      setMessage(t("forgotPassword.enterNewPassword"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage(t("forgotPassword.passwordsNoMatch"));
      return;
    }

    if (newPassword.length < 8) {
      setMessage(t("forgotPassword.passwordMinLength"));
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      // autoLogin is true by default, which returns a token
      const result = await tmoApi.resetPassword(mobile, verificationCode, newPassword, mobilePrefix, true);

      // If autoLogin is true, the API returns a token
      if (typeof result === 'string') {
        // Store the token for auto-login
        tmoApi.setTMOToken(result);
      }

      setStep("success");
    } catch (error) {
      console.error("Reset password error:", error);
      setMessage(
        error instanceof Error ? error.message : t("forgotPassword.resetFailed")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendSMS = async () => {
    if (smsCountdown > 0) return;
    await handleSendSMS();
  };

  // Step 1: Mobile Number Entry
  if (step === "mobile") {
    return (
      <div className="w-full">
        <h2 className="text-xl font-semibold mb-4 text-primary">
          {t("forgotPassword.title")}
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          {t("forgotPassword.mobileDescription")}
        </p>

        <MobileInput
          mobile={mobile}
          mobilePrefix={mobilePrefix}
          onMobileChange={setMobile}
          onPrefixChange={setMobilePrefix}
          disabled={isLoading}
          placeholder={t("forgotPassword.mobilePlaceholder")}
        />

        {message && (
          <div
            className={`mt-4 text-sm ${
              message.includes("sent") ? "text-blue-standard" : "text-red-600"
            } text-center`}
          >
            {message}
          </div>
        )}

        <Button
          onClick={handleSendSMS}
          variant="default"
          className="w-full mt-6"
          disabled={isLoading}
        >
          {isLoading ? t("forgotPassword.sending") : t("forgotPassword.sendCode")}
        </Button>

        <Button
          variant="link"
          className="w-full"
          onClick={(e) => {
            e.preventDefault();
            onBack();
          }}
        >
          {t("forgotPassword.backToLogin")}
        </Button>
      </div>
    );
  }

  // Step 2: Verification Code Entry
  if (step === "verification") {
    return (
      <div className="w-full">
        <h2 className="text-xl font-semibold mb-4 text-primary">
          {t("forgotPassword.verificationTitle")}
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          {t("forgotPassword.sentTo", { prefix: mobilePrefix, mobile: mobile })}
        </p>

        <IconInput
          type="text"
          id="verificationCode"
          value={verificationCode}
          placeholder={t("forgotPassword.codePlaceholder")}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          icon={BsShieldLock}
        />

        {/* Debug code display */}
        {debugCode && (
          <div className="mt-2 p-2 bg-yellow-900/50 border border-yellow-600 rounded text-yellow-200 text-sm text-center">
            Debug Mode - Verification Code: <strong>{debugCode}</strong>
          </div>
        )}

        <div className="flex justify-between items-center mt-2">
          <button
            type="button"
            onClick={handleResendSMS}
            disabled={smsCountdown > 0 || isLoading}
            className="text-sm text-blue-600 hover:underline disabled:text-gray-400 disabled:no-underline"
          >
            {smsCountdown > 0 ? t("forgotPassword.resendIn", { seconds: smsCountdown }) : t("forgotPassword.resendCode")}
          </button>
          <button
            type="button"
            onClick={() => setStep("mobile")}
            className="text-sm text-gray-500 hover:underline"
          >
            {t("forgotPassword.changeNumber")}
          </button>
        </div>

        {message && (
          <div
            className={`mt-4 text-sm ${
              message.includes("sent") ? "text-blue-standard" : "text-red-600"
            } text-center`}
          >
            {message}
          </div>
        )}

        <Button
          onClick={handleVerifyCode}
          variant="default"
          className="w-full mt-6"
          disabled={isLoading || verificationCode.length < 4}
        >
          {t("forgotPassword.continue")}
        </Button>

        <Button
          variant="link"
          className="w-full"
          onClick={(e) => {
            e.preventDefault();
            onBack();
          }}
        >
          {t("forgotPassword.backToLogin")}
        </Button>
      </div>
    );
  }

  // Step 3: New Password Entry
  if (step === "newPassword") {
    return (
      <div className="w-full">
        <h2 className="text-xl font-semibold mb-4 text-primary">
          {t("forgotPassword.newPasswordTitle")}
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          {t("forgotPassword.newPasswordDescription")}
        </p>

        <div className="space-y-4">
          <IconInput
            type="password"
            id="newPassword"
            value={newPassword}
            placeholder={t("forgotPassword.newPasswordPlaceholder")}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewPassword(e.target.value)
            }
            icon={RiLockPasswordLine}
          />

          <IconInput
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            placeholder={t("forgotPassword.confirmPasswordPlaceholder")}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setConfirmPassword(e.target.value)
            }
            icon={RiLockPasswordLine}
          />
        </div>

        {message && (
          <div className="mt-4 text-sm text-red-600 text-center">{message}</div>
        )}

        <Button
          onClick={handleResetPassword}
          variant="default"
          className="w-full mt-6"
          disabled={isLoading}
        >
          {isLoading ? t("forgotPassword.resetting") : t("forgotPassword.resetPassword")}
        </Button>

        <Button
          variant="link"
          className="w-full"
          onClick={(e) => {
            e.preventDefault();
            setStep("verification");
          }}
        >
          {t("forgotPassword.back")}
        </Button>
      </div>
    );
  }

  // Step 4: Success
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-center mb-4 text-foreground">
        {t("forgotPassword.successTitle")}
      </h2>

      <p className="text-gray-500 text-center mb-6">
        {t("forgotPassword.successDescription")}
      </p>

      <Button
        onClick={() => {
          onBack();
          setStep("mobile");
          setMobile("");
          setVerificationCode("");
          setNewPassword("");
          setConfirmPassword("");
        }}
        variant="default"
        className="w-full"
      >
        {t("forgotPassword.backToLogin")}
      </Button>
    </div>
  );
};

export default ForgotPasswordForm;
