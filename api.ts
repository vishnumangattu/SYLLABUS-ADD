import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Token to requests if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor for token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['x-auth-token'] = token;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        // No refresh token, logout user
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/adminlogin';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const { token, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem('token', token);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        processQueue(null, token);
        originalRequest.headers['x-auth-token'] = token;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/adminlogin';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const fetchCourses = (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.search) queryParams.append('search', params.search);
  if (params.category) queryParams.append('category', params.category);
  if (params.level) queryParams.append('level', params.level);
  const queryString = queryParams.toString();
  return api.get(`/courses${queryString ? `?${queryString}` : ''}`);
};
export const fetchCourseDetails = (id) => api.get(`/courses/${id}`);
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (credentials) => api.post('/auth/register', credentials);
export const refreshToken = (refreshToken) => api.post('/auth/refresh', { refreshToken });
export const logout = (refreshToken) => api.post('/auth/logout', { refreshToken });
export const changePassword = (data) => api.post('/auth/change-password', data);
export const forgotPassword = (username) => api.post('/auth/forgot-password', { username });
export const resetPassword = (data) => api.post('/auth/reset-password', data);
export const createCourse = (data) => api.post('/courses', data);
export const updateCourse = (id, data) => api.put(`/courses/${id}`, data);
export const deleteCourse = (id) => api.delete(`/courses/${id}`);

export default api;