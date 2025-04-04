import React, { useState, useRef, useEffect } from "react";
import { BsList } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const CompanyProfileButton = () => {
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
      await axios.post("http://localhost:3001/api/company/logout", {}, { withCredentials: true });
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center px-2 py-1 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition"
      >
        <BsList className="text-xl" />
      </button>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute left-full top-0 ml-2 w-40 bg-white text-gray-800 shadow-lg rounded-md border border-gray-300"
          >
            <ul className="p-1">
              <li className="px-3 py-2 text-sm hover:bg-blue-100 cursor-pointer rounded-md">
                <Link to="/company_management">Profile Management</Link>
              </li>
              <li className="px-3 py-2 text-sm hover:bg-blue-100 cursor-pointer rounded-md">
                <Link to="/sales">Sales Management</Link>
              </li>
              <li className="px-3 py-2 text-sm hover:bg-blue-100 cursor-pointer rounded-md">
                <Link to="/ads_management">Ads Management</Link>
              </li>
              <li
                onClick={handleLogout}
                className="px-3 py-2 text-sm text-red-500 hover:bg-red-100 cursor-pointer rounded-md"
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

export default CompanyProfileButton;