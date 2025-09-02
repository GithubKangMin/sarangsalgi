export type ConcernCategory = '학업' | '진로' | '인간관계' | '생활_재정' | '건강_멘탈' | '기타';

export interface Concern {
  id: string;
  studentId: string;
  name?: string;
  category: ConcernCategory;
  title?: string;
  content: string;
  createdAt: string;
}

export interface ConcernRequest {
  studentId: string;
  name?: string;
  category: ConcernCategory;
  title?: string;
  content: string;
}

export interface Topic {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  answersCount: number;
  lastUpdatedAt: string;
}

export interface TopicRequest {
  title: string;
  content: string;
}

export interface Answer {
  id: string;
  topicId: string;
  studentId: string;
  name?: string;
  content: string;
  createdAt: string;
}

export interface AnswerRequest {
  studentId: string;
  name?: string;
  content: string;
}

export interface AdminLoginRequest {
  password: string;
}

export interface AdminSessionResponse {
  loggedIn: boolean;
  expiresAt?: string;
}

export type TabType = 'concerns' | 'topics' | 'admin';

export interface ApiError {
  error: string;
  details?: Record<string, string>;
}