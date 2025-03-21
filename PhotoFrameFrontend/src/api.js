import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL; // Use import.meta.env in Vite

export const login = async (email, password) => {
  const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
  localStorage.setItem('token', data.token);
  return data;
};

export const register = async (user) => {
  await axios.post(`${API_URL}/auth/register`, user);
};

export const fetchProducts = async () => {
  const { data } = await axios.get(`${API_URL}/products`);
  return data;
};

export const uploadProduct = async (product, token) => {
  const config = { headers: { Authorization: token } };
  const { data } = await axios.post(`${API_URL}/products/upload`, product, config);
  return data;
};