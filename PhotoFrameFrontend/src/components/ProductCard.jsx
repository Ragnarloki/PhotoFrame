import React, { useState, useEffect } from "react";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import ProductDetailsModal from "./ProductDetailsModal";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Disable scrolling
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto"; // Enable scrolling
  };

  return (
    <div className="-mb-28 h-full">
      <CardContainer className="inter-var w-full">
        <CardBody className="bg-gray-50 relative group/card dark:bg-black dark:border-white/[0.2] border-black/[0.1] 
          w-full sm:w-[18rem] md:w-[20rem] h-auto rounded-xl p-4 border shadow-lg transition-transform transform hover:scale-105 duration-300">
          
          {/* Show Skeleton Loader while Loading */}
          {isLoading ? (
            <SkeletonCard />
          ) : (
            <>
              {/* Product Image */}
              <CardItem translateZ="50" className="w-full h-48 overflow-hidden rounded-lg">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-110"
                />
              </CardItem>

              {/* Product Info */}
              <div className="mt-4 space-y-2">
                <CardItem translateZ="50" className="text-lg font-bold text-neutral-600 dark:text-white text-center">
                  {product.name}
                </CardItem>
                <CardItem as="p" translateZ="60" className="text-neutral-500 text-sm dark:text-neutral-300 text-center">
                  {product.description}
                </CardItem>
              </div>

              {/* Product Price */}
              <CardItem translateZ="50" className="text-md font-semibold text-blue-600 text-center mt-2">
                ₹{product.price}
              </CardItem>

              {/* CTA Buttons */}
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
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-bold hover:shadow-lg transition duration-300">
                    Buy Now
                  </Link>
                </CardItem>
              </div>
            </>
          )}
        </CardBody>
      </CardContainer>

      {/* Product Details Modal */}
      {isModalOpen && <ProductDetailsModal product={product} closeModal={closeModal} />}
    </div>
  );
}

// Skeleton Loader Component
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
