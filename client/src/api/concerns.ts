import { apiClient } from './base';
import { ConcernRequest, Concern } from '../types';

export const concernsApi = {
  create: (data: ConcernRequest): Promise<Concern> =>
    apiClient.post('/concerns', data),
};