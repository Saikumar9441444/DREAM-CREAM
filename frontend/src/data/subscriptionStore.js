const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${BASE_URL}/api/subscriptions`;

const DEFAULT_PLANS = [
  {
    id: 'sub-1',
    name: 'Family Pack Weekly',
    price: 1499,
    frequency: 'Weekly',
    subscribers: 42,
    features: ['2 Family Tubs', '4 Waffle Cones', 'Free Toppings', 'Free Delivery'],
    popular: true
  },
  {
    id: 'sub-2',
    name: 'Couples Weekend',
    price: 899,
    frequency: 'Weekly',
    subscribers: 86,
    features: ['1 Family Tub', '2 Choco Cones', 'Free Delivery'],
    popular: false
  },
  {
    id: 'sub-3',
    name: 'Monthly Mega Box',
    price: 2499,
    frequency: 'Monthly',
    subscribers: 115,
    features: ['4 Premium Tubs', 'Assorted Popsicles', 'Secret New Flavor Sample'],
    popular: false
  }
];

let useLocal = false;
let localPlans = [...DEFAULT_PLANS];

export const getSubscriptions = async () => {
  if (useLocal) return [...localPlans];

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('API failed');
    const data = await response.json();
    if (data.length === 0) {
      // Seed default plans
      await fetch(`${API_URL}/seed`, { method: 'POST' });
      const seeded = await fetch(API_URL);
      return await seeded.json();
    }
    return data;
  } catch (error) {
    console.warn('Backend subscription API unavailable, using local mock data:', error.message);
    useLocal = true;
    return [...localPlans];
  }
};

export const addSubscription = async (plan) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan)
    });
    if (response.ok) return await response.json();
    throw new Error('API failed');
  } catch (error) {
    console.warn('Backend subscription add failed, using local store:', error.message);
    const newPlan = { ...plan, id: `sub-${Date.now()}` };
    localPlans = [newPlan, ...localPlans];
    return newPlan;
  }
};

export const updateSubscription = async (id, updatedPlan) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPlan)
    });
    if (response.ok) return await response.json();
    throw new Error('API failed');
  } catch (error) {
    console.warn('Backend subscription update failed, using local store:', error.message);
    localPlans = localPlans.map(p => p.id === id || p._id === id ? { ...p, ...updatedPlan } : p);
    return localPlans.find(p => p.id === id || p._id === id);
  }
};

export const deleteSubscription = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (response.ok) return;
    throw new Error('API failed');
  } catch (error) {
    console.warn('Backend subscription delete failed, using local store:', error.message);
    localPlans = localPlans.filter(p => p.id !== id && p._id !== id);
  }
};
