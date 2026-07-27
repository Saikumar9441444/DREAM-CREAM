const MOCK_ORDERS = [
  {
    id: 'ORD-8921',
    customerName: 'Rahul Sharma',
    phone: '9876543210',
    items: [
      { name: 'Strawberry Dream', quantity: 2, price: 120 },
      { name: 'Classic Vanilla', quantity: 1, price: 90 }
    ],
    totalAmount: 330,
    status: 'new', // new, preparing, ready, completed, rejected
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2 mins ago
    prepTime: 0
  },
  {
    id: 'ORD-8922',
    customerName: 'Priya Patel',
    phone: '9876543211',
    items: [
      { name: 'Chocolate Fudge Brownie', quantity: 1, price: 150 }
    ],
    totalAmount: 150,
    status: 'preparing',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    prepTime: 10
  },
  {
    id: 'ORD-8923',
    customerName: 'Vikram Singh',
    phone: '9876543212',
    items: [
      { name: 'Mango Sorbet', quantity: 3, price: 150 }
    ],
    totalAmount: 450,
    status: 'ready',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    prepTime: 15
  }
];

export const getOrders = () => {
  const cached = localStorage.getItem('dream_cream_orders_db');
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      console.error('Failed to parse orders cache', e);
    }
  }
  
  // Initialize with mock orders if empty
  localStorage.setItem('dream_cream_orders_db', JSON.stringify(MOCK_ORDERS));
  return MOCK_ORDERS;
};

export const updateOrderStatus = (orderId, newStatus, prepTime = 0) => {
  const orders = getOrders();
  const updated = orders.map(order => 
    order.id === orderId 
      ? { ...order, status: newStatus, prepTime: prepTime > 0 ? prepTime : order.prepTime } 
      : order
  );
  localStorage.setItem('dream_cream_orders_db', JSON.stringify(updated));
  return updated;
};

// Function to simulate an incoming order
export const simulateNewOrder = () => {
  const orders = getOrders();
  const newOrder = {
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    customerName: 'Guest User',
    phone: '9999999999',
    items: [
      { name: 'Pistachio Delight', quantity: 1, price: 180 }
    ],
    totalAmount: 180,
    status: 'new',
    timestamp: new Date().toISOString(),
    prepTime: 0
  };
  const updated = [newOrder, ...orders];
  localStorage.setItem('dream_cream_orders_db', JSON.stringify(updated));
  return updated;
};

// Function to actually place a real user order
export const addOrder = (orderData) => {
  const orders = getOrders();
  const newOrder = {
    ...orderData,
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'new',
    timestamp: new Date().toISOString(),
    prepTime: 0
  };
  const updated = [newOrder, ...orders];
  localStorage.setItem('dream_cream_orders_db', JSON.stringify(updated));
  return newOrder;
};
