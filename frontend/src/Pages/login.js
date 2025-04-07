import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("investor");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  const handleLogin = async () => {
    try {
      let apiUrl = "http://localhost:3001/api/login";
      if (role === "company") {
        apiUrl = "http://localhost:3001/api/company/login";
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();
      console.log("🔍 API Response:", data);

      if (!response.ok) {
        console.error("❌ Server Error:", data);
        alert(data.message || "Login failed");
        return;
      }

      alert("Login successful");

      if (role === "company") {
        navigate("/company");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      alert("An error occurred during login.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-purple-500 to-purple-800">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-4xl w-full flex overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
        <div className="w-1/2 bg-gradient-to-r from-purple-700 to-purple-900 p-8 rounded-lg text-white flex flex-col justify-center items-center">
          <h1 className="text-4xl font-extrabold mb-4 animate-fade-in">Welcome Back!</h1>
          <p className="text-lg text-center mb-4 animate-fade-in delay-100">Your personalized space awaits. Sign in to continue your journey.</p>
          <p className="text-sm text-center animate-fade-in delay-200">✔️ Secure Access  • ✔️ 24/7 Support</p>
        </div>

        <div className="w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-purple-700 text-center mb-6 animate-slide-in">Sign In</h2>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Email Address</label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 hover:border-purple-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Password</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 hover:border-purple-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Select Role</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 hover:border-purple-500"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="investor">User</option>
              <option value="company">Company</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex justify-between items-center mb-3">
            <label className="flex items-center text-gray-700 font-semibold">
              <input
                type="checkbox"
                className="mr-2"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Remember Me
            </label>
            <Link
              to="/forgot-password"
              className="text-purple-600 hover:underline font-semibold"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Added new link here */}
          <div className="text-center mb-6 animate-fade-in delay-300">
            <span className="text-gray-700 font-semibold">
              Don't have an account?{" "}
              <Link to="/start" className="text-purple-600 hover:underline font-semibold">
                Create one
              </Link>
            </span>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-purple-700 text-white p-3 rounded-lg font-semibold text-lg hover:bg-purple-800 transition-all duration-300 transform hover:scale-105"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
