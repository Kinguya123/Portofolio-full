// utils/visitorTracker.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const trackPageView = async (page) => {
  try {
    const response = await fetch(`${API_URL}/visitors/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page, timestamp: new Date().toISOString() })
    });
    return await response.json();
  } catch (error) {
    console.log('Visitor tracking skipped:', error.message);
    return { success: false };
  }
};