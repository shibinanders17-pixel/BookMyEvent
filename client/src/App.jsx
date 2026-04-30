import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"
import { WishlistProvider } from "./context/WishlistContext"
import Home from "./pages/Home"
import Booking from "./pages/Booking"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Services from "./pages/Services"
import ServiceDetails from "./pages/ServiceDetails"
import CustomerDashboard from "./pages/CustomerDashboard"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import NotFound from "./pages/NotFound"

const ConditionalFooter = () => {
  const location = useLocation();
  const hideFooterPages = ["/login", "/register", "/booking", "/dashboard"];
  if (hideFooterPages.includes(location.pathname)) return null;
  return <Footer />;
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:id" element={<ServiceDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/dashboard" element={<CustomerDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ConditionalFooter />
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}