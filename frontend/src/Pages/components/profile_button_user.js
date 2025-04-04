import React, { useState, useRef, useEffect } from "react";
import { BsPersonCircle } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const ProfileButton = ({ user }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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
      {user ? (
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-full 
                     hover:bg-gray-200 transition shadow-md border border-gray-300"
        >
          <BsPersonCircle className="text-2xl text-gray-700" />
          <span className="font-semibold">{user.username}</span>
        </button>
      ) : (
        <Link
          to="/login"
          className="px-4 py-2 bg-blue-500 text-white rounded-full shadow-md border border-blue-600
                     hover:bg-blue-600 transition font-semibold"
        >
          Login
        </Link>
      )}

      <AnimatePresence>
        {dropdownOpen && user && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200"
          >
            <ul className="py-2">
              <li>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition"
                >
                  Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition"
                >
                  Logout
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileButton;