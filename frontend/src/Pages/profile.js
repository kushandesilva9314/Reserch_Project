import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { User, Camera } from "lucide-react";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileResponse = await axios.get("http://localhost:3001/api/profile", {
          withCredentials: true,
        });
        setProfile(profileResponse.data);

        const imageResponse = await axios.get("http://localhost:3001/api/profile-picture/get", {
          withCredentials: true,
        });

        setImage(imageResponse.data.imageUrl ? `http://localhost:3001${imageResponse.data.imageUrl}` : null);
      } catch (err) {
        setError("Unauthorized access. Redirecting...");
        setTimeout(() => navigate("/"), 2000);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      setLoading(true);
      const uploadResponse = await axios.post(
        "http://localhost:3001/api/profile-picture/upload",
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );
      setImage(`http://localhost:3001${uploadResponse.data.imageUrl}`);
    } catch (err) {
      setError("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-red-500 text-center text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />
      {/* Adjusted padding-top to account for 128px navbar height + some extra space */}
      <div className="pt-40 pb-16 px-4 flex items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-600">Loading your profile...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden max-w-md w-full"
          >
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-slate-700 to-slate-900 p-6 relative pb-24">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="text-2xl font-bold text-white text-center"
              >
                {profile?.fullName || "User Profile"}
              </motion.h2>
              <p className="text-slate-300 text-center">{profile?.email}</p>
            </div>

            {/* Profile Image */}
            <div className="relative -mt-16 flex justify-center mb-4">
              <label htmlFor="fileInput" className="relative cursor-pointer group">
                <input
                  type="file"
                  id="fileInput"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  {image ? (
                    <img
                      src={image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={() => setImage(null)}
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                      <User size={64} className="text-slate-500" />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 bg-slate-600 hover:bg-slate-700 transition-colors p-2 rounded-full shadow-md">
                  <Camera size={18} className="text-white" />
                </div>
              </label>
            </div>

            {/* Profile Info */}
            <div className="p-6">
              <div className="space-y-4">
                <ProfileItem label="Full Name" value={profile?.fullName} delay={0.3} />
                <ProfileItem label="Email" value={profile?.email} delay={0.4} />
                <ProfileItem label="Phone" value={profile?.phoneNumber} delay={0.5} />
                <ProfileItem label="Role" value={profile?.role} delay={0.6} />
                <ProfileItem label="Address" value={profile?.address} delay={0.7} />
              </div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 w-full bg-slate-700 hover:bg-slate-800 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Edit Profile
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
};

const ProfileItem = ({ label, value, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="flex flex-col"
  >
    <span className="text-sm text-slate-500 font-medium">{label}</span>
    <span className="text-slate-800 font-medium">{value || "Not provided"}</span>
    <div className="mt-2 h-px bg-slate-100"></div>
  </motion.div>
);

export default Profile;