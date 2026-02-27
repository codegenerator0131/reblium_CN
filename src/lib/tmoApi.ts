// TMO API Service
import {
  TMOLoginResponse,
  TMOCustomer,
  TMOCustomerRegisterRequest,
  TMOProduct,
  TMOProductsResponse,
  TMOCategoriesResponse,
  TMOCart,
  TMOCartItem,
  TMOAddToCartRequest,
  TMOUpdateCartItemRequest,
  TMOPaymentMethod,
  TMOCartTotals,
  TMOPlaceOrderRequest,
  TMOAlipayQRCodeResponse,
  TMOOrder,
  TMOOrdersResponse,
  TMOAddress,
  TMOSearchCriteria,
  TMOAPIError,
  MappedUser,
  MappedProduct,
  MappedCartItem,
  MappedOrder,
  MappedOrderItem,
  TMOGeoRegion,
  TMOGeoCity,
  TMOGeoDistrict,
  TMOGeoItem,
  AddressPayload,
} from "@/types/tmo";

const TMO_BASE_URL =
  process.env.NEXT_PUBLIC_TMO_API_URL || "https://reblium.alpha.tmogroup.asia";

// ==================== Auth Error Handler ====================

// Callback for handling authentication errors (set by UserContext)
let onAuthError: (() => void) | null = null;

export function setAuthErrorHandler(handler: () => void): void {
  onAuthError = handler;
}

export function clearAuthErrorHandler(): void {
  onAuthError = null;
}

