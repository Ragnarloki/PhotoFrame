import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState, useRef } from "react";
import { GlobalContext } from "./context/GlobalContext";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

const Header = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(GlobalContext);
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const countdownInterval = useRef(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear(); // Clear all stored data
      setUser(null);
      setShowModal(false);
      navigate("/"); // Redirect to home page
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const resetCountdown = () => {
    if (countdownInterval.current) {
      clearInterval(countdownInterval.current);
      countdownInterval.current = null;
    }
    
    // Extend session by 30 minutes
    const newExpiration = Date.now() + 30 * 60 * 1000;
    localStorage.setItem("expiration", newExpiration.toString());

    setCountdown(5);
    setShowModal(false);
  };

  useEffect(() => {
    const checkExpiration = () => {
      const expiration = localStorage.getItem("expiration");
      if (!expiration) return;

      const timeLeft = parseInt(expiration) - Date.now();

      if (timeLeft <= 5000 && timeLeft > 0) {
        setShowModal(true);
        setCountdown(Math.ceil(timeLeft / 1000));

        if (!countdownInterval.current) {
          countdownInterval.current = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(countdownInterval.current);
                countdownInterval.current = null;
                setShowModal(false);
                handleLogout();
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      } else if (timeLeft <= 0) {
        setShowModal(false);
        handleLogout();
      }
    };

    const interval = setInterval(checkExpiration, 1000);
    return () => {
      clearInterval(interval);
      if (countdownInterval.current) {
        clearInterval(countdownInterval.current);
      }
    };
  }, []);

  return (
    <>
      <header className="bg-indigo-600 text-white p-4 flex justify-between items-center relative z-10">
        <Link to="/" className="text-xl font-bold">Thittani's Photo Frames</Link>
        <nav className="flex space-x-4">
          <Link to="/">Home</Link>
          {user?.role === "admin" && <Link to="/upload">Upload Product</Link>}
          {!user ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
          )}
        </nav>
      </header>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80 z-50">
            <h2 className="text-lg font-bold">Session Expiring</h2>
            <p className="mt-2 text-gray-700">
              You will be logged out in <span className="font-bold text-red-500">{countdown}</span> seconds.
            </p>
            <div className="mt-4 flex justify-center space-x-3">
              <button onClick={resetCountdown} className="bg-blue-500 text-white px-4 py-2 rounded">Stay Logged In</button>
              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Logout Now</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
