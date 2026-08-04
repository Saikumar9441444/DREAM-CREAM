const localHosts = ['localhost', '127.0.0.1', '192.168.1.7'];
const isLocal = localHosts.includes(window.location.hostname);

export const BACKEND_URL = isLocal 
  ? 'http://192.168.1.7:5000' 
  : 'https://dream-cream-backend.onrender.com';

console.log('[API Config] Selected backend URL:', BACKEND_URL);
