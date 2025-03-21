import { useEffect, useState } from 'react';
import { fetchProducts } from '../api';  // Ensure this function is correctly defined in ../api
import ProductCard from '../components/ProductCard';
import axios from 'axios';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get("https://photoframe-1.onrender.com/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } 
    };

    getProducts();
  }, []);

  return (
    <div className="relative w-full h-full  text-black">
      <div className="relative flex flex-col items-center w-full  pt-8">
        <h2 className="text-3xl md:text-4xl font-bold -mb-2 animate-fade-in text-center border-b-2 pb-2 border-gray-700 w-fit">
          Product Dashboard
        </h2>


          <div className="container mx-auto my-4 px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.length > 0 ? (
                products.map((product) => <ProductCard key={product._id} product={product} />)
              ) : ( 
                
                <p className="text-center col-span-full text-gray-500">No products available</p>
              )}
            </div>
          </div>
        
      </div>
    </div>
  );
};

export default Dashboard;
