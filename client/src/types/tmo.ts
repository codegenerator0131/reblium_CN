// TMO API Types — Auth & Customer

export interface TMOCustomAttribute {
  attribute_code: string;
  value: string;
}

export interface TMOCustomer {
  id: number;
  group_id: number;
  default_billing?: string;
  default_shipping?: string;
  created_at: string;
  updated_at: string;
  created_in: string;
  email: string;
  firstname: string;
  lastname: string;
  store_id: number;
  website_id: number;
  addresses: TMOAddress[];
  disable_auto_group_change: number;
  extension_attributes?: {
    is_subscribed?: boolean;
    assistance_allowed?: number;
  };
  custom_attributes?: TMOCustomAttribute[];
  dob?: string;
}

export interface TMOAddress {
  id?: number;
  customer_id?: number;
  region?: { region_code: string; region: string; region_id: number };
  region_id?: number;
  country_id: string;
  street: string[];
  telephone: string;
  postcode: string;
  city: string;
  firstname: string;
  lastname: string;
  default_shipping?: boolean;
  default_billing?: boolean;
  custom_attributes?: Array<{ attribute_code: string; value: any }>;
}

export interface TMOCustomerRegisterRequest {
  customer: {
    email: string;
    custom_attributes: TMOCustomAttribute[];
    dob?: string;
    firstname: string;
    lastname: string;
  };
  verify_code: string;
  password: string;
  cart_id?: string;
}

export interface MappedUser {
  id: number;
  email: string;
  name: string;
  firstname: string;
  lastname: string;
  mobile?: string;
  mobile_prefix?: string;
  created_at: string;
  is_verified: boolean;
  dob?: string;
  addresses: TMOAddress[];
  custom_attributes: TMOCustomAttribute[];
}

export interface TMOGeoItem {
  id: string;
  name: string;
}

export type TMOGeoRegion = TMOGeoItem;
export type TMOGeoCity = TMOGeoItem;
export type TMOGeoDistrict = TMOGeoItem;

export interface TMOAPIError {
  message: string;
  errors?: { message: string; parameters?: Record<string, string> }[];
  code?: number;
  parameters?: string[];
  trace?: string;
}

export interface SMSCodeResponse {
  success?: boolean;
  message?: string;
  code?: string;
}

// ==================== Product Types ====================

export interface TMOProduct {
  id: number;
  sku: string;
  name: string;
  attribute_set_id: number;
  price: number;
  status: number;
  visibility: number;
  type_id: string;
  created_at: string;
  updated_at: string;
  weight?: number;
  extension_attributes?: TMOProductExtensionAttributes;
  product_links?: TMOProductLink[];
  options?: TMOProductOption[];
  media_gallery_entries?: TMOMediaGalleryEntry[];
  tier_prices?: TMOTierPrice[];
  custom_attributes?: TMOCustomAttribute[];
}

export interface TMODownloadableLink {
  id: number;
  title: string;
  sort_order: number;
  is_shareable: number;
  price: number;
  number_of_downloads: number;
  link_type: string;
  link_file?: string;
  sample_type?: string | null;
  sample_file?: string | null;
}

export interface TMOProductExtensionAttributes {
  website_ids?: number[];
  category_links?: TMOCategoryLink[];
  stock_item?: TMOStockItem;
  configurable_product_options?: TMOConfigurableOption[];
  downloadable_product_links?: TMODownloadableLink[];
  downloadable_product_samples?: any[];
  configurable_product_links?: number[];
}

export interface TMOCategoryLink {
  position: number;
  category_id: string;
}

export interface TMOStockItem {
  item_id: number;
  product_id: number;
  stock_id: number;
  qty: number;
  is_in_stock: boolean;
  is_qty_decimal: boolean;
  show_default_notification_message: boolean;
  use_config_min_qty: boolean;
  min_qty: number;
  use_config_min_sale_qty: number;
  min_sale_qty: number;
  use_config_max_sale_qty: boolean;
  max_sale_qty: number;
  use_config_backorders: boolean;
  backorders: number;
  use_config_notify_stock_qty: boolean;
  notify_stock_qty: number;
  use_config_qty_increments: boolean;
  qty_increments: number;
  use_config_enable_qty_inc: boolean;
  enable_qty_increments: boolean;
  use_config_manage_stock: boolean;
  manage_stock: boolean;
  low_stock_date: string | null;
  is_decimal_divided: boolean;
  stock_status_changed_auto: number;
}

export interface TMOConfigurableOption {
  id: number;
  attribute_id: string;
  label: string;
  position: number;
  values: TMOConfigurableOptionValue[];
  product_id: number;
}

export interface TMOConfigurableOptionValue {
  value_index: number;
}

export interface TMOProductLink {
  sku: string;
  link_type: string;
  linked_product_sku: string;
  linked_product_type: string;
  position: number;
}

