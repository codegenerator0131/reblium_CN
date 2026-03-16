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
