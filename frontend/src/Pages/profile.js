import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Upload, User } from "lucide-react";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { useNavigate } from "react-router-dom";


const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    const fetchProfile = async () => {
      try {
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
        navigate("/");

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
      const uploadResponse = await axios.post(
        "http://localhost:3001/api/profile-picture/upload",
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );
      setImage(`http://localhost:3001${uploadResponse.data.imageUrl}`);
    } catch (err) {
      setError("Failed to upload image");
    }
  };

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (!profile) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen pt-40 flex items-center justify-center bg-gradient-to-br from-purple-300 to-blue-300">


        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-10 w-[500px] relative"
        >
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
            <label htmlFor="fileInput" className="relative cursor-pointer">
              <input
                type="file"
                id="fileInput"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg flex items-center justify-center bg-gray-200">
                {image ? (
                  <img
                    src={image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={() => setImage(null)}
                  />
                ) : (
                  <User size={64} className="text-gray-600" />
                )}
              </div>
            </label>
          </div>

          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-3xl font-semibold text-center text-gray-800 mt-14"
          >
            Profile Details
          </motion.h2>

          <div className="mt-6 space-y-3 text-lg text-gray-700">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <strong>Name:</strong> {profile.fullName}
            </motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <strong>Email:</strong> {profile.email}
            </motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <strong>Phone Number:</strong> {profile.phoneNumber}
            </motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <strong>Role:</strong> {profile.role}
            </motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <strong>Address:</strong> {profile.address}
            </motion.p>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
