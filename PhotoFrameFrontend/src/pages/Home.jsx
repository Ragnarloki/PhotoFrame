import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import Contact from "./Contact";
import HeroSection from "./HeroSection";
import { CardHoverEffectDemo } from "../components/CardHoverEffectDemo";
import { BackgroundBeamsWithCollision } from "../components/ui/background-beams-with-collision";
import API_URL from "../api";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/products`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <HeroSection />
     
      {/* Featured Products Section */}
      <div className="container mx-auto my-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-6">Our Best Collection</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products .slice(0, 4) .map((product) => <ProductCard key={product._id} product={product} />)
              ) : (
         <p className="text-center col-span-full text-gray-500">No products available</p>
         )}

        </div>
      </div>

      {/* About Us Section */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">Why Choose Us?</h2>
          <p className="mt-4 text-lg text-gray-700">We provide top-quality photo frames, mirrors, and custom-made designs to suit your needs.</p>
        </div>
      </div>

      <Contact />
      
      </div>
  );
};

export default Home;
