/** @format */

export interface Question {
  id: number;
  order: number;
  question_type:
    | "single_choice"
    | "multiple_choice"
    | "fill_in_the_blank"
    | "true_false";
  correct_answers: string[];
  explanation_type: "text" | "image" | "video" | "audio" | "none";
  options: QuizOption[];
  time_limit: number;
  translation: QuizQuestionTranslation;
  isAlreadyAnswered: boolean;
}
export interface QuizOption {
  label: string;
  value: string;
}

export interface QuizQuestionTranslation {
  id: number;
  questionable_type: string;
  questionable_id: number;
  locale: string;
  question_text: string;
  slug: string;
  question_explanation: string; // Can be a video URL or image path
  answer_explanation: string;
  hints: string;
}

export interface AnswerType {
  id: number;
  answer_text: string[];
  score: number;
  taken_time: number;
  is_correct: boolean;
}
