import React, { useState, useContext, useEffect } from "react";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import ProductDetailsModal from "./ProductDetailsModal";
import { Link } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar, FaHeart, FaEye, FaShoppingCart, FaTag, FaInfoCircle } from "react-icons/fa";
import { GlobalContext } from "./context/GlobalContext";
import { motion } from "framer-motion";

export default function ProductCard({ product }) {
  const { user, addToFavorites, favorites, removeFromFavorites, loading, addToCart } = useContext(GlobalContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [quickViewLoading, setQuickViewLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [discountDetails, setDiscountDetails] = useState({
    originalPrice: 0,
    discountPercentage: 0,
    finalPrice: product?.price || 0,
    youSave: 0,
  });
  
  // Generate accurate discount and pricing when the component mounts
  useEffect(() => {
    if (product?.price) {
      const basePrice = product.price;
  
      // Generate a random discount percentage
      let discountPercentage;
      const rand = Math.random();
  
      if (rand < 0.6) { // 60% chance for 10-30% discount
        discountPercentage = 10 + Math.floor(Math.random() * 20);
      } else if (rand < 0.9) { // 30% chance for 5-10% discount
        discountPercentage = 5 + Math.floor(Math.random() * 5);
      } else { // 10% chance for 30-50% discount
        discountPercentage = 30 + Math.floor(Math.random() * 20);
      }
  
      // Calculate the original price and final price without rounding
      const originalPrice = basePrice / (1 - discountPercentage / 100);
      const finalPrice = basePrice;
      const youSave = originalPrice - finalPrice;
  
      setDiscountDetails({
        originalPrice: originalPrice.toFixed(2), // Ensure precision with 2 decimal places
        discountPercentage,
        finalPrice: finalPrice.toFixed(2), // Ensure precision with 2 decimal places
        youSave: youSave.toFixed(2), // Ensure precision with 2 decimal places
      });
    }
 
  
    
    if (favorites?.length) {
      setIsWishlisted(favorites.includes(product?._id));
    }
  }, [favorites, product?._id, product?.price]);

  const toggleWishlist = async () => {
    if (!user) {
      alert("Please log in to add to favorites.");
      return;
    }
    setWishlistLoading(true);
    try {
      if (isWishlisted) {
        await removeFromFavorites(product._id);
      } else {
        await addToFavorites(product._id);
      }
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      alert("Please log in to add items to cart.");
      return;
    }
    setCartLoading(true);
    try {
      await addToCart(product._id, 1);
      setIsInCart(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setCartLoading(false);
    }
  };

  const openModal = () => {
    setQuickViewLoading(true);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
    setTimeout(() => setQuickViewLoading(false), 500);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const [rating] = useState(() => {
    if (!product?._id) return 4.0;
    const seed = product._id
      .toString()
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (3.5 + (seed % 15) / 10).toFixed(1);
  });

  const hasDiscount = discountDetails.discountPercentage > 0;


  return (
    <div className="h-full">
      <CardContainer className="w-full">
        <CardBody className="bg-gray-50 relative group/card dark:bg-black dark:border-white/[0.2] border-black/[0.1] 
          w-full sm:w-[18rem] md:w-[20rem] h-auto rounded-xl p-4 border shadow-lg transition-transform transform hover:scale-105 duration-300">
          
          {loading ? (
            <SkeletonCard />
          ) : (
            <>
            <div className="absolute top-3 left-3 z-20 flex flex-col gap-1">
              {hasDiscount && (
                <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md flex items-center">
                  <FaTag className="mr-1" />
                  {discountDetails.discountPercentage}% OFF
                </div>
              )}
              
              {/* Random special offers */}
              {Math.random() > 0.7 && (
                <div className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                  Free Shipping
                </div>
              )}
              
              {Math.random() > 0.8 && (
                <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                  Limited Stock
                </div>
              )}
            </div>
              <CardItem translateZ="50" className="w-full h-48 overflow-hidden rounded-lg relative">
                <img
                  src={product?.imageUrl || "default-image.jpg"}
                  alt={product?.name || "Unknown Product"}
                  className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-110"
                />
              </CardItem>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <CardItem translateZ="50" className="text-lg font-bold text-neutral-600 dark:text-white line-clamp-1">
                    {product?.name || "No Name Available"}
                  </CardItem>
                  <button
                    onClick={toggleWishlist}
                    className={`p-2 bg-white/80 rounded-full shadow-md transition-colors 
                      ${isWishlisted ? "bg-red-200 dark:bg-red-900" : "hover:bg-gray-200 dark:hover:bg-gray-700"}`}
                  >
                    <FaHeart className={`text-lg ${isWishlisted ? "text-red-500" : "text-gray-500 dark:text-gray-400"}`} />
                  </button>
                </div>

                <CardItem 
                  as="p" 
                  translateZ="60" 
                  className="text-neutral-500 text-sm dark:text-neutral-300 line-clamp-2 h-10"
                  title={product?.description || "No description available."}
                >
                  {product?.description || "No description available."}
                </CardItem>
              </div>

            
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center">
                  {generateStars(rating)}
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">{rating} / 5</span>
                </div>
                
                <div className="flex flex-col items-end">
                  {hasDiscount && (
                    <span className="text-xs text-gray-400 line-through">
                      ₹{discountDetails.originalPrice.toLocaleString()}
                    </span>
                  )}
                  <CardItem translateZ="50" className={`text-md font-semibold ${hasDiscount ? 'text-red-500' : 'text-blue-600'}`}>
                    ₹{discountDetails.finalPrice.toLocaleString()}
                  </CardItem>
              
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 gap-2">
  <CardItem 
    translateZ={20} 
    as="button"
    onClick={openModal}
    className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg transition-all duration-200 w-full flex items-center justify-center gap-2"
  >
    <FaInfoCircle className="text-sm" />
    View Details
  </CardItem>

  <CardItem translateZ={20} as="button" className="w-full">
    <Link
      to="/buy-now"
      state={{ product }}
      className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transition-all duration-200 w-full flex items-center justify-center gap-2"
    >
      <FaShoppingCart className="text-sm" />
      Buy Now
    </Link>
  </CardItem>
</div>
            </>
          )}
        </CardBody>
      </CardContainer>

      {isModalOpen && (
        <ProductDetailsModal 
          product={{
            ...product,
            originalPrice: discountDetails.originalPrice,
            discountPercentage: discountDetails.discountPercentage,
            youSave: discountDetails.youSave
          }} 
          closeModal={closeModal} 
        />
      )}
    </div>
  );
}

const generateStars = (rating) => {
  const stars = [];
  const adjustedRating = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0 && adjustedRating < 5;

  for (let i = 0; i < adjustedRating; i++) {
    stars.push(<FaStar key={i} className="text-yellow-400" />);
  }

  if (hasHalfStar) {
    stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
  }

  while (stars.length < 5) {
    stars.push(<FaRegStar key={stars.length} className="text-yellow-400" />);
  }

  return stars;
};

const SkeletonCard = () => (
  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 p-4 rounded-lg shadow-md h-full">
    <div className="h-48 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
    <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-500 rounded my-3"></div>
    <div className="h-3 w-5/6 bg-gray-300 dark:bg-gray-500 rounded my-2"></div>
    <div className="h-5 w-1/2 bg-gray-400 dark:bg-gray-400 rounded my-4"></div>
    <div className="flex justify-between mt-4">
      <div className="h-8 w-24 bg-gray-300 dark:bg-gray-500 rounded"></div>
      <div className="h-8 w-24 bg-gray-300 dark:bg-gray-500 rounded"></div>
    </div>
  </div>
);