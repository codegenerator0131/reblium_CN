import { useState, useContext, useEffect, forwardRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/Dialog";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { Textarea } from "@/components/Textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import {
  Loader2,
  User,
  Lock,
  Trash2,
  HelpCircle,
  Settings,
  MapPin,
  Plus,
  Pencil,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import tmoApi from "@/lib/tmoApi";
import { SMS_COUNTDOWN_SECONDS } from "@/Constant";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/AlertDialog";
import { UserContext } from "@/provider/UserContext";
import { useTheme } from "@/provider/ThemeContext";
import { useLanguage } from "@/provider/LanguageContext";
import { TMOAddress } from "@/types/tmo";
import AddressForm from "@/components/AddressForm";

interface UserProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserProfileDialog = forwardRef<
  HTMLDivElement,
  UserProfileDialogProps
>(function UserProfileDialog({ open, onOpenChange }, ref) {
  const router = useRouter();
  const { t } = useTranslation("common");
  const {
    userInfo,
    tmoUser,
    isAuthenticated,
    logout,
    saveUserHistory,
    refetchUserData,
  } = useContext(UserContext);

  // Theme and Language
  const { theme, toggleTheme } = useTheme();
  const { currentLanguage, changeLanguage, languages } = useLanguage();

  // Profile state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [bio, setBio] = useState("");

  // Password reset state (SMS-based)
  type ResetStep = "idle" | "verification" | "newPassword" | "success";
  const [resetStep, setResetStep] = useState<ResetStep>("idle");
  const [resetMobile, setResetMobile] = useState("");
  const [resetMobilePrefix, setResetMobilePrefix] = useState("86");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [smsCountdown, setSmsCountdown] = useState(0);
  const [isSendingSMS, setIsSendingSMS] = useState(false);
  const [debugCode, setDebugCode] = useState<string | null>(null);

  // Support state
  const [supportMessage, setSupportMessage] = useState("");

  // Delete account state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Loading states
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSendingSupport, setIsSendingSupport] = useState(false);

  // Address state
  const [addresses, setAddresses] = useState<TMOAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [editingAddress, setEditingAddress] = useState<TMOAddress | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) router.push("/");
  }, [isAuthenticated, router]);

  useEffect(() => {
    // Prefer TMO user data if available
    if (tmoUser) {
      setFirstName(tmoUser.firstname || "");
      setLastName(tmoUser.lastname || "");
      setEmail(tmoUser.email || "");
      setMobile(tmoUser.mobile || "");
      setResetMobile(tmoUser.mobile || "");
      setResetMobilePrefix((tmoUser.mobile_prefix || "86").replace(/\D/g, ""));
    } else if (userInfo) {
      // Fall back to legacy user data
      const nameParts = (userInfo.name || "").split(" ");
      setFirstName(nameParts[0] || "");
      setLastName(nameParts.slice(1).join(" ") || "");
      setEmail(userInfo.email || "");
      setBio(userInfo.bio || "");
    }
  }, [userInfo, tmoUser]);

  // SMS countdown timer for password reset
  useEffect(() => {
    if (smsCountdown > 0) {
      const timer = setTimeout(() => setSmsCountdown(smsCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [smsCountdown]);

  // Fetch addresses when dialog opens
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!open || !isAuthenticated) return;

      setLoadingAddresses(true);
      try {
        const token = tmoApi.getTMOToken();
        if (token) {
          const addressList = await tmoApi.getAddress(token);
          setAddresses(addressList || []);
        }
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      } finally {
        setLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, [open, isAuthenticated]);

  // Address handlers
  const handleSaveAddress = async (payload: any) => {
    setSavingAddress(true);
    try {
      const token = tmoApi.getTMOToken();
      if (!token) throw new Error("No authentication token");

      // Payload comes from AddressForm in the correct API format:
      // { address: {...}, default_billing: true/false }
      if (editingAddress?.id) {
        await tmoApi.updateAddress(payload, token);
        toast.success(t("userSettings.toast.updateSuccess"));
      } else {
        await tmoApi.createAddress(payload, token);
        toast.success(t("userSettings.toast.updateSuccess"));
      }

      // Refresh addresses
      const addressList = await tmoApi.getAddress(token);
      setAddresses(addressList || []);
      setShowAddressForm(false);
      setEditingAddress(null);
    } catch (error) {
      console.error("Failed to save address:", error);
      toast.error(
        error instanceof Error ? error.message : t("userSettings.toast.updateFailed")
      );
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    setDeletingAddressId(addressId);
    try {
      const token = tmoApi.getTMOToken();
      if (!token) throw new Error("No authentication token");

      await tmoApi.deleteAddress(addressId, token);
      toast.success(t("userSettings.addresses.delete"));

      // Refresh addresses
      const addressList = await tmoApi.getAddress(token);
      setAddresses(addressList || []);
    } catch (error) {
      console.error("Failed to delete address:", error);
      toast.error(
        error instanceof Error ? error.message : t("userSettings.toast.updateFailed")
      );
    } finally {
      setDeletingAddressId(null);
    }
  };

  const handleEditAddress = (address: TMOAddress) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setShowAddressForm(true);
  };

  const handleLanguageSelect = (
    e: React.MouseEvent,
    language: {
      code: string;
      name: string;
      flag: string;
    }
  ) => {
    e.preventDefault();
    e.stopPropagation();
    changeLanguage(language.code);
  };

  const handleUpdateProfile = async () => {
    try {
      setIsUpdating(true);
      const token = tmoApi.getTMOToken();

      if (token && tmoUser) {
        // Use TMO API to update profile
        await tmoApi.updateProfile(
          {
            customer: {
              id: tmoUser.id,
              email: email,
              firstname: firstName,
              lastname: lastName,
            },
          },
          token
        );
        toast.success(t("userSettings.toast.updateSuccess"));
        refetchUserData();
      } else {
        // Fall back to legacy API
        const response = await fetch("/api/user", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: `${firstName} ${lastName}`.trim(),
            email,
            bio,
          }),
        });

        const { success, message } = await response.json();

        if (!success) {
          toast.error(message || t("userSettings.toast.updateFailed"));
          return;
        }

        toast.success(message || t("userSettings.toast.updateSuccess"));
        refetchUserData();
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error(
        err instanceof Error ? err.message : t("userSettings.toast.updateFailed")
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSendResetSMS = async () => {
    if (!resetMobile) {
      toast.warning(t("userSettings.security.enterMobile"));
      return;
    }

    setIsSendingSMS(true);
    setDebugCode(null);
    try {
      // check=2 is for password reset
      const response = await tmoApi.sendSMSCode(2, resetMobile, resetMobilePrefix);
      setSmsCountdown(SMS_COUNTDOWN_SECONDS);
      setResetStep("verification");

      if (response.code) {
        setDebugCode(response.code);
        toast.info(`${t("userSettings.security.codeSent")} (Debug: ${response.code})`);
      } else {
        toast.success(t("userSettings.security.codeSent"));
      }
    } catch (err) {
      console.error("Send SMS error:", err);
      toast.error(
        err instanceof Error ? err.message : t("userSettings.security.sendFailed")
      );
    } finally {
      setIsSendingSMS(false);
    }
  };

  const handleResendSMS = async () => {
    if (smsCountdown > 0) return;
    await handleSendResetSMS();
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.warning(t("userSettings.toast.passwordMismatch"));
      return;
    }
    if (newPassword.length < 8) {
      toast.warning(t("userSettings.toast.passwordTooShort"));
      return;
    }

    setIsChangingPassword(true);
    try {
      const result = await tmoApi.resetPassword(
        resetMobile,
        verificationCode,
        newPassword,
        resetMobilePrefix,
        true
      );

      // If autoLogin is true, the API returns a token
      if (typeof result === "string") {
        tmoApi.setTMOToken(result);
      }

      toast.success(t("userSettings.toast.passwordChanged"));
      saveUserHistory(tmoUser?.email || userInfo?.email || "", "Password Changed");
      setResetStep("success");
    } catch (err) {
      console.error(err);
      toast.error(
        err instanceof Error
          ? err.message
          : t("userSettings.toast.passwordChangeFailed")
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  const resetPasswordFlow = () => {
    setResetStep("idle");
    setVerificationCode("");
    setNewPassword("");
    setConfirmPassword("");
    setSmsCountdown(0);
    setDebugCode(null);
  };

  const handleSendSupportRequest = async () => {
    if (!supportMessage.trim()) {
      toast.warning(t("userSettings.toast.supportMessageEmpty"));
      return;
    }
    try {
      setIsSendingSupport(true);
      const response = await fetch("/api/sendRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: tmoUser?.email || userInfo?.email,
          text: supportMessage,
        }),
      });
      const { message, success } = await response.json();
      if (success) {
        toast.success(message || t("userSettings.toast.supportSuccess"));
        setSupportMessage("");
      } else {
        toast.error(t("userSettings.toast.supportFailed"));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSendingSupport(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch("/api/user/deleteAccount", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: tmoUser?.email || userInfo?.email,
        }),
      });

      const data = await response.json();
      if (data.success) {
        saveUserHistory(tmoUser?.email || userInfo?.email || "", "Deleted Account");
        logout();
      }
    } catch (err) {
      console.error(err);
    }
    setShowDeleteDialog(false);
  };

  // Get display values
  const displayName = tmoUser
    ? `${tmoUser.firstname} ${tmoUser.lastname}`
    : userInfo?.name || "";
  const displayEmail = tmoUser?.email || userInfo?.email || "";
  const displayId = tmoUser?.id || userInfo?.id || "N/A";
  const displayCreatedAt = tmoUser?.created_at || userInfo?.created_at;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {t("userSettings.title")}
            </DialogTitle>
            <DialogDescription>{t("userSettings.subtitle")}</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                {t("userSettings.tabs.profile")}
              </TabsTrigger>
              <TabsTrigger value="addresses">
                <MapPin className="h-4 w-4 mr-2" />
                {t("userSettings.tabs.addresses")}
              </TabsTrigger>
              <TabsTrigger value="security">
                <Lock className="h-4 w-4 mr-2" />
                {t("userSettings.tabs.security")}
              </TabsTrigger>
              <TabsTrigger value="preferences">
                <Settings className="h-4 w-4 mr-2" />
                {t("userSettings.tabs.preferences")}
              </TabsTrigger>
              <TabsTrigger value="support">
                <HelpCircle className="h-4 w-4 mr-2" />
                {t("userSettings.tabs.support")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground" htmlFor="firstName">
                    {t("userSettings.profile.firstName")}
                  </Label>
                  <Input
                    className="text-foreground"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder={t("userSettings.profile.firstNamePlaceholder")}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground" htmlFor="lastName">
                    {t("userSettings.profile.lastName")}
                  </Label>
                  <Input
                    className="text-foreground"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder={t("userSettings.profile.lastNamePlaceholder")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground" htmlFor="email">
                  {t("userSettings.profile.email")}
                </Label>
                <Input
                  className="text-foreground"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("userSettings.profile.emailPlaceholder")}
                />
              </div>

              {mobile && (
                <div className="space-y-2">
                  <Label className="text-foreground" htmlFor="mobile">
                    {t("userSettings.profile.mobile")}
                  </Label>
                  <Input
                    className="text-foreground"
                    id="mobile"
                    type="tel"
                    value={mobile}
                    disabled
                    placeholder={t("userSettings.profile.mobilePlaceholder")}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("userSettings.profile.mobileNote")}
                  </p>
                </div>
              )}

              {!tmoUser && (
                <div className="space-y-2">
                  <Label className="text-foreground" htmlFor="bio">
                    {t("userSettings.profile.bio")}
                  </Label>
                  <Textarea
                    className="text-foreground"
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder={t("userSettings.profile.bioPlaceholder")}
                    rows={4}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-foreground">
                  {t("userSettings.profile.credentials")}
                </Label>
                <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">
                      {t("userSettings.profile.userId")}
                    </span>{" "}
                    <span className="text-muted-foreground">{displayId}</span>
                  </p>
                  <p className="text-sm text-foreground">
                    <span className="font-medium">
                      {t("userSettings.profile.memberSince")}
                    </span>{" "}
                    <span className="text-muted-foreground">
                      {displayCreatedAt
                        ? new Date(displayCreatedAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button onClick={handleUpdateProfile} disabled={isUpdating}>
                  {isUpdating && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("userSettings.profile.saveChanges")}
                </Button>
              </DialogFooter>
            </TabsContent>

            <TabsContent value="addresses" className="space-y-4 mt-4">
              {showAddressForm ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    {editingAddress
                      ? t("userSettings.addresses.edit")
                      : t("userSettings.addresses.addNew")}
                  </h3>
                  <AddressForm
                    initialData={editingAddress}
                    userInfo={{
                      firstname: tmoUser?.firstname || "",
                      lastname: tmoUser?.lastname || "",
                      mobile: tmoUser?.mobile || "",
                    }}
                    onSave={handleSaveAddress}
                    onCancel={() => {
                      setShowAddressForm(false);
                      setEditingAddress(null);
                    }}
                    isLoading={savingAddress}
                  />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">
                      {t("userSettings.addresses.title")}
                    </h3>
                    <Button size="sm" onClick={handleAddNewAddress}>
                      <Plus className="h-4 w-4 mr-2" />
                      {t("userSettings.addresses.addNew")}
                    </Button>
                  </div>

                  {loadingAddresses ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>{t("userSettings.addresses.noAddresses")}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className="p-4 rounded-lg border bg-muted/30 space-y-2"
                        >
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <p className="font-medium text-foreground">
                                {address.firstname} {address.lastname}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {address.street?.join(", ")}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {address.city}
                                {address.region?.region && `, ${address.region.region}`}
                                {address.postcode && ` ${address.postcode}`}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {address.telephone}
                              </p>
                              {address.default_billing && (
                                <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                                  {t("userSettings.addresses.defaultBilling")}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditAddress(address)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => address.id && handleDeleteAddress(address.id)}
                                disabled={deletingAddressId === address.id}
                              >
                                {deletingAddressId === address.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="security" className="space-y-4 mt-4">
              {/* Step: Idle - Show mobile and send SMS button */}
              {resetStep === "idle" && (
                <>
                  <div className="space-y-2">
                    <Label className="text-foreground">
                      {t("userSettings.security.resetPasswordTitle")}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t("userSettings.security.resetPasswordDescription")}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">
                      {t("userSettings.security.mobileNumber")}
                    </Label>
                    <div className="flex items-center border border-input rounded-md dark:bg-input/30 bg-transparent px-3 h-9 shadow-xs">
                      <span className="text-muted-foreground text-sm">
                        +{resetMobilePrefix} {resetMobile}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={handleSendResetSMS}
                    disabled={isSendingSMS || !resetMobile}
                    className="w-full"
                  >
                    {isSendingSMS && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {t("userSettings.security.sendVerificationCode")}
                  </Button>
                </>
              )}

              {/* Step: Verification - Enter SMS code */}
              {resetStep === "verification" && (
                <>
                  <div className="space-y-2">
                    <Label className="text-foreground">
                      {t("userSettings.security.verificationTitle")}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t("userSettings.security.codeSentTo", {
                        prefix: resetMobilePrefix,
                        mobile: resetMobile,
                      })}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground" htmlFor="verification-code">
                      {t("userSettings.security.verificationCode")}
                    </Label>
                    <Input
                      className="text-foreground text-center text-lg tracking-widest"
                      id="verification-code"
                      value={verificationCode}
                      onChange={(e) =>
                        setVerificationCode(
                          e.target.value.replace(/\D/g, "").slice(0, 6)
                        )
                      }
                      placeholder="------"
                      maxLength={6}
                    />
                  </div>

                  {/* Debug code display */}
                  {debugCode && (
                    <div className="p-2 bg-yellow-900/50 border border-yellow-600 rounded text-yellow-200 text-sm text-center">
                      Debug Mode - Verification Code: <strong>{debugCode}</strong>
                    </div>
                  )}

                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={handleResendSMS}
                      disabled={smsCountdown > 0 || isSendingSMS}
                      className="text-sm text-blue-600 hover:underline disabled:text-gray-400 disabled:no-underline"
                    >
                      {smsCountdown > 0
                        ? t("userSettings.security.resendIn", { seconds: smsCountdown })
                        : t("userSettings.security.resendCode")}
                    </button>
                  </div>

                  <Button
                    onClick={() => {
                      if (!verificationCode || verificationCode.length < 4) {
                        toast.warning(t("userSettings.security.enterValidCode"));
                        return;
                      }
                      setResetStep("newPassword");
                    }}
                    disabled={verificationCode.length < 4}
                    className="w-full"
                  >
                    {t("userSettings.security.continue")}
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={resetPasswordFlow}
                    className="w-full"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t("userSettings.security.back")}
                  </Button>
                </>
              )}

              {/* Step: New Password - Enter new password */}
              {resetStep === "newPassword" && (
                <>
                  <div className="space-y-2">
                    <Label className="text-foreground">
                      {t("userSettings.security.newPasswordTitle")}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t("userSettings.security.newPasswordDescription")}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground" htmlFor="new-password">
                      {t("userSettings.security.newPassword")}
                    </Label>
                    <Input
                      className="text-foreground"
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder={t("userSettings.security.newPasswordPlaceholder")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground" htmlFor="confirm-password">
                      {t("userSettings.security.confirmPassword")}
                    </Label>
                    <Input
                      className="text-foreground"
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t("userSettings.security.confirmPasswordPlaceholder")}
                    />
                  </div>

                  <Button
                    onClick={handleResetPassword}
                    disabled={isChangingPassword}
                    className="w-full"
                  >
                    {isChangingPassword && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {t("userSettings.security.resetPassword")}
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => setResetStep("verification")}
                    className="w-full"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t("userSettings.security.back")}
                  </Button>
                </>
              )}

              {/* Step: Success */}
              {resetStep === "success" && (
                <div className="text-center space-y-4 py-4">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
                  <p className="text-foreground font-medium">
                    {t("userSettings.toast.passwordChanged")}
                  </p>
                  <Button onClick={resetPasswordFlow} className="w-full">
                    {t("userSettings.security.done")}
                  </Button>
                </div>
              )}

              {/* Delete Account - always visible at the bottom */}
              {resetStep !== "success" && (
                <div className="pt-4 border-t">
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteDialog(true)}
                    className="w-full sm:w-auto"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t("userSettings.security.deleteAccount")}
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="preferences" className="space-y-4 mt-4">
              <div className="space-y-6">
                {/* Language Selection */}
                <div className="space-y-3">
                  <Label className="text-foreground text-base font-semibold">
                    {t("userSettings.preferences.language")}
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {languages.map((language) => (
                      <div
                        key={language.code}
                        onClick={(e) => handleLanguageSelect(e, language)}
                        className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                          currentLanguage === language.name
                            ? "border-primary bg-primary/10 scale-105"
                            : "border-border bg-muted/30 hover:border-primary/50 hover:scale-102"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-3xl">{language.flag}</span>
                          <span className="text-sm font-medium text-foreground text-center">
                            {language.name}
                          </span>
                        </div>
                        {currentLanguage === language.name && (
                          <div className="absolute top-2 right-2">
                            <FaCheck className="text-primary" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("userSettings.preferences.languageDescription")}
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="support" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-foreground" htmlFor="support-message">
                  {t("userSettings.support.message")}
                </Label>
                <Textarea
                  className="text-foreground"
                  id="support-message"
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  placeholder={t("userSettings.support.messagePlaceholder")}
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  {t("userSettings.support.responseTime")}
                </p>
              </div>

              <DialogFooter>
                <Button
                  onClick={handleSendSupportRequest}
                  disabled={isSendingSupport}
                >
                  {isSendingSupport && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("userSettings.support.sendRequest")}
                </Button>
              </DialogFooter>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              {t("userSettings.deleteDialog.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("userSettings.deleteDialog.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("userSettings.deleteDialog.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("userSettings.deleteDialog.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});
