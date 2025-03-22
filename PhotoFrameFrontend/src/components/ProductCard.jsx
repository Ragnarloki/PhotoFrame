import React, { useState, useEffect } from "react";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import ProductDetailsModal from "./ProductDetailsModal";
import { Link } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export default function ProductCard({ product }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      setRating((Math.random() * 2 + 3).toFixed(1)); // Random rating between 3.0 - 5.0
    }, 1500);
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <div className="-mb-28 h-full">
      <CardContainer className="inter-var w-full">
        <CardBody className="bg-gray-50 relative group/card dark:bg-black dark:border-white/[0.2] border-black/[0.1] 
          w-full sm:w-[18rem] md:w-[20rem] h-auto rounded-xl p-4 border shadow-lg transition-transform transform hover:scale-105 duration-300">
          
          {isLoading ? (
            <SkeletonCard />
          ) : (
            <>
              <CardItem translateZ="50" className="w-full h-48 overflow-hidden rounded-lg">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-110"
                />
              </CardItem>

              <div className="mt-4 space-y-2">
                <CardItem translateZ="50" className="text-lg font-bold text-neutral-600 dark:text-white text-center">
                  {product.name}
                </CardItem>

                <CardItem as="p" translateZ="60" className="text-neutral-500 text-sm dark:text-neutral-300 text-center">
                  {product.description}
                </CardItem>
              </div>

              {/* Rating System */}
              <div className="flex justify-center items-center mt-2">
                {generateStars(rating)}
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">{rating} / 5</span>
              </div>

              {/* Stock Status */}
              <CardItem translateZ="50" className={`text-md font-semibold text-center mt-2 ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                {product.stock > 0 ? "Out of Stock" : "In Stock"}
              </CardItem>

              <CardItem translateZ="50" className="text-md font-semibold text-blue-600 text-center mt-2">
                ₹{product.price}
              </CardItem>

              <div className="flex justify-between items-center mt-4">
                <CardItem translateZ={20} as="button"
                  onClick={openModal}
                  className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-200 dark:bg-gray-800 dark:text-white text-gray-700 hover:bg-gray-300 dark:hover:bg-gray-700 transition">
                  View Details
                </CardItem>

                <CardItem translateZ={20} as="button">
                  <Link
                    to="/buy-now"
                    state={{ product }}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold hover:shadow-lg hover:border-2 hover:border-white transition duration-300">
                    Buy Now
                  </Link>
                </CardItem>
              </div>
            </>
          )}
        </CardBody>
      </CardContainer>

      {isModalOpen && <ProductDetailsModal product={product} closeModal={closeModal} />}
    </div>
  );
}

// Skeleton Loader
const SkeletonCard = () => {
  return (
    <div className="animate-pulse">
      <div className="w-full h-48 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 my-3 mx-auto"></div>
      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6 my-2 mx-auto"></div>
      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-4/6 my-2 mx-auto"></div>
      <div className="h-5 bg-gray-400 dark:bg-gray-600 rounded w-1/2 my-4 mx-auto"></div>
      <div className="flex justify-between items-center mt-4">
        <div className="h-8 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-8 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );
};

// Function to Generate Star Ratings
const generateStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
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
