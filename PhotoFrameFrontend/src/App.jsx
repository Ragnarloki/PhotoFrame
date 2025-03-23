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
const App = () =>{  
 const { user, setUser } = useContext(GlobalContext); // Access context
 

  return (
  
  <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      {user?.role === "admin" &&   <Route path="/dashboard" element={<Dashboard />} />}
      <Route path="/BrowseCollection" element={<BrowseCollection />} />
      
      <Route path="/login" element={<Login />} />
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