export interface TMOProductOption {
  product_sku: string;
  option_id: number;
  title: string;
  type: string;
  sort_order: number;
  is_require: boolean;
  price?: number;
  price_type?: string;
  max_characters?: number;
  values?: TMOProductOptionValue[];
}

export interface TMOProductOptionValue {
  title: string;
  sort_order: number;
  price: number;
  price_type: string;
  option_type_id: number;
}

export interface TMOMediaGalleryEntry {
  id: number;
  media_type: string;
  label: string | null;
  position: number;
  disabled: boolean;
  types: string[];
  file: string;
}

export interface TMOTierPrice {
  customer_group_id: number;
  qty: number;
  value: number;
  extension_attributes?: {
    percentage_value?: number;
    website_id?: number;
  };
}

export interface TMOProductsResponse {
  items: TMOProduct[];
  search_criteria: TMOSearchCriteria;
  total_count: number;
}

export interface TMOSearchCriteria {
  filter_groups?: TMOFilterGroup[];
  sort_orders?: TMOSortOrder[];
  page_size?: number;
  current_page?: number;
}

export interface TMOFilterGroup {
  filters: TMOFilter[];
}

export interface TMOFilter {
  field: string;
  value: string;
  condition_type: string;
}

export interface TMOSortOrder {
  field: string;
  direction: "ASC" | "DESC";
}

// ==================== Category Types ====================

export interface TMOCategory {
  id: number;
  parent_id: number;
  name: string;
  is_active: boolean;
  position: number;
  level: number;
  product_count: number;
  children_data: TMOCategory[];
}

export interface TMOCategoriesResponse {
  id: number;
  parent_id: number;
  name: string;
  is_active: boolean;
  position: number;
  level: number;
  product_count: number;
  children_data: TMOCategory[];
}

// ==================== Cart Types ====================

export interface TMOCart {
  id: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_virtual: boolean;
  items: TMOCartItem[];
  items_count: number;
  items_qty: number;
  customer: TMOCartCustomer;
  billing_address?: TMOAddress;
  orig_order_id: number;
  currency: TMOCartCurrency;
  customer_is_guest: boolean;
  customer_note_notify: boolean;
  customer_tax_class_id: number;
  store_id: number;
  extension_attributes?: TMOCartExtensionAttributes;
}

export interface TMOCartItem {
  item_id: number;
  sku: string;
  qty: number;
  name: string;
  price: number;
  product_type: string;
  quote_id: string;
  product_option?: TMOCartItemProductOption;
  extension_attributes?: TMOCartItemExtensionAttributes;
}

export interface TMOCartItemProductOption {
  extension_attributes?: {
    custom_options?: TMOCartItemCustomOption[];
    configurable_item_options?: TMOCartItemConfigurableOption[];
    downloadable_option?: {
      downloadable_links: number[];
    };
  };
}

export interface TMOCartItemCustomOption {
  option_id: string;
  option_value: string;
}

export interface TMOCartItemConfigurableOption {
  option_id: string;
  option_value: number;
}

export interface TMOCartItemExtensionAttributes {
  discounts?: TMODiscount[];
}

export interface TMODiscount {
  discount_data: {
    amount: number;
    base_amount: number;
    original_amount: number;
    base_original_amount: number;
  };
  rule_label: string;
  rule_id: number;
}

export interface TMOCartCustomer {
  id?: number;
  group_id?: number;
  email?: string;
  firstname?: string;
  lastname?: string;
}

export interface TMOCartCurrency {
  global_currency_code: string;
  base_currency_code: string;
  store_currency_code: string;
  quote_currency_code: string;
  store_to_base_rate: number;
  store_to_quote_rate: number;
  base_to_global_rate: number;
  base_to_quote_rate: number;
}

export interface TMOCartExtensionAttributes {
  shipping_assignments?: TMOShippingAssignment[];
}

export interface TMOShippingAssignment {
  shipping: {
    address: TMOAddress;
    method: string;
  };
  items: TMOCartItem[];
}

export interface TMOAddToCartRequest {
  cartItem: {
    sku: string;
    qty: number;
    quote_id?: string;
    product_option?: TMOCartItemProductOption;
  };
}

export interface TMOUpdateCartItemRequest {
  cartItem: {
    item_id: number;
    qty: number;
    quote_id?: string;
  };
}

// ==================== Checkout Types ====================

export interface TMOCartTotals {
  grand_total: number;
  base_grand_total: number;
  subtotal: number;
  base_subtotal: number;
  discount_amount: number;
  base_discount_amount: number;
  subtotal_with_discount: number;
  base_subtotal_with_discount: number;
  shipping_amount: number;
  base_shipping_amount: number;
  shipping_discount_amount: number;
  base_shipping_discount_amount: number;
  tax_amount: number;
  base_tax_amount: number;
  weee_tax_applied_amount: number | null;
  shipping_tax_amount: number;
  base_shipping_tax_amount: number;
  subtotal_incl_tax: number;
  shipping_incl_tax: number;
  base_shipping_incl_tax: number;
  base_currency_code: string;
  quote_currency_code: string;
  items_qty: number;
  items: TMOCartTotalItem[];
  total_segments: TMOTotalSegment[];
}

