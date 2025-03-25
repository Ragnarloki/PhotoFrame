import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UploadProduct from './pages/UploadProduct';
import Home from './pages/Home';
import { useContext, useEffect, useState } from 'react';
import BuyNow from './components/BuyNow';
import { GlobalContext } from './components/context/GlobalContext';
import BrowseCollection from './pages/BrowseCollection';
import Footer from './pages/Footer';
import EditProduct from './pages/EditProducts';
import Cart from './components/Cart';
import Profile from './components/Profile';
import FavoritesPage from './pages/FavoritesPage';
import Button from './pages/button';
import ProductDetailsModal from './components/ProductCard';

const App = () =>{  
 const { user, setUser } = useContext(GlobalContext); // Access context
 

  return (
  
  <BrowserRouter>
    <Header />
   
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/button" element={<Button />} />
      
      {user?.role === "admin" &&   <Route path="/dashboard" element={<Dashboard />} />}
      <Route path="/BrowseCollection" element={<BrowseCollection />} />
      
      <Route path="/login" element={<Login />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      <Route path="/productDetails" element={<ProductDetailsModal />} />
      
        <Route path="/register" element={<Register />} />
        {user?.role === "admin" && <Route path="/upload" element={<UploadProduct />} />}
        <Route path="/edit/:id" element={<EditProduct />} />

      <Route path="/buy-now" element={<BuyNow />} />
    </Routes>
    <Footer />
  </BrowserRouter>
);
}
export default App;
