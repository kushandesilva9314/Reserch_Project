import React, { useState, useEffect } from "react";
import { FaFileUpload, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CompanyRegistrationForm = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    ownerName: "",
    password: "",
    confirmPassword: "",
    businessType: "Startups",
    companyDescription: "",
    registrationCopy: null,
    previewImage: null,
  });

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

  const [passwordError, setPasswordError] = useState(false);
  const [popupMessage, setPopupMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "confirmPassword") {
      setPasswordError(formData.password !== value);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        registrationCopy: file,
        previewImage: URL.createObjectURL(file),
      });
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, registrationCopy: null, previewImage: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordError(true);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("companyName", formData.companyName);
    formDataToSend.append("companyEmail", formData.companyEmail);
    formDataToSend.append("companyPhone", formData.companyPhone);
    formDataToSend.append("ownerName", formData.ownerName);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("businessType", formData.businessType);
    formDataToSend.append("companyDescription", formData.companyDescription);
    if (formData.registrationCopy) {
      formDataToSend.append("registrationCopy", formData.registrationCopy);
    }

    try {
      const response = await fetch("http://localhost:3001/api/company/register", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();
      console.log("Response Data:", data);
      if (response.ok) {
        setPopupMessage({
          text: "Your company registration request is under review. You will be notified via email after the approval.",
          type: "success",
        });
      } else {
        setPopupMessage({
          text: data.message || "Error registering company!",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setPopupMessage({ text: "Server error, try again!", type: "error" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-600 to-white px-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl relative">
        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <button
            type="button"
            onClick={() => navigate("/start")}
            className="px-3 py-1 bg-purple-200 text-purple-900 text-sm font-medium rounded hover:bg-purple-300 transition"
          >
            ← Back
          </button>
        </div>

        <h2 className="text-center text-3xl font-bold text-purple-700 mb-6">
          Company Registration
        </h2>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                className="w-full p-3 border rounded"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company Email
              </label>
              <input
                type="email"
                name="companyEmail"
                className="w-full p-3 border rounded"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company Phone
              </label>
              <input
                type="tel"
                name="companyPhone"
                className="w-full p-3 border rounded"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Owner/Founder
              </label>
              <input
                type="text"
                name="ownerName"
                className="w-full p-3 border rounded"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
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
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Business Type
            </label>
            <select
              name="businessType"
              className="w-full p-3 border rounded"
              onChange={handleChange}
              required
            >
              <option value="Startups">Startups</option>
              <option value="SMEs">SMEs</option>
              <option value="Large Scale">Large Scale</option>
            </select>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Company Description
            </label>
            <textarea
              name="companyDescription"
              className="w-full p-3 border rounded h-32"
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Company Registration Copy
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
                  <FaFileUpload className="text-purple-700 text-2xl mb-2" />
                  <input
                    type="file"
                    name="registrationCopy"
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
                    Upload Registration Copy
                  </label>
                </>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-700 to-purple-900 text-white p-3 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 mt-4"
          >
            Register Company
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

export default CompanyRegistrationForm;
