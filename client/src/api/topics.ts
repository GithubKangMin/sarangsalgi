import { apiClient } from './base';
import { Topic, Answer, AnswerRequest } from '../types';

export const topicsApi = {
  getAll: (): Promise<Topic[]> =>
    apiClient.get('/topics'),
    
  getById: (id: string): Promise<Topic> =>
    apiClient.get(`/topics/${id}`),
    
  getAnswers: (topicId: string): Promise<Answer[]> =>
    apiClient.get(`/topics/${topicId}/answers`),
    
  createAnswer: (topicId: string, data: AnswerRequest): Promise<Answer> =>
    apiClient.post(`/topics/${topicId}/answers`, data),
};