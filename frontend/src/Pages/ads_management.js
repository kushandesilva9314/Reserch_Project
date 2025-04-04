import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaEye, FaTrashAlt, FaTimes } from "react-icons/fa";
import logo from "../Pages/Assets/logo.png";

const API_BASE_URL = "http://localhost:3001/api/ads";

const fetchAds = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "GET",
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching ads:", error);
    return [];
  }
};

const addAd = async (adData) => {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(adData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error adding ad:", error);
  }
};

const deleteAd = async (adId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${adId}`, {
      method: "DELETE",
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.error("Error deleting ad:", error);
  }
};

const AdsPage = () => {
  const [ads, setAds] = useState([]);
  const [investment, setInvestment] = useState("");
  const [percentage, setPercentage] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAd, setSelectedAd] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAds = async () => {
      const adsData = await fetchAds();
      setAds(adsData);
    };
    loadAds();
  }, []);

  const handleAddAd = async () => {
    if (!investment || !percentage || !description) {
      alert("All fields are required!");
      return;
    }
    if (percentage < 1 || percentage > 100) {
      alert("Percentage must be between 1 and 100");
      return;
    }
    const newAd = { investment: Number(investment), percentage, description };
    const result = await addAd(newAd);
    if (result?.message === "Ad created successfully") {
      setAds([...ads, result.ad]);
      setInvestment("");
      setPercentage("");
      setDescription("");
    } else {
      alert("Failed to add ad!");
    }
  };

  const handleDeleteAd = async (id) => {
    const result = await deleteAd(id);
    if (result?.message === "Ad deleted successfully") {
      setAds(ads.filter((ad) => ad._id !== id));
    } else {
      alert("Failed to delete ad!");
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <img src={logo} alt="Logo" className="absolute top-4 left-4 w-16 cursor-pointer" onClick={() => navigate("/")} />
      <div className="p-6 max-w-2xl mx-auto bg-white rounded-2xl shadow-lg w-full">
        <div className="flex items-center mb-4">
          <FaHome className="text-2xl cursor-pointer text-blue-500 hover:text-blue-700 transition" onClick={() => navigate("/")} />
          <h1 className="text-2xl font-semibold text-gray-800 ml-2">Ads</h1>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-md mb-6 border border-gray-200 space-y-3">
          <div className="relative">
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
              placeholder="Investment Amount (LKR)"
              value={investment}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, "");
                setInvestment(val);
              }}
            />
          </div>
          <input
            type="number"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Percentage (1-100)"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            min="1"
            max="100"
          />
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Investment Description"
            rows="2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition" onClick={handleAddAd}>
            Add Ad
          </button>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Your Ads</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-600">
                <th className="p-3 text-left">Investment</th>
                <th className="p-3 text-left">Percentage</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ads.length > 0 ? (
                ads.map((ad) => (
                  <tr key={ad._id} className="border-b">
                    <td className="p-3">LKR {ad.investment.toLocaleString()}</td>
                    <td className="p-3">{ad.percentage}%</td>
                    <td className="p-3 flex space-x-2">
                      <button className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition" onClick={() => setSelectedAd(ad)}>
                        <FaEye />
                      </button>
                      <button className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition" onClick={() => handleDeleteAd(ad._id)}>
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-500">No ads found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup Modal */}
      {selectedAd && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setSelectedAd(null)}
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-bold mb-4">Ad Details</h2>
            <p><strong>Investment:</strong> LKR {selectedAd.investment.toLocaleString()}</p>
            <p><strong>Percentage:</strong> {selectedAd.percentage}%</p>
            <p><strong>Description:</strong> {selectedAd.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdsPage;