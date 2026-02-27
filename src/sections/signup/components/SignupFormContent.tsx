"use client";

import React, { useState, useEffect } from "react";
import { validateEmail, validatePassword } from "@/lib/auth_validation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/Button";
import { Label } from "@/components/Label";
import { Input } from "@/components/Input";
import MobileInput from "@/components/MobileInput";
import tmoApi from "@/lib/tmoApi";
import { useTranslation } from "react-i18next";
import { SMS_COUNTDOWN_SECONDS } from "@/Constant";

interface SignupFormContentProps {
  onSignupSuccess: (token: string) => void;
  signupMessage: string;
  setSignupMessage: (message: string) => void;
}

type SignupStep = "form" | "verification";

const SignupFormContent: React.FC<SignupFormContentProps> = ({
  onSignupSuccess,
  signupMessage,
  setSignupMessage,
}) => {
  const { t } = useTranslation("common");
  const [step, setStep] = useState<SignupStep>("form");

  // Form fields
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [mobilePrefix, setMobilePrefix] = useState<string>("86");
  const [dob, setDob] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");

  // Errors
  const [firstnameError, setFirstnameError] = useState<string>("");
  const [lastnameError, setLastnameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [mobileError, setMobileError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [verificationError, setVerificationError] = useState<string>("");

  // State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [smsSent, setSmsSent] = useState<boolean>(false);
  const [smsCountdown, setSmsCountdown] = useState<number>(0);
  const [debugCode, setDebugCode] = useState<string | null>(null);

  // SMS countdown timer
  useEffect(() => {
    if (smsCountdown > 0) {
      const timer = setTimeout(() => setSmsCountdown(smsCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [smsCountdown]);

  const clearErrors = () => {
    setFirstnameError("");
    setLastnameError("");
    setEmailError("");
    setMobileError("");
    setPasswordError("");
    setVerificationError("");
  };

  const validateForm = (): boolean => {
    clearErrors();
    let isValid = true;

    if (!firstname.trim()) {
      setFirstnameError(t("signup.errors.enterFirstName"));
      isValid = false;
    }

    if (!lastname.trim()) {
      setLastnameError(t("signup.errors.enterLastName"));
      isValid = false;
    }

    if (!validateEmail(email).isValid) {
      setEmailError(t("signup.errors.validEmail"));
      isValid = false;
    }

    if (!mobile.trim()) {
      setMobileError(t("signup.errors.enterMobile"));
      isValid = false;
    }

    if (!validatePassword(password).isValid) {
      setPasswordError(validatePassword(password).error);
      isValid = false;
    }

    if (password !== confirmPassword) {
      setPasswordError(t("signup.errors.passwordsNoMatch"));
      isValid = false;
    }

    return isValid;
  };

  const handleSendSMS = async () => {
    clearErrors();

    if (!mobile.trim()) {
      setMobileError(t("signup.errors.enterMobileFirst"));
      return;
    }

    setIsLoading(true);
    setDebugCode(null);

    try {
      // check=1 is for registration
      const response = await tmoApi.sendSMSCode(1, mobile, mobilePrefix);
      setSmsSent(true);
      setSmsCountdown(SMS_COUNTDOWN_SECONDS);

      // Check if debug mode returned a code
      if (response.code) {
        setDebugCode(response.code);
        toast.success(
          t("signup.toast.codeSent") + ` (Debug: ${response.code})`,
        );
      } else {
        toast.success(t("signup.toast.codeSent"));
      }

      setStep("verification");
    } catch (error) {
      console.error("❌ Send SMS error:", error);
      const errorMessage =
        error instanceof Error ? error.message : t("signup.toast.sendFailed");
      setMobileError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // If we haven't sent SMS yet, send it and move to verification step
    if (!smsSent) {
      await handleSendSMS();
      return;
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    if (!verificationCode || verificationCode.length < 4) {
      setVerificationError(t("signup.errors.validCode"));
      return;
    }

    setIsLoading(true);
    try {
      // Register with TMO API
      const customerData = {
        customer: {
          email: email,
          custom_attributes: [
            { attribute_code: "mobile", value: mobile },
            { attribute_code: "mobile_prefix", value: `+${mobilePrefix}` },
          ],
          dob: dob || undefined,
          firstname: firstname,
          lastname: lastname,
        },
        verify_code: verificationCode,
        password: password,
        cart_id: "",
      };

      const registerResult = await tmoApi.register(customerData);

      // After successful registration, login to get token
      toast.success(t("signup.toast.registrationSuccess"));

      try {
        const token = await tmoApi.loginWithMobile(
          mobile,
          password,
          mobilePrefix,
        );
        onSignupSuccess(token);
      } catch (loginError) {
        // Registration succeeded but login failed (likely due to admin approval needed)
        const loginErrorMessage =
          loginError instanceof Error ? loginError.message : "";
        if (
          loginErrorMessage.includes("approval") ||
          loginErrorMessage.includes("approve") ||
          loginErrorMessage.includes("pending")
        ) {
          setVerificationError(t("signup.errors.awaitingApproval"));
          toast.info(t("signup.toast.awaitingApproval"));
        } else {
          setVerificationError(t("signup.errors.registeredButLoginFailed"));
          toast.info(t("signup.toast.registeredButLoginFailed"));
        }
      }
    } catch (error) {
      console.error("❌ Registration error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      const errorMessage =
        error instanceof Error
          ? error.message
          : t("signup.toast.registrationFailed");
      setVerificationError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendSMS = async () => {
    if (smsCountdown > 0) return;
    await handleSendSMS();
  };

  if (step === "verification") {
    return (
      <>
        <h2 className="text-2xl font-semibold mb-8 text-foreground">
          {t("signup.verificationTitle")}
        </h2>
        <p className="mb-4 text-gray-500">
          {t("signup.verificationSentTo", {
            prefix: mobilePrefix,
            mobile: mobile,
          })}
        </p>
        <form onSubmit={handleVerifyAndRegister}>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-foreground" htmlFor="verificationCode">
                {t("signup.verificationCode")}
              </Label>
              <Input
                className="text-primary text-center text-lg tracking-widest"
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setVerificationCode(value);
                }}
                placeholder={t("signup.enterCode")}
                maxLength={6}
              />
              {verificationError && (
                <p className="mt-1 text-sm text-red-600">{verificationError}</p>
              )}

              {/* Debug code display */}
              {debugCode && (
                <div className="mt-2 p-2 bg-yellow-900/50 border border-yellow-600 rounded text-yellow-200 text-sm text-center">
                  Debug Mode - Verification Code: <strong>{debugCode}</strong>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleResendSMS}
                disabled={smsCountdown > 0 || isLoading}
                className="text-sm text-blue-600 hover:underline disabled:text-gray-400 disabled:no-underline"
              >
                {smsCountdown > 0
                  ? t("signup.resendIn", { seconds: smsCountdown })
                  : t("signup.resendCode")}
              </button>
              <button
                type="button"
                onClick={() => setStep("form")}
                className="text-sm text-gray-500 hover:underline"
              >
                {t("signup.changeMobile")}
              </button>
            </div>

            <Button
              type="submit"
              variant="default"
              className="w-full"
              disabled={isLoading || verificationCode.length < 4}
            >
              {isLoading
                ? t("signup.registering")
                : t("signup.completeRegistration")}
            </Button>

            {verificationError && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => (window.location.href = "/")}
              >
                {t("signup.backToLogin")}
              </Button>
            )}
          </div>
        </form>

        {signupMessage && (
          <p
            className={`mt-4 text-sm ${
              signupMessage.includes("failed")
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {signupMessage}
          </p>
        )}

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
        />
      </>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-semibold mb-8 text-foreground">
        {t("signup.title")}
      </h2>
      <form onSubmit={handleSignupSubmit}>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground" htmlFor="firstname">
                {t("signup.firstName")}
              </Label>
              <Input
                className="text-primary"
                id="firstname"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                placeholder={t("signup.firstNamePlaceholder")}
              />
              {firstnameError && (
                <p className="mt-1 text-sm text-red-600">{firstnameError}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-foreground" htmlFor="lastname">
                {t("signup.lastName")}
              </Label>
              <Input
                className="text-primary"
                id="lastname"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                placeholder={t("signup.lastNamePlaceholder")}
              />
              {lastnameError && (
                <p className="mt-1 text-sm text-red-600">{lastnameError}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground" htmlFor="email">
              {t("signup.email")}
            </Label>
            <Input
              className="text-primary"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("signup.emailPlaceholder")}
            />
            {emailError && (
              <p className="mt-1 text-sm text-red-600">{emailError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-foreground" htmlFor="mobile">
              {t("signup.mobile")}
            </Label>
            <MobileInput
              mobile={mobile}
              mobilePrefix={mobilePrefix}
              onMobileChange={setMobile}
              onPrefixChange={setMobilePrefix}
              disabled={isLoading}
              error={mobileError}
              placeholder={t("signup.mobilePlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground" htmlFor="dob">
              {t("signup.dob")}
            </Label>
            <Input
              className="text-primary"
              id="dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground" htmlFor="password">
              {t("signup.password")}
            </Label>
            <Input
              className="text-primary"
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
              }}
              placeholder={t("signup.passwordPlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground" htmlFor="confirmPassword">
              {t("signup.confirmPassword")}
            </Label>
            <Input
              className="text-primary"
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setPasswordError("");
              }}
              placeholder={t("signup.confirmPasswordPlaceholder")}
            />
            {passwordError && (
              <p className="mt-1 text-sm text-red-600">{passwordError}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="default"
            className="w-full mt-6"
            disabled={isLoading}
          >
            {isLoading ? t("signup.sendingCode") : t("signup.signUp")}
          </Button>
        </div>
      </form>

      {signupMessage && (
        <p
          className={`mt-4 text-sm ${
            signupMessage.includes("failed") ? "text-red-600" : "text-green-600"
          }`}
        >
          {signupMessage}
        </p>
      )}

      <p className="mt-4 text-xs text-gray-500">{t("signup.termsAgreement")}</p>
      <p className="mt-4 text-sm text-gray-600">
        {t("signup.alreadyHaveAccount")}
        <Button variant="link" onClick={() => (window.location.href = "/")}>
          {t("signup.logIn")}
        </Button>
      </p>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
    </>
  );
};

export default SignupFormContent;
