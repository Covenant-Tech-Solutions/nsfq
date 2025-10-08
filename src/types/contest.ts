/** @format */

import { PaginationData } from "./pagination";
import { AnswerType, Question } from "./question";

export interface ContestApiResponse extends PaginationData {
  data: ContestType[];
}

export interface ContestType {
  id: number;
  category_id: number;
  image: string;
  contest_label: string;
  start_time: string;
  end_time: string;
  banner_image: string | null;
  is_free: boolean;
  entry_fee: string;
  is_featured: boolean;
  status: "upcoming" | "running" | "completed";
  created_at: string;
  participant_limit: number;
  updated_at: string;
  questions_count: number;
  isAlreadyAnswered?: boolean;
  participants_count: number;
  translation: ContestTranslationType;
  contest_label_name: string;
  questions_sum_time_limit?: number;
  status_name: string;
  is_favorite: boolean;
  prizes?: PrizeType[];
  category: CategoryType;
  questions?: Question[];
  taken_status?: "pending" | "running" | "submitted" | "won" | "lost";
}

export interface ContestTranslationType {
  id: number;
  contest_id: number;
  locale: string;
  title: string;
  tags: string[];
  slug: string;
  description: string;
}

export interface PrizeType {
  id: number;
  contest_id: number;
  name: string;
  amount: string;
  rank: number;
  created_at: string; // ISO Date string
  updated_at: string; // ISO Date string
}

export interface ContestDetailsType extends ContestType {
  participants: ParticipantType[];
  has_taken?: boolean;
}

export interface CategoryType {
  id: number;
  title: string;
}

export interface ParticipantType {
  id: number;
  contest_id: number;
  user_id: number;
  prize_id: number | null;
  score: number;
  time_taken: number;
  answers_sum_score?: number;
  answers_count?: number;
  answers_sum_taken_time?: number;
  submitted_at: string | null;
  status: "pending" | "running" | "submitted" | "won" | "lost";
  total_contest_score?: number;
  user?: UserType;
  contest?: ContestType;
  prize?: PrizeType | null;
  created_at: string;
  updated_at: string;
}

export interface ParticipantPaginationType extends PaginationData {
  data: ParticipantType[];
}

interface UserType {
  id: number;
  first_name: string;
  last_name: string;
  avatar: string;
  full_name: string;
}

export interface ContestQuestionType extends Question {
  contest_id: number;
  answers?: AnswerType[];
}

export interface ContestAnswerType extends AnswerType {
  contest_participant_id: number;
  contest_question_id: number;
}

export interface ContestResultResponseType {
  questions: ContestQuestionType[];
  answers: ContestAnswerType[];
}
