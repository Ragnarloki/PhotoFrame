import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL; // Use import.meta.env in Vite

export const login = async (email, password) => {
  const { data } = await axios.post(`${API_URL}/api/auth/login`, { email, password });
  localStorage.setItem('token', data.token);
  return data;
};

export const register = async (user) => {
  await axios.post(`${API_URL}/api/auth/register`, user);
};

export const fetchProducts = async () => {
  const { data } = await axios.get(`${API_URL}/api/products`);
  return data;
};

export const getProductById = async (id) => {
  const { data } = await axios.get(`${API_URL}/api/products/${id}`);
  return data;
};

export const uploadProduct = async (product, token) => {
  const config = { headers: { Authorization: token } };
  const { data } = await axios.post(`${API_URL}/api/products/upload`, product, config);
  return data;
};

export const updateProduct = async (id, updatedProduct, token) => {
  const config = { headers: { Authorization: token } };
  const { data } = await axios.put(`${API_URL}/api/products/edit/${id}`, updatedProduct, config);
  return data;
};

export const deleteProduct = async (id, token) => {
  const config = { headers: { Authorization: token } };
  await axios.delete(`${API_URL}/api/products/delete/${id}`, config);
};


export const addToFavorites = async (userId, productId) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/add-favorite`, { userId, productId });
    return response.data;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

// Remove from Favorites
export const removeFromFavorites = async (userId, productId) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/remove-favorite`, { userId, productId });
    return response.data;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

// Get Favorites
export const getFavorites = async () => {
  const UserId = localStorage.getItem("UserId");
   
  try {
    const response = await axios.get(`${API_URL}/api/auth/favorites/${UserId}`);
    return response.data.favorites;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
};

export default API_URL;
