const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${BASE_URL}/api/settings`;

export const getSettings = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch settings');
    return await response.json();
  } catch (error) {
    console.error(error);
    // Return safe defaults if backend fails
    return {
      storeName: 'Cream Dream',
      whatsappNumber: '919014002314',
      openingHours: '10:00 AM - 11:00 PM',
      currency: '₹'
    };
  }
};

export const updateSettings = async (newSettings) => {
  try {
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings)
    });
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};
