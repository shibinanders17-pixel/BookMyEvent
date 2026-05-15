import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"
import { WishlistProvider } from "./context/WishlistContext"

import Home from "./pages/Home"
import Booking from "./pages/Booking"
import CartCheckout from "./pages/CartCheckout"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Services from "./pages/Services"
import ServiceDetails from "./pages/ServiceDetails"
import CustomerDashboard from "./pages/CustomerDashboard"
import BookingDetail from "./pages/BookingDetail"
import CustomRequestDetail from "./pages/CustomRequestDetail"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import NotFound from "./pages/NotFound"
import CustomRequest from "./pages/CustomRequest"
import Notifications from "./pages/Notifications"
import Availability from "./pages/Availability"

import AdminLogin from "./admin/AdminLogin"
import AdminDashboard from "./admin/AdminDashboard"
import AdminBookings from "./admin/AdminBookings"
import AdminUsers from "./admin/AdminUsers"
import AdminServices from "./admin/AdminServices"
import AdminAddService from "./admin/AdminAddService";
import AdminEditService from "./admin/AdminEditService";
import AdminSettings from "./admin/AdminSettings"
import AdminBookingDetail from "./admin/AdminBookingDetail"
import AdminProtectedRoutes from "./admin/AdminProtectedRoutes"
import AdminCustomRequests from "./admin/AdminCustomRequests"


const ConditionalLayout = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const hideFooterPages = ["/login", "/register", "/booking", "/dashboard", "/cart-checkout", "/custom-request"];
  const showFooter = !isAdmin && !hideFooterPages.includes(location.pathname) && !location.pathname.startsWith("/dashboard/bookings/") && !location.pathname.startsWith("/dashboard/requests/");

  return (
    <>
      {!isAdmin && <Navbar />}
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/cart-checkout" element={<CartCheckout />} />
        <Route path="/dashboard" element={<CustomerDashboard />} />
        <Route path="/dashboard/:tab" element={<CustomerDashboard />} />
        <Route path="/dashboard/bookings/:id" element={<BookingDetail />} />
        <Route path="/dashboard/requests/:id" element={<CustomRequestDetail />} />
        <Route path="/custom-request" element={<CustomRequest />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/availability" element={<Availability />} />
        <Route path="*" element={<NotFound />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<AdminProtectedRoutes />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/bookings/:id" element={<AdminBookingDetail />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/services/add" element={<AdminAddService />} />
          <Route path="/admin/services/edit/:id" element={<AdminEditService />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/custom-requests" element={<AdminCustomRequests />} />
        </Route>
      </Routes>
      {showFooter && <Footer />}
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            <ConditionalLayout />
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}