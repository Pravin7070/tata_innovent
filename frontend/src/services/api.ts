import axios from 'axios';
import { dashboardMockData } from '../utils/mockData';

// Create an Axios instance for future backend integration
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
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
   * Currently simulates an API call returning mock data.
   */
  getDashboardData: async () => {
    // In production, this would be:
    // const response = await api.get('/dashboard');
    // return response.data;
    
    await delay(1200); // Simulate network latency (1.2s)
    
    // Simulate occasional random failures to test ErrorBoundary (1% chance)
    if (Math.random() < 0.01) {
      throw new Error('Simulated network failure. Could not connect to vehicle telemetry endpoint.');
    }
    
    return dashboardMockData;
  }
};
