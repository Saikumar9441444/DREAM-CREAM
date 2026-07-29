const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${BASE_URL}/api/orders`;

// Local fallback data
let localOrders = [];

let useLocal = false;

export const getOrders = async () => {
  if (useLocal) return [...localOrders];

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('API failed');
    const data = await response.json();
    if (data.length === 0) return [];
    return data;
  } catch (error) {
    console.warn('Backend unavailable, using local orders:', error.message);
    useLocal = true;
    return [...localOrders];
  }
};

export const addOrder = async (orderData) => {
  const newOrder = {
    ...orderData,
    id: orderData.id || `ORD-${Math.floor(Math.random() * 100000)}`,
    timestamp: new Date().toISOString()
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    });
    if (response.ok) return await response.json();
    throw new Error('API failed');
  } catch (error) {
    console.warn('Backend add failed, using local store:', error.message);
    localOrders = [newOrder, ...localOrders];
    return newOrder;
  }
};

export const updateOrderStatus = async (id, newStatus) => {
  try {
    const response = await fetch(`${API_URL}/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (response.ok) return await response.json();
    throw new Error('API failed');
  } catch (error) {
    console.warn('Backend update failed, using local store:', error.message);
    localOrders = localOrders.map(o => o.id === id ? { ...o, status: newStatus } : o);
    return localOrders.find(o => o.id === id);
  }
};

export const simulateNewOrder = async () => {
  const orderData = {
    customerName: 'Demo Customer ' + Math.floor(Math.random() * 100),
    phone: '555-010' + Math.floor(Math.random() * 9),
    address: '123 Test St',
    deliveryType: 'delivery',
    items: [
      { name: 'Classic Vanilla Bean', quantity: 2, price: 120 }
    ],
    totalAmount: 240,
    paymentMethod: 'UPI',
    status: 'new'
  };
  return await addOrder(orderData);
};
