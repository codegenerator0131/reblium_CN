import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoLogoWechat } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import tmoApi from "@/lib/tmoApi";

export default function SocialLoginButtons() {
  const { t } = useTranslation("common");
  const [status, setStatus] = useState("idle");

  const handleWeChatLogin = async () => {
    setStatus("loading");

    try {
      // Build the redirect URL - this is where TMO will redirect after successful WeChat login
      // TMO will append the token to this URL
      const redirectUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/wechat/callback`
          : "";

      if (!redirectUrl) {
        throw new Error("Could not determine redirect URL");
      }

      // Get WeChat login URL from TMO API
      const wechatLoginUrl = await tmoApi.getWeChatLoginUrl(redirectUrl);

      if (!wechatLoginUrl) {
        throw new Error("Failed to get WeChat login URL");
      }

      // Redirect to WeChat login page (managed by TMO)
      window.location.href = wechatLoginUrl;
    } catch (error) {
      console.error("WeChat login error:", error);
      toast.error(t("socialLogin.wechatLoginFailed"), {
        position: "top-center",
        autoClose: 3000,
      });
      setStatus("idle");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="login-buttons w-full space-y-3">
        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-sm">
            {t("socialLogin.orContinueWith")}
          </span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>

        <button
          className="quick-login-button font-semibold rounded-lg py-3 border border-gray-300 w-full flex items-center justify-center gap-4 text-foreground hover:bg-green-600/10 transition-colors"
          onClick={handleWeChatLogin}
          disabled={status === "loading"}
        >
          <IoLogoWechat size={24} color="#07C160" />
          <p className="text-white">
            {status === "loading"
              ? t("socialLogin.connecting")
              : t("socialLogin.wechat")}
          </p>
        </button>
      </div>
    </>
  );
}
