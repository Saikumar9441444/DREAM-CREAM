import { products } from './products';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${BASE_URL}/api/products`;

// Local fallback data
let localProducts = [...products].map(p => ({
  ...p,
  price: parseInt(String(p.price).replace('\u20B9', ''), 10),
  stock: Math.floor(Math.random() * 100) + 10,
  inStock: true
}));

let useLocal = false;

export const getProducts = async () => {
  if (useLocal) return [...localProducts];

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('API failed');
    const data = await response.json();
    if (data.length === 0) {
      // DB is empty, seed it
      await fetch(`${API_URL}/seed`, { method: 'POST' });
      const seeded = await fetch(API_URL);
      return await seeded.json();
    }
    return data;
  } catch (error) {
    console.warn('Backend unavailable, using local products:', error.message);
    useLocal = true;
    return [...localProducts];
  }
};

export const addProduct = async (product) => {
  const newProduct = {
    ...product,
    id: product.id || `PRD-${Date.now()}`,
    price: Number(product.price)
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    });
    if (response.ok) return await response.json();
    throw new Error('API failed');
  } catch (error) {
    console.warn('Backend add failed, using local store:', error.message);
    localProducts = [newProduct, ...localProducts];
    return newProduct;
  }
};

export const updateProduct = async (id, updatedProduct) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct)
    });
    if (response.ok) return await response.json();
    throw new Error('API failed');
  } catch (error) {
    console.warn('Backend update failed, using local store:', error.message);
    localProducts = localProducts.map(p => p.id === id ? { ...p, ...updatedProduct } : p);
    return localProducts.find(p => p.id === id);
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (response.ok) return;
    throw new Error('API failed');
  } catch (error) {
    console.warn('Backend delete failed, using local store:', error.message);
    localProducts = localProducts.filter(p => p.id !== id);
  }
};
