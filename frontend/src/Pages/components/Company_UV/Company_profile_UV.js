import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaUserCircle, FaImage, FaArrowLeft } from "react-icons/fa";

const ProfileSectionUV = ({ companyEmail }) => {
  const [companyName, setCompanyName] = useState("");
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!companyEmail) return;

      try {
        const response = await axios.get(
          `http://localhost:3001/api/company/uv/images/${companyEmail}`
        );
        setCompanyName(response.data.companyName);
        setCoverPhoto(
          response.data.coverPhoto
            ? `http://localhost:3001${response.data.coverPhoto}`
            : null
        );
        setProfilePhoto(
          response.data.profilePhoto
            ? `http://localhost:3001${response.data.profilePhoto}`
            : null
        );
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

    fetchCompanyData();
  }, [companyEmail]);

  return (
    <div className="relative w-full h-[38vh]">
      {/* Back Button */}
      <motion.button
        onClick={() => navigate("/ads")}
        className="absolute top-4 left-4 z-10 text-white bg-black bg-opacity-40 rounded-full p-2 hover:bg-opacity-60 transition"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <FaArrowLeft size={20} />
      </motion.button>

      {/* Cover Photo */}
      <motion.div
        className="w-full h-[28vh] bg-gray-200 relative overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {coverPhoto ? (
          <img
            src={coverPhoto}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <FaImage size={50} />
          </div>
        )}

        {/* Business Name */}
        <motion.div
          className="absolute bottom-2 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-md text-lg font-semibold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {companyName}
        </motion.div>
      </motion.div>

      {/* Profile Picture */}
      <motion.div
        className="absolute bottom-[2rem] right-8 w-24 h-24 bg-gray-300 rounded-full border-4 border-white overflow-hidden shadow-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        whileHover={{ scale: 1.1 }}
      >
        {profilePhoto ? (
          <img
            src={profilePhoto}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <FaUserCircle size={50} />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProfileSectionUV;
