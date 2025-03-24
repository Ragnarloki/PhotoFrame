import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { GlobalContext } from "./context/GlobalContext";
import { getFavorites } from "../api";
import { FaHeart, FaSignOutAlt, FaEdit, FaSave, FaTrash, FaCamera, FaLock } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;
const DEFAULT_PROFILE_PIC = "https://th.bing.com/th/id/OIP.2wRpI007gG7aZqFRrBmGRwHaFP?w=270&h=191&c=7&r=0&o=5&dpr=1.4&pid=1.7";

function Profile() {
  const { user, setUser } = useContext(GlobalContext);
  const [favorites, setFavorites] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    name: user?.name || "",
    email: user?.email || "",
    profilePic: user?.profilePic || DEFAULT_PROFILE_PIC,
  });

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const favs = await getFavorites();
      setFavorites(favs);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("UserId");
    setUser(null);
    window.location.href = "/login";
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    try {
      await axios.put(`${API_URL}/api/auth/update-profile`, updatedUser, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setUser(updatedUser);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdatedUser({ ...updatedUser, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFavorite = (id) => {
    setFavorites(favorites.filter((fav) => fav._id !== id));
  };

  return (
    <div className="flex justify-center align-middle h-screen ">
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-lg mx-auto mb-20 p-6 bg-white shadow-lg rounded-lg mt-10"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Profile</h2>
        <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-2 rounded-md flex items-center gap-2">
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative">
          <img src={updatedUser.profilePic} alt="Profile" className="w-24 h-24 rounded-full border" />
          <label className="absolute bottom-0 right-0 bg-gray-800 p-1 rounded-full cursor-pointer">
            <FaCamera className="text-white" />
            <input type="file" className="hidden" onChange={handleProfilePicChange} />
          </label>
        </div>
        <div className="mt-4 text-center">
          {isEditing ? (
            <input type="text" className="border p-2 rounded-md w-full text-center" value={updatedUser.name} onChange={(e) => setUpdatedUser({ ...updatedUser, name: e.target.value })} />
          ) : (
            <h3 className="text-xl font-semibold">{updatedUser.name}</h3>
          )}

          {isEditing ? (
            <input type="email" className="border p-2 rounded-md w-full mt-2 text-center" value={updatedUser.email} onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })} />
          ) : (
            <p className="text-gray-600">{updatedUser.email}</p>
          )}
        </div>

        <div className="mt-4 flex gap-3">
          {isEditing ? (
            <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center gap-2">
              <FaSave /> Save
            </button>
          ) : (
            <button onClick={handleEdit} className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2">
              <FaEdit /> Edit Profile
            </button>
          )}
          <button className="bg-gray-500 text-white px-4 py-2 rounded-md flex items-center gap-2">
            <FaLock /> Change Password
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold">Favorite Products</h3>
        {favorites.length === 0 ? (
          <p className="text-gray-500 mt-2">No favorite products yet.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {favorites.map((product) => (
              <motion.li key={product._id} whileHover={{ scale: 1.05 }} className="p-3 border rounded-md flex justify-between items-center">
                <span>{product.name}</span>
                <div className="flex gap-3">
                  <FaHeart className="text-red-500" />
                  <FaTrash className="text-gray-500 cursor-pointer" onClick={() => removeFavorite(product._id)} />
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
    </div>
  );
}

export default Profile;
