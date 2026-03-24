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
  TMOProductsResponse,
  TMOProduct,
  TMOCategoriesResponse,
  TMOSearchCriteria,
  TMOCart,
  TMOCartItem,
  TMOCartTotals,
  TMOAddToCartRequest,
  TMOUpdateCartItemRequest,
  TMOCartItemProductOption,
  TMOPlaceOrderRequest,
  TMOPaymentMethod,
  TMOOrder,
  TMOOrdersResponse,
  MappedProduct,
  MappedCartItem,
  MappedOrder,
  MappedOrderItem,
} from "@/types/tmo";

const TMO_BASE_URL =
  import.meta.env.VITE_TMO_API_URL || "https://reblium.alpha.tmogroup.asia";

export const TMO_IMAGE_BASE_URL = TMO_BASE_URL;
export const TMO_MEDIA_URL =
  import.meta.env.VITE_TMO_MEDIA_URL || `${TMO_BASE_URL}/media/catalog/product`;

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
  token?: string
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
      errorData.message || `Request failed with status ${response.status}`
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

// Helper function to strip HTML tags from text
export function stripHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

// ==================== Auth Endpoints ====================

export async function loginWithEmail(
  email: string,
  password: string
): Promise<string> {
  const response = await apiRequest<any>("rest/V1/integration/customer/token", {
    method: "POST",
    body: JSON.stringify({ username: email, password }),
  });

  if (typeof response === "string") return response;
  if (response && typeof response === "object") {
    return response.token || response.access_token || JSON.stringify(response);
  }
  throw new Error("Invalid token response format");
}

export async function loginWithMobile(
  mobile: string,
  password: string,
  prefix: string
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
    }
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
  prefix: string
): Promise<string> {
  const response = await apiRequest<any>("rest/V1/customer/login/token", {
    method: "POST",
    body: JSON.stringify({ mobile, code, mobile_prefix: prefix, cart_id: "" }),
  });

  if (typeof response === "string") return response;
  if (response && typeof response === "object") {
    return response.token || response.access_token || JSON.stringify(response);
  }
  throw new Error("Invalid token response format");
}

export async function register(
  customerData: TMOCustomerRegisterRequest
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
  data: boolean | string | SMSCodeAPIResponse
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
  prefix: string
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
      errorMessage || `Request failed with status ${response.status}`
    );
  }

  return parseSMSResponse(data);
}

export async function resetPassword(
  mobile: string,
  code: string,
  password: string,
  prefix: string,
  autoLogin: boolean = true
): Promise<string | boolean> {
  return apiRequest<string | boolean>("rest/V1/customer/resetpassword/token", {
    method: "POST",
    body: JSON.stringify({
      mobile_prefix: prefix,
      mobile,
      code,
      password,
      autoLogin,
    }),
  });
}

export async function changePassword(
  oldPassword: string,
  newPassword: string,
  token?: string
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
    authToken
  );
}

export async function getWeChatLoginUrl(redirectUrl: string): Promise<string> {
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
    authToken
  );
}

export async function createAddress(
  payload: any,
  token?: string
): Promise<TMOAddress> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  return apiRequest<TMOAddress>(
    "rest/V1/customer/address",
    { method: "POST", body: JSON.stringify(payload) },
    authToken
  );
}

export async function updateAddress(
  payload: any,
  token?: string
): Promise<TMOAddress> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  return apiRequest<TMOAddress>(
    "rest/V1/customer/address",
    { method: "PUT", body: JSON.stringify(payload) },
    authToken
  );
}

export async function deleteAddress(
  addressId: number,
  token?: string
): Promise<boolean> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  return apiRequest<boolean>(
    `rest/V1/customer/address/${addressId}`,
    { method: "DELETE" },
    authToken
  );
}

// ==================== Geo Endpoints (China) ====================

export async function getRegions(): Promise<TMOGeoRegion[]> {
  return apiRequest<TMOGeoRegion[]>("rest/V1/directory/geoinfo/of/region/CN", {
    method: "GET",
  });
}

export async function getCities(regionId: string): Promise<TMOGeoCity[]> {
  return apiRequest<TMOGeoCity[]>(
    `rest/V1/directory/geoinfo/of/city/${regionId}`,
    { method: "GET" }
  );
}

