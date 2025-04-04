import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMessageCircle, FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import ProfileButtonAdmin from "./ProfileButton";
import ProfileButtonInvestor from "./profile_button_user";
import logo from "../Assets/logo.png";

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full px-6 py-4 flex justify-between items-center z-50 shadow-md 
                 bg-gradient-to-r from-purple-500 to-white"
    >
      {/* Logo */}
      <div>
        <Link to="/">
          <img src={logo} alt="Logo" className="h-24 md:h-26" />
        </Link>
      </div>

      {/* Navigation Links */}
      <ul className="hidden md:flex space-x-6 font-semibold text-gray-800">
        {[
          { name: "Home", path: "/" },
          { name: "News", path: "/news" },
          { name: "Ads", path: "/ads" },
          { name: "About", path: "/about" }
        ].map((item, index) => (
          <motion.li key={index} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link to={item.path} className="hover:text-gray-600 transition">
              {item.name}
            </Link>
          </motion.li>
        ))}
      </ul>

      {/* Search Bar, Profile, and Chatbot */}
      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-full bg-gray-100 text-gray-700 
                       focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
          />
          <FiSearch className="absolute left-3 top-3 text-gray-500" />
        </div>

        {/* Profile Button - Only Show If Logged In */}
        {user && user.role === "admin" && <ProfileButtonAdmin />}
        {user && user.role === "investor" && <ProfileButtonInvestor user={user} />}

        {/* Chatbot Button */}
        <motion.button
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
          onClick={() => navigate("/chatbot")}
        >
          <FiMessageCircle className="text-xl text-gray-700" />
        </motion.button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
