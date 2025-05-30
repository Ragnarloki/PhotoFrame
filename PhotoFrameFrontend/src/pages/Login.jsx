import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BackgroundBeamsWithCollision } from "../components/ui/background-beams-with-collision";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { GlobalContext } from "../components/context/GlobalContext";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../components/firebase";
import { login } from "../api";
import LoadingScreen from "./LoadingScreen";  // Import the Loading Screen

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);  // Add loading state
  const navigate = useNavigate();
  const { user, setUser,setFavorites } = useContext(GlobalContext); 
  
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);  // Show loader
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // console.log("User Info:", user);

      setUser({
        id: user.userId,
        name: user.displayName,
        emails: user.email,
        photo: user.photoURL,
      });

      const expirationTime = Date.now() + 30 * 60 * 1000; // 30 mins expiration
  
      // Store user in local storage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("expiration", expirationTime);
  
      setTimeout(() => {
        setLoading(false); // Hide loader after login
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); // Show loader
      const data = await login(email, password);
  
      const userData = {
        id: data.userId,
        name: data.name,
        emails: data.email,
        role: data.role,
      };
  
      const expirationTime = Date.now() + 30 * 60 * 1000; // 30 mins expiration
  
      localStorage.setItem("UserId", data.userId);
  
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("expiration", expirationTime);
      localStorage.setItem("favorites", JSON.stringify(data.favorites));
      setFavorites(data.favorites);
      localStorage.setItem("email", data.email);

      localStorage.setItem("name", data.name);

      const token = localStorage.getItem("token");
      const role = localStorage.getItem("userRole");
      const UserId = localStorage.getItem("UserId");
      const emails = localStorage.getItem("email");
      const name = localStorage.getItem("name");
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }
  
      setTimeout(() => {
        setLoading(false); // Hide loader after login
        setUser({ role, token, UserId ,emails,name});        
        navigate("/");
      }, 2000);
    } catch (err) {
      setLoading(false);
      console.error("Login Error:", err);
      setError("Invalid email or password");
    }
  };

  return loading ? (
    <LoadingScreen />  // Show loader if loading is true
  ) : (
    <BackgroundBeamsWithCollision>
      <div className="min-h-screen flex items-center justify-center ">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form onSubmit={handleLogin}>
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
                />
              </div>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2"
                />
                <label className="text-gray-700">Remember Me</label>
              </div>
              <a href="/forgot-password" className="text-indigo-600 hover:underline">
                Forgot Password?
              </a>
            </div>
            <button className="w-full bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-all">
              Login
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-700">
              Don't have an account?{" "}
              <a href="/register" className="text-indigo-600 hover:underline">
                Register here
              </a>
            </p>
          </div>
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
                onClick={handleGoogleSignIn}
              >
                <FcGoogle className="mr-2" />
                <span>Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </BackgroundBeamsWithCollision>
  );
};

export default Login;