// Handle authentication error - clear tokens and redirect to login
function handleAuthError(): void {
  if (typeof window !== "undefined") {
    // Clear all auth tokens
    localStorage.removeItem("tmo_token");
    localStorage.removeItem("token");

    // Call the auth error handler if set (from UserContext)
    if (onAuthError) {
      onAuthError();
    } else {
      // Fallback: redirect to login page directly
      window.location.href = "/login";
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
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      // Don't redirect for login endpoints
      const isAuthEndpoint =
        endpoint.includes("/token") || endpoint.includes("/register");
      if (!isAuthEndpoint) {
        console.error(
          "TMO API: Authentication failed - token expired or invalid",
        );
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

  // Some endpoints return empty response
  const text = await response.text();
  if (!text) {
    return {} as T;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to parse response:", text);
    throw new Error(`Invalid JSON response: ${text}`);
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("tmo_token");
}

// ==================== Auth Endpoints ====================

// Get WeChat login redirect URL from TMO
export async function getWeChatLoginUrl(redirectUrl: string): Promise<string> {
  const url = `${TMO_BASE_URL}/rest/V1/wechat/qrcodeurl?redirect_url=${encodeURIComponent(redirectUrl)}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get WeChat login URL: ${response.status}`);
  }

  // Response is a plain URL string (e.g., "https://open.weixin.qq.com/connect/qrconnect?...")
  const text = await response.text();

  let wechatUrl = text.trim();

  // If response is JSON-encoded string (has quotes), parse it properly to unescape \/
  if (wechatUrl.startsWith('"') && wechatUrl.endsWith('"')) {
    try {
      wechatUrl = JSON.parse(wechatUrl);
    } catch {
      // Fallback: manual quote removal and unescape
      wechatUrl = wechatUrl.slice(1, -1).replace(/\\\//g, "/");
    }
  }

  // Validate it's a proper URL
  if (!wechatUrl.startsWith("http")) {
    // Try parsing as JSON in case API returns object
    try {
      const data = JSON.parse(text);
      wechatUrl = data.url || data.redirect_url || data.qrcode_url || "";
    } catch {
      throw new Error("Invalid WeChat login URL received");
    }
  }

  if (!wechatUrl) {
    throw new Error("Empty WeChat login URL received");
  }

  return wechatUrl;
}

export async function loginWithEmail(
  email: string,
  password: string,
): Promise<string> {
  const response = await apiRequest<any>("rest/V1/integration/customer/token", {
    method: "POST",
    body: JSON.stringify({ username: email, password }),
  });

  // Handle both string and object responses
  if (typeof response === "string") {
    return response;
  } else if (response && typeof response === "object") {
    // If response is an object, extract the token field
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

  // Handle both string and object responses
  if (typeof response === "string") {
    return response;
  } else if (response && typeof response === "object") {
    // If response is an object, extract the token field
    return response.token || response.access_token || JSON.stringify(response);
  }

  throw new Error("Invalid token response format");
}

export async function loginWithSMS(
  mobile: string,
  code: string,
  prefix: string,
): Promise<string> {
  const response = await apiRequest<any>("rest/V1/customer/login/token", {
    method: "POST",
    body: JSON.stringify({ mobile, code, mobile_prefix: prefix, cart_id: "" }),
  });

  // Handle both string and object responses
  if (typeof response === "string") {
    return response;
  } else if (response && typeof response === "object") {
    // If response is an object, extract the token field
    return response.token || response.access_token || JSON.stringify(response);
  }

  throw new Error("Invalid token response format");
}

export async function register(
  customerData: TMOCustomerRegisterRequest,
): Promise<TMOCustomer> {
  const response = await apiRequest<TMOCustomer>("rest/V1/customers/register", {
    method: "POST",
    body: JSON.stringify(customerData),
  });

  return response;
}

export interface SMSCodeResponse {
  success?: boolean;
  message?: string;
  code?: string; // Debug mode returns the verification code
}

// Raw API response structure for SMS code
interface SMSCodeAPIResponse {
  message?: string;
  code?: number; // API status code (e.g., 9000), not the SMS code
  parameters?: string[]; // The actual SMS code is in parameters[0]
  trace?: string;
}

// Helper function to parse SMS API response
function parseSMSResponse(
  data: boolean | string | SMSCodeAPIResponse,
): SMSCodeResponse {
  // Handle various response formats
  if (typeof data === "boolean") {
    return { success: data };
  }
  if (typeof data === "string") {
    return { success: true, message: data };
  }

  // Handle object response with parameters array (debug mode)
  // The actual verification code is in parameters[0]
  if (data && typeof data === "object") {
    const apiResponse = data as SMSCodeAPIResponse;
    const verificationCode = apiResponse.parameters?.[0];

    // Replace %1 placeholder with actual code in message
    let message = apiResponse.message || "";
    if (verificationCode && message.includes("%1")) {
      message = message.replace("%1", verificationCode);
    }

    return {
      success: true,
      message: message,
      code: verificationCode, // The actual SMS verification code
    };
  }

  return { success: true };
}

export async function sendSMSCode(
  check: 1 | 2, // 1 for register, 2 for password reset
  mobile: string,
  prefix: string,
): Promise<SMSCodeResponse> {
  const url = `${TMO_BASE_URL}/rest/V1/customer/mobile/sendcode/${check}/${mobile}/${prefix}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Try to parse response body regardless of status code
  // In debug mode, API may return 401 but still include the verification code
  const text = await response.text();
  let data: boolean | string | SMSCodeAPIResponse;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = text;
  }

  // Check if response contains debug mode verification code
  if (typeof data === "object" && data !== null) {
    const apiResponse = data as SMSCodeAPIResponse;
    // If we have parameters with verification code, it's debug mode - treat as success
    if (apiResponse.parameters?.[0]) {
      return parseSMSResponse(data);
    }
  }

  // If no debug code and response is not ok, throw error
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

// Country/Region codes for mobile prefixes
export interface CountryCode {
  code: string;
  name: string;
  prefix: string;
}

export async function getCountryCodes(): Promise<CountryCode[]> {
  try {
    // Try to fetch from TMO API if available
    const response = await apiRequest<CountryCode[]>(
      "rest/V1/directory/countries",
      { method: "GET" },
    );
    return response;
  } catch {
    // Return default list if API doesn't support this endpoint
    return getDefaultCountryCodes();
  }
}

export function getDefaultCountryCodes(): CountryCode[] {
  // SMS module only supports China
  return [{ code: "CN", name: "China", prefix: "86" }];
}

export async function resetPassword(
  mobile: string,
  code: string,
  password: string,
  prefix: string,
  autoLogin: boolean = true,
): Promise<string | boolean> {
  const response = await apiRequest<string | boolean>(
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
  return response;
}

export async function changePassword(
  oldPassword: string,
  newPassword: string,
  token?: string,
): Promise<boolean> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  const response = await apiRequest<boolean>(
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
  return response;
}

// ==================== Product Endpoints ====================

export async function getProducts(
  searchCriteria?: TMOSearchCriteria,
): Promise<TMOProductsResponse> {
  let queryString = "";

  if (searchCriteria) {
    const params: string[] = [];

    if (searchCriteria.filter_groups) {
      searchCriteria.filter_groups.forEach((group, groupIndex) => {
        group.filters.forEach((filter, filterIndex) => {
          params.push(
            `searchCriteria[filter_groups][${groupIndex}][filters][${filterIndex}][field]=${encodeURIComponent(filter.field)}`,
          );
          params.push(
            `searchCriteria[filter_groups][${groupIndex}][filters][${filterIndex}][value]=${encodeURIComponent(filter.value)}`,
          );
          params.push(
            `searchCriteria[filter_groups][${groupIndex}][filters][${filterIndex}][condition_type]=${encodeURIComponent(filter.condition_type)}`,
          );
        });
      });
    }

    if (searchCriteria.sort_orders) {
      searchCriteria.sort_orders.forEach((sort, index) => {
        params.push(
          `searchCriteria[sortOrders][${index}][field]=${encodeURIComponent(sort.field)}`,
        );
        params.push(
          `searchCriteria[sortOrders][${index}][direction]=${encodeURIComponent(sort.direction)}`,
        );
      });
    }

    if (searchCriteria.page_size) {
      params.push(`searchCriteria[pageSize]=${searchCriteria.page_size}`);
    }

    if (searchCriteria.current_page) {
      params.push(`searchCriteria[currentPage]=${searchCriteria.current_page}`);
    }

    queryString = params.length > 0 ? `?${params.join("&")}` : "";
  }

  const response = await apiRequest<TMOProductsResponse>(
    `rest/V1/products${queryString}`,
    { method: "GET" },
  );
  return response;
}

export async function getProductDetail(sku: string): Promise<TMOProduct> {
  const response = await apiRequest<TMOProduct>(
    `rest/V1/products/${encodeURIComponent(sku)}`,
    { method: "GET" },
  );
  return response;
}

export async function getCategories(): Promise<TMOCategoriesResponse> {
  const response = await apiRequest<TMOCategoriesResponse>(
    "rest/V1/categories",
    { method: "GET" },
  );
  return response;
}

// ==================== Customer Endpoints ====================

export async function getProfile(token?: string): Promise<TMOCustomer> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  const response = await apiRequest<TMOCustomer>(
    "rest/V1/customers/me",
    { method: "GET" },
    authToken,
  );
  return response;
}

export async function getOrders(token?: string): Promise<TMOOrdersResponse> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  const response = await apiRequest<TMOOrdersResponse>(
    "rest/V1/customer/orders",
    { method: "GET" },
    authToken,
  );
  return response;
}

export async function getOrderDetail(
  entityId: number,
  token?: string,
): Promise<TMOOrder> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  const response = await apiRequest<TMOOrder>(
    `rest/V1/customer/orders/${entityId}`,
    { method: "GET" },
    authToken,
  );
  return response;
}

export async function getAddress(token?: string): Promise<TMOAddress[]> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  const response = await apiRequest<TMOAddress[]>(
    "rest/V1/customer/address",
    { method: "GET" },
    authToken,
  );
  return response;
}

export async function createAddress(
  payload: any,
  token?: string,
): Promise<TMOAddress> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  const response = await apiRequest<TMOAddress>(
    "rest/V1/customer/address",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    authToken,
  );
  return response;
}

export async function updateAddress(
  payload: any,
  token?: string,
): Promise<TMOAddress> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  const response = await apiRequest<TMOAddress>(
    "rest/V1/customer/address",
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
    authToken,
  );
  return response;
}

export async function deleteAddress(
  addressId: number,
  token?: string,
): Promise<boolean> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  const response = await apiRequest<boolean>(
    `rest/V1/customer/address/${addressId}`,
    { method: "DELETE" },
    authToken,
  );
  return response;
}

// Geo endpoints - China (CN) only
// These endpoints return hierarchical location data: Region -> City -> District

export async function getRegions(): Promise<TMOGeoRegion[]> {
  // Only supports CN - hardcoded country_id
  const response = await apiRequest<TMOGeoRegion[]>(
    "rest/V1/directory/geoinfo/of/region/CN",
    { method: "GET" },
  );
  return response;
}

export async function getCities(regionId: string): Promise<TMOGeoCity[]> {
  const response = await apiRequest<TMOGeoCity[]>(
    `rest/V1/directory/geoinfo/of/city/${regionId}`,
    { method: "GET" },
  );
  return response;
}

export async function getDistricts(cityId: string): Promise<TMOGeoDistrict[]> {
  const response = await apiRequest<TMOGeoDistrict[]>(
    `rest/V1/directory/geoinfo/of/district/${cityId}`,
    { method: "GET" },
  );
  return response;
}

export interface UpdateProfileRequest {
  customer: {
    id?: number;
    email?: string;
    firstname?: string;
    lastname?: string;
    dob?: string;
    custom_attributes?: Array<{
      attribute_code: string;
      value: string;
    }>;
  };
}

export async function updateProfile(
  profileData: UpdateProfileRequest,
  token?: string,
): Promise<TMOCustomer> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  const response = await apiRequest<TMOCustomer>(
    "rest/V1/customers/me",
    {
      method: "PUT",
      body: JSON.stringify(profileData),
    },
    authToken,
  );
  return response;
}

// ==================== Cart Endpoints ====================

export async function createCart(token?: string): Promise<string> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  const response = await apiRequest<string>(
    "rest/V1/partial-checkout/cart",
    { method: "POST" },
    authToken,
  );
  return response;
}

export async function getCart(token?: string): Promise<TMOCart> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  const response = await apiRequest<TMOCart>(
    "rest/V1/partial-checkout/cart",
    { method: "GET" },
    authToken,
  );
  return response;
}

export async function addToCart(
  cartItem: TMOAddToCartRequest,
  token?: string,
): Promise<TMOCartItem> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  const response = await apiRequest<TMOCartItem>(
    "rest/V1/partial-checkout/cart/items",
    {
      method: "POST",
      body: JSON.stringify(cartItem),
    },
    authToken,
  );
  return response;
}

export async function updateCartItem(
  itemId: number,
  cartItem: TMOUpdateCartItemRequest,
  token?: string,
): Promise<TMOCartItem> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  const response = await apiRequest<TMOCartItem>(
    `rest/V1/partial-checkout/cart/items/${itemId}`,
    {
      method: "PUT",
      body: JSON.stringify(cartItem),
    },
    authToken,
  );
  return response;
}

export async function deleteCartItem(
  itemId: number,
  token?: string,
): Promise<boolean> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  const response = await apiRequest<boolean>(
    `rest/V1/partial-checkout/cart/items/${itemId}`,
    { method: "DELETE" },
    authToken,
  );
  return response;
}

export async function checkoutAdd(
  cartId: string,
  itemIds: number[],
  token?: string,
): Promise<boolean> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  const response = await apiRequest<boolean>(
    "rest/V1/partial-checkout/checkout/add",
    {
      method: "POST",
      body: JSON.stringify({
        cart_id: parseInt(cartId, 10),
        item_ids: itemIds,
      }),
    },
    authToken,
  );
  return response;
}

export async function getPaymentMethods(
  token?: string,
): Promise<TMOPaymentMethod[]> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  const response = await apiRequest<TMOPaymentMethod[]>(
    "rest/V1/carts/mine/payment-methods",
    { method: "GET" },
    authToken,
  );
  return response;
}

export async function getTotals(token?: string): Promise<TMOCartTotals> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  const response = await apiRequest<TMOCartTotals>(
    "rest/V1/carts/mine/totals",
    { method: "GET" },
    authToken,
  );
  return response;
}

// Set billing address on cart (useful for virtual products)
export async function setBillingAddress(
  billingAddress: TMOAddress,
  token?: string,
): Promise<number> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  const response = await apiRequest<number>(
    "rest/V1/carts/mine/billing-address",
    {
      method: "POST",
      body: JSON.stringify({ address: billingAddress }),
    },
    authToken,
  );
  return response;
}

// Estimate shipping methods for cart
export interface ShippingMethod {
  carrier_code: string;
  method_code: string;
  carrier_title: string;
  method_title: string;
  amount: number;
  base_amount: number;
  available: boolean;
  price_excl_tax: number;
  price_incl_tax: number;
}

export async function estimateShippingMethods(
  address: TMOAddress,
  token?: string,
): Promise<ShippingMethod[]> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  const response = await apiRequest<ShippingMethod[]>(
    "rest/V1/carts/mine/estimate-shipping-methods",
    {
      method: "POST",
      body: JSON.stringify({ address }),
    },
    authToken,
  );
  return response;
}

export interface ShippingInformationRequest {
  addressInformation: {
    shipping_address: TMOAddress;
    billing_address: TMOAddress;
    shipping_carrier_code: string;
    shipping_method_code: string;
  };
}

export interface ShippingInformationResponse {
  payment_methods: TMOPaymentMethod[];
  totals: TMOCartTotals;
}

export async function setShippingInformation(
  shippingAddress: TMOAddress,
  billingAddress: TMOAddress,
  shippingCarrierCode: string = "freeshipping",
  shippingMethodCode: string = "freeshipping",
  token?: string,
): Promise<ShippingInformationResponse> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  const requestBody: ShippingInformationRequest = {
    addressInformation: {
      shipping_address: shippingAddress,
      billing_address: billingAddress,
      shipping_carrier_code: shippingCarrierCode,
      shipping_method_code: shippingMethodCode,
    },
  };

  const response = await apiRequest<ShippingInformationResponse>(
    "rest/V1/carts/mine/shipping-information",
    {
      method: "POST",
      body: JSON.stringify(requestBody),
    },
    authToken,
  );
  return response;
}

export async function placeOrder(
  paymentMethod: string,
  billingAddress?: TMOAddress,
  shippingAddress?: TMOAddress,
  token?: string,
): Promise<number> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  const requestBody: TMOPlaceOrderRequest = {
    paymentMethod: { method: paymentMethod },
  };

  if (billingAddress) {
    requestBody.billingAddress = billingAddress;
  }

  // Use shipping address if provided, otherwise use billing address as shipping
  if (shippingAddress) {
    requestBody.shippingAddress = shippingAddress;
  } else if (billingAddress) {
    requestBody.shippingAddress = billingAddress;
  }

  const response = await apiRequest<number>(
    "rest/V1/carts/mine/payment-information",
    {
      method: "POST",
      body: JSON.stringify(requestBody),
    },
    authToken,
  );
  return response;
}

export async function getAlipayQRCode(
  orderId: string,
): Promise<TMOAlipayQRCodeResponse> {
  // This endpoint returns a plain text URL, not JSON
  // So we need to use fetch directly instead of apiRequest
  const url = `${TMO_BASE_URL}/rest/V1/alipay/qrcode/quote/${orderId}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get Alipay payment URL: ${response.status}`);
  }

  // Get response as plain text (it's a URL string)
  const paymentUrl = await response.text();

  return {
    qr_code: paymentUrl,
    order_id: orderId,
  };
}

export async function getWeChatQRCode(
  orderId: string,
): Promise<TMOAlipayQRCodeResponse> {
  // This endpoint returns a plain text URL, not JSON
  // So we need to use fetch directly instead of apiRequest
  // Updated endpoint: rest/V1/wechatpay/getqrcode/:quoteId/?quoteIdIsOrderId=1
  const url = `${TMO_BASE_URL}/rest/V1/wechatpay/getqrcode/${orderId}?quoteIdIsOrderId=1`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get WeChat payment URL: ${response.status}`);
  }

  // Get response as plain text (it's a URL string)
  const paymentUrl = await response.text();

  return {
    qr_code: paymentUrl,
    order_id: orderId,
  };
}

// ==================== Data Mapping Utilities ====================

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

// Helper function to strip HTML tags from text
function stripHtml(html: string): string {
  if (!html) return "";
  // Remove HTML tags and decode common HTML entities
  return html
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();
}

export function mapTMOProductToMapped(
  product: TMOProduct,
  baseImageUrl?: string,
): MappedProduct {
  const descriptionHtml =
    product.custom_attributes?.find(
      (attr) => attr.attribute_code === "description",
    )?.value || "";

  const shortDescriptionHtml =
    product.custom_attributes?.find(
      (attr) => attr.attribute_code === "short_description",
    )?.value || "";

  // Strip HTML tags from descriptions
  const description = stripHtml(descriptionHtml);
  const shortDescription = stripHtml(shortDescriptionHtml);

  const categoryIds =
    product.extension_attributes?.category_links?.map(
      (link) => link.category_id,
    ) || [];

  const images =
    product.media_gallery_entries?.map((entry) => {
      const imageUrl = baseImageUrl
        ? `${baseImageUrl}/catalog/product${entry.file}`
        : entry.file;
      return imageUrl;
    }) || [];

  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    artist_name: product.name, // Map to artist_name for compatibility
    description: description || shortDescription,
    price: product.price,
    category: categoryIds[0] || "",
    categoryIds: categoryIds, // All category IDs this product belongs to
    url: images[0] || "",
    images,
    is_pack: product.type_id === "grouped" || product.type_id === "bundle",
    options: product.options,
    custom_attributes: product.custom_attributes || [],
  };
}

export function mapTMOCartItemToMapped(
  item: TMOCartItem,
  baseImageUrl?: string,
): MappedCartItem {
  // Map custom options to display format
  const options: { label: string; value: string }[] = [];

  if (item.product_option?.extension_attributes?.custom_options) {
    item.product_option.extension_attributes.custom_options.forEach((opt) => {
      options.push({
        label: `Option ${opt.option_id}`,
        value: opt.option_value,
      });
    });
  }

  return {
    id: item.item_id,
    sku: item.sku,
    name: item.name,
    price: item.price,
    qty: item.qty,
    subtotal: item.price * item.qty,
    options: options.length > 0 ? options : undefined,
  };
}

export function mapTMOOrderToMapped(order: TMOOrder): MappedOrder {
  const items: MappedOrderItem[] = order.items.map((item) => ({
    id: item.item_id,
    sku: item.sku,
    name: item.name,
    price: item.price,
    qty: item.qty_ordered,
    subtotal: item.row_total,
    image: item.extension_attributes?.main_image_url,
  }));

  return {
    id: order.entity_id,
    incrementId: order.increment_id,
    status: order.status,
    state: order.state,
    grandTotal: order.grand_total,
    subtotal: order.subtotal,
    shippingAmount: order.shipping_amount,
    taxAmount: order.tax_amount,
    discountAmount: order.discount_amount,
    totalQty: order.total_qty_ordered,
    createdAt: order.created_at,
    items,
    billingAddress: order.billing_address,
    paymentMethod: order.payment.method,
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

// ==================== Export all functions ====================

const tmoApi = {
  // Auth
  loginWithEmail,
  loginWithMobile,
  loginWithSMS,
  register,
  sendSMSCode,
  resetPassword,
  changePassword,
  getCountryCodes,
  getDefaultCountryCodes,
  getWeChatLoginUrl,

  // Products
  getProducts,
  getProductDetail,
  getCategories,

  // Customer
  getProfile,
  updateProfile,
  getOrders,
  getOrderDetail,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,

  // Geo
  getRegions,
  getCities,
  getDistricts,

  // Cart
  createCart,
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
  checkoutAdd,
  getPaymentMethods,
  getTotals,
  setBillingAddress,
  estimateShippingMethods,
  setShippingInformation,
  placeOrder,
  getAlipayQRCode,
  getWeChatQRCode,

  // Mapping utilities
  mapTMOCustomerToUser,
  mapTMOProductToMapped,
  mapTMOCartItemToMapped,
  mapTMOOrderToMapped,

  // Token management
  setTMOToken,
  removeTMOToken,
  getTMOToken,

  // Auth error handling
  setAuthErrorHandler,
  clearAuthErrorHandler,
};

export default tmoApi;
