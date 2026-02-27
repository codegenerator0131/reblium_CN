export type Avatar = {
  id: number;
  chat_id: number;
  name: string;
  image: string;
  avatar: {
    Voice: string;
  };
  user_id: number;
  prompts: string;
  created_at: string;
  updated_at: string;
  welcome_message: string;
  tags: string;
  description: string;
  logo: string;
  is_public: number;
  userName: string;
  thumbnail: string | null;
  gpt_api_key: string;
  gpt_model: string;
  elevenlabs_voice_id: string;
  elevenlabs_api_key: string;
  language: string;
  logo_visible: string;
};

export type Gallery = {
  id: number;
  user_id: number;
  image_link: string;
};

export interface PackItem {
  asset_id: number;
  asset_name: string;
  asset_url: string;
  asset_artist_name: string;
}

export interface Assets {
  id: number;
  name: string;
  artist_name: string;
  description: string;
  price: number;
  category: string;
  brand?: string;
  limited_edition?: number;
  store_type?: string;
  url: string;
  icon?: string;
  version?: string;
  is_default: number;
  is_pack: number;
  creation_year?: number;
  pack_items?: PackItem[];
}

export type User = {
  id: number;
  email: string;
  name: string;
  password: string;
  verification_token: string | null;
  is_verified: number | boolean;
  verification_code: string | null;
  google_id: string | null;
  avatar_id: number;
  facebook_id: string | null;
  apple_id: string | null;
  discord_id: string | null;
  wechat_id: string | null;
  verification_code_expires: string | null;
  created_at: string | null;
  bio: string;
  active_date: string;
  cancel_date: string | null;
  profile_picture: string;
  profile_avatar: any;
  role_ids: number[];
  role_names: string[];
  cur_role_ids: number[];
  is_trial: number | boolean;
  last_login: string | null;
  slug: string;
  profile_thumbnail: string | null;
};

export type UserWithRoles = {
  id: number;
  email: string;
  name: string;
  is_verified: boolean;
  profile_picture: string;
  google_id: string | null;
  facebook_id: string | null;
  apple_id: string | null;
  discord_id: string | null;
  wechat_id: string | null;
  created_at: string | null;
  bio: string | null;
  password: string;
  verification_code: string;
  verification_code_expires: string;
  role_id: number | null;
  status: number | null;
  active_date: string | null;
  cancel_date: string | null;
  slug: string;
};

export type UserCredit = {
  amount: number;
  premium_status: string;
};

export interface MySQLResult {
  affectedRows: number;
  insertId: number;
  warningCount: number;
}

