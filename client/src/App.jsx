
import React from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import { AuthProvider } from "./context/AuthContext" 
import { CartProvider } from "./context/CartContext"

import Home from "./pages/Home"
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails"
import CustomerDashboard from "./pages/CustomerDashboard"
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"

export default function App() {
  return (
    <AuthProvider>
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/services" element={<Services/>}/>
          <Route path="/services/:id" element={<ServiceDetails/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/booking" element={<Booking/>} />
          <Route path="/dashboard" element={<CustomerDashboard/>}/>
        </Routes>
        <Footer />
      </BrowserRouter>
    </CartProvider>
  </AuthProvider>
  )
}