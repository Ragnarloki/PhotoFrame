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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, setUser } = useContext(GlobalContext); 
  
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User Info:", user);

      setUser({
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      });
      const expirationTime = Date.now() +  30 * 60 * 1000; // Current time + 1 hour
  
      // Store user in local storage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("expiration", expirationTime);
  
      navigate("/");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
  
      const userData = {
        id: data.userId,
        name: data.name,
        email: data.email,
        role: data.role,
      };
  
      const expirationTime = Date.now() + 30 * 60 * 1000; // Current time + 1 hour
  
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("expiration", expirationTime);
  
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }
  
      setUser(userData);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
    }
  };
  

  return (
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