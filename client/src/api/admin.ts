import { apiClient } from './base';
import { 
  AdminLoginRequest, 
  AdminSessionResponse, 
  Concern, 
  ConcernCategory,
  Topic,
  TopicRequest 
} from '../types';

export const adminApi = {
  login: (data: AdminLoginRequest): Promise<{ message: string }> =>
    apiClient.post('/admin/login', data),
    
  logout: (): Promise<{ message: string }> =>
    apiClient.post('/admin/logout'),
    
  getSession: (): Promise<AdminSessionResponse> =>
    apiClient.get('/admin/session'),
    
  getConcerns: (params?: {
    q?: string;
    category?: ConcernCategory;
    sort?: string;
  }): Promise<{ concerns: Concern[]; totalCount: number }> => {
    const searchParams = new URLSearchParams();
    if (params?.q) searchParams.append('q', params.q);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.sort) searchParams.append('sort', params.sort);
    
    const query = searchParams.toString();
    return apiClient.get(`/admin/concerns${query ? `?${query}` : ''}`);
  },
  
  createTopic: (data: TopicRequest): Promise<Topic> =>
    apiClient.post('/admin/topics', data),
    
  updateTopic: (id: string, data: TopicRequest): Promise<Topic> =>
    apiClient.put(`/admin/topics/${id}`, data),
    
  deleteTopic: (id: string): Promise<{ message: string }> =>
    apiClient.delete(`/admin/topics/${id}`),
};