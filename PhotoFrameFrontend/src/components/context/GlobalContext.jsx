import React, { createContext, useEffect, useState } from "react";
import API_URL from "../../api";
import axios from "axios";

// Create a context
export const GlobalContext = createContext(null);

// Define the provider component
export default function Globalstate({ children }) {
  const [user, setUser] = useState(null); // State for user
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [favorites, setFavorites] = useState([]); // State for favorites

  // Helper function to safely parse JSON
  const safeParseJSON = (value, defaultValue) => {
    try {
      return value && value !== "undefined" ? JSON.parse(value) : defaultValue;
    } catch (error) {
      return defaultValue;
    }
  };

  // Fetch user data and favorites from localStorage on initial load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    const storedFavorites = localStorage.getItem("favorites");
    const storedUser = localStorage.getItem("user");
    const UserId = localStorage.getItem("UserId");
    const emails = localStorage.getItem("email");
    const name = localStorage.getItem("name");
  
    // Safe parsing to prevent errors
    const parsedFavorites = safeParseJSON(storedFavorites, []);
    const parsedUser = safeParseJSON(storedUser, null);

    if (token && role && UserId) {
      setUser({ role, token, UserId ,emails,name});
      fetchFavoritesFromDB(UserId); 
      setFavorites(parsedFavorites);
      // console.log(parsedFavorites)// Fetch favorites from the database
    }
  }, []);

  // Fetch products
  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/products`);
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  // Fetch favorites from the database
  const fetchFavoritesFromDB = async (userId) => {
    if (!userId) return; // Prevent making a request if userId is not available
    try {
      const response = await axios.get(`${API_URL}/api/auth/favorites/${userId}`);
      const favoritesFromDB = response.data.favorites;
    //   setFavorites(favoritesFromDB); // Update favorites state
    //    console.log("Favorites from DB:", favoritesFromDB);
    // //   localStorage.setItem("favorites", JSON.stringify(favoritesFromDB)); // Save to localStorage
     } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };
  //  console.log(favorites)
  // Add product to favorites
  const addToFavorites = async (productId) => {
    if (!user?.UserId) {
      alert("Please log in to add to favorites.");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/auth/add-favorite`, {
        userId: user.UserId,
        productId,
      });
      const updatedFavorites = [...favorites, productId];
      setFavorites(updatedFavorites); // Update favorites state
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Save to localStorage
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  // Remove product from favorites
  const removeFromFavorites = async (productId) => {
    if (!user?.UserId) {
      alert("Please log in to remove from favorites.");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/auth/remove-favorite`, {
        userId: user.UserId,
        productId,
      });
      const updatedFavorites = favorites.filter((id) => id !== productId);
      setFavorites(updatedFavorites); // Update favorites state
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Save to localStorage
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  };

  // Check if a product is in favorites
  const isFavorite = (productId) => favorites.includes(productId);

  return (
    <GlobalContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        setFavorites,
        user,
        setUser,
        loading,
        setLoading,
        products,
        setProducts,
        filteredProducts,
        setFilteredProducts,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
