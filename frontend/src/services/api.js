const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = {
  getAsteroids: async () => {
    try {
      const response = await fetch(`${API_BASE}/asteroids`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { asteroids: [], error: 'Failed to fetch asteroids' };
    }
  },

  getStats: async () => {
    try {
      const response = await fetch(`${API_BASE}/stats`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Stats Error:', error);
      return { total: 0, avgDistance: 0, avgVelocity: 0, error: 'Failed to fetch stats' };
    }
  }
};

export default api;
