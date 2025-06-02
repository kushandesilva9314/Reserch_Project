import React, { useEffect, useState } from "react";
import { FaBuilding, FaUserTie, FaChartLine, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegistrationPage = () => {
  const [welcomeText, setWelcomeText] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Improved text animation with smoother typing effect
  useEffect(() => {
    const fullText = "Welcome to Investo!";
    let currentIndex = 0;
    
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setWelcomeText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        
        // Reset animation after a pause
        setTimeout(() => {
          currentIndex = 0;
          const resetInterval = setInterval(() => {
            if (currentIndex <= fullText.length) {
              setWelcomeText(fullText.slice(0, currentIndex));
              currentIndex++;
            } else {
              clearInterval(resetInterval);
            }
          }, 100);
        }, 2000);
      }
    }, 100);
    
    return () => clearInterval(typingInterval);
  }, []);

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/protected", {
          withCredentials: true, 
        });
        if (response.status === 200) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); 
    }
  }, [isAuthenticated, navigate]);

  // Card hover animation
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-700 via-purple-500 to-indigo-600 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white opacity-10"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 20}s linear infinite`,
            }}
          />
        ))}
      </div>

      {/* Welcome text with animation */}
      <div className="relative z-10 mt-16 mb-8 text-center">
        <div className="inline-block px-10 py-5 rounded-xl ">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">
            {welcomeText}
            <span className="animate-pulse">|</span>
          </h1>
          <p className="text-purple-100 mt-4 text-xl">
            Your gateway to smarter investments
          </p>
        </div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row items-center justify-center gap-8 px-6 md:px-12 py-8 max-w-7xl mx-auto">
        {/* Company Card */}
        <div 
          className={`w-full md:w-1/2 max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 transition-all duration-300 shadow-xl ${
            hoveredCard === 'company' ? 'transform scale-105 shadow-purple-500/30' : ''
          }`}
          onMouseEnter={() => setHoveredCard('company')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FaBuilding className="text-3xl text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">For Companies</h2>
            <p className="text-purple-100 mb-6">
              Register as a company to manage your investments, track performance, and connect with investors.
            </p>
            <ul className="text-left text-purple-100 mb-8 space-y-2">
              <li className="flex items-center"><FaChartLine className="mr-2 text-purple-300" /> Portfolio management tools</li>
              <li className="flex items-center"><FaChartLine className="mr-2 text-purple-300" /> Investor relations dashboard</li>
              <li className="flex items-center"><FaChartLine className="mr-2 text-purple-300" /> Performance analytics</li>
            </ul>
            <button
              className="w-full py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 transition flex items-center justify-center group"
              onClick={() => navigate("/company-registration")}
            >
              Register as Company
              <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Investor Card */}
        <div 
          className={`w-full md:w-1/2 max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 transition-all duration-300 shadow-xl ${
            hoveredCard === 'investor' ? 'transform scale-105 shadow-indigo-500/30' : ''
          }`}
          onMouseEnter={() => setHoveredCard('investor')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="text-center">
            <div className="w-20 h-20 bg-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FaUserTie className="text-3xl text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">For Investors</h2>
            <p className="text-purple-100 mb-6">
              Register as an investor to discover opportunities, track investments, and grow your portfolio.
            </p>
            <ul className="text-left text-purple-100 mb-8 space-y-2">
              <li className="flex items-center"><FaChartLine className="mr-2 text-indigo-300" /> Discover investment opportunities</li>
              <li className="flex items-center"><FaChartLine className="mr-2 text-indigo-300" /> Track portfolio performance</li>
              <li className="flex items-center"><FaChartLine className="mr-2 text-indigo-300" /> Advanced analytics tools</li>
            </ul>
            <button
              className="w-full py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition flex items-center justify-center group"
              onClick={() => navigate("/user-registration")}
            >
              Register as Investor
              <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Login link */}
      <div className="mb-10 text-center z-10">
        <p className="text-white text-lg">
          Already have an account? 
          <span 
            className="ml-2 text-purple-200 font-semibold cursor-pointer hover:text-white transition-colors underline"
            onClick={() => navigate("/login")}
          >
            Login now
          </span>
        </p>
      </div>

      {/* Add keyframes for floating animation */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(30px, 20px) rotate(180deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default RegistrationPage;