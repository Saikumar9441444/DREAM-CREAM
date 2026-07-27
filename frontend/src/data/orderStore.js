const API_URL = 'http://localhost:5000/api/orders';

export const getOrders = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const addOrder = async (orderData) => {
  try {
    // Generate a quick ID on frontend for optimistic UI if needed, but backend will handle real ID
    const newOrder = {
      ...orderData,
      id: `ORD-${Math.floor(Math.random() * 100000)}`
    };
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    });
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

export const updateOrderStatus = async (id, newStatus) => {
  try {
    const response = await fetch(`${API_URL}/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

export const simulateNewOrder = async () => {
  // Mock order for demo purposes
  const orderData = {
    customerName: "Alex " + Math.floor(Math.random() * 100),
    phone: "555-010" + Math.floor(Math.random() * 9),
    address: "123 Main St",
    deliveryType: "delivery",
    items: [
      { name: "Classic Vanilla Bean", quantity: 2, price: 120 }
    ],
    totalAmount: 240,
    paymentMethod: "UPI"
  };
  return await addOrder(orderData);
};