export interface TMOCartTotalItem {
  item_id: number;
  price: number;
  base_price: number;
  qty: number;
  row_total: number;
  base_row_total: number;
  row_total_with_discount: number;
  tax_amount: number;
  base_tax_amount: number;
  tax_percent: number;
  discount_amount: number;
  base_discount_amount: number;
  discount_percent: number;
  price_incl_tax: number;
  base_price_incl_tax: number;
  row_total_incl_tax: number;
  base_row_total_incl_tax: number;
  options: string;
  weee_tax_applied_amount: number | null;
  weee_tax_applied: string | null;
  name: string;
}

export interface TMOTotalSegment {
  code: string;
  title: string;
  value: number;
  area?: string;
  extension_attributes?: Record<string, unknown>;
}

export interface TMOPlaceOrderRequest {
  paymentMethod: {
    method: string;
    po_number?: string;
    additional_data?: Record<string, string>;
  };
  billingAddress?: TMOAddress;
  shippingAddress?: TMOAddress;
}

export interface TMOPaymentMethod {
  code: string;
  title: string;
}

// ==================== Order Types ====================

export interface TMOOrder {
  entity_id: number;
  increment_id: string;
  state: string;
  status: string;
  store_id: number;
  grand_total: number;
  base_grand_total: number;
  subtotal: number;
  base_subtotal: number;
  discount_amount: number;
  base_discount_amount: number;
  shipping_amount: number;
  base_shipping_amount: number;
  tax_amount: number;
  base_tax_amount: number;
  total_qty_ordered: number;
  customer_id: number;
  customer_email: string;
  customer_firstname: string;
  customer_lastname: string;
  created_at: string;
  updated_at: string;
  items: TMOOrderItem[];
  billing_address: TMOAddress;
  payment: TMOOrderPayment;
  status_histories: TMOOrderStatusHistory[];
  extension_attributes?: TMOOrderExtensionAttributes;
  order_currency_code: string;
}

export interface TMOOrderItem {
  item_id: number;
  order_id: number;
  parent_item_id: number | null;
  sku: string;
  name: string;
  qty_ordered: number;
  qty_shipped: number;
  qty_invoiced: number;
  qty_canceled: number;
  qty_refunded: number;
  price: number;
  base_price: number;
  row_total: number;
  base_row_total: number;
  tax_amount: number;
  base_tax_amount: number;
  tax_percent: number;
  discount_amount: number;
  base_discount_amount: number;
  product_type: string;
  product_id: number;
  created_at: string;
  updated_at: string;
  extension_attributes?: {
    main_image_url?: string;
    item_options?: any[];
    itemized_taxes?: any[];
  };
}

export interface TMOOrderPayment {
  account_status: string | null;
  additional_information: string[];
  amount_ordered: number;
  base_amount_ordered: number;
  base_shipping_amount: number;
  cc_last4: string | null;
  entity_id: number;
  method: string;
  parent_id: number;
  shipping_amount: number;
  extension_attributes?: {
    method_label?: string;
  };
}

export interface TMOOrderStatusHistory {
  entity_id: number;
  parent_id: number;
  is_customer_notified: number;
  is_visible_on_front: number;
  comment: string | null;
  status: string;
  created_at: string;
  entity_name: string;
}

export interface TMOOrderExtensionAttributes {
  shipping_assignments?: TMOShippingAssignment[];
  payment_additional_info?: { key: string; value: string }[];
}

export interface TMOOrdersResponse {
  items: TMOOrder[];
  search_criteria: TMOSearchCriteria;
  total_count: number;
}

// ==================== Mapped Types ====================

export interface MappedProduct {
  id: number;
  sku: string;
  name: string;
  artist_name: string;
  description: string;
  price: number;
  category: string;
  categoryIds: string[];
  url: string;
  images: string[];
  is_pack: boolean;
  pack_items?: MappedProduct[];
  options?: TMOProductOption[];
  custom_attributes: TMOCustomAttribute[];
}

export interface MappedCartItem {
  id: number;
  sku: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
  subtotal: number;
  options?: {
    label: string;
    value: string;
  }[];
}

export interface MappedOrder {
  id: number;
  incrementId: string;
  status: string;
  state: string;
  grandTotal: number;
  subtotal: number;
  shippingAmount: number;
  taxAmount: number;
  discountAmount: number;
  totalQty: number;
  createdAt: string;
  items: MappedOrderItem[];
  billingAddress: TMOAddress;
  paymentMethod: string;
}

export interface MappedOrderItem {
  id: number;
  sku: string;
  name: string;
  price: number;
  qty: number;
  subtotal: number;
  image?: string;
}
