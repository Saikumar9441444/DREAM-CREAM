// Dynamic API configurations based on environment
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const BACKEND_URL = isLocal 
  ? 'http://localhost:5000' 
  : 'https://dream-cream-s.onrender.com';

console.log('[API Config] Selected backend URL:', BACKEND_URL);
