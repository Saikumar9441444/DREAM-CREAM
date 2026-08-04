import { BACKEND_URL } from '../utils/apiConfig';
const BASE_URL = import.meta.env.VITE_API_URL || BACKEND_URL;
const API_URL = `${BASE_URL}/api/enquiries`;

export const getEnquiries = async () => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch enquiries');
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const createEnquiry = async (enquiryData) => {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiryData)
    });
    if (!res.ok) throw new Error('Failed to create enquiry');
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const updateEnquiry = async (id, updateData) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    if (!res.ok) throw new Error('Failed to update enquiry');
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};
