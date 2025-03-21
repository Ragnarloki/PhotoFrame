import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "./context/GlobalContext";
import { useContext } from "react";

const Header = () => {
  const navigate = useNavigate();
   const { user, setUser } = useContext(GlobalContext); // Access context
    
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setUser(null);
    navigate("/");
  };

  return (
    <header className="bg-indigo-600 text-white p-4 flex justify-between items-center">
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
  );
};

export default Header;
