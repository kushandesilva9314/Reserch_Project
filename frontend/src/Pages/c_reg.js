import React, { useState, useEffect } from "react";
import { FaFileUpload, FaTimes, FaBuilding, FaArrowLeft, FaInfoCircle, FaCheck, FaEye, FaEyeSlash } from "react-icons/fa";
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
  const [passwordError, setPasswordError] = useState(false);
  const [popupMessage, setPopupMessage] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
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

  const validateStep = (step) => {
    const errors = {};
    
    if (step === 1) {
      if (!formData.companyName.trim()) errors.companyName = "Company name is required";
      if (!formData.companyEmail.trim()) errors.companyEmail = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.companyEmail)) errors.companyEmail = "Email is invalid";
      if (!formData.companyPhone.trim()) errors.companyPhone = "Phone number is required";
      if (!formData.ownerName.trim()) errors.ownerName = "Owner name is required";
    } else if (step === 2) {
      if (!formData.password) errors.password = "Password is required";
      else if (formData.password.length < 6) errors.password = "Password must be at least 6 characters";
      
      if (!formData.confirmPassword) errors.confirmPassword = "Please confirm your password";
      else if (formData.password !== formData.confirmPassword) errors.confirmPassword = "Passwords do not match";
    } else if (step === 3) {
      if (!formData.companyDescription.trim()) errors.companyDescription = "Company description is required";
      if (!formData.registrationCopy) errors.registrationCopy = "Registration document is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "confirmPassword") {
      setPasswordError(formData.password !== value);
    }
    
   
    if (formErrors[name]) {
      setFormErrors({...formErrors, [name]: undefined});
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
     
      if (formErrors.registrationCopy) {
        setFormErrors({...formErrors, registrationCopy: undefined});
      }
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, registrationCopy: null, previewImage: null });
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      return;
    }
    
    setIsSubmitting(true);

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
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex justify-center mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold 
                ${currentStep === step 
                  ? "bg-purple-600 text-white" 
                  : currentStep > step 
                    ? "bg-green-500 text-white" 
                    : "bg-gray-200 text-gray-600"}`}
            >
              {currentStep > step ? <FaCheck /> : step}
            </div>
            {step < 3 && (
              <div 
                className={`w-16 h-1 ${
                  currentStep > step ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  
  const renderStep1 = () => (
    <>
      <h3 className="text-xl font-semibold text-purple-800 mb-4">
        Company Information
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            className={`w-full p-3 border rounded-lg transition focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none ${
              formErrors.companyName ? "border-red-500" : "border-gray-300"
            }`}
            onChange={handleChange}
            placeholder="Enter company name"
          />
          {formErrors.companyName && (
            <p className="text-red-500 text-sm mt-1">{formErrors.companyName}</p>
          )}
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="companyEmail"
            value={formData.companyEmail}
            className={`w-full p-3 border rounded-lg transition focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none ${
              formErrors.companyEmail ? "border-red-500" : "border-gray-300"
            }`}
            onChange={handleChange}
            placeholder="example@company.com"
          />
          {formErrors.companyEmail && (
            <p className="text-red-500 text-sm mt-1">{formErrors.companyEmail}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="companyPhone"
            value={formData.companyPhone}
            className={`w-full p-3 border rounded-lg transition focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none ${
              formErrors.companyPhone ? "border-red-500" : "border-gray-300"
            }`}
            onChange={handleChange}
            placeholder="+1 (123) 456-7890"
          />
          {formErrors.companyPhone && (
            <p className="text-red-500 text-sm mt-1">{formErrors.companyPhone}</p>
          )}
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Owner/Founder Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="ownerName"
            value={formData.ownerName}
            className={`w-full p-3 border rounded-lg transition focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none ${
              formErrors.ownerName ? "border-red-500" : "border-gray-300"
            }`}
            onChange={handleChange}
            placeholder="Enter owner's full name"
          />
          {formErrors.ownerName && (
            <p className="text-red-500 text-sm mt-1">{formErrors.ownerName}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={nextStep}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition duration-300 flex items-center"
        >
          Next Step
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
          </svg>
        </button>
      </div>
    </>
  );

  
  const renderStep2 = () => (
    <>
      <h3 className="text-xl font-semibold text-purple-800 mb-4">
        Account Information
      </h3>

      <div className="grid grid-cols-1 gap-4">
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              className={`w-full p-3 border rounded-lg pr-10 transition focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none ${
                formErrors.password ? "border-red-500" : "border-gray-300"
              }`}
              onChange={handleChange}
              placeholder="Create a secure password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {formErrors.password && (
            <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Password must be at least 6 characters long
          </p>
        </div>

        <div className="form-group mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              className={`w-full p-3 border rounded-lg pr-10 transition focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none ${
                formErrors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
              onChange={handleChange}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {formErrors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>
          )}
        </div>

        <div className="form-group mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Type <span className="text-red-500">*</span>
          </label>
          <select
            name="businessType"
            value={formData.businessType}
            className="w-full p-3 border border-gray-300 rounded-lg transition focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
            onChange={handleChange}
          >
            <option value="Startups">Startups</option>
            <option value="SMEs">SMEs (Small and Medium Enterprises)</option>
            <option value="Large Scale">Large Scale Business</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={prevStep}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-300 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12"></path>
          </svg>
          Previous
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition duration-300 flex items-center"
        >
          Next Step
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
          </svg>
        </button>
      </div>
    </>
  );

  
  const renderStep3 = () => (
    <>
      <h3 className="text-xl font-semibold text-purple-800 mb-4">
        Company Details
      </h3>

      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Company Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="companyDescription"
          value={formData.companyDescription}
          className={`w-full p-3 border rounded-lg transition focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none h-32 ${
            formErrors.companyDescription ? "border-red-500" : "border-gray-300"
          }`}
          onChange={handleChange}
          placeholder="Provide a detailed description of your company, including your mission, vision, and services offered..."
        ></textarea>
        {formErrors.companyDescription && (
          <p className="text-red-500 text-sm mt-1">{formErrors.companyDescription}</p>
        )}
      </div>

      <div className="form-group mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Company Registration Document <span className="text-red-500">*</span>
        </label>
        <div 
          className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
            formData.previewImage 
              ? "border-purple-400 bg-purple-50" 
              : formErrors.registrationCopy 
                ? "border-red-300 bg-red-50" 
                : "border-gray-300 bg-gray-50 hover:border-purple-400 hover:bg-purple-50"
          } text-center`}
        >
          {formData.previewImage ? (
            <div className="relative inline-block">
              <img
                src={formData.previewImage}
                alt="Uploaded Preview"
                className="max-w-full max-h-48 rounded-lg shadow-md"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-700 transition"
                title="Remove image"
              >
                <FaTimes />
              </button>
            </div>
          ) : (
            <>
              <input
                type="file"
                name="registrationCopy"
                accept="image/*,.pdf"
                className="hidden"
                id="fileUpload"
                onChange={handleFileChange}
              />
              <label
                htmlFor="fileUpload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <FaFileUpload className="text-purple-600 text-4xl mb-3" />
                <p className="font-medium text-purple-600 mb-1">Click to upload document</p>
                <p className="text-sm text-gray-500">
                  Upload your company registration certificate (PNG, JPG, PDF)
                </p>
              </label>
            </>
          )}
        </div>
        {formErrors.registrationCopy && (
          <p className="text-red-500 text-sm mt-1">{formErrors.registrationCopy}</p>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={prevStep}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-300 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12"></path>
          </svg>
          Previous
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition duration-300 flex items-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              Submit Registration
              <FaCheck className="ml-2" />
            </>
          )}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-800 via-purple-600 to-indigo-700 p-4 sm:p-6">
      {/* Background decoration elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-20 translate-y-20"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-300 opacity-10 rounded-full transform -translate-x-20 -translate-y-20"></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-indigo-400 opacity-10 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl relative overflow-hidden">
        {/* Header decoration */}
        <div className="h-3 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
        
        {/* Back to start button */}
        <div className="absolute top-4 left-4 z-10">
          <button
            type="button"
            onClick={() => navigate("/start")}
            className="flex items-center px-3 py-2 text-sm font-medium text-purple-800 bg-purple-100 rounded-full hover:bg-purple-200 transition-colors"
          >
            <FaArrowLeft className="mr-1" /> Back
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-center mb-6">
            <FaBuilding className="text-purple-600 text-3xl mr-3" />
            <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              Company Registration
            </h2>
          </div>

          {renderStepIndicator()}

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </form>
        </div>
      </div>

      {/* Success/Error Popup */}
      {popupMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md mx-4 transform transition-all animate-fade-in-up">
            <div className={`w-16 h-16 mx-auto flex items-center justify-center rounded-full mb-4 ${
              popupMessage.type === "success" ? "bg-green-100" : "bg-red-100"
            }`}>
              {popupMessage.type === "success" ? (
                <FaCheck className="text-green-600 text-2xl" />
              ) : (
                <FaInfoCircle className="text-red-600 text-2xl" />
              )}
            </div>
            <h3 className={`text-xl font-bold mb-2 ${
              popupMessage.type === "success" ? "text-green-600" : "text-red-600"
            }`}>
              {popupMessage.type === "success" ? "Success!" : "Oops!"}
            </h3>
            <p className="text-gray-700 mb-6">{popupMessage.text}</p>
            <button
              className={`px-6 py-3 rounded-lg text-white font-medium transition-colors ${
                popupMessage.type === "success" 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
              onClick={() => {
                setPopupMessage(null);
                if (popupMessage.type === "success") navigate("/start");
                if (popupMessage.type === "error") window.location.reload();
              }}
            >
              {popupMessage.type === "success" ? "Go Back to Start" : "Try Again"}
            </button>
          </div>
        </div>
      )}

      {/* Add CSS animation */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CompanyRegistrationForm;