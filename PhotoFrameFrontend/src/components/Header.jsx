import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState, useRef } from "react";
import { GlobalContext } from "./context/GlobalContext";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { Menu, X, User, Heart } from "lucide-react"; // Icons for the mobile menu
import { motion } from "framer-motion";
import axios from "axios";
import { getProductById } from "../api"; // Import the function to fetch product details

const Header = () => {
  const navigate = useNavigate();
  const { user, setUser, favorites } = useContext(GlobalContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showFavoritesDropdown, setShowFavoritesDropdown] = useState(false);
  const [favoriteProducts, setFavoriteProducts] = useState([]);

  const profileRef = useRef(null);
  const favoritesRef = useRef(null);

  useEffect(() => {
    // Fetch details of favorite products when the dropdown is opened
    const fetchFavorites = async () => {
      try {
        const products = await Promise.all(
          favorites.map((id) => getProductById(id))
        );
        setFavoriteProducts(products);
      } catch (error) {
        console.error("Error fetching favorite products:", error);
      }
    };

    if (showFavoritesDropdown) {
      fetchFavorites();
    }
  }, [showFavoritesDropdown, favorites]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (favoritesRef.current && !favoritesRef.current.contains(event.target)) {
        setShowFavoritesDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex justify-between items-center relative z-10 shadow-lg">
      <Link to="/" className="text-xl font-bold hover:text-gray-200 transition-colors">
        Thittani's Photo Frames
      </Link>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-white focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-4 items-center">
        <Link to="/" className="hover:text-gray-200 transition-colors">Home</Link>
        {user?.role === "admin" && (
          <>
            <Link to="/upload" className="hover:text-gray-200 transition-colors">Upload Product</Link>
            <Link to="/dashboard" className="hover:text-gray-200 transition-colors">Dashboard</Link>
          </>
        )}
        {!user ? (
          <>
            <Link to="/login" className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-700 transition-colors">Login</Link>
            <Link to="/register" className="bg-green-500 px-3 py-1 rounded hover:bg-green-700 transition-colors">Register</Link>
          </>
        ) : (
          <>
            {/* Profile Dropdown */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center hover:text-gray-200 transition-colors"
              >
                <User size={24} className="mr-2" />
                {user.name}
              </button>
              {showProfileDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-10 right-0 bg-white text-gray-800 rounded-lg shadow-lg py-2 w-48"
                >
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </div>

            {/* Favorites Dropdown */}
            <div ref={favoritesRef} className="relative">
              <button
                onClick={() => setShowFavoritesDropdown(!showFavoritesDropdown)}
                className="hover:text-gray-200 transition-colors"
              >
                <Heart size={24} />
              </button>
              {showFavoritesDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-10 right-0 bg-white text-gray-800 rounded-lg shadow-lg py-2 w-48"
                >
                  {favoriteProducts.length > 0 ? (
                    favoriteProducts.map((item) => (
                      <div key={item.id} className="block px-4 py-2 hover:bg-gray-100">
                        {item.name}
                      </div>
                    ))
                  ) : (
                    <p className="px-4 py-2 text-gray-500">No favorites yet</p>
                  )}
                  <Link to="/favorites" className="block px-4 py-2 hover:bg-gray-100">View All</Link>
                </motion.div>
              )}
            </div>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
