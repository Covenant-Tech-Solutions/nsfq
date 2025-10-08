/** @format */

export interface UserDetailsType {
  bio: string | null;
  full_name: string;
  nationality: string;
  created_by: string;
  country_of_birth: string;
  personal_value: string[];
  grow_up_place: string;
  can_speak: string[]; //logtext;
  religion_view: string;
  drink: string;
  smoke: string;
  diet: string;
  guardian_phone: string;
  activities: string[]; // longtext;
}
export interface AppearanceType {
  date_of_birth: string;
  gender: string;
  marital_status: string;
  height: number;
  disabilities: string;
  children: number;
  complexion: string;
  blood_group: string;
  hair_color: string;
  eye_color: string;
}
export interface HobbyType {
  musics: string[];
  watching: string[];
  reading: string[];
  cooking: string[];
  styling: string[];
}

export interface SocialLink {
  type: string;
  link: string;
}

export interface CareerType {
  education_id: number;
  education?: {
    degree: string;
  };
  education_subject_id: number;
  education_subject?: {
    name: string;
  };
  institute: string;
  profession_id: number;
  profession?: {
    name: string;
  };
  workplace: string;
  designation: string;
  yearly_income: string;
}
export interface CommunityType {
  religion_id: number;
  religion?: {
    name: string;
  };
  religion_caste_id: number;
  religion_caste?: {
    name: string;
  };
  family_values: string;
  mother_tongue: string;
}
export interface FamilyType {
  family_type: string;
  father_profession: string;
  mother_profession: string;
  family_status: string;
  no_of_brothers: string;
  no_of_sisters: string;
  no_of_married_brothers: string;
  no_of_married_sisters: string;
}
export interface UserType {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zip_code: string;
  coins: number;
  score: number;
  status: "active" | "inactive" | string; // can be narrowed further if needed
  is_2fa_enabled: boolean;
  is_kyc_verified: boolean;
  payment_user_id: number | null;
  provider_id: number | null;
  referer_id: number | null;
  fcm_token: string | null;
  email_verified_at: string | null; // ISO timestamp string
  phone_verified_at: string | null; // ISO timestamp string
  created_at: string; // ISO timestamp string
  updated_at: string; // ISO timestamp string
  kyc: KycType | null;
}
export interface KycType {
  id: number;
  status: string;
}

export interface UserSettingsType {
  id: number;
  user_id: number;
  is_profile_visible: boolean;
  is_image_private: boolean;
  is_interest_request_enable: boolean;
  is_chat_enable: boolean;
  is_profile_view_enable: boolean;
  is_new_profile_match_enable: boolean;
}

export interface Media {
  id: number;
  path: string;
  name?: string;
}

export interface addressType {
  type: string;
  is_same_as_permanent: 0 | 1;
  division_id: number;
  district_id: number;
  upazila_id: number;
  area_id: number;
  division?: {
    name: string;
  };
  district?: {
    name: string;
  };
  upazila?: {
    name: string;
  };
  area?: {
    name: string;
  };
}
