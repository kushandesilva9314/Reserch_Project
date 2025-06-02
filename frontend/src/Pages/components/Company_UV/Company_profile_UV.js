import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaUserCircle, FaImage, FaArrowLeft } from "react-icons/fa";

const ProfileSectionUV = ({ companyEmail }) => {
  const [companyData, setCompanyData] = useState({
    companyName: "",
    coverPhoto: null,
    profilePhoto: null,
    loading: true,
    error: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!companyEmail) {
        setCompanyData(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3001/api/company/uv/images/${companyEmail}`
        );
        
        setCompanyData({
          companyName: response.data.companyName,
          coverPhoto: response.data.coverPhoto
            ? `http://localhost:3001${response.data.coverPhoto}`
            : null,
          profilePhoto: response.data.profilePhoto
            ? `http://localhost:3001${response.data.profilePhoto}`
            : null,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error("Error fetching company data:", error);
        setCompanyData(prev => ({ 
          ...prev, 
          loading: false, 
          error: "Failed to load company profile"
        }));
      }
    };

    fetchCompanyData();
  }, [companyEmail]);

  const { companyName, coverPhoto, profilePhoto, loading, error } = companyData;

  if (loading) {
    return (
      <div className="w-full h-[28vh] bg-slate-100 flex items-center justify-center">
        <div className="animate-pulse text-slate-500">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[28vh] bg-slate-100 flex items-center justify-center">
        <div className="text-slate-700">{error}</div>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-slate-50 shadow-md rounded-b-lg h-[28vh]">
      {/* Back Button */}
      <motion.button
        onClick={() => navigate("/ads")}
        className="absolute top-4 left-4 z-10 text-white bg-slate-800 bg-opacity-60 rounded-full p-2 hover:bg-slate-700 transition-all duration-300 shadow-md"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ scale: 1.1 }}
        aria-label="Go back"
      >
        <FaArrowLeft size={18} />
      </motion.button>

      {/* Cover Photo - Takes up most of the space */}
      <motion.div
        className="w-full h-[24vh] bg-slate-200 relative overflow-hidden rounded-t-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {coverPhoto ? (
          <img
            src={coverPhoto}
            alt="Company Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-300 to-slate-400 text-slate-600">
            <FaImage size={40} />
            <span className="mt-2 text-sm">Cover Image</span>
          </div>
        )}

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-40" />

        {/* Business Name - Positioned for better visibility */}
        <motion.div
          className="absolute bottom-4 left-4 bg-slate-800 bg-opacity-70 text-white px-4 py-2 rounded-lg text-xl font-semibold shadow-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {companyName || "Company Name"}
        </motion.div>
      </motion.div>

      {/* Bottom Bar - Minimal height */}
      <div className="w-full h-[4vh] bg-slate-50 rounded-b-lg shadow-inner"></div>

      {/* Profile Picture - Adjusted positioning to overlap cover and bottom bar */}
      <motion.div
        className="absolute bottom-1 right-8 w-20 h-20 bg-slate-300 rounded-full border-4 border-slate-50 overflow-hidden shadow-xl z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        whileHover={{ scale: 1.05 }}
      >
        {profilePhoto ? (
          <img
            src={profilePhoto}
            alt="Company Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-400 to-slate-500 text-slate-200">
            <FaUserCircle size={40} />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProfileSectionUV;