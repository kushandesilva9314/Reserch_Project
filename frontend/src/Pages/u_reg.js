import React, { useState, useEffect } from "react";
import { FaIdCard, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios"

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    username: "",
    password: "",
    confirmPassword: "",
    address: "",
    governmentId: null,
    previewImage: null,
  });

  const [passwordError, setPasswordError] = useState(false);
  const [popupMessage, setPopupMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "confirmPassword") {
      setPasswordError(formData.password !== value);
    }
  };

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData({
        ...formData,
        governmentId: file,
        previewImage: URL.createObjectURL(file),
      });
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, governmentId: null, previewImage: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordError(true);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phoneNumber", formData.phoneNumber);
    formDataToSend.append("username", formData.username);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("address", formData.address);
    if (formData.governmentId) {
      formDataToSend.append("governmentId", formData.governmentId);
    }

    try {
      const response = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();
      console.log("Response Data:", data); 

      if (response.ok) {
        setPopupMessage({
          text: "Registration successful! Your request is under review. You will receive an email notification once it's approved.",
          type: "success",
        });
      } else {
        console.error("Error response:", data); 

        if (response.status === 400 && data.message?.includes("email")) {
          setPopupMessage({
            text: "An investor with this email already exists!",
            type: "error",
          });
        } else {
          setPopupMessage({
            text: data.message || "System error, please try again later.",
            type: "error",
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setPopupMessage({
        text: "Network error. Please check your connection and try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-600 to-white px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 sm:p-12 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-center text-3xl font-bold text-purple-700 mb-6">
          Register as an Investor
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                className="w-full p-3 border rounded"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                className="w-full p-3 border rounded"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                className="w-full p-3 border rounded"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                name="username"
                className="w-full p-3 border rounded"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                className="w-full p-3 border rounded"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                className={`w-full p-3 border rounded ${
                  passwordError ? "border-red-500" : ""
                }`}
                onChange={handleChange}
                required
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">
                  Passwords do not match.
                </p>
              )}
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                name="address"
                className="w-full p-3 border rounded"
                onChange={handleChange}
                required
              ></textarea>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Government ID Upload
            </label>
            <div className="flex flex-col items-center justify-center p-3 border rounded bg-purple-100 cursor-pointer relative">
              {formData.previewImage ? (
                <div className="relative w-32 h-32">
                  <img
                    src={formData.previewImage}
                    alt="Uploaded Preview"
                    className="w-full h-full object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-700 transition"
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <>
                  <FaIdCard className="text-purple-700 text-2xl mb-2" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="fileUpload"
                    onChange={handleFileChange}
                    required
                  />
                  <label
                    htmlFor="fileUpload"
                    className="cursor-pointer text-purple-700"
                  >
                    Upload ID
                  </label>
                </>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-purple-700 text-white p-3 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 mt-4"
          >
            Register
          </button>
        </form>
      </div>

      {popupMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md">
            <p className="text-lg font-semibold">{popupMessage.text}</p>
            <button
              className="mt-4 px-6 py-2 bg-purple-700 text-white rounded-lg"
              onClick={() => {
                setPopupMessage(null);
                if (popupMessage.type === "success") navigate("/start");
                if (popupMessage.type === "error") window.location.reload();
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationForm;
