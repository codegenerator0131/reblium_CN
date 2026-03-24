import { useState, useEffect, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, User, Lock, Trash2, HelpCircle, ArrowLeft, CheckCircle2, MapPin, Plus, Pencil } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/_core/hooks/useAuth";
import tmoApi from "@/lib/tmoApi";
import type { TMOAddress, TMOGeoItem } from "@/types/tmo";
import { SMS_COUNTDOWN_SECONDS } from "@/lib/authValidation";

interface UserProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProfileDialog({ open, onOpenChange }: UserProfileDialogProps) {
  const { user, refresh } = useAuth();

  // Profile state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Profile verification state
  type ProfileStep = "edit" | "verify";
  const [profileStep, setProfileStep] = useState<ProfileStep>("edit");
  const [profileSmsCode, setProfileSmsCode] = useState("");
  const [profileSmsCountdown, setProfileSmsCountdown] = useState(0);
  const [profileDebugCode, setProfileDebugCode] = useState<string | null>(null);
  const [isSendingProfileSMS, setIsSendingProfileSMS] = useState(false);
  const profileCountdownRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

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
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [debugCode, setDebugCode] = useState<string | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  // Support state
  const [supportMessage, setSupportMessage] = useState("");
  const [isSendingSupport, setIsSendingSupport] = useState(false);

  // Address state
  const [addresses, setAddresses] = useState<TMOAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<TMOAddress | null>(null);
  const [savingAddress, setSavingAddress] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState<number | null>(null);

  // Address form fields
  const [addrStreet, setAddrStreet] = useState("");
  const [addrPostcode, setAddrPostcode] = useState("");
  const [addrDefaultBilling, setAddrDefaultBilling] = useState(false);

