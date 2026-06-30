import axios from 'axios';
import { dashboardMockData } from '../utils/mockData';

// Create an Axios instance for future backend integration
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock network delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const DashboardService = {
  /**
   * Fetches the dashboard telemetry and diagnostic data.
   */
  getDashboardData: async () => {
    try {
      const response = await api.get('/dashboard');
      return response.data;
    } catch (error) {
      console.warn("Backend not available, falling back to mock data", error);
      return dashboardMockData;
    }
  }
};

export const VideoService = {
  uploadVideo: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  
  getHistory: async () => {
    const response = await api.get('/history');
    return response.data;
  },

  getDetections: async () => {
    const response = await api.get('/detections');
    return response.data;
  }
};