export async function getDistricts(cityId: string): Promise<TMOGeoDistrict[]> {
  return apiRequest<TMOGeoDistrict[]>(
    `rest/V1/directory/geoinfo/of/district/${cityId}`,
    { method: "GET" }
  );
}

// ==================== Customer Endpoints ====================

export async function getProfile(token?: string): Promise<TMOCustomer> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  return apiRequest<TMOCustomer>(
    "rest/V1/customers/me",
    { method: "GET" },
    authToken
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
  token?: string
): Promise<TMOCustomer> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  return apiRequest<TMOCustomer>(
    "rest/V1/customers/me",
    { method: "PUT", body: JSON.stringify(profileData) },
    authToken
  );
}

export async function getOrders(token?: string): Promise<TMOOrdersResponse> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  return apiRequest<TMOOrdersResponse>(
    "rest/V1/customer/orders",
    { method: "GET" },
    authToken
  );
}

export async function getOrderDetail(
  entityId: number,
  token?: string
): Promise<TMOOrder> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  return apiRequest<TMOOrder>(
    `rest/V1/customer/orders/${entityId}`,
    { method: "GET" },
    authToken
  );
}

export async function cancelOrder(
  orderId: number,
  token?: string
): Promise<boolean> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  return apiRequest<boolean>(
    `rest/V1/customer/orders/${orderId}/cancel`,
    { method: "POST" },
    authToken
  );
}

// ==================== Product Endpoints ====================

export async function getProducts(
  searchCriteria?: TMOSearchCriteria
): Promise<TMOProductsResponse> {
  let queryString = "";

  if (searchCriteria) {
    const params: string[] = [];

    if (searchCriteria.filter_groups) {
      searchCriteria.filter_groups.forEach((group, groupIndex) => {
        group.filters.forEach((filter, filterIndex) => {
          params.push(
            `searchCriteria[filter_groups][${groupIndex}][filters][${filterIndex}][field]=${encodeURIComponent(filter.field)}`
          );
          params.push(
            `searchCriteria[filter_groups][${groupIndex}][filters][${filterIndex}][value]=${encodeURIComponent(filter.value)}`
          );
          params.push(
            `searchCriteria[filter_groups][${groupIndex}][filters][${filterIndex}][condition_type]=${encodeURIComponent(filter.condition_type)}`
          );
        });
      });
    }

    if (searchCriteria.sort_orders) {
      searchCriteria.sort_orders.forEach((sort, index) => {
        params.push(
          `searchCriteria[sortOrders][${index}][field]=${encodeURIComponent(sort.field)}`
        );
        params.push(
          `searchCriteria[sortOrders][${index}][direction]=${encodeURIComponent(sort.direction)}`
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

  return apiRequest<TMOProductsResponse>(`rest/V1/products${queryString}`, {
    method: "GET",
  });
}

export async function getProductDetail(sku: string): Promise<TMOProduct> {
  return apiRequest<TMOProduct>(`rest/V1/products/${encodeURIComponent(sku)}`, {
    method: "GET",
  });
}

export async function getCategories(): Promise<TMOCategoriesResponse> {
  return apiRequest<TMOCategoriesResponse>("rest/V1/categories", {
    method: "GET",
  });
}

// ==================== Cart Endpoints ====================

export async function createCart(token?: string): Promise<string> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  return apiRequest<string>(
    "rest/V1/partial-checkout/cart",
    { method: "POST" },
    authToken
  );
}

export async function getCart(token?: string): Promise<TMOCart> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  return apiRequest<TMOCart>(
    "rest/V1/partial-checkout/cart",
    { method: "GET" },
    authToken
  );
}

export async function addToCart(
  cartItem: TMOAddToCartRequest,
  token?: string
): Promise<TMOCartItem> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  return apiRequest<TMOCartItem>(
    "rest/V1/partial-checkout/cart/items",
    {
      method: "POST",
      body: JSON.stringify(cartItem),
    },
    authToken
  );
}

export async function updateCartItem(
  itemId: number,
  cartItem: TMOUpdateCartItemRequest,
  token?: string
): Promise<TMOCartItem> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  return apiRequest<TMOCartItem>(
    `rest/V1/partial-checkout/cart/items/${itemId}`,
    {
      method: "PUT",
      body: JSON.stringify(cartItem),
    },
    authToken
  );
}

export async function deleteCartItem(
  itemId: number,
  token?: string
): Promise<boolean> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  return apiRequest<boolean>(
    `rest/V1/partial-checkout/cart/items/${itemId}`,
    { method: "DELETE" },
    authToken
  );
}

export async function checkoutAdd(
  cartId: string,
  itemIds: number[],
  token?: string
): Promise<boolean> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  return apiRequest<boolean>(
    "rest/V1/partial-checkout/checkout/add",
    {
      method: "POST",
      body: JSON.stringify({
        cart_id: parseInt(cartId, 10),
        item_ids: itemIds,
      }),
    },
    authToken
  );
}

export async function getPaymentMethods(
  token?: string
): Promise<TMOPaymentMethod[]> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  return apiRequest<TMOPaymentMethod[]>(
    "rest/V1/carts/mine/payment-methods",
    { method: "GET" },
    authToken
  );
}

export async function getTotals(token?: string): Promise<TMOCartTotals> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  return apiRequest<TMOCartTotals>(
    "rest/V1/carts/mine/totals",
    { method: "GET" },
    authToken
  );
}

export async function setBillingAddress(
  billingAddress: TMOAddress,
  token?: string
): Promise<number> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  return apiRequest<number>(
    "rest/V1/carts/mine/billing-address",
    {
      method: "POST",
      body: JSON.stringify({ address: billingAddress }),
    },
    authToken
  );
}

export async function placeOrder(
  paymentMethod: string,
  billingAddress?: TMOAddress,
  shippingAddress?: TMOAddress,
  token?: string
): Promise<number> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  const requestBody: TMOPlaceOrderRequest = {
    paymentMethod: { method: paymentMethod },
  };

  if (billingAddress) {
    requestBody.billingAddress = billingAddress;
  }
  if (shippingAddress) {
    requestBody.shippingAddress = shippingAddress;
  } else if (billingAddress) {
    requestBody.shippingAddress = billingAddress;
  }

  return apiRequest<number>(
    "rest/V1/carts/mine/payment-information",
    {
      method: "POST",
      body: JSON.stringify(requestBody),
    },
    authToken
  );
}

// ==================== Support ====================

export async function submitFeedback(
  message: string,
  token?: string,
): Promise<any> {
  const authToken = token || getToken();
  if (!authToken) throw new Error("No authentication token");

  const response = await apiRequest<any>(
    "rest/V1/contact-form",
    {
      method: "POST",
      body: JSON.stringify({ message }),
    },
    authToken,
  );
  return response;
}

// ==================== Payment ====================

export async function getAlipayQRCode(
  orderId: string
): Promise<{ qr_code: string; order_id: string }> {
  const url = `${TMO_BASE_URL}/rest/V1/alipay/qrcode/quote/${orderId}`;
  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Failed to get Alipay payment URL: ${response.status}`);
  }

  const paymentUrl = await response.text();
  return { qr_code: paymentUrl, order_id: orderId };
}

export async function getWeChatQRCode(
  orderId: string
): Promise<{ qr_code: string; order_id: string }> {
  const url = `${TMO_BASE_URL}/rest/V1/wechatpay/getqrcode/${orderId}?quoteIdIsOrderId=1`;
  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Failed to get WeChat payment URL: ${response.status}`);
  }

  const paymentUrl = await response.text();
  return { qr_code: paymentUrl, order_id: orderId };
}

// ==================== Data Mapping ====================

export function mapTMOCustomerToUser(customer: TMOCustomer): MappedUser {
  const mobile = customer.custom_attributes?.find(
    attr => attr.attribute_code === "mobile"
  )?.value;
  const mobilePrefix = customer.custom_attributes?.find(
    attr => attr.attribute_code === "mobile_prefix"
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

export function mapTMOProductToMapped(
  product: TMOProduct,
  baseImageUrl?: string
): MappedProduct {
  const descriptionHtml =
    product.custom_attributes?.find(
      attr => attr.attribute_code === "description"
    )?.value || "";

  const shortDescriptionHtml =
    product.custom_attributes?.find(
      attr => attr.attribute_code === "short_description"
    )?.value || "";

  const description = stripHtml(descriptionHtml);
  const shortDescription = stripHtml(shortDescriptionHtml);

  const categoryIds =
    product.extension_attributes?.category_links?.map(
      link => link.category_id
    ) || [];

  const images =
    product.media_gallery_entries?.map(entry => {
      const imageUrl = baseImageUrl
        ? `${baseImageUrl}/media/catalog/product${entry.file}`
        : entry.file;
      return imageUrl;
    }) || [];

  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    artist_name: product.name,
    description: description || shortDescription,
    price: product.price,
    category: categoryIds[0] || "",
    categoryIds: categoryIds,
    url: images[0] || "",
    images,
    is_pack: product.type_id === "grouped" || product.type_id === "bundle",
    options: product.options,
    custom_attributes: product.custom_attributes || [],
  };
}

export function mapTMOCartItemToMapped(item: TMOCartItem): MappedCartItem {
  const options: { label: string; value: string }[] = [];

  if (item.product_option?.extension_attributes?.custom_options) {
    item.product_option.extension_attributes.custom_options.forEach(opt => {
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
  const items: MappedOrderItem[] = order.items.map(item => ({
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

// ==================== License SKU Helpers ====================

const PERSONAL_LICENSE_SUFFIX = "-personal";
const COMMERCIAL_LICENSE_SUFFIX = "-commercial";

export type LicenseType = "personal" | "commercial" | "unknown";

export function parseLicenseSku(sku: string): {
  baseSku: string;
  licenseType: LicenseType;
} {
  const lowerSku = sku.toLowerCase();
  if (lowerSku.endsWith(PERSONAL_LICENSE_SUFFIX)) {
    return {
      baseSku: sku.slice(0, -PERSONAL_LICENSE_SUFFIX.length),
      licenseType: "personal",
    };
  } else if (lowerSku.endsWith(COMMERCIAL_LICENSE_SUFFIX)) {
    return {
      baseSku: sku.slice(0, -COMMERCIAL_LICENSE_SUFFIX.length),
      licenseType: "commercial",
    };
  }
  return { baseSku: sku, licenseType: "unknown" };
}

// Order status helpers
const ORDER_SUCCESS_STATUSES = ["complete", "paid"] as const;
const ORDER_FAILED_STATUSES = [
  "canceled",
  "cancelled",
  "closed",
  "failed",
] as const;
const ORDER_PENDING_STATUSES = [
  "pending",
  "pending_payment",
  "processing",
  "new",
] as const;

export function isOrderSuccess(status: string): boolean {
  return ORDER_SUCCESS_STATUSES.includes(status.toLowerCase() as any);
}

export function isOrderFailed(status: string): boolean {
  return ORDER_FAILED_STATUSES.includes(status.toLowerCase() as any);
}

export function isOrderPending(status: string): boolean {
  return ORDER_PENDING_STATUSES.includes(status.toLowerCase() as any);
}

// ==================== Constants ====================

export const ORDER_POLLING_INTERVAL_MS = 3000;
export const STORE_PAGE_SIZE = 20;

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
  getOrders,
  getOrderDetail,
  cancelOrder,
  getProducts,
  getProductDetail,
  getCategories,
  createCart,
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
  checkoutAdd,
  getPaymentMethods,
  getTotals,
  setBillingAddress,
  placeOrder,
  submitFeedback,
  getAlipayQRCode,
  getWeChatQRCode,
  mapTMOCustomerToUser,
  mapTMOProductToMapped,
  stripHtml,
  mapTMOCartItemToMapped,
  mapTMOOrderToMapped,
  parseLicenseSku,
  isOrderSuccess,
  isOrderFailed,
  isOrderPending,
  setTMOToken,
  removeTMOToken,
  getTMOToken,
  setAuthErrorHandler,
  clearAuthErrorHandler,
};

export default tmoApi;