  // Geo cascading selects
  const [regions, setRegions] = useState<TMOGeoItem[]>([]);
  const [cities, setCities] = useState<TMOGeoItem[]>([]);
  const [districts, setDistricts] = useState<TMOGeoItem[]>([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  // Delete account state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Populate fields from user data
  useEffect(() => {
    if (open && user) {
      setFirstName(user.firstname || user.name?.split(" ")[0] || "");
      setLastName(user.lastname || user.name?.split(" ").slice(1).join(" ") || "");
      setEmail(user.email || "");
      setMobile(user.mobile || "");
      setResetMobile(user.mobile || "");
      setResetMobilePrefix((user.mobile_prefix || "86").replace(/\D/g, ""));
      // Reset flows when dialog opens
      resetPasswordFlow();
      setProfileStep("edit");
      setProfileSmsCode("");
      setProfileDebugCode(null);
    }
  }, [open, user]);

  // Fetch addresses and regions when dialog opens
  useEffect(() => {
    if (!open || !user) return;

    const fetchAddresses = async () => {
      setLoadingAddresses(true);
      try {
        const token = tmoApi.getTMOToken();
        if (token) {
          const list = await tmoApi.getAddress(token);
          setAddresses(list || []);
        }
      } catch {
        // Addresses may not be available
      } finally {
        setLoadingAddresses(false);
      }
    };

    const fetchRegions = async () => {
      setLoadingRegions(true);
      try {
        const data = await tmoApi.getRegions();
        setRegions(data);
      } catch {
        // Geo data may not be available
      } finally {
        setLoadingRegions(false);
      }
    };

    fetchAddresses();
    fetchRegions();
  }, [open, user]);

  const handleRegionChange = async (regionId: string) => {
    setSelectedRegion(regionId);
    setCities([]);
    setDistricts([]);
    setSelectedCity("");
    setSelectedDistrict("");
    if (!regionId) return;
    setLoadingCities(true);
    try {
      const data = await tmoApi.getCities(regionId);
      setCities(data);
    } catch {
      // ignore
    } finally {
      setLoadingCities(false);
    }
  };

  const handleCityChange = async (cityId: string) => {
    setSelectedCity(cityId);
    setDistricts([]);
    setSelectedDistrict("");
    if (!cityId) return;
    setLoadingDistricts(true);
    try {
      const data = await tmoApi.getDistricts(cityId);
      setDistricts(data);
    } catch {
      // ignore
    } finally {
      setLoadingDistricts(false);
    }
  };

  // SMS countdown timer cleanup
  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (profileCountdownRef.current) clearInterval(profileCountdownRef.current);
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

  // ==================== Addresses ====================
  const resetAddressForm = () => {
    setAddrStreet("");
    setAddrPostcode("");
    setAddrDefaultBilling(false);
    setSelectedRegion("");
    setSelectedCity("");
    setSelectedDistrict("");
    setCities([]);
    setDistricts([]);
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    resetAddressForm();
    setShowAddressForm(true);
  };

  const handleEditAddress = (address: TMOAddress) => {
    setEditingAddress(address);
    setAddrStreet(address.street?.join("\n") || "");
    setAddrPostcode(address.postcode || "");
    setAddrDefaultBilling(address.default_billing || false);
    // Reset geo selects — user needs to re-select for edits
    setSelectedRegion("");
    setSelectedCity("");
    setSelectedDistrict("");
    setCities([]);
    setDistricts([]);
    setShowAddressForm(true);
  };

  const handleSaveAddress = async () => {
    if (!selectedDistrict) {
      toast.error("Please select a district");
      return;
    }
    if (!addrStreet.trim()) {
      toast.error("Please enter a street address");
      return;
    }
    if (!addrPostcode.trim()) {
      toast.error("Please enter a postcode");
      return;
    }

    setSavingAddress(true);
    try {
      const token = tmoApi.getTMOToken();
      if (!token) throw new Error("No authentication token");

      const payload = {
        address: {
          ...(editingAddress?.id ? { id: editingAddress.id } : {}),
          firstname: user?.firstname || firstName,
          lastname: user?.lastname || lastName,
          telephone: user?.mobile || "",
          street: [addrStreet.trim()],
          postcode: addrPostcode.trim(),
          custom_attributes: [
            { attribute_code: "district_id", value: parseInt(selectedDistrict, 10) },
            { attribute_code: "mobile_prefix", value: "+86" },
            { attribute_code: "mobile", value: user?.mobile || "" },
          ],
        },
        default_billing: addrDefaultBilling,
      };

      if (editingAddress?.id) {
        await tmoApi.updateAddress(payload, token);
      } else {
        await tmoApi.createAddress(payload, token);
      }

      toast.success("Address saved successfully");
      const list = await tmoApi.getAddress(token);
      setAddresses(list || []);
      setShowAddressForm(false);
      setEditingAddress(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to save address");
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
      toast.success("Address deleted");
      const list = await tmoApi.getAddress(token);
      setAddresses(list || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete address");
    } finally {
      setDeletingAddressId(null);
    }
  };

  // ==================== Profile ====================
  const startProfileCountdown = useCallback(() => {
    setProfileSmsCountdown(SMS_COUNTDOWN_SECONDS);
    if (profileCountdownRef.current) clearInterval(profileCountdownRef.current);
    profileCountdownRef.current = setInterval(() => {
      setProfileSmsCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(profileCountdownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleProfileSendSMS = async () => {
    const mobileNum = user?.mobile || mobile;
    const prefix = (user?.mobile_prefix || "86").replace(/\D/g, "");
    if (!mobileNum) {
      toast.error("No mobile number associated with this account");
      return;
    }

    setIsSendingProfileSMS(true);
    setProfileDebugCode(null);
    try {
      const response = await tmoApi.sendSMSCode(2, mobileNum, prefix);
      startProfileCountdown();
      setProfileStep("verify");

      if (response.code) {
        setProfileDebugCode(response.code);
        toast.info(`Verification code sent (Debug: ${response.code})`);
      } else {
        toast.success("Verification code sent");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to send SMS");
    } finally {
      setIsSendingProfileSMS(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!profileSmsCode || profileSmsCode.length < 4) {
      toast.error("Please enter the verification code");
      return;
    }

    try {
      setIsUpdating(true);
      const token = tmoApi.getTMOToken();
      if (!token) {
        toast.error("No authentication token");
        return;
      }

      // Verify the SMS code first by logging in with it (validates the code)
      const mobileNum = user?.mobile || mobile;
      const prefix = (user?.mobile_prefix || "86").replace(/\D/g, "");
      await tmoApi.loginWithSMS(mobileNum!, profileSmsCode, prefix);

      await tmoApi.updateProfile(
        {
          customer: {
            id: user?.id,
            email,
            firstname: firstName,
            lastname: lastName,
          },
        },
        token,
      );
      toast.success("Profile updated successfully");
      refresh();
      setProfileStep("edit");
      setProfileSmsCode("");
      setProfileDebugCode(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  // ==================== Password Reset (SMS-based) ====================
  const handleSendResetSMS = async () => {
    if (!resetMobile) {
      toast.error("Mobile number is required");
      return;
    }

    setIsSendingSMS(true);
    setDebugCode(null);
    try {
      const response = await tmoApi.sendSMSCode(2, resetMobile, resetMobilePrefix);
      startCountdown();
      setResetStep("verification");

      if (response.code) {
        setDebugCode(response.code);
        toast.info(`Verification code sent (Debug: ${response.code})`);
      } else {
        toast.success("Verification code sent");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to send SMS");
    } finally {
      setIsSendingSMS(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsChangingPassword(true);
    try {
      const result = await tmoApi.resetPassword(
        resetMobile,
        verificationCode,
        newPassword,
        resetMobilePrefix,
        true,
      );

      if (typeof result === "string") {
        tmoApi.setTMOToken(result);
      }

      toast.success("Password changed successfully");
      setResetStep("success");
    } catch (err: any) {
      toast.error(err.message || "Password reset failed");
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

  // ==================== Support ====================
  const handleSendSupportRequest = async () => {
    if (!supportMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }
    try {
      setIsSendingSupport(true);
      const token = tmoApi.getTMOToken();
      if (!token) {
        toast.error("Not authenticated");
        return;
      }
      await tmoApi.submitFeedback(supportMessage, token);
      toast.success("Support request sent successfully");
      setSupportMessage("");
    } catch {
      toast.error("Failed to send support request");
    } finally {
      setIsSendingSupport(false);
    }
  };

  const handleDeleteAccount = () => {
    toast.error("Account deletion is not available yet");
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Settings</DialogTitle>
            <DialogDescription>
              Manage your account settings and preferences
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="addresses">
                <MapPin className="h-4 w-4 mr-2" />
                Addresses
              </TabsTrigger>
              <TabsTrigger value="security">
                <Lock className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="support">
                <HelpCircle className="h-4 w-4 mr-2" />
                Support
              </TabsTrigger>
            </TabsList>

            {/* ==================== Profile Tab ==================== */}
            <TabsContent value="profile" className="space-y-4 mt-4">
              {profileStep === "edit" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>

                  {mobile && (
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <Input
                        id="mobile"
                        type="tel"
                        value={mobile}
                        disabled
                        placeholder="Mobile number"
                      />
                      <p className="text-xs text-muted-foreground">
                        Mobile number cannot be changed here. Contact support if needed.
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Credentials</Label>
                    <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">User ID:</span>{" "}
                        <span className="text-muted-foreground">{user?.id || "N/A"}</span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Member Since:</span>{" "}
                        <span className="text-muted-foreground">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button onClick={handleProfileSendSMS} disabled={isSendingProfileSMS}>
                      {isSendingProfileSMS && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Changes
                    </Button>
                  </DialogFooter>
                </>
              )}

              {profileStep === "verify" && (
                <>
                  <div className="space-y-2">
                    <Label>Verify Your Identity</Label>
                    <p className="text-sm text-muted-foreground">
                      Enter the verification code sent to your mobile number to confirm changes.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-sms-code">Verification Code</Label>
                    <Input
                      id="profile-sms-code"
                      className="text-center text-lg tracking-widest"
                      value={profileSmsCode}
                      onChange={(e) =>
                        setProfileSmsCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      placeholder="------"
                      maxLength={6}
                      onKeyDown={(e) => e.key === "Enter" && handleUpdateProfile()}
                    />
                  </div>

                  {profileDebugCode && (
                    <div className="p-2 bg-yellow-900/50 border border-yellow-600 rounded text-yellow-200 text-sm text-center">
                      Debug Mode - Verification Code: <strong>{profileDebugCode}</strong>
                    </div>
                  )}

                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => {
                        if (profileSmsCountdown > 0) return;
                        handleProfileSendSMS();
                      }}
                      disabled={profileSmsCountdown > 0 || isSendingProfileSMS}
                      className="text-sm text-primary hover:underline disabled:text-muted-foreground disabled:no-underline"
                    >
                      {profileSmsCountdown > 0 ? `Resend in ${profileSmsCountdown}s` : "Resend Code"}
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => { setProfileStep("edit"); setProfileSmsCode(""); setProfileDebugCode(null); }}
                      className="flex-1"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      onClick={handleUpdateProfile}
                      disabled={isUpdating || profileSmsCode.length < 4}
                      className="flex-1"
                    >
                      {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Confirm & Save
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>

            {/* ==================== Addresses Tab ==================== */}
            <TabsContent value="addresses" className="space-y-4 mt-4">
              {showAddressForm ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setShowAddressForm(false); setEditingAddress(null); }}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h3 className="text-lg font-semibold">
                      {editingAddress ? "Edit Address" : "Add New Address"}
                    </h3>
                  </div>

                  {/* Region → City → District */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="addr-region">Province *</Label>
                      <select
                        id="addr-region"
                        value={selectedRegion}
                        onChange={(e) => handleRegionChange(e.target.value)}
                        disabled={loadingRegions}
                        className="w-full px-3 py-2 border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                      >
                        <option value="">{loadingRegions ? "Loading..." : "Select Province"}</option>
                        {regions.map((r) => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addr-city">City *</Label>
                      <select
                        id="addr-city"
                        value={selectedCity}
                        onChange={(e) => handleCityChange(e.target.value)}
                        disabled={loadingCities || cities.length === 0}
                        className="w-full px-3 py-2 border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                      >
                        <option value="">{loadingCities ? "Loading..." : "Select City"}</option>
                        {cities.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addr-district">District *</Label>
                      <select
                        id="addr-district"
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        disabled={loadingDistricts || districts.length === 0}
                        className="w-full px-3 py-2 border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                      >
                        <option value="">{loadingDistricts ? "Loading..." : "Select District"}</option>
                        {districts.map((d) => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addr-street">Street Address *</Label>
                    <Input id="addr-street" value={addrStreet} onChange={(e) => setAddrStreet(e.target.value)} placeholder="Street address" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addr-postcode">Postcode *</Label>
                    <Input id="addr-postcode" value={addrPostcode} onChange={(e) => setAddrPostcode(e.target.value)} placeholder="Postcode" />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="addr-default"
                      checked={addrDefaultBilling}
                      onChange={(e) => setAddrDefaultBilling(e.target.checked)}
                      className="h-4 w-4 rounded border-input"
                    />
                    <Label htmlFor="addr-default" className="text-sm font-normal cursor-pointer">
                      Set as default billing address
                    </Label>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => { setShowAddressForm(false); setEditingAddress(null); }} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleSaveAddress} disabled={savingAddress} className="flex-1">
                      {savingAddress && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {editingAddress ? "Update Address" : "Save Address"}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Your Addresses</h3>
                    <Button size="sm" onClick={handleAddNewAddress}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add New
                    </Button>
                  </div>

                  {loadingAddresses ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No addresses saved yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {addresses.map((address) => (
                        <div key={address.id} className="p-4 rounded-lg border bg-muted/30 space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <p className="font-medium">
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
                                  Default Billing
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <Button size="sm" variant="ghost" onClick={() => handleEditAddress(address)}>
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

            {/* ==================== Security Tab ==================== */}
            <TabsContent value="security" className="space-y-4 mt-4">
              {/* Step: Idle - Show mobile and send SMS button */}
              {resetStep === "idle" && (
                <>
                  <div className="space-y-2">
                    <Label>Reset Password</Label>
                    <p className="text-sm text-muted-foreground">
                      We will send a verification code to your mobile number to reset your password.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Mobile Number</Label>
                    <div className="flex items-center border border-input rounded-md bg-transparent px-3 h-9 shadow-xs">
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
                    {isSendingSMS && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Verification Code
                  </Button>
                </>
              )}

              {/* Step: Verification - Enter SMS code */}
              {resetStep === "verification" && (
                <>
                  <div className="space-y-2">
                    <Label>Verify Your Identity</Label>
                    <p className="text-sm text-muted-foreground">
                      Enter the code sent to +{resetMobilePrefix} {resetMobile}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="verification-code">Verification Code</Label>
                    <Input
                      id="verification-code"
                      className="text-center text-lg tracking-widest"
                      value={verificationCode}
                      onChange={(e) =>
                        setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      placeholder="------"
                      maxLength={6}
                    />
                  </div>

                  {debugCode && (
                    <div className="p-2 bg-yellow-900/50 border border-yellow-600 rounded text-yellow-200 text-sm text-center">
                      Debug Mode - Verification Code: <strong>{debugCode}</strong>
                    </div>
                  )}

                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => {
                        if (smsCountdown > 0) return;
                        handleSendResetSMS();
                      }}
                      disabled={smsCountdown > 0 || isSendingSMS}
                      className="text-sm text-primary hover:underline disabled:text-muted-foreground disabled:no-underline"
                    >
                      {smsCountdown > 0 ? `Resend in ${smsCountdown}s` : "Resend Code"}
                    </button>
                  </div>

                  <Button
                    onClick={() => {
                      if (!verificationCode || verificationCode.length < 4) {
                        toast.error("Please enter a valid verification code");
                        return;
                      }
                      setResetStep("newPassword");
                    }}
                    disabled={verificationCode.length < 4}
                    className="w-full"
                  >
                    Continue
                  </Button>

                  <Button variant="ghost" onClick={resetPasswordFlow} className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                </>
              )}

              {/* Step: New Password */}
              {resetStep === "newPassword" && (
                <>
                  <div className="space-y-2">
                    <Label>Set New Password</Label>
                    <p className="text-sm text-muted-foreground">
                      Enter your new password below. Must be at least 8 characters with upper+lower+number.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>

                  <Button
                    onClick={handleResetPassword}
                    disabled={isChangingPassword}
                    className="w-full"
                  >
                    {isChangingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Reset Password
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => setResetStep("verification")}
                    className="w-full"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                </>
              )}

              {/* Step: Success */}
              {resetStep === "success" && (
                <div className="text-center space-y-4 py-4">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
                  <p className="font-medium">Password changed successfully</p>
                  <Button onClick={resetPasswordFlow} className="w-full">
                    Done
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
                    Delete Account
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* ==================== Support Tab ==================== */}
            <TabsContent value="support" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="support-message">Message</Label>
                <Textarea
                  id="support-message"
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  placeholder="Describe your issue or question..."
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  Our support team will respond to your request via email within 24-48 hours.
                </p>
              </div>

              <DialogFooter>
                <Button
                  onClick={handleSendSupportRequest}
                  disabled={isSendingSupport}
                >
                  {isSendingSupport && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Request
                </Button>
              </DialogFooter>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove all your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
