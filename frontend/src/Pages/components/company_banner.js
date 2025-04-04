import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaUserTie, FaIndustry, FaInfoCircle } from "react-icons/fa";

const CompanyBanner = () => {
  const [company, setCompany] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/company/protected", {
          withCredentials: true,
        });
        console.log("Company Data:", response.data);
        setCompany(response.data.user);
      } catch (err) {
        setError("Failed to load company details");
        console.error("Error fetching company details:", err);
      }
    };

    fetchCompanyDetails();
  }, []);

  if (error) {
    return <div className="text-red-500 text-center p-4 font-semibold">{error}</div>;
  }

  if (!company) {
    return <div className="text-gray-500 text-center p-4 font-semibold">Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative bg-gradient-to-br from-gray-900 to-gray-700 text-white p-10 rounded-xl shadow-2xl shadow-black max-w-4xl w-[95%] mx-auto mb-16 text-left border border-gray-600 overflow-hidden"
    >
      {/* Glassmorphism Effect */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-lg rounded-xl"></div>

      {/* Company Info */}
      <div className="relative z-10 space-y-6">
        <h1 className="text-3xl font-extrabold text-white uppercase tracking-wider border-b border-gray-500 pb-2">
          Company Information
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem icon={<FaEnvelope />} label="Email" value={company.companyEmail} />
          <InfoItem icon={<FaPhone />} label="Phone" value={company.companyPhone} />
          <InfoItem icon={<FaUserTie />} label="Business Owner" value={company.ownerName} />
          <InfoItem icon={<FaIndustry />} label="Business Type" value={company.businessType} />
          <InfoItem icon={<FaInfoCircle />} label="Description" value={company.companyDescription} fullWidth />
        </div>
      </div>
    </motion.div>
  );
};

// Reusable Info Item Component
const InfoItem = ({ icon, label, value, fullWidth = false }) => (
  <div className={`flex items-center gap-4 ${fullWidth ? "col-span-2" : ""}`}>
    <div className="text-lg bg-gray-800 p-3 rounded-full text-white">{icon}</div>
    <div>
      <h2 className="text-md font-bold text-gray-300">{label}</h2>
      <p className="text-lg font-medium text-white">{value}</p>
    </div>
  </div>
);

export default CompanyBanner;
