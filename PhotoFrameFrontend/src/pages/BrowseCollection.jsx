import { useEffect, useState } from "react";
import API_URL from "../api";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import { FaArrowUp } from "react-icons/fa";

const BrowseCollection = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");
  const [showScroll, setShowScroll] = useState(false);

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

  useEffect(() => {
    let filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (selectedCategory !== "All") {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }
    if (sortOrder === "priceLowToHigh") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "priceHighToLow") {
      filtered.sort((a, b) => b.price - a.price);
    }
    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, sortOrder, products]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSortOrder("default");
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative w-full  min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 text-white">
      <div className="relative flex flex-col items-center w-full pt-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in text-center border-b-2 pb-2 border-white w-fit">
          Explore Our Collection
        </h2>

        {/* Filters Section */}
        <div className="flex flex-wrap  justify-center gap-4 mt-6 w-full max-w-4xl px-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-80 px-4 py-2 text-white bg-gray-800 rounded-md border-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            className="px-4 py-2 rounded-md text-white bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Frames">Frames</option>
            <option value="Glass">Glass</option>
            <option value="Mirrors">Mirrors</option>
          </select>

          <select
            className="px-4 py-2 rounded-md text-white bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="default">Sort by</option>
            <option value="priceLowToHigh">Price: Low to High</option>
            <option value="priceHighToLow">Price: High to Low</option>
          </select>

          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Clear Filters
          </button>
        </div>

        {/* Product Display Section */}
        <div className="container mx-auto mb-20 my-8 px-4 flex flex-col flex-grow">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center col-span-full text-gray-300 mt-6 mb-4">
              No products match your search criteria.
            </p>
          )}
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScroll && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-md"
        >
          <FaArrowUp size={24} />
        </button>
      )}
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
);

export default BrowseCollection;
