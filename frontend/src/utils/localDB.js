import { products as initialProducts } from '../data/products';

const STORAGE_KEY = 'dream_cream_products';

export const getLocalProducts = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProducts));
    return initialProducts;
  }
  return JSON.parse(stored);
};

export const saveLocalProducts = (products) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const addLocalProduct = (product) => {
  const products = getLocalProducts();
  const newProduct = {
    ...product,
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    createdAt: new Date().toISOString()
  };
  const updated = [newProduct, ...products];
  saveLocalProducts(updated);
  return newProduct;
};

export const deleteLocalProduct = (id) => {
  const products = getLocalProducts();
  const updated = products.filter(p => p.id !== id);
  saveLocalProducts(updated);
  return updated;
};

export const updateLocalProduct = (id, updatedData) => {
  const products = getLocalProducts();
  const updated = products.map(p => p.id === id ? { ...p, ...updatedData } : p);
  saveLocalProducts(updated);
  return updated;
};
