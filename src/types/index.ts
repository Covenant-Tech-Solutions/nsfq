/** @format */

export interface CompanyInfoType {
  name: string;
  email: string;
  phone: string;
  website: string;
  description: string;
}

export interface ThemeColorType {
  primary_color: string;
  secondary_color: string;
}

export interface LogoFaviconType {
  logo_light: string;
  logo_dark: string;
  favicon: string;
}

export interface AddressType {
  country: string;
  state: string;
  city: string;
  postal_code: string;
  address: string;
  location: string;
}

export interface SocialMediaItem {
  id: number;
  name: string;
  link: string;
  icon: string;
}

export type SocialMediaType = SocialMediaItem[];

export interface OTPType {
  expire_time: number;
  digit_range: [number, number];
}

export interface DefaultCurrencyType {
  name: string;
  code: string;
  symbol: string;
  symbol_position: string;
  thousand_separator: string;
  decimal_separator: string;
  precision: string;
  rate: string;
  is_default: string;
}

export interface AuthProviderItem {
  id: string;
  name: string;
  is_enabled: boolean;
}

export type AuthProviderType = AuthProviderItem[];

export interface SystemConfig {
  user_registration: {
    is_enabled: boolean;
  };
  agreement_trams_and_policy: {
    is_enabled: boolean;
  };
  force_secure_password: {
    is_enabled: boolean;
  };
  email_verification: {
    is_enabled: boolean;
  };
  phone_verification: {
    is_enabled: boolean;
  };
  force_https: {
    is_enabled: boolean;
  };
  push_notification: {
    is_enabled: boolean;
  };
  is_kyc_enabled: {
    is_enabled: boolean;
  };
}

export interface PageType {
  id: number;
  title: string;
  slug: string;
  sections: PageSectionType[];
}

export interface PageSectionType {
  id: number;
  title: string;
  slug: string;
  content: [any];
}

export interface PaginationDataTypes {
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: any[];
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: string;
  to: number;
  total: number;
}

export interface SitePaginationConfig {
  per_page: number;
  data_limit: number;
}

export interface CookieConsentType {
  is_enabled: boolean;
  title: string;
  description: string;
}

export interface ServiceSwitchType {
  system_config: SystemConfig;
  site_pagination_config: SitePaginationConfig;
  cookie_consent: CookieConsentType;
}

export interface ApplicationInfoType {
  company_info: CompanyInfoType;
  frontend_url: string;
  theme: ThemeColorType;
  KYC_approval_time: string;
  logo_favicon: LogoFaviconType;
  address: AddressType;
  timezone: string;
  social_medias: SocialMediaType;
  otp: OTPType;
  defaultCurrency: DefaultCurrencyType;
  auth_providers: AuthProviderType;
  footer_text: string;
  coins: CoinSettingType;
  auth_left_sidebar_image: string;
}

export interface RecaptchaType {
  is_enabled: boolean;
  site_key: string;
  secret_key: string;
}

export interface GoogleAnalyticsType {
  is_enabled: boolean;
  measurement_id: string;
}

export interface TawkToType {
  is_enabled: boolean;
  property_id: string;
  widget_id: string;
}

export interface ExtensionsType {
  recaptcha: RecaptchaType;
  google_analytics: GoogleAnalyticsType;
  tawk_to: TawkToType;
}

export interface FirebaseTypes {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
  vapidKey: string | null;
}

export interface AppInfoType {
  application_info: ApplicationInfoType;
  extensions: ExtensionsType;
  service_switch: ServiceSwitchType;
  firebase: FirebaseTypes;
}

export interface CoinSettingType {
  score_ratio: {
    coin: string;
    score: number;
  };
  usd_ratio: {
    usd: number;
    coin: number;
  };
  initial_balance: number;
}

export interface CurrencyType {
  code: string;
  name: string;
  symbol: string;
  symbol_position: string;
  thousand_separator: string;
  decimal_separator: string;
  precision: number;
  rate: number;
  is_default: boolean;
}

export interface TestimonialsApiResponse {
  id: number;
  name: string;
  designation: string;
  description: string;
  image: string;
  rating: number;
  status: "active" | "inactive"; // Assuming only "active"/"inactive"
  created_at: string; // or `Date` if you're converting it
  updated_at: string; // or `Date` if you're converting it
}

export interface NotificationType {
  id?: string;
  data: string;
  created_at: string;
}

export interface NotificationResponseType extends PaginationDataTypes {
  data: NotificationType[];
}

export interface PWAType {
  title: string;
  description: string;
  theme_color: string;
  background_color: string;
  icons: {
    src: string;
    sizes: string;
    type: string;
  }[];
}

export interface PWAResponseType {
  statusCode: number;
  data: PWAType;
}
