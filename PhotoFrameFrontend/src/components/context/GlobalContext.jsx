import React, { createContext, useEffect, useState } from "react";
import API_URL from "../../api";
import axios from "axios";

// Create a context
export const GlobalContext = createContext(null);

// Define the provider component
export default function Globalstate({ children }) {
    const [user, setUser] = useState(''); // State for user
    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("userRole");
        if (token && role) {
          setUser({ role });
        }
      }, []); 

      const [products, setProducts] = useState([]);
      const [loading, setLoading] = useState(true);
      const [filteredProducts, setFilteredProducts] = useState([]);
      
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
   
    return (
        <GlobalContext.Provider value={{ user, setUser,loading, setLoading , products, setProducts ,filteredProducts, setFilteredProducts}}>
            {children}
        </GlobalContext.Provider>
    );
}
