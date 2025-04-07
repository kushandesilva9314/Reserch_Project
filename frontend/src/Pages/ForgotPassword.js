import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("investor");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    try {
      await axios.post("http://localhost:3001/api/forgot-password", { email, role });
      alert("OTP sent to your email!");
      setStep(2);
    } catch (error) {
      alert("Failed to send OTP. Check your email and role.");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await axios.post("http://localhost:3001/api/verify-otp", { email, otp });
      alert(response.data.message);
      if (response.status === 200) {
        setStep(3);
      }
    } catch (error) {
      alert("Invalid OTP. Try again.");
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      await axios.post("http://localhost:3001/api/reset-password", { email, newPassword, role });
      alert("Password successfully reset!");
      navigate("/login");
    } catch (error) {
      alert("Failed to reset password.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-purple-500 to-purple-800 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-800 animate-gradientBlur"></div>
      
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full text-center z-10">
        
        {/* Online Image */}
        <div className="flex justify-center mb-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2919/2919600.png"
            alt="Forgot Password"
            className="w-24 h-24"
          />
        </div>

        {step === 1 && (
          <>
            <h2 className="text-3xl font-bold text-purple-700 mb-6">Forgot Password</h2>
            <input 
              type="email" 
              className="w-full p-3 border rounded-lg mb-4" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Enter your email" 
            />
            <select 
              className="w-full p-3 border rounded-lg mb-4" 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="investor">Investor</option>
              <option value="company">Company</option>
            </select>
            <button 
              className="w-full bg-purple-700 text-white p-3 rounded-lg hover:bg-purple-800"
              onClick={handleSendOTP}
            >
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-3xl font-bold text-purple-700 mb-6">Enter OTP</h2>
            <input 
              type="text" 
              className="w-full p-3 border rounded-lg mb-4" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)} 
              placeholder="Enter OTP"
            />
            <button 
              className="w-full bg-purple-700 text-white p-3 rounded-lg hover:bg-purple-800"
              onClick={handleVerifyOTP}
            >
              Verify OTP
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-3xl font-bold text-purple-700 mb-6">Reset Password</h2>
            <input 
              type="password" 
              className="w-full p-3 border rounded-lg mb-4" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              placeholder="New Password"
            />
            <input 
              type="password" 
              className="w-full p-3 border rounded-lg mb-4" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              placeholder="Confirm Password"
            />
            <button 
              className="w-full bg-purple-700 text-white p-3 rounded-lg hover:bg-purple-800"
              onClick={handleResetPassword}
            >
              Reset Password
            </button>
          </>
        )}

        {/* Back to Login Button */}
        <button 
          className="mt-4 w-full bg-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-400"
          onClick={() => navigate("/login")}
        >
          Back to Login
        </button>
      </div>

      {/* Tailwind Animation for Background */}
      <style>
        {`
          @keyframes gradientBlur {
            0% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.1); opacity: 0.8; }
            100% { transform: scale(1); opacity: 0.6; }
          }
          .animate-gradientBlur {
            animation: gradientBlur 5s infinite alternate;
          }
        `}
      </style>
    </div>
  );
};

export default ForgotPassword;
