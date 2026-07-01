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
  startEdgeInference: async (file?: File) => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/start-inference', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    }

    const response = await api.post('/start-inference');
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

export const StatusService = {
  getEdgeStatus: async () => {
    const response = await api.get('/status');
    return response.data;
  }
};

export const MapService = {
  calculateRoute: async (start: string, destination: string) => {
    const response = await api.post('/map/route', { start, destination });
    return response.data;
  }
};

export const SimulationService = {
  start: async () => {
    const response = await api.post('/simulation/start');
    return response.data;
  },
  stop: async () => {
    const response = await api.post('/simulation/stop');
    return response.data;
  },
  reset: async () => {
    const response = await api.post('/simulation/reset');
    return response.data;
  }
};

export const SettingsService = {
  resetSystem: async () => {
    const response = await api.post('/settings/reset');
    return response.data;
  },
  runDiagnostics: async () => {
    const response = await api.post('/settings/diagnostics');
    return response.data;
  }
};
