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
      {/* Toggle Button */}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-[#1f2937] text-white rounded-lg shadow-md hover:bg-[#374151] transition duration-200"
      >
        <BsList className="text-2xl" />
        <span className="hidden md:inline text-sm font-medium">Menu</span>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-full top-0 ml-3 w-48 bg-[#111827] text-white shadow-2xl rounded-xl z-50 border border-gray-700"
          >
            <ul className="p-2">
              <li>
                <Link
                  to="/company_management"
                  className="block px-4 py-2 rounded-md text-sm hover:bg-[#1f2937] transition"
                >
                  Profile Management
                </Link>
              </li>
              <li>
                <Link
                  to="/sales"
                  className="block px-4 py-2 rounded-md text-sm hover:bg-[#1f2937] transition"
                >
                  Sales Management
                </Link>
              </li>
              <li>
                <Link
                  to="/ads_management"
                  className="block px-4 py-2 rounded-md text-sm hover:bg-[#1f2937] transition"
                >
                  Ads Management
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 rounded-md text-sm text-red-400 hover:bg-red-900/30 transition"
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

export default CompanyProfileButton;
