import React, { useState, useRef, useEffect } from "react";
import { BsPersonCircle } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom"; 
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios"; 

const ProfileButton = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); 

  const [user, setUser] = useState({
    name: "Admin",
    isLoggedIn: true, 
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3001/api/logout", {}, { withCredentials: true });

      
      navigate("/");

      
      setTimeout(() => window.location.reload(), 500); 
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {user.isLoggedIn && (
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition"
        >
          <BsPersonCircle className="text-xl" />
          <span>{user.name}</span>
        </button>
      )}

      <AnimatePresence>
        {dropdownOpen && user.isLoggedIn && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-white text-gray-800 shadow-lg rounded-md border border-gray-300"
          >
            <ul className="p-2">
              <li className="p-2 hover:bg-gray-100 cursor-pointer">
                <Link to="/admin">Admin Panel</Link>
              </li>
              <li
                className="p-2 text-red-500 hover:bg-red-100 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileButton;
