import { useState, useEffect, ChangeEvent, useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/provider/UserContext";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { BsShieldLock } from "react-icons/bs";

import IconInput from "../../../components/IconInput";
import MobileInput from "@/components/MobileInput";
import { Button } from "@/components/Button";
import { useTranslation } from "react-i18next";
import tmoApi from "@/lib/tmoApi";

interface LoginFormProps {
  onForgotPassword: () => void;
}

type LoginMethod = "email" | "mobile_password" | "mobile_sms";

export default function LoginForm({ onForgotPassword }: LoginFormProps) {
  const { t } = useTranslation("common");
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("email");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [mobilePrefix, setMobilePrefix] = useState("86");
  const [password, setPassword] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [smsCountdown, setSmsCountdown] = useState(0);
  const [debugCode, setDebugCode] = useState<string | null>(null);
  const router = useRouter();
  const { login, isAuthenticated, saveUserHistory } =
    useContext(UserContext);

  // Load saved credentials when component mounts
  useEffect(() => {
    const savedEmail = localStorage.getItem("remembered_email");
    const savedPassword = localStorage.getItem("remembered_password");
    const wasRemembered = localStorage.getItem("remember_me") === "true";

    if (wasRemembered && savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(atob(savedPassword));
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/projects");
    }
  }, [isAuthenticated, router]);

  // SMS countdown timer
  useEffect(() => {
    if (smsCountdown > 0) {
      const timer = setTimeout(() => setSmsCountdown(smsCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [smsCountdown]);

  const handleRememberMe = () => {
    if (rememberMe) {
      localStorage.setItem("remembered_email", email);
      localStorage.setItem("remembered_password", btoa(password));
      localStorage.setItem("remember_me", "true");
    } else {
      localStorage.removeItem("remembered_email");
      localStorage.removeItem("remembered_password");
      localStorage.removeItem("remember_me");
    }
  };

  const handleSendSMS = async () => {
    if (!mobile) {
      setLoginMessage(t("login.toast.enterMobile"));
      return;
    }

    try {
      setIsLoading(true);
      setDebugCode(null);
      const response = await tmoApi.sendSMSCode(2, mobile, mobilePrefix);
      setSmsCountdown(60);

      // Check if debug mode returned a code
      if (response.code) {
        setDebugCode(response.code);
        setLoginMessage(t("login.toast.debugCode", { code: response.code }));
      } else {
        setLoginMessage(t("login.toast.smsSent"));
      }
    } catch (error) {
      console.error("Send SMS error:", error);
      setLoginMessage(
        error instanceof Error ? error.message : t("login.toast.smsFailed"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginMessage("");

    try {
      let token: string;

      switch (loginMethod) {
        case "email":
          if (!email || !password) {
            setLoginMessage(t("login.toast.enterEmailPassword"));
            setIsLoading(false);
            return;
          }
          token = await tmoApi.loginWithEmail(email, password);
          break;

        case "mobile_password":
          if (!mobile || !password) {
            setLoginMessage(t("login.toast.enterMobilePassword"));
            setIsLoading(false);
            return;
          }
          token = await tmoApi.loginWithMobile(mobile, password, mobilePrefix);
          break;

        case "mobile_sms":
          if (!mobile || !smsCode) {
            setLoginMessage(t("login.toast.enterMobileSms"));
            setIsLoading(false);
            return;
          }
          token = await tmoApi.loginWithSMS(mobile, smsCode, mobilePrefix);
          break;

        default:
          throw new Error(t("login.toast.invalidMethod"));
      }

      // Store both tokens for compatibility
      tmoApi.setTMOToken(token);
      handleRememberMe();

      if (loginMethod === "email") {
        saveUserHistory(email, "Login");
      } else {
        saveUserHistory(mobile, "Login");
      }

      // Call the login function from UserContext
      login(token);
      setLoginMessage(t("login.toast.loginSuccess"));
    } catch (error) {
      console.error("Login error:", error);
      setLoginMessage(
        error instanceof Error
          ? error.message
          : t("login.toast.loginFailed"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-xl md:text-3xl font-bold leading-tight mt-12 uppercase text-white text-center">
        {t("login.title")}
      </h1>

      {/* Login Method Tabs */}
      <div className="mt-6 flex justify-center gap-2 flex-wrap">
        <button
          type="button"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            loginMethod === "email"
              ? "bg-blue-standard text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
          onClick={() => setLoginMethod("email")}
        >
          {t("login.tabs.email")}
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            loginMethod === "mobile_password"
              ? "bg-blue-standard text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
          onClick={() => setLoginMethod("mobile_password")}
        >
          {t("login.tabs.mobilePassword")}
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            loginMethod === "mobile_sms"
              ? "bg-blue-standard text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
          onClick={() => setLoginMethod("mobile_sms")}
        >
          {t("login.tabs.mobileSms")}
        </button>
      </div>

      <form onSubmit={handleLogin} className="mt-6">
        {loginMethod === "email" ? (
          <>
            <IconInput
              type="email"
              id="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              placeholder={t("login.emailPlaceholder")}
              icon={MdEmail}
            />
            <div className="mt-4">
              <IconInput
                type="password"
                id="password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                placeholder={t("login.passwordPlaceholder")}
                icon={RiLockPasswordLine}
              />
            </div>
          </>
        ) : (
          <>
            <MobileInput
              mobile={mobile}
              mobilePrefix={mobilePrefix}
              onMobileChange={setMobile}
              onPrefixChange={setMobilePrefix}
              disabled={isLoading}
            />
            <div className="mt-4">
              {loginMethod === "mobile_password" ? (
                <IconInput
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  placeholder={t("login.passwordPlaceholder")}
                  icon={RiLockPasswordLine}
                />
              ) : (
                <div className="flex gap-2">
                  <div className="flex-1">
                    <IconInput
                      type="text"
                      id="smsCode"
                      value={smsCode}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setSmsCode(e.target.value)
                      }
                      placeholder={t("login.smsCodePlaceholder")}
                      icon={BsShieldLock}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSendSMS}
                    disabled={isLoading || smsCountdown > 0}
                    className="px-4 py-3 rounded-lg bg-blue-standard text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors whitespace-nowrap"
                  >
                    {smsCountdown > 0 ? `${smsCountdown}s` : t("login.sendSms")}
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Debug code display */}
        {debugCode && (
          <div className="mt-2 p-2 bg-yellow-900/50 border border-yellow-600 rounded text-yellow-200 text-sm text-center">
            Debug Mode - Verification Code: <strong>{debugCode}</strong>
          </div>
        )}

        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            id="remember-me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 bg-blue-standard bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 text-sm font-medium text-white"
          >
            {t("login.rememberMe")}
          </label>
        </div>

        <div className="flex items-center flex-col gap-2">
          <Button
            type="submit"
            variant="default"
            className="w-full mt-6"
            disabled={isLoading}
          >
            {isLoading ? t("login.loggingIn") : t("login.logIn")}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => router.push("/signup")}
          >
            {t("login.signUp")}
          </Button>
        </div>
      </form>

      {loginMessage && (
        <div
          className={`mt-4 text-sm ${
            loginMessage.includes("successful") ||
            loginMessage.includes("Debug")
              ? "text-blue-standard"
              : "text-red-600"
          } text-center`}
        >
          {loginMessage}
        </div>
      )}

      <div className="text-center mt-2 text-white">
        <Button
          variant="link"
          className="w-full"
          onClick={(e) => {
            e.preventDefault();
            onForgotPassword();
          }}
        >
          {t("login.forgotPassword")}
        </Button>
      </div>
    </>
  );
}
