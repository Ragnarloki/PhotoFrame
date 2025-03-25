import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import Contact from "./Contact";
import HeroSection from "./HeroSection";
import { CardHoverEffectDemo } from "../components/CardHoverEffectDemo";
import { BackgroundBeamsWithCollision } from "../components/ui/background-beams-with-collision";
import API_URL from "../api";
import { FaStar, FaArrowRight } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { GlobalContext } from "../components/context/GlobalContext";


const Home = () => {
  
  const [products, setProducts] = useState([]);
  const {loading, setLoading} = useContext(GlobalContext);
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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div>
      {/* Hero Section */}
      <HeroSection />
      
      {/* Featured Products Section */}
      <div className="container mx-auto my-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-6">Our Best Collection</h2>
        {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : 
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products .slice(0, 4) .map((product) => <ProductCard key={product._id} product={product} />)
              ) : (
         <p className="text-center col-span-full text-gray-500">No products available</p>
         )}

          </div>}
      </div>
      
      {/* About Us Section */}
      <div className="bg-gray-100 py-12 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold">Why Choose Us?</h2>
          <p className="mt-4 text-lg text-gray-700">
            We provide top-quality photo frames, mirrors, and custom-made designs to suit your needs.
          </p>
        </div>
      </div>
      
      {/* Testimonials Section */}
      <div className="bg-gray-900 text-white py-12 text-center">
  <h2 className="text-4xl font-bold mb-6">Customer Reviews</h2>
  <div className="flex flex-wrap justify-center gap-6">
    {[
      { name: "Arun Kumar", review: "Beautiful frames and great quality! Highly recommend.", rating: 5 },
      { name: "Priya Sharma", review: "Loved the custom design, exactly what I wanted.", rating: 4 },
      { name: "Rahul Mehta", review: "Fast delivery and excellent service.", rating: 5 },
      { name: "Sneha Reddy", review: "Affordable prices with premium quality.", rating: 4 },
    
    ].map((customer, index) => (
      <div key={index} className="bg-gray-800 p-6 rounded-lg w-80 shadow-lg">
        <p className="italic">"{customer.review}"</p>
        <div className="mt-4 flex justify-center text-yellow-400">
          {[...Array(customer.rating)].map((_, i) => (
            <FaStar key={i} />
          ))}
        </div>
        <p className="mt-2 font-bold">- {customer.name}</p>
      </div>
    ))}
  </div>
</div>

      
      <Contact />
    </div>
  );
};
const SkeletonCard = () => (
  <div className="animate-pulse bg-gray-700 p-4 rounded-lg shadow-md">
    <div className="h-48 bg-gray-600 rounded-md"></div>
    <div className="h-4 w-3/4 bg-gray-500 rounded my-3"></div>
    <div className="h-3 w-5/6 bg-gray-500 rounded my-2"></div>
    <div className="h-5 w-1/2 bg-gray-400 rounded my-4"></div>
    <div className="flex justify-between mt-4">
      <div className="h-8 w-24 bg-gray-500 rounded"></div>
      <div className="h-8 w-24 bg-gray-500 rounded"></div>
    </div>
  </div>
)
export default Home;
