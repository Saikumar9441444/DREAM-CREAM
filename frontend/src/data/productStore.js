const API_URL = 'http://localhost:5000/api/products';

export const getProducts = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch products');
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const addProduct = async (product) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

export const updateProduct = async (id, updatedProduct) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct)
    });
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

export const deleteProduct = async (id) => {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error(error);
  }
};
