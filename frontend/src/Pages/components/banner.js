import { Building2, MapPin, Facebook, Twitter, Linkedin } from "lucide-react";
import React, { useEffect, useState } from "react";
import businessImage from "../Assets/bw.jpeg";

const Banner = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:3001/api/protected", {
          method: "GET",
          credentials: "include",
        });
        setIsAuthenticated(response.ok);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="w-full max-w-screen-xl mx-auto overflow-hidden rounded-lg shadow-xl bg-slate-50 transition-all duration-300 hover:shadow-2xl">
      <div className="flex flex-col md:flex-row">
        {/* Left side - Content */}
        <div className="relative w-full md:w-1/2 bg-slate-100 p-6 md:p-10 flex flex-col justify-between animate-fadeIn">
          {/* Logo */}
          <div className="flex items-center mb-6">
            <Building2 className="h-6 w-6 text-slate-700 mr-2" />
            <span className="text-slate-800 font-medium text-sm uppercase tracking-wider">AI Invest</span>
          </div>

          {/* Main content */}
          <div className="space-y-6 mb-8">
            <div>
              <h2 className="text-slate-500 font-medium text-xl md:text-2xl tracking-wide">NEXT-GEN STRATEGY</h2>
              <div className="mt-2">
                <span className="text-slate-800 text-3xl md:text-5xl font-bold">AI-DRIVEN </span>
                <span className="text-slate-600 text-3xl md:text-5xl font-bold">INVESTMENTS</span>
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              Empower your financial strategies with cutting-edge AI-driven insights.
              Real-time analytics and predictive modeling to maximize your returns.
            </p>

            {isLoading ? (
              <div className="inline-block bg-slate-300 text-transparent animate-pulse rounded px-6 py-2">
                Loading...
              </div>
            ) : !isAuthenticated ? (
              <a
                href="/start"
                className="inline-block bg-slate-700 hover:bg-slate-800 text-white px-6 py-3 rounded-md text-sm font-medium transition-colors duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                Get Started Now
              </a>
            ) : null}
          </div>

          {/* Footer with icons */}
          <div className="mt-auto">
            <div className="flex items-center space-x-3 mb-3">
              <a 
                href="#" 
                className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-800 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4 text-white" />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-800 flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4 text-white" />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-800 flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4 text-white" />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-800 flex items-center justify-center transition-colors"
                aria-label="Location"
              >
                <MapPin className="h-4 w-4 text-white" />
              </a>
            </div>
            <div className="text-slate-600 text-sm flex items-center">
              <span className="text-slate-500 mr-1">●</span>
              <a href="https://www.investo.com" className="hover:text-slate-800 transition-colors">www.investo.com</a>
            </div>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="w-full md:w-1/2 h-64 md:h-auto relative">
          <img
            src={businessImage}
            alt="Investment professional"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/20 to-slate-800/40 mix-blend-overlay"></div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
