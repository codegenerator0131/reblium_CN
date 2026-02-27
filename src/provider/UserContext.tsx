"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/type";
import { MappedUser } from "@/types/tmo";
import tmoApi from "@/lib/tmoApi";

interface UserContextType {
  userInfo: User | null;
  tmoUser: MappedUser | null;
  credits: number | string;
  loading: boolean;
  isAuthenticated: boolean;
  refetchUserData: () => Promise<void>;
  saveUserHistory: (email: string, description: string) => Promise<void>;
  clearUserData: () => void;
  login: (token: string) => void;
  logout: () => void;
  rolesData: {
    roleName: string;
    credits: string;
    premiumName: string;
    rolesArr: string[];
  };
  isTimeTracking: boolean;
  localTimeLeft: number;
  checkLoginRoleValidity: () => boolean;
}

export const UserContext = createContext<UserContextType>({
  userInfo: null,
  tmoUser: null,
  credits: 0,
  loading: false,
  isAuthenticated: false,
  refetchUserData: async () => {},
  clearUserData: () => {},
  login: () => {},
  logout: () => {},
  rolesData: { roleName: "", credits: "", premiumName: "", rolesArr: [] },
  saveUserHistory: async () => {},
  isTimeTracking: false,
  localTimeLeft: 0,
  checkLoginRoleValidity: () => false,
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [tmoUser, setTmoUser] = useState<MappedUser | null>(null);
  const [credits, setCredits] = useState<number | string>(0);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rolesData, setRolesData] = useState({
    roleName: "",
    credits: "",
    premiumName: "",
    rolesArr: [] as string[],
  });

  const timeTrackerRef = useRef<NodeJS.Timeout | null>(null);
  const localTimeLeftRef = useRef(0);

  const initialFetchDone = useRef(false);
  const authErrorHandled = useRef(false);

  // Fetch user data from TMO API
  const fetchTMOUserData = useCallback(async (token: string): Promise<void> => {
    try {
      const tmoCustomer = await tmoApi.getProfile(token);
      const mappedUser = tmoApi.mapTMOCustomerToUser(tmoCustomer);
      setTmoUser(mappedUser);

      // Map TMO customer to existing User type for compatibility
      const compatibleUser: User = {
        id: tmoCustomer.id,
        email: tmoCustomer.email,
        name: `${tmoCustomer.firstname} ${tmoCustomer.lastname}`,
        password: "",
        verification_token: null,
        is_verified: true,
        verification_code: null,
        google_id: null,
        avatar_id: 0,
        facebook_id: null,
        apple_id: null,
        discord_id: null,
        wechat_id: null,
        verification_code_expires: null,
        created_at: tmoCustomer.created_at,
        bio: "",
        active_date: tmoCustomer.created_at,
        cancel_date: null,
        profile_picture: "",
        profile_avatar: null,
        role_ids: [],
        role_names: ["user"], // Default role for TMO users
        cur_role_ids: [],
        is_trial: false,
        last_login: null,
        slug: "",
        profile_thumbnail: null,
      };

      setUserInfo(compatibleUser);
      setIsAuthenticated(true);

      // Set default roles data for TMO users
      setRolesData({
        roleName: "user",
        credits: "0",
        premiumName: "free",
        rolesArr: ["user"],
      });
    } catch (error) {
      console.error("Error fetching TMO user data:", error);
      throw error;
    }
  }, []);

  const fetchUserData = useCallback(async (): Promise<void> => {
    // Check for TMO token
    const tmoToken = tmoApi.getTMOToken();

    if (tmoToken) {
      try {
        await fetchTMOUserData(tmoToken);
        setLoading(false);
        return;
      } catch (error) {
        console.error("TMO auth failed:", error);
        // If TMO auth fails, clear TMO token
        tmoApi.removeTMOToken();
      }
    }

    // No TMO token or TMO auth failed
    setIsAuthenticated(false);
    setLoading(false);
  }, [fetchTMOUserData]);

  const login = useCallback(
    async (token: string) => {
      // Store TMO token
      tmoApi.setTMOToken(token);

      // Fetch user data to populate the context
      await fetchUserData();

      // Redirect to projects
      router.push("/projects");
    },
    [fetchUserData, router],
  );

  const saveUserHistory = async (email: string, description: string) => {
    try {
      const response = await fetch("/api/history", {
        method: "POST",
        body: JSON.stringify({
          email,
          description,
        }),
      });
      const data = await response.json();
    } catch (error) {
      console.error("Error to save user history");
    }
  };

  const clearUserData = useCallback(() => {
    setUserInfo(null);
    setTmoUser(null);
    setCredits(0);
    setLoading(false);
    setIsAuthenticated(false);
    setRolesData({ roleName: "", credits: "", premiumName: "", rolesArr: [] });
  }, []);

  // Handle auth error from TMO API (token expired/invalid)
  const handleAuthError = useCallback(() => {
    if (authErrorHandled.current) return;
    authErrorHandled.current = true;

    clearUserData();

    // Remove authentication tokens
    localStorage.removeItem("tmo_token");
    tmoApi.removeTMOToken();

    // Remove session data
    localStorage.removeItem("selectedMenuItem");
    localStorage.removeItem("default_persona");
    localStorage.removeItem("verificationFailed");

    // Remove cart and pending payment data
    localStorage.removeItem("tmo_cart_id");
    localStorage.removeItem("pending_order_id");
    localStorage.removeItem("pending_payment_url");
    localStorage.removeItem("pending_payment_method");

    router.push("/login");

    // Reset flag after a short delay to allow future auth errors to be handled
    setTimeout(() => {
      authErrorHandled.current = false;
    }, 1000);
  }, [clearUserData, router]);

  // Set up TMO API auth error handler
  useEffect(() => {
    tmoApi.setAuthErrorHandler(handleAuthError);
    return () => {
      tmoApi.clearAuthErrorHandler();
    };
  }, [handleAuthError]);

  const logout = useCallback(() => {
    clearUserData();

    // Remove authentication tokens
    localStorage.removeItem("tmo_token");
    tmoApi.removeTMOToken();

    // Remove session data
    localStorage.removeItem("selectedMenuItem");
    localStorage.removeItem("default_persona");
    localStorage.removeItem("verificationFailed");

    // Remove cart and pending payment data
    localStorage.removeItem("tmo_cart_id");
    localStorage.removeItem("pending_order_id");
    localStorage.removeItem("pending_payment_url");
    localStorage.removeItem("pending_payment_method");

    router.push("/");
  }, [router, clearUserData]);

  const checkTokenValidity = useCallback(() => {
    const tmoToken = tmoApi.getTMOToken();

    // Check TMO token
    if (tmoToken) {
      // TMO tokens are typically JWT - validate if possible
      try {
        const payload = JSON.parse(atob(tmoToken.split(".")[1]));
        if (payload.exp) {
          const expiration = payload.exp * 1000;
          if (Date.now() >= expiration) {
            logout();
            return false;
          }
        }
        setIsAuthenticated(true);
        return true;
      } catch {
        // TMO token might not be JWT, assume valid if it exists
        setIsAuthenticated(true);
        return true;
      }
    }

    // No token
    setIsAuthenticated(false);
    setLoading(false);
    return false;
  }, [logout]);

  useEffect(() => {
    const initialize = async () => {
      if (initialFetchDone.current) return;
      setLoading(true);
      const isValid = checkTokenValidity();
      if (isValid) {
        await fetchUserData();
      }
      setLoading(false);
      initialFetchDone.current = true;
    };

    initialize();
  }, [checkTokenValidity, fetchUserData]);

  useEffect(() => {
    const interval = setInterval(checkTokenValidity, 60000);
    return () => clearInterval(interval);
  }, [checkTokenValidity]);

  const checkLoginRoleValidity = useCallback(() => {
    if (
      rolesData.rolesArr.includes("beta") ||
      rolesData.rolesArr.includes("admin") ||
      rolesData.rolesArr.includes("studio")
    ) {
      return true;
    }
    return false;
  }, [rolesData.rolesArr]);

  return (
    <UserContext.Provider
      value={{
        userInfo,
        tmoUser,
        credits,
        loading,
        isAuthenticated,
        refetchUserData: fetchUserData,
        clearUserData,
        login,
        logout,
        rolesData,
        isTimeTracking: !!timeTrackerRef.current,
        localTimeLeft: localTimeLeftRef.current,
        checkLoginRoleValidity,
        saveUserHistory,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
