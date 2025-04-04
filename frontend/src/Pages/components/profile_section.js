import { motion } from "framer-motion";
import { FaUserCircle, FaImage } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import CompanyProfileButton from "./company_profile_button";

const ProfileSection = () => {
  const [isCompany, setIsCompany] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const companyResponse = await axios.get("http://localhost:3001/api/company/protected", {
          withCredentials: true,
        });
        if (companyResponse.data?.user?.role === "company") {
          setIsCompany(true);
          setBusinessName(companyResponse.data.user.companyName || "Business Name");
        }

        const imagesResponse = await axios.get("http://localhost:3001/api/company/images/user/images", {
          withCredentials: true,
        });

        setCoverPhoto(imagesResponse.data.cover ? `http://localhost:3001${imagesResponse.data.cover}` : null);
        setProfilePhoto(imagesResponse.data.profile ? `http://localhost:3001${imagesResponse.data.profile}` : null);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="relative w-full h-[38vh]">
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

        {/* Business Name (Inside Cover, Bottom-Left) */}
        <motion.div 
          className="absolute bottom-2 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-md text-lg font-semibold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {businessName}
        </motion.div>

        {/* Company Profile Button (Top-Left) */}
        {isCompany && (
          <div className="absolute top-4 left-4">
            <CompanyProfileButton />
          </div>
        )}
      </motion.div>

      {/* Profile Picture (Overlapping Cover Photo) */}
      <motion.div 
        className="absolute bottom-[2rem] right-8 w-24 h-24 bg-gray-300 rounded-full border-4 border-white overflow-hidden cursor-pointer shadow-lg"
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

export default ProfileSection;
