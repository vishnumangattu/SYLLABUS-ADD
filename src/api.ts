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

export const fetchCourses = () => api.get('/courses');
export const fetchCourseDetails = (id: string) => api.get(`/courses/${id}`);
export const login = (credentials: any) => api.post('/auth/login', credentials);
export const register = (credentials: any) => api.post('/auth/register', credentials);
export const createCourse = (data: any) => api.post('/courses', data);
export const updateCourse = (id: string, data: any) => api.put(`/courses/${id}`, data);
export const deleteCourse = (id: string) => api.delete(`/courses/${id}`);

export default api;