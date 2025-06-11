import axios from 'axios';
const token = localStorage.getItem('token') || sessionStorage.getItem('token');
export const configAPI = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});
