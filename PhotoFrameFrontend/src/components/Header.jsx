import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState, useRef } from "react";
import { GlobalContext } from "./context/GlobalContext";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { Menu, X } from "lucide-react"; // Icons for the mobile menu

const Header = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(GlobalContext);
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const countdownInterval = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      setUser(null);
      setShowModal(false);
      navigate("/");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const resetCountdown = () => {
    if (countdownInterval.current) {
      clearInterval(countdownInterval.current);
      countdownInterval.current = null;
    }
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
        <Link to="/" className="text-xl font-bold">
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
        <nav className="hidden md:flex space-x-4">
          <Link to="/" className="hover:text-gray-200">Home</Link>
          {user?.role === "admin" && (
            <>
              <Link to="/upload" className="hover:text-gray-200">Upload Product</Link>
              <Link to="/dashboard" className="hover:text-gray-200">Dashboard</Link>
            </>
          )}
          {!user ? (
            <>
              <Link to="/login" className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-700">Login</Link>
              <Link to="/register" className="bg-green-500 px-3 py-1 rounded hover:bg-green-700">Register</Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-700"
            >
              Logout
            </button>
          )}
        </nav>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="md:hidden absolute top-16 left-0 w-full bg-indigo-700 text-white flex flex-col space-y-2 py-4 shadow-lg z-50">
          <Link to="/" className="px-4 py-2 hover:bg-indigo-500" onClick={() => setMenuOpen(false)}>Home</Link>
          {user?.role === "admin" && (
            <>
              <Link to="/upload" className="px-4 py-2 hover:bg-indigo-500" onClick={() => setMenuOpen(false)}>Upload Product</Link>
              <Link to="/dashboard" className="px-4 py-2 hover:bg-indigo-500" onClick={() => setMenuOpen(false)}>Dashboard</Link>
            </>
          )}
          {!user ? (
            <>
              <Link to="/login" className="px-4 py-2 bg-blue-500 text-center rounded hover:bg-blue-700" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="px-4 py-2 bg-green-500 text-center rounded hover:bg-green-700" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-center rounded hover:bg-red-700"
            >
              Logout
            </button>
          )}
        </nav>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
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
