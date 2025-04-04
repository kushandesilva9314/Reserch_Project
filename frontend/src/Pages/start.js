import React, { useEffect, useState } from "react";
import { FaBuilding, FaUserTie } from "react-icons/fa";
import startPic from "./Assets/start_pic.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegistrationPage = () => {
  const [welcomeText, setWelcomeText] = useState("");
  const fullText = "Welcome to Investo!";
  let index = 0;
  let isDisplaying = false;

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDisplaying) {
        setWelcomeText(fullText.slice(0, index));
        index++;
        if (index > fullText.length) {
          isDisplaying = true;
          setTimeout(() => {
            index = 0;
            isDisplaying = false;
          }, 1000);
        }
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const navigate = useNavigate();

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

  
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); 
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-purple-600 to-white relative">
      <div className="absolute top-12 left-20 text-4xl font-bold text-white">
        {welcomeText}
      </div>

      <div className="flex flex-grow">
        <div className="w-1/2 flex flex-col items-center justify-center p-8">
          <img src={startPic} alt="Start" className="max-w-full h-auto" />
        </div>

        <div className="w-1/2 flex items-center justify-center">
          <div className="bg-white shadow-2xl rounded-2xl p-10 w-3/4 h-[90vh] flex flex-col justify-center border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-3xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center mb-4">
                <FaBuilding className="mr-2 text-purple-600" /> Company
              </h2>
              <p className="text-gray-600 mb-4">
                Register as a company to manage your investments.
              </p>
              <button
                className="w-full py-3 text-lg font-semibold text-purple-600 bg-gradient-to-r from-purple-500 to-white rounded-lg shadow-lg hover:from-purple-600 hover:to-white transition"
                onClick={() => navigate("/company-registration")}
              >
                Register as Company
              </button>
            </div>

            <div className="border-t border-gray-300 my-6"></div>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center mb-4">
                <FaUserTie className="mr-2 text-purple-600" /> Investor
              </h2>
              <p className="text-gray-600 mb-4">
                Register as an investor to explore opportunities.
              </p>
              <button
                className="w-full py-3 text-lg font-semibold text-purple-600 bg-gradient-to-r from-purple-500 to-white rounded-lg shadow-lg hover:from-purple-600 hover:to-white transition"
                onClick={() => navigate("/user-registration")}
              >
                Register as User
              </button>
            </div>

            <p className="text-center text-gray-600 mt-20">
              Already have an account? 
              <span 
                className="text-purple-600 font-semibold cursor-pointer hover:underline"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;