import { useEffect, useState } from 'react';
import { fetchProducts } from '../api';
import ProductCard from '../components/ProductCard';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        console.log("Fetched Products:", data);
        setProducts(data);
      })
      .catch((error) => console.error("Error fetching products:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative w-full h-full bg-gray-900 text-white">
      {/* Particle Background */}
     

      {/* Main Content */}
      <div className="relative flex flex-col items-center w-full min-h-screen pt-8 ">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold -mb-2 animate-fade-in text-center border-b-2 pb-2 border-gray-700 w-fit">
          Product Dashboard
        </h2>

        {/* Loading State */}
        {loading ? (
          <p className="text-gray-300 text-lg text-center animate-pulse">Loading products...</p>
        ) : (
           <div className="container mx-auto my-4 px-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.length > 0 ? (
                      products.map((product) => <ProductCard key={product._id} product={product} />)
                    ) : (
                      <p className="text-center col-span-full text-gray-500">No products available</p>
                    )}
                  </div>
                </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
