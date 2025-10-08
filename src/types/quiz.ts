/** @format */

import { ContestType } from "./contest";
import { PaginationData } from "./pagination";
import { AnswerType, Question } from "./question";

export interface QuizCategory {
  id: number;
  title: string;
  slug: string;
}

export interface QuizTranslation {
  id: number;
  quiz_id: number;
  locale: string;
  title: string;
  tags: string[];
  slug: string;
  description: string;
}
// Pagination data structure
export interface QuizPaginationApiResponse extends PaginationData {
  data: QuizType[];
}

export interface QuizQuestionType extends Question {
  quiz_id: number;
  answers?: AnswerType[];
}

// Full quiz object with questions
export interface QuizDetail {
  id: number;
  title: string;
  slug: string;
  has_level: boolean;
  point_to_pass: number;
  category: QuizCategory;
  questions: QuizQuestionType[];
}

// API response
export interface QuizDetailResponse {
  statusCode: number;
  data: {
    quiz: QuizDetail;
    answers: string[];
  };
}

export interface QuizAnswerType extends AnswerType {
  question_id: number;
}

export interface QuizResultResponseType {
  questions: QuizQuestionType[];
  answers: QuizAnswerType[];
}

// quiz category
export interface QuizCategory {
  id: number;
  title: string;
  slug: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface QuizCategoryApiResponse extends PaginationData {
  data: QuizCategory[];
}

export interface LevelPivot {
  quiz_id: number;
  level_id: number;
  id: number;
}

export interface QuizLevel {
  id: number;
  title: string;
  slug: string;
  is_taken: boolean;
  status?: string;
  pivot: LevelPivot;
}
export interface QuizLevelCategory {
  id: number;
  title: string;
}

export interface QuizLevels {
  id: number;
  title: string;
  slug: string;
  has_level: boolean;
  point_to_pass: number;
  category: QuizLevelCategory;
  levels: QuizLevel[];
}

export interface QuizLevelsApiResponse {
  statusCode: number;
  data: {
    quiz: QuizLevels;
    answers: any[];
  };
}

export interface LevelDetail {
  id: number;
  level_id: number;
  quiz_id: number;
  created_at: string;
  updated_at: string;
  level: QuizCategory;
  quiz: QuizCategory;
  questions: QuizQuestionType[];
}

export interface LevelQuestionsApiResponse {
  statusCode: number;
  data: {
    level: LevelDetail;
    answers: string[];
  };
}

export interface QuizAnswerApiResponse {
  question_id: number;
  answer_text: string[];
  score: number;
  taken_time: number;
  is_correct: boolean;
  created_at: string;
}
export interface QuizHistoryItem {
  id: number;
  user_id: number;
  quiz_id: number;
  status: "pending" | "completed" | "in_progress" | "cancelled";
  created_at: string;
  updated_at: string;
  quiz: QuizHistoryItem;
}

export interface QuizHistoryItem {
  id: number;
  title: string;
  slug: string;
  image: string;
}

export interface FavoritesApiResponse extends PaginationData {
  data: QuizType[] | ContestType[];
}

export interface QuizTranslation {
  id: number;
  quiz_id: number;
  locale: string;
  title: string;
  tags: string[];
  slug: string;
  description: string;
}

export interface QuizType {
  id: number;
  image: string;
  has_level: boolean;
  category_id: number;
  quiz_level: string;
  banner_image: string | null;
  is_free: boolean;
  quiz_level_name: string;
  point_to_pass: number;
  status_name: string;
  user_quizzes?: any[];
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  category: QuizCategory;
  translation: QuizTranslation;
  taken_status: null | "pending" | "in_progress" | "completed" | "cancelled";
  is_favorite: boolean;
  questions_sum_time_limit?: number;
  question_levels_count?: number;
  questions_count?: number;
  user_quizzes_count?: number;
  levels?: QuizLevel[];
}

export interface UserQuizType {
  id: number;
  user_id: number;
  quiz_id: number;
  score: number;
  answers_count?: number;
  user_level_completed?: number;
  user_level_pending?: number;
  answers_sum_score?: number;
  answers_sum_taken_time?: number;
  time_taken: number;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
  quiz: QuizType;
}
