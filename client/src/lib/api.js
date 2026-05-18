import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('startupiq_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('startupiq_token');
      localStorage.removeItem('startupiq_user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

// Ideas API
export const ideasAPI = {
  getAll: (params) => API.get('/ideas', { params }),
  getOne: (id) => API.get(`/ideas/${id}`),
  create: (data) => API.post('/ideas', data),
  update: (id, data) => API.put(`/ideas/${id}`, data),
  delete: (id) => API.delete(`/ideas/${id}`),
};

// AI API
export const aiAPI = {
  analyze: (ideaId) => API.post(`/ai/analyze/${ideaId}`),
};

// Reports API
export const reportsAPI = {
  getAll: () => API.get('/reports'),
  getOne: (id) => API.get(`/reports/${id}`),
  delete: (id) => API.delete(`/reports/${id}`),
  getDashboardStats: () => API.get('/reports/stats/dashboard'),
};

export default API;
