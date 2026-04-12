/**
 * Centralized API Configuration for Cream Dream
 * This ensures that if the backend URL changes, you only update it here.
 */

// Use relative paths by default for proxy-based dev and same-origin prod
// Priority: 1. Environment Variable (Production), 2. Local Fallback (Vite Proxy)
export const API_BASE = import.meta.env.VITE_API_URL || '';

export const ENDPOINTS = {
  PRODUCTS: `${API_BASE}/api/products`,
  ORDERS: `${API_BASE}/api/orders`,
  CONTENT: `${API_BASE}/api/content`,
  VISITORS: `${API_BASE}/api/visitors`
};

/**
 * Enhanced fetch wrapper with automatic JSON parsing and error handling
 */
export async function apiFetch(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Fetch error at ${url}:`, error);
    throw error;
  }
}
