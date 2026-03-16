import { useState, useCallback, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Smartphone, Mail, MessageSquare } from "lucide-react";
import tmoApi from "@/lib/tmoApi";
import {
  validateEmail,
  validatePassword,
  validateMobile,
  sanitizeMobile,
  MOBILE_MAX_LENGTH,
  SMS_COUNTDOWN_SECONDS,
} from "@/lib/authValidation";

type AuthView = "login" | "signup" | "forgot-password";
type LoginMethod = "email" | "mobile-password" | "mobile-sms";
type ForgotStep = "mobile" | "verify" | "new-password" | "success";
type SignupStep = "form" | "verify";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess: (token: string) => void;
  initialView?: AuthView;
}

export function LoginDialog({ open, onOpenChange, onLoginSuccess, initialView = "login" }: LoginDialogProps) {
  const [view, setView] = useState<AuthView>(initialView);
  const [loading, setLoading] = useState(false);

  // Reset view when dialog opens
  useEffect(() => {
    if (open) {
      setView(initialView);
    }
  }, [open, initialView]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] max-h-[90vh] overflow-y-auto">
        {view === "login" && (
          <LoginView
            onLoginSuccess={onLoginSuccess}
            onSwitchToSignup={() => setView("signup")}
            onSwitchToForgot={() => setView("forgot-password")}
            loading={loading}
            setLoading={setLoading}
          />
        )}
        {view === "signup" && (
          <SignupView
            onLoginSuccess={onLoginSuccess}
            onSwitchToLogin={() => setView("login")}
            loading={loading}
            setLoading={setLoading}
          />
        )}
        {view === "forgot-password" && (
          <ForgotPasswordView
            onLoginSuccess={onLoginSuccess}
            onBack={() => setView("login")}
            loading={loading}
            setLoading={setLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

// ==================== Login View ====================

function LoginView({
  onLoginSuccess,
  onSwitchToSignup,
  onSwitchToForgot,
  loading,
  setLoading,
}: {
  onLoginSuccess: (token: string) => void;
  onSwitchToSignup: () => void;
  onSwitchToForgot: () => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
}) {
  const [method, setMethod] = useState<LoginMethod>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [mobilePrefix] = useState("86");
  const [smsCode, setSmsCode] = useState("");
  const [smsCountdown, setSmsCountdown] = useState(0);
  const [debugCode, setDebugCode] = useState<string | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const startCountdown = useCallback(() => {
    setSmsCountdown(SMS_COUNTDOWN_SECONDS);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setSmsCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleSendSMS = async () => {
    const mobileError = validateMobile(mobile);
    if (mobileError) { toast.error(mobileError); return; }

    try {
      setLoading(true);
      const result = await tmoApi.sendSMSCode(2, mobile, mobilePrefix);
      startCountdown();
      if (result.code) {
        setDebugCode(result.code);
        toast.info(`[Debug] Verification code: ${result.code}`);
      } else {
        toast.success("Verification code sent");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to send SMS");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      let token: string;

      if (method === "email") {
        const emailErr = validateEmail(email);
        if (emailErr) { toast.error(emailErr); setLoading(false); return; }
        if (!password) { toast.error("Password is required"); setLoading(false); return; }
        token = await tmoApi.loginWithEmail(email, password);
      } else if (method === "mobile-password") {
        const mobileErr = validateMobile(mobile);
        if (mobileErr) { toast.error(mobileErr); setLoading(false); return; }
        if (!password) { toast.error("Password is required"); setLoading(false); return; }
        token = await tmoApi.loginWithMobile(mobile, password, mobilePrefix);
      } else {
        const mobileErr = validateMobile(mobile);
        if (mobileErr) { toast.error(mobileErr); setLoading(false); return; }
        if (!smsCode) { toast.error("Verification code is required"); setLoading(false); return; }
        token = await tmoApi.loginWithSMS(mobile, smsCode, mobilePrefix);
      }

      // Clean token (remove surrounding quotes if present)
      token = token.replace(/^"|"$/g, "");
      tmoApi.setTMOToken(token);
      toast.success("Login successful");
      onLoginSuccess(token);
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleWeChatLogin = async () => {
    try {
      setLoading(true);
      const callbackUrl = `${window.location.origin}/auth/wechat/callback`;
      const wechatUrl = await tmoApi.getWeChatLoginUrl(callbackUrl);
      window.location.href = wechatUrl;
    } catch (err: any) {
      toast.error(err.message || "Failed to initiate WeChat login");
      setLoading(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Sign In</DialogTitle>
      </DialogHeader>

      <Tabs value={method} onValueChange={(v) => setMethod(v as LoginMethod)} className="mt-2">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="email" className="text-xs gap-1">
            <Mail className="h-3 w-3" />
            Email
          </TabsTrigger>
          <TabsTrigger value="mobile-password" className="text-xs gap-1">
            <Smartphone className="h-3 w-3" />
            Mobile
          </TabsTrigger>
          <TabsTrigger value="mobile-sms" className="text-xs gap-1">
            <MessageSquare className="h-3 w-3" />
            SMS
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
        </TabsContent>

        <TabsContent value="mobile-password" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="login-mobile-pw">Mobile Number</Label>
            <div className="flex gap-2">
              <div className="flex items-center px-3 bg-muted rounded-md text-sm min-w-[60px] justify-center">
                +{mobilePrefix}
              </div>
              <Input
                id="login-mobile-pw"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(sanitizeMobile(e.target.value))}
                maxLength={MOBILE_MAX_LENGTH}
                placeholder="Enter mobile number"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-mobile-password">Password</Label>
            <Input
              id="login-mobile-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
        </TabsContent>

        <TabsContent value="mobile-sms" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="login-mobile-sms">Mobile Number</Label>
            <div className="flex gap-2">
              <div className="flex items-center px-3 bg-muted rounded-md text-sm min-w-[60px] justify-center">
                +{mobilePrefix}
              </div>
              <Input
                id="login-mobile-sms"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(sanitizeMobile(e.target.value))}
                maxLength={MOBILE_MAX_LENGTH}
                placeholder="Enter mobile number"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-sms-code">Verification Code</Label>
            <div className="flex gap-2">
              <Input
                id="login-sms-code"
                value={smsCode}
                onChange={(e) => setSmsCode(e.target.value)}
                placeholder="Enter code"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleSendSMS}
                disabled={loading || smsCountdown > 0}
                className="min-w-[100px] shrink-0"
              >
                {smsCountdown > 0 ? `${smsCountdown}s` : "Send Code"}
              </Button>
            </div>
            {debugCode && (
              <p className="text-xs text-muted-foreground">
                [Debug] Code: <span className="font-mono font-bold">{debugCode}</span>
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-3 mt-2">
        <Button onClick={handleLogin} disabled={loading} className="w-full">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign In
        </Button>

        <Button
          variant="outline"
          onClick={handleWeChatLogin}
          disabled={loading}
          className="w-full"
        >
          Sign in with WeChat
        </Button>

        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={onSwitchToForgot}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Forgot password?
          </button>
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-primary hover:underline"
          >
            Create account
          </button>
        </div>
      </div>
    </>
  );
}

// ==================== Signup View ====================

function SignupView({
  onLoginSuccess,
  onSwitchToLogin,
  loading,
  setLoading,
}: {
  onLoginSuccess: (token: string) => void;
  onSwitchToLogin: () => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
}) {
  const [step, setStep] = useState<SignupStep>("form");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [mobilePrefix] = useState("86");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [smsCountdown, setSmsCountdown] = useState(0);
  const [debugCode, setDebugCode] = useState<string | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const startCountdown = useCallback(() => {
    setSmsCountdown(SMS_COUNTDOWN_SECONDS);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setSmsCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleSendSMS = async () => {
    const mobileErr = validateMobile(mobile);
    if (mobileErr) { toast.error(mobileErr); return; }

    try {
      setLoading(true);
      const result = await tmoApi.sendSMSCode(1, mobile, mobilePrefix);
      startCountdown();
      if (result.code) {
        setDebugCode(result.code);
        toast.info(`[Debug] Verification code: ${result.code}`);
      } else {
        toast.success("Verification code sent");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to send SMS");
    } finally {
      setLoading(false);
    }
  };

  const handleStepOne = async () => {
    if (!firstname.trim()) { toast.error("First name is required"); return; }
    if (!lastname.trim()) { toast.error("Last name is required"); return; }
    const emailErr = validateEmail(email);
    if (emailErr) { toast.error(emailErr); return; }
    const mobileErr = validateMobile(mobile);
    if (mobileErr) { toast.error(mobileErr); return; }
    const pwErr = validatePassword(password);
    if (pwErr) { toast.error(pwErr); return; }
    if (password !== confirmPassword) { toast.error("Passwords do not match"); return; }

    await handleSendSMS();
    setStep("verify");
  };

  const handleRegister = async () => {
    if (!smsCode) { toast.error("Enter the verification code"); return; }

    try {
      setLoading(true);
      await tmoApi.register({
        customer: {
          email,
          firstname,
          lastname,
          dob: dob || undefined,
          custom_attributes: [
            { attribute_code: "mobile", value: mobile },
            { attribute_code: "mobile_prefix", value: `+${mobilePrefix}` },
          ],
        },
        verify_code: smsCode,
        password,
        cart_id: "",
      });

      toast.success("Account created! Logging you in...");

      // Auto-login after registration
      const token = await tmoApi.loginWithMobile(mobile, password, mobilePrefix);
      const cleanToken = token.replace(/^"|"$/g, "");
      tmoApi.setTMOToken(cleanToken);
      onLoginSuccess(cleanToken);
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={step === "verify" ? () => setStep("form") : onSwitchToLogin}
            className="p-1 rounded-md hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <DialogTitle>
            {step === "form" ? "Create Account" : "Verify Mobile"}
          </DialogTitle>
        </div>
      </DialogHeader>

      {step === "form" && (
        <div className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="signup-firstname">First Name</Label>
              <Input id="signup-firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} placeholder="First name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-lastname">Last Name</Label>
              <Input id="signup-lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} placeholder="Last name" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-mobile">Mobile Number</Label>
            <div className="flex gap-2">
              <div className="flex items-center px-3 bg-muted rounded-md text-sm min-w-[60px] justify-center">+{mobilePrefix}</div>
              <Input id="signup-mobile" type="tel" value={mobile} onChange={(e) => setMobile(sanitizeMobile(e.target.value))} maxLength={MOBILE_MAX_LENGTH} placeholder="Enter mobile number" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-dob">Date of Birth (optional)</Label>
            <Input id="signup-dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 chars, upper+lower+number" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-confirm">Confirm Password</Label>
            <Input id="signup-confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" />
          </div>

          <Button onClick={handleStepOne} disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button type="button" onClick={onSwitchToLogin} className="text-primary hover:underline">
              Sign in
            </button>
          </p>
        </div>
      )}

      {step === "verify" && (
        <div className="space-y-4 mt-2">
          <p className="text-sm text-muted-foreground">
            We sent a verification code to +{mobilePrefix} {mobile}
          </p>

          <div className="space-y-2">
            <Label htmlFor="signup-sms-code">Verification Code</Label>
            <div className="flex gap-2">
              <Input
                id="signup-sms-code"
                value={smsCode}
                onChange={(e) => setSmsCode(e.target.value)}
                placeholder="Enter code"
                onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleSendSMS}
                disabled={loading || smsCountdown > 0}
                className="min-w-[100px] shrink-0"
              >
                {smsCountdown > 0 ? `${smsCountdown}s` : "Resend"}
              </Button>
            </div>
            {debugCode && (
              <p className="text-xs text-muted-foreground">
                [Debug] Code: <span className="font-mono font-bold">{debugCode}</span>
              </p>
            )}
          </div>

          <Button onClick={handleRegister} disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
        </div>
      )}
    </>
  );
}

// ==================== Forgot Password View ====================

function ForgotPasswordView({
  onLoginSuccess,
  onBack,
  loading,
  setLoading,
}: {
  onLoginSuccess: (token: string) => void;
  onBack: () => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
}) {
  const [step, setStep] = useState<ForgotStep>("mobile");
  const [mobile, setMobile] = useState("");
  const [mobilePrefix] = useState("86");
  const [smsCode, setSmsCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [smsCountdown, setSmsCountdown] = useState(0);
  const [debugCode, setDebugCode] = useState<string | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const startCountdown = useCallback(() => {
    setSmsCountdown(SMS_COUNTDOWN_SECONDS);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setSmsCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleSendSMS = async () => {
    const mobileErr = validateMobile(mobile);
    if (mobileErr) { toast.error(mobileErr); return; }

    try {
      setLoading(true);
      const result = await tmoApi.sendSMSCode(2, mobile, mobilePrefix);
      startCountdown();
      if (result.code) {
        setDebugCode(result.code);
        toast.info(`[Debug] Verification code: ${result.code}`);
      } else {
        toast.success("Verification code sent");
      }
      setStep("verify");
    } catch (err: any) {
      toast.error(err.message || "Failed to send SMS");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = () => {
    if (!smsCode) { toast.error("Enter the verification code"); return; }
    setStep("new-password");
  };

  const handleResetPassword = async () => {
    const pwErr = validatePassword(newPassword);
    if (pwErr) { toast.error(pwErr); return; }
    if (newPassword !== confirmPassword) { toast.error("Passwords do not match"); return; }

    try {
      setLoading(true);
      const result = await tmoApi.resetPassword(
        mobile,
        smsCode,
        newPassword,
        mobilePrefix,
        true, // autoLogin
      );

      if (typeof result === "string" && result) {
        const token = result.replace(/^"|"$/g, "");
        tmoApi.setTMOToken(token);
        toast.success("Password reset successful");
        onLoginSuccess(token);
      } else {
        toast.success("Password reset successful. Please sign in.");
        setStep("success");
      }
    } catch (err: any) {
      toast.error(err.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={step === "mobile" ? onBack : () => {
              if (step === "verify") setStep("mobile");
              else if (step === "new-password") setStep("verify");
              else onBack();
            }}
            className="p-1 rounded-md hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <DialogTitle>Reset Password</DialogTitle>
        </div>
      </DialogHeader>

      {step === "mobile" && (
        <div className="space-y-4 mt-2">
          <p className="text-sm text-muted-foreground">
            Enter your mobile number to receive a verification code.
          </p>
          <div className="space-y-2">
            <Label htmlFor="forgot-mobile">Mobile Number</Label>
            <div className="flex gap-2">
              <div className="flex items-center px-3 bg-muted rounded-md text-sm min-w-[60px] justify-center">+{mobilePrefix}</div>
              <Input
                id="forgot-mobile"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(sanitizeMobile(e.target.value))}
                maxLength={MOBILE_MAX_LENGTH}
                placeholder="Enter mobile number"
                onKeyDown={(e) => e.key === "Enter" && handleSendSMS()}
              />
            </div>
          </div>
          <Button onClick={handleSendSMS} disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Verification Code
          </Button>
        </div>
      )}

      {step === "verify" && (
        <div className="space-y-4 mt-2">
          <p className="text-sm text-muted-foreground">
            Enter the code sent to +{mobilePrefix} {mobile}
          </p>
          <div className="space-y-2">
            <Label htmlFor="forgot-code">Verification Code</Label>
            <div className="flex gap-2">
              <Input
                id="forgot-code"
                value={smsCode}
                onChange={(e) => setSmsCode(e.target.value)}
                placeholder="Enter code"
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleSendSMS}
                disabled={loading || smsCountdown > 0}
                className="min-w-[100px] shrink-0"
              >
                {smsCountdown > 0 ? `${smsCountdown}s` : "Resend"}
              </Button>
            </div>
            {debugCode && (
              <p className="text-xs text-muted-foreground">
                [Debug] Code: <span className="font-mono font-bold">{debugCode}</span>
              </p>
            )}
          </div>
          <Button onClick={handleVerify} disabled={loading} className="w-full">
            Verify
          </Button>
        </div>
      )}

      {step === "new-password" && (
        <div className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="forgot-new-pw">New Password</Label>
            <Input
              id="forgot-new-pw"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min 8 chars, upper+lower+number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="forgot-confirm-pw">Confirm Password</Label>
            <Input
              id="forgot-confirm-pw"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
            />
          </div>
          <Button onClick={handleResetPassword} disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reset Password
          </Button>
        </div>
      )}

      {step === "success" && (
        <div className="space-y-4 mt-2 text-center">
          <p className="text-sm text-muted-foreground">
            Your password has been reset successfully.
          </p>
          <Button onClick={onBack} className="w-full">
            Back to Sign In
          </Button>
        </div>
      )}
    </>
  );
}
