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
    <div className="bg-gray-100 text-black py-16 px-6 md:px-12">
      <div className="container mx-auto flex flex-col md:flex-row items-center shadow-2xl rounded-2xl p-8 h-[450px]">
        {/* Left Section */}
        <motion.div
          className="md:w-1/2 text-center md:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Transform Your Investments with AI Precision
          </h1>
          <p className="mt-6 text-lg leading-relaxed opacity-80">
            Empower your financial strategies with cutting-edge AI-driven insights.
            Our platform provides real-time analytics and predictive modeling to help you maximize returns with confidence.
          </p>
          {!isAuthenticated && (
            <div className="mt-8">
              <a href="/start">
                <motion.button
                  className="bg-gradient-to-r from-purple-600 to-white text-black px-8 py-4 rounded-lg shadow-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started Now
                </motion.button>
              </a>
            </div>
          )}
        </motion.div>

        {/* Right Section */}
        <motion.div
          className="md:w-1/2 flex justify-center md:justify-end mt-6 md:mt-0 relative"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={businessWoman}
            alt="Business woman"
            className="w-[350px] h-[350px] object-cover shadow-lg"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Banner;