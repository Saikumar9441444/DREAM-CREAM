import { STATIC_PRODUCTS } from './staticProducts';

const STORAGE_KEY = 'dream_cream_products_db';

export const getProducts = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing stored products', e);
    }
  }
  // Initialize if empty
  localStorage.setItem(STORAGE_KEY, JSON.stringify(STATIC_PRODUCTS));
  return STATIC_PRODUCTS;
};

export const saveProducts = (products) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const addProduct = (product) => {
  const products = getProducts();
  const newProduct = { ...product, id: Date.now().toString() };
  products.unshift(newProduct); // Add to top
  saveProducts(products);
  return products;
};

export const updateProduct = (updatedProduct) => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === updatedProduct.id || p._id === updatedProduct._id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedProduct };
    saveProducts(products);
  }
  return products;
};

export const deleteProduct = (id) => {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id && p._id !== id);
  saveProducts(filtered);
  return filtered;
};
