const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${BASE_URL}/api/addons`;

// Local fallback data
let localAddons = [
  { id: 1, name: 'Rainbow Sprinkles', category: 'Toppings', price: 20, inStock: true },
  { id: 2, name: 'Chocolate Chips', category: 'Toppings', price: 25, inStock: true },
  { id: 3, name: 'Waffle Cone', category: 'Cones', price: 40, inStock: true },
  { id: 4, name: 'Sugar Cone', category: 'Cones', price: 20, inStock: true },
  { id: 5, name: 'Hot Fudge', category: 'Sauces', price: 30, inStock: true },
  { id: 6, name: 'Caramel Drizzle', category: 'Sauces', price: 30, inStock: false },
];

let useLocal = false;

export const getAddons = async () => {
  if (useLocal) return [...localAddons];

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('API failed');
    const data = await response.json();
    if (data.length === 0) {
      await fetch(`${API_URL}/seed`, { method: 'POST' });
      const seeded = await fetch(API_URL);
      return await seeded.json();
    }
    return data;
  } catch (error) {
    console.warn('Backend unavailable, using local addons:', error.message);
    useLocal = true;
    return [...localAddons];
  }
};

export const addAddon = async (addon) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addon)
    });
    if (response.ok) return await response.json();
    throw new Error('API failed');
  } catch (error) {
    console.warn('Backend add failed, using local store:', error.message);
    const newAddon = { ...addon, id: Date.now() };
    localAddons = [newAddon, ...localAddons];
    return newAddon;
  }
};

export const updateAddon = async (id, updatedAddon) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedAddon)
    });
    if (response.ok) return await response.json();
    throw new Error('API failed');
  } catch (error) {
    console.warn('Backend update failed, using local store:', error.message);
    localAddons = localAddons.map(a => a.id === id ? { ...a, ...updatedAddon } : a);
    return localAddons.find(a => a.id === id);
  }
};

export const deleteAddon = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (response.ok) return;
    throw new Error('API failed');
  } catch (error) {
    console.warn('Backend delete failed, using local store:', error.message);
    localAddons = localAddons.filter(a => a.id !== id);
  }
};
