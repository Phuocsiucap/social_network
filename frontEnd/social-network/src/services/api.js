// src/services/api.js
import axios from 'axios';
import { authStore, useUIStore } from '../store';

import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: 'http://localhost:5000/webchat',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = authStore.getState().getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.method !== 'get') {
      useUIStore.getState().setGlobalLoading(true);
    }

    return config;
  },
  (error) => {
    useUIStore.getState().setGlobalLoading(false);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    useUIStore.getState().setGlobalLoading(false);
    return response;
  },
  (error) => {
    useUIStore.getState().setGlobalLoading(false);

    if (error.response) {
      const { status, data } = error.response;

      // Đối với lỗi 400, không hiển thị toast nếu là lỗi business logic
      if (status === 400) {
        // Chỉ log, không toast để component tự xử lý
        console.log('API Error 400:', data);
        return Promise.reject({
          success: false,
          message: data.message || 'Bad request',
          code: data.code,
          originalError: error
        });
      }

      switch (status) {
        case 401:
          authStore.getState().logout();
          toast.error('Session expired. Please login again.');
          window.location.href = '/login';
          break;
        case 403:
          toast.error('Access denied');
          break;
        case 404:
          toast.error('Resource not found');
          break;
        case 422:
          if (data.errors) {
            Object.values(data.errors).forEach((error) => {
              toast.error(error[0]);
            });
          } else {
            toast.error(data.message || 'Validation failed');
          }
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error(data.message || 'Something went wrong');
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error('Something went wrong');
    }

    return Promise.reject(error);
  }
);

export default api;
