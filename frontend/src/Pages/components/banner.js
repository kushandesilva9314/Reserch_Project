
import { Building2, MapPin } from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import businessWoman from "../Assets/bw.png";

const Banner = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/protected", {
          method: "GET",
          credentials: "include",
        });
        setIsAuthenticated(response.ok);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="w-full max-w-screen-xl mx-auto overflow-hidden rounded-lg shadow-2xl bg-white">
      <div className="flex flex-col md:flex-row">
        {/* Left side - Content */}
        <motion.div
          className="relative w-full md:w-1/2 bg-gray-100 p-8 md:p-12 flex flex-col justify-between"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo */}
          <div className="flex items-center mb-6">
            <Building2 className="h-6 w-6 text-purple-600 mr-2" />
            <span className="text-gray-700 font-medium text-sm uppercase tracking-wider">AI Invest</span>
          </div>

          {/* Main content */}
          <div className="space-y-6 mb-8">
            <div>
              <h2 className="text-gray-500 font-medium text-xl md:text-2xl">NEXT-GEN STRATEGY</h2>
              <div className="mt-2">
                <span className="text-gray-700 text-3xl md:text-5xl font-bold">AI-DRIVEN </span>
                <span className="text-purple-600 text-3xl md:text-5xl font-bold">INVESTMENTS</span>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              Empower your financial strategies with cutting-edge AI-driven insights.
              Real-time analytics and predictive modeling to maximize your returns.
            </p>

            {!isAuthenticated && (
              <a
                href="/start"
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded text-sm font-medium transition-colors"
              >
                Get Started Now
              </a>
            )}
          </div>

          {/* Footer with icons */}
          <div className="mt-auto">
            <div className="flex items-center space-x-3 mb-2">
              <a href="#" className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="text-white text-xs">fb</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="text-white text-xs">tw</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="text-white text-xs">in</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <MapPin className="h-4 w-4 text-white" />
              </a>
            </div>
            <div className="text-gray-600 text-sm flex items-center">
              <span className="text-purple-600 mr-1">●</span>
              www.investo.com
            </div>
          </div>
        </motion.div>

        {/* Right side - Image */}
        <motion.div
          className="w-full md:w-1/2 h-64 md:h-auto relative"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={businessWoman}
            alt="Business woman"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent mix-blend-overlay"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default Banner;
