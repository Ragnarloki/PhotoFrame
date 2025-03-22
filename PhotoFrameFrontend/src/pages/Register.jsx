import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BackgroundBeamsWithCollision } from "../components/ui/background-beams-with-collision";
import { FaUser, FaEnvelope, FaLock, FaUserTag } from "react-icons/fa";
import { GlobalContext } from "../components/context/GlobalContext";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../components/firebase";
import { FcGoogle } from "react-icons/fc";

import { register } from '../api';

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default role is 'user'
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [adminPopup, setAdminPopup] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(GlobalContext);

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Registered User:", user);

      setUser({
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      });

      localStorage.setItem("user", JSON.stringify(user));
      navigate("/");
    } catch (error) {
      console.error("Google Sign-Up Error:", error);
    }
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);

    if (selectedRole === "admin") {
      setAdminPopup(true);
    } else {
      setPassword(""); // Clear password if another role is selected
    }
  };

  const verifyAdminPassword = () => {
    const correctPassword = "12341234"; // Hardcoded admin password
    if (adminPassword === correctPassword) {
      setPassword(correctPassword);
      setAdminPopup(false);
    } else {
      alert("Incorrect admin password!");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await register({ name, email, password, role });
      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <BackgroundBeamsWithCollision>
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Register</h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Name</label>
              <div className="flex items-center border rounded-lg p-2">
                <FaUser className="text-gray-500 mr-2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full outline-none"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <div className="flex items-center border rounded-lg p-2">
                <FaEnvelope className="text-gray-500 mr-2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full outline-none"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Password</label>
              <div className="flex items-center border rounded-lg p-2">
                <FaLock className="text-gray-500 mr-2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full outline-none"
                  required
                  disabled={role === "admin"} // Disable input when role is admin
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Role</label>
              <div className="flex items-center border rounded-lg p-2">
                <FaUserTag className="text-gray-500 mr-2" />
                <select
                  value={role}
                  onChange={handleRoleChange}
                  className="w-full outline-none"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <button className="w-full bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-all">
              Register
            </button>
          </form>

          <p className="text-center mt-4 text-gray-700">
            Already have an account?{" "}
            <a href="/login" className="text-indigo-600 hover:underline">
              Login here
            </a>
          </p>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <button
                className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm hover:bg-gray-50 transition-all"
                onClick={handleGoogleSignUp}
              >
                <FcGoogle className="mr-2" />
                <span>Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold text-green-600">Registration Successful!</h2>
            <p className="text-gray-600 mt-2">Redirecting to login...</p>
          </div>
        </div>
      )}

      {/* Admin Password Popup */}
      {adminPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold text-red-600">Admin Access Required</h2>
            <p className="text-gray-600 mt-2">Enter the admin password to proceed:</p>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="border p-2 rounded-lg mt-2"
            />
            <button className="bg-indigo-600 text-white p-2 rounded-lg mt-4" onClick={verifyAdminPassword}>
              Verify
            </button>
          </div>
        </div>
      )}
    </BackgroundBeamsWithCollision>
  );
};

export default Register;
