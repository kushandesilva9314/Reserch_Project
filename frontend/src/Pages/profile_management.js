import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Lock, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "./Assets/logo.png";
import Post from "./components/post";

export default function ImageUploadPage() {
  const [images, setImages] = useState({ profile: null, cover: null });
  const [selectedImages, setSelectedImages] = useState({ profile: null, cover: null });
  const navigate = useNavigate();

  const fetchImages = async () => {
    const res = await axios.get("http://localhost:3001/api/images", { withCredentials: true });
    setImages(res.data || { profile: null, cover: null });
  };

  useEffect(() => { fetchImages(); }, []);

  const handleImageSelect = (e, type) => {
    const file = e.target.files[0];
    if (file) setSelectedImages((prev) => ({ ...prev, [type]: file }));
  };

  const handleRemoveSelectedImage = (type) => {
    setSelectedImages((prev) => ({ ...prev, [type]: null }));
  };

  const handleImageUpload = async () => {
    for (const type of ["profile", "cover"]) {
      if (selectedImages[type]) {
        const formData = new FormData();
        formData.append("image", selectedImages[type]);
        await axios.post(`http://localhost:3001/api/upload/${type}`, formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
    }
    fetchImages();
    setSelectedImages({ profile: null, cover: null });
  };

  const handleRemoveImage = async (type) => {
    await axios.delete(`http://localhost:3001/api/delete/${type}`, { withCredentials: true });
    fetchImages();
  };

  return (
    <div className="p-6 space-y-6 bg-slate-900 min-h-screen text-slate-100">
      <div className="flex items-center justify-between">
        <img
          src={logo}
          alt="Logo"
          className="h-12 cursor-pointer"
          onClick={() => navigate("/company")}
        />
        <h1 className="text-2xl font-bold text-center flex-1 text-slate-100">Profile Management</h1>
      </div>

      <div className="border border-slate-700 rounded-2xl p-6 shadow-xl space-y-6 bg-slate-800">
        <div className="grid grid-cols-2 gap-6">
          {['profile', 'cover'].map((type) => (
            <div key={type} className="space-y-4">
              <label className="block mb-2 font-semibold capitalize text-slate-200">{type} picture</label>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative border border-slate-600 rounded-2xl p-3 shadow-md bg-slate-700"
              >
                {images[type] ? (
                  <div className="relative">
                    <img
                      src={`http://localhost:3001${images[type]}`}
                      alt={`${type} preview`}
                      className="rounded-2xl w-full h-48 object-contain"
                    />
                    <div className="absolute top-2 right-2">
                      <button
                        className="bg-red-500 p-1 rounded-full"
                        onClick={() => handleRemoveImage(type)}
                      >
                        <X className="text-white" />
                      </button>
                    </div>
                    <div className="absolute top-2 left-2">
                      <Lock className="text-white bg-black p-1 rounded-full" />
                    </div>
                  </div>
                ) : selectedImages[type] ? (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(selectedImages[type])}
                      alt={`${type} preview`}
                      className="rounded-2xl w-full h-48 object-contain"
                    />
                    <div className="absolute top-2 right-2">
                      <button
                        className="bg-red-500 p-1 rounded-full"
                        onClick={() => handleRemoveSelectedImage(type)}
                      >
                        <X className="text-white" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageSelect(e, type)}
                    />
                    <div className="w-full h-48 flex items-center justify-center border-2 border-dashed border-slate-500 rounded-2xl text-slate-400">
                      Upload {type} picture
                    </div>
                  </label>
                )}
              </motion.div>
            </div>
          ))}
        </div>
        <button
          className="mt-4 flex items-center px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500"
          onClick={handleImageUpload}
        >
          <Upload className="mr-2" /> Add
        </button>
      </div>
      <hr className="border-t border-slate-700 mt-6 w-full" />
      <Post />
    </div>
  );
}
