import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BackgroundBeamsWithCollision } from "../components/ui/background-beams-with-collision";
import { FaUser, FaEnvelope, FaLock, FaUserTag } from "react-icons/fa";
import { GlobalContext } from "../components/context/GlobalContext";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../components/firebase";
import { FcGoogle } from "react-icons/fc";
import { register } from '../api';
import LoadingScreen from "./LoadingScreen";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [adminPopup, setAdminPopup] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loader state

  const navigate = useNavigate();
  const { setUser } = useContext(GlobalContext);

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      setUser({
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      });

      localStorage.setItem("user", JSON.stringify(user));
      navigate("/");
    } catch (error) {
      setError("Google Sign-Up Failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);

    if (selectedRole === "admin") {
      setAdminPopup(true);
    } else {
      setAdminPassword("");
      setPassword("");
      setAdminPopup(false);
    }
  };

  const verifyAdminPassword = () => {
    const correctPassword = "12341234"; // Hardcoded admin password
    if (adminPassword === correctPassword) {
      setPassword(correctPassword);
      setAdminPopup(false);
    } else {
      setError("Incorrect admin password! Role set to User.");
      setRole("user"); // Reset to user if wrong password
      setAdminPopup(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loader

    try {
      await register({ name, email, password, role });
      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false); // Stop loader
    }
  };

  return (
    <BackgroundBeamsWithCollision>
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-lg p-8">
          {loading ? (
            <LoadingScreen />
          ) : (
            <>
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
                      disabled={role === "admin"}
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
                <Link to={"/login"} className="text-indigo-600 hover:underline">
                  Login here
                </Link>
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
            </>
          )}
        </div>
      </div>

      {/* Admin Password Modal */}
      {adminPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold text-gray-800">Admin Password</h2>
            <p className="text-gray-600 mt-2">Enter the admin password to continue</p>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full mt-2 p-2 border rounded-lg outline-none"
            />
            <div className="mt-4 flex justify-between">
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg" onClick={() => setAdminPopup(false)}>
                Cancel
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg" onClick={verifyAdminPassword}>
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </BackgroundBeamsWithCollision>
  );
};

export default Register;
