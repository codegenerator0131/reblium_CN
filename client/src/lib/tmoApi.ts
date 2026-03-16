// TMO API Service — adapted for Vite client-only environment
import type {
  TMOCustomer,
  TMOCustomerRegisterRequest,
  TMOAddress,
  TMOGeoRegion,
  TMOGeoCity,
  TMOGeoDistrict,
  TMOAPIError,
  MappedUser,
  SMSCodeResponse,
} from "@/types/tmo";

const TMO_BASE_URL =
  import.meta.env.VITE_TMO_API_URL || "https://reblium.alpha.tmogroup.asia";

// ==================== Auth Error Handler ====================

let onAuthError: (() => void) | null = null;

export function setAuthErrorHandler(handler: () => void): void {
  onAuthError = handler;
}

export function clearAuthErrorHandler(): void {
  onAuthError = null;
}

function handleAuthError(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("tmo_token");
    if (onAuthError) {
      onAuthError();
    }
  }
}

// ==================== Helper Functions ====================

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const url = `${TMO_BASE_URL}/${endpoint}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    if (response.status === 401) {
      const isAuthEndpoint =
        endpoint.includes("/token") || endpoint.includes("/register");
      if (!isAuthEndpoint) {
        handleAuthError();
        throw new Error("Authentication failed. Please log in again.");
      }
    }

    const errorData: TMOAPIError = await response.json().catch(() => ({
      message: `HTTP error! status: ${response.status}`,
    }));
    throw new Error(
      errorData.message || `Request failed with status ${response.status}`,
    );
  }

  const text = await response.text();
  if (!text) return {} as T;

  try {
    return JSON.parse(text);
  } catch {
    // Some endpoints return plain strings (e.g. token)
    return text as unknown as T;
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("tmo_token");
}

// ==================== Auth Endpoints ====================

export async function loginWithEmail(
  email: string,
  password: string,
): Promise<string> {
  const response = await apiRequest<any>(
    "rest/V1/integration/customer/token",
    {
      method: "POST",
      body: JSON.stringify({ username: email, password }),
    },
  );

  if (typeof response === "string") return response;
  if (response && typeof response === "object") {
    return response.token || response.access_token || JSON.stringify(response);
  }
  throw new Error("Invalid token response format");
}

export async function loginWithMobile(
  mobile: string,
  password: string,
  prefix: string,
): Promise<string> {
  const response = await apiRequest<any>(
    "rest/V1/customer/login/mobile_password/token",
    {
      method: "POST",
      body: JSON.stringify({
        mobile,
        password,
        mobile_prefix: prefix,
        cart_id: "",
      }),
    },
  );

  if (typeof response === "string") return response;
  if (response && typeof response === "object") {
    return response.token || response.access_token || JSON.stringify(response);
  }
  throw new Error("Invalid token response format");
}

export async function loginWithSMS(
  mobile: string,
  code: string,
  prefix: string,
): Promise<string> {
  const response = await apiRequest<any>(
    "rest/V1/customer/login/token",
    {
      method: "POST",
      body: JSON.stringify({ mobile, code, mobile_prefix: prefix, cart_id: "" }),
    },
  );

  if (typeof response === "string") return response;
  if (response && typeof response === "object") {
    return response.token || response.access_token || JSON.stringify(response);
  }
  throw new Error("Invalid token response format");
}

export async function register(
  customerData: TMOCustomerRegisterRequest,
): Promise<TMOCustomer> {
  return apiRequest<TMOCustomer>("rest/V1/customers/register", {
    method: "POST",
    body: JSON.stringify(customerData),
  });
}

// Raw API response structure for SMS code
interface SMSCodeAPIResponse {
  message?: string;
  code?: number;
  parameters?: string[];
  trace?: string;
}

function parseSMSResponse(
  data: boolean | string | SMSCodeAPIResponse,
): SMSCodeResponse {
  if (typeof data === "boolean") return { success: data };
  if (typeof data === "string") return { success: true, message: data };

  if (data && typeof data === "object") {
    const apiResponse = data as SMSCodeAPIResponse;
    const verificationCode = apiResponse.parameters?.[0];

    let message = apiResponse.message || "";
    if (verificationCode && message.includes("%1")) {
      message = message.replace("%1", verificationCode);
    }

    return { success: true, message, code: verificationCode };
  }

  return { success: true };
}

export async function sendSMSCode(
  check: 1 | 2,
  mobile: string,
  prefix: string,
): Promise<SMSCodeResponse> {
  const url = `${TMO_BASE_URL}/rest/V1/customer/mobile/sendcode/${check}/${mobile}/${prefix}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const text = await response.text();
  let data: boolean | string | SMSCodeAPIResponse;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = text;
  }

  if (typeof data === "object" && data !== null) {
    const apiResponse = data as SMSCodeAPIResponse;
    if (apiResponse.parameters?.[0]) {
      return parseSMSResponse(data);
    }
  }

  if (!response.ok) {
    const errorMessage =
      typeof data === "object" && "message" in data
        ? (data as SMSCodeAPIResponse).message
        : `Request failed with status ${response.status}`;
    throw new Error(
      errorMessage || `Request failed with status ${response.status}`,
    );
  }

  return parseSMSResponse(data);
}

export async function resetPassword(
  mobile: string,
  code: string,
  password: string,
  prefix: string,
  autoLogin: boolean = true,
): Promise<string | boolean> {
  return apiRequest<string | boolean>(
    "rest/V1/customer/resetpassword/token",
    {
      method: "POST",
      body: JSON.stringify({
        mobile_prefix: prefix,
        mobile,
        code,
        password,
        autoLogin,
      }),
    },
  );
}

export async function changePassword(
  oldPassword: string,
  newPassword: string,
  token?: string,
): Promise<boolean> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  return apiRequest<boolean>(
    "rest/V1/customer/changepassword",
    {
      method: "POST",
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
    },
    authToken,
  );
}

export async function getWeChatLoginUrl(
  redirectUrl: string,
): Promise<string> {
  const url = `${TMO_BASE_URL}/rest/V1/wechat/qrcodeurl?redirect_url=${encodeURIComponent(redirectUrl)}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Failed to get WeChat login URL: ${response.status}`);
  }

  const text = await response.text();
  let wechatUrl = text.trim();

  if (wechatUrl.startsWith('"') && wechatUrl.endsWith('"')) {
    try {
      wechatUrl = JSON.parse(wechatUrl);
    } catch {
      wechatUrl = wechatUrl.slice(1, -1).replace(/\\\//g, "/");
    }
  }

  if (!wechatUrl.startsWith("http")) {
    try {
      const data = JSON.parse(text);
      wechatUrl = data.url || data.redirect_url || data.qrcode_url || "";
    } catch {
      throw new Error("Invalid WeChat login URL received");
    }
  }

  if (!wechatUrl) throw new Error("Empty WeChat login URL received");
  return wechatUrl;
}

// ==================== Address Endpoints ====================

export async function getAddress(token?: string): Promise<TMOAddress[]> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  return apiRequest<TMOAddress[]>(
    "rest/V1/customer/address",
    { method: "GET" },
    authToken,
  );
}

export async function createAddress(
  payload: any,
  token?: string,
): Promise<TMOAddress> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  return apiRequest<TMOAddress>(
    "rest/V1/customer/address",
    { method: "POST", body: JSON.stringify(payload) },
    authToken,
  );
}

export async function updateAddress(
  payload: any,
  token?: string,
): Promise<TMOAddress> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  return apiRequest<TMOAddress>(
    "rest/V1/customer/address",
    { method: "PUT", body: JSON.stringify(payload) },
    authToken,
  );
}

export async function deleteAddress(
  addressId: number,
  token?: string,
): Promise<boolean> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  return apiRequest<boolean>(
    `rest/V1/customer/address/${addressId}`,
    { method: "DELETE" },
    authToken,
  );
}

// ==================== Geo Endpoints (China) ====================

export async function getRegions(): Promise<TMOGeoRegion[]> {
  return apiRequest<TMOGeoRegion[]>(
    "rest/V1/directory/geoinfo/of/region/CN",
    { method: "GET" },
  );
}

export async function getCities(regionId: string): Promise<TMOGeoCity[]> {
  return apiRequest<TMOGeoCity[]>(
    `rest/V1/directory/geoinfo/of/city/${regionId}`,
    { method: "GET" },
  );
}

export async function getDistricts(cityId: string): Promise<TMOGeoDistrict[]> {
  return apiRequest<TMOGeoDistrict[]>(
    `rest/V1/directory/geoinfo/of/district/${cityId}`,
    { method: "GET" },
  );
}

// ==================== Customer Endpoints ====================

export async function getProfile(token?: string): Promise<TMOCustomer> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  return apiRequest<TMOCustomer>(
    "rest/V1/customers/me",
    { method: "GET" },
    authToken,
  );
}

export async function updateProfile(
  profileData: {
    customer: {
      id?: number;
      email?: string;
      firstname?: string;
      lastname?: string;
      dob?: string;
      custom_attributes?: Array<{ attribute_code: string; value: string }>;
    };
  },
  token?: string,
): Promise<TMOCustomer> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  return apiRequest<TMOCustomer>(
    "rest/V1/customers/me",
    { method: "PUT", body: JSON.stringify(profileData) },
    authToken,
  );
}

// ==================== Data Mapping ====================

export function mapTMOCustomerToUser(customer: TMOCustomer): MappedUser {
  const mobile = customer.custom_attributes?.find(
    (attr) => attr.attribute_code === "mobile",
  )?.value;
  const mobilePrefix = customer.custom_attributes?.find(
    (attr) => attr.attribute_code === "mobile_prefix",
  )?.value;

  return {
    id: customer.id,
    email: customer.email,
    name: `${customer.firstname} ${customer.lastname}`,
    firstname: customer.firstname,
    lastname: customer.lastname,
    mobile,
    mobile_prefix: mobilePrefix,
    created_at: customer.created_at,
    is_verified: true,
    dob: customer.dob,
    addresses: customer.addresses || [],
    custom_attributes: customer.custom_attributes || [],
  };
}

// ==================== Token Management ====================

export function setTMOToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("tmo_token", token);
  }
}

export function removeTMOToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("tmo_token");
  }
}

export function getTMOToken(): string | null {
  return getToken();
}

// ==================== Default Export ====================

const tmoApi = {
  loginWithEmail,
  loginWithMobile,
  loginWithSMS,
  register,
  sendSMSCode,
  resetPassword,
  changePassword,
  getWeChatLoginUrl,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
  getRegions,
  getCities,
  getDistricts,
  getProfile,
  updateProfile,
  mapTMOCustomerToUser,
  setTMOToken,
  removeTMOToken,
  getTMOToken,
  setAuthErrorHandler,
  clearAuthErrorHandler,
};

export default tmoApi;
