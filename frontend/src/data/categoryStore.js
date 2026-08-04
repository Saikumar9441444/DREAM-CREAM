import { BACKEND_URL } from '../utils/apiConfig';
const BASE_URL = import.meta.env.VITE_API_URL || BACKEND_URL;
const API_URL = `${BASE_URL}/api/categories`;

const DEFAULT_CATEGORIES = [
  'Dairy', 'Vegan', 'Sorbet', 'Specialty', 'Milkshake', 'Thick Shake'
];

let useLocal = false;

export const getCategories = async () => {
  if (useLocal) {
    const cached = localStorage.getItem('dream_cream_categories_db');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { /* fall through */ }
    }
    localStorage.setItem('dream_cream_categories_db', JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES;
  }

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('API failed');
    const data = await response.json();
    if (data.length === 0) {
      // Seed defaults
      await fetch(`${API_URL}/seed`, { method: 'POST' });
      const seeded = await fetch(API_URL);
      return await seeded.json();
    }
    return data;
  } catch (error) {
    console.warn('Backend unavailable, using local categories:', error.message);
    useLocal = true;
    return getCategories(); // recurse into local path
  }
};

export const addCategory = async (categoryName) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: categoryName })
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to add category');
    }
    return await getCategories();
  } catch (error) {
    if (error.message === 'Category already exists') throw error;
    console.warn('Backend add failed, using local store:', error.message);

    // Local fallback
    const categories = JSON.parse(localStorage.getItem('dream_cream_categories_db') || '[]');
    if (categories.includes(categoryName)) throw new Error('Category already exists');
    const updated = [...categories, categoryName];
    localStorage.setItem('dream_cream_categories_db', JSON.stringify(updated));
    return updated;
  }
};

export const deleteCategory = async (categoryName) => {
  try {
    const response = await fetch(`${API_URL}/${encodeURIComponent(categoryName)}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('API failed');
    return await getCategories();
  } catch (error) {
    console.warn('Backend delete failed, using local store:', error.message);
    const categories = JSON.parse(localStorage.getItem('dream_cream_categories_db') || '[]');
    const updated = categories.filter(c => c !== categoryName);
    localStorage.setItem('dream_cream_categories_db', JSON.stringify(updated));
    return updated;
  }
};
