export interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  is_verified: boolean;
  verification_code: string | null;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: number;
  algorithm_id: number;
  question: string;
  options: string;
  correct_answer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  created_at: string;
}

export interface UserAnswer {
  id: number;
  user_id: number;
  question_id: number;
  answer: string;
  language: string;
  is_correct: boolean;
  created_at: string;
}

export interface Database {
  get: (sql: string, params?: any[]) => Promise<any>;
  run: (sql: string, params?: any[]) => Promise<any>;
  all: (sql: string, params?: any[]) => Promise<any[]>;
}

export interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    email: string;
    username: string;
  };
} 