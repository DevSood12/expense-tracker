import axios from 'axios';

const api = axios.create({
  // Dev: client/.env points at localhost:5000. Production: same origin, so '/api'.
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // Ensures httpOnly cookies are sent with every request
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;