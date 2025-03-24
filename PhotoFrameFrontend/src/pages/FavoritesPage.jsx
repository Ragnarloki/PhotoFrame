import React, { useContext, useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { GlobalContext } from "../components/context/GlobalContext";
import { getFavorites } from "../api";
import { motion } from "framer-motion";

export default function FavoritesPage() {
  const {  user } = useContext(GlobalContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [favorites, setFavorites] = useState([]);
  useEffect(() => {
    const fetchFavorites = async () => {
      if (user) {
        try {
          setLoading(true);
          const favoriteProducts = await getFavorites(user.id);
          setFavorites(favoriteProducts);
        } catch (error) {
          setError("Failed to load favorite products. Try again later.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFavorites();
  }, [user, setFavorites]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }} 
      className="container mx-auto p-6"
    >
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        ❤️ My Favorite Products
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(6)].map((_, index) => (
            <motion.div 
              key={index} 
              className="h-64 bg-gray-200 rounded-lg animate-pulse" 
            />
          ))}
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : favorites.length === 0 ? (
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.7 }} 
          className="text-center text-gray-500 text-lg"
        >
          No favorite products yet. Start adding some! 🚀
        </motion.p>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.5 }} 
          className="flex justify-evenly flex-wrap gap-6"
        >
          {favorites.map((product) => (
            <motion.div 
              key={product.id} 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
