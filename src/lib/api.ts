import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://unbelong-api.belong2jazz.workers.dev';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Illustration {
  id: string;
  work_id: string;
  title: string;
  slug: string;
  description: string | null;
  image_id: string;
  og_image_id: string | null;
  status: 'draft' | 'published' | 'archived';
  tags: string;
  view_count: number;
  created_at: number;
  updated_at: number;
  published_at: number | null;
}

export interface Work {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  type: 'manga' | 'illustration';
  status: 'ongoing' | 'completed' | 'hiatus';
  cover_image_id: string | null;
  created_at: number;
  updated_at: number;
}

// Illustrations API
export const illustrationsApi = {
  list: () => client.get<ApiResponse<Illustration[]>>('/api/illustrations'),
  get: (id: string) => client.get<ApiResponse<Illustration>>(`/api/illustrations/${id}`),
};

// Works API
export const worksApi = {
  list: (type?: 'manga' | 'illustration') => 
    client.get<ApiResponse<Work[]>>('/api/works', { params: { type } }),
  get: (id: string) => client.get<ApiResponse<Work>>(`/api/works/${id}`),
};

export default client;
