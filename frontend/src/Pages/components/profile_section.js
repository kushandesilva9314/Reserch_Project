import { motion } from "framer-motion";
import { FaUserCircle, FaImage } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import CompanyProfileButton from "./company_profile_button";

const ProfileSection = () => {
  const [companyData, setCompanyData] = useState({
    isCompany: false,
    businessName: "",
    coverPhoto: null,
    profilePhoto: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setCompanyData(prev => ({ ...prev, loading: true }));
        
        const companyResponse = await axios.get("http://localhost:3001/api/company/protected", {
          withCredentials: true,
        });

        const isCompany = companyResponse.data?.user?.role === "company";
        const businessName = isCompany 
          ? (companyResponse.data.user.companyName || "Business Name")
          : "User Profile";

          let coverPhoto = null;
          let profilePhoto = null;
          let imageError = false;
          
          try {
            const imagesResponse = await axios.get("http://localhost:3001/api/company/images/user/images", {
              withCredentials: true,
            });
          
            coverPhoto = imagesResponse.data.cover 
              ? `http://localhost:3001${imagesResponse.data.cover}` 
              : null;
            profilePhoto = imagesResponse.data.profile 
              ? `http://localhost:3001${imagesResponse.data.profile}` 
              : null;
          } catch (err) {
            imageError = true; 
          }
          
          setCompanyData({
            isCompany,
            businessName,
            coverPhoto,
            profilePhoto,
            loading: false,
            error: imageError ? "No Profile Data Uploaded" : null,
          });
          
      } catch (error) {
        console.error("Error fetching user data:", error);
        setCompanyData(prev => ({ 
          ...prev, 
          loading: false, 
          error: "Failed to load profile data" 
        }));
      }
    };

    fetchUserData();
  }, []);

  const { isCompany, businessName, coverPhoto, profilePhoto, loading, error } = companyData;

  if (loading) {
    return (
      <div className="w-full h-[28vh] bg-slate-100 flex items-center justify-center">
        <div className="animate-pulse text-slate-500">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full bg-slate-50 shadow-md rounded-b-lg h-[28vh]">
        {/* Fallback when no images or data found */}
        <div className="w-full h-[24vh] bg-gradient-to-b from-slate-300 to-slate-400 flex flex-col items-center justify-center text-slate-600 rounded-t-lg">
          <FaImage size={40} />
          <span className="mt-2 text-sm">No Profile Data Uploaded</span>
  
          {/* Company Name shown anyway */}
          <div className="mt-4 text-xl font-semibold">{businessName}</div>
  
          {/* Company Profile Button - Still visible! */}
          {isCompany && (
            <div className="absolute top-4 left-4 z-50">
              <CompanyProfileButton />
            </div>
          )}
        </div>
  
        {/* Empty bottom bar for layout consistency */}
        <div className="w-full h-[4vh] bg-slate-50 rounded-b-lg shadow-inner"></div>
      </div>
    );
  }
  

  return (
    <div className="relative w-full bg-slate-50 shadow-md rounded-b-lg h-[28vh]">
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
          {businessName}
        </motion.div>
        
        {/* Company Profile Button - Moved from right to left corner */}
        {isCompany && (
          <div className="absolute top-4 left-4 z-10">
            <CompanyProfileButton />
          </div>
        )}
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

export default ProfileSection;