import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChartLine, FaComments, FaStar, FaArrowRight, FaBuilding } from "react-icons/fa";
import ChatPopup from "./chatpop";

const AdCard = ({ ad }) => {
  const { companyName, businessType, investment, percentage, description, companyEmail } = ad;
  const [expanded, setExpanded] = useState(false);
  const [predictedSale, setPredictedSale] = useState(null);
  const [predictedROI, setPredictedROI] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();

  const fetchPrediction = async () => {
    const url = `http://localhost:3001/api/predict/${companyEmail}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch prediction");
      const data = await response.json();
      const sales = data.predicted_sales;
      const roi = (sales * percentage) / 100;

      setPredictedSale(sales);
      setPredictedROI(roi);
      setShowPopup(true);
    } catch (error) {
      console.error("Error fetching prediction:", error);
    }
  };

  return (
    <>
      <div className="w-full sm:w-80 overflow-hidden shadow-xl rounded-2xl border border-gray-200 bg-white transform transition-all hover:shadow-2xl">
        {/* Company Banner with Logo and Type */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-3 px-4 flex justify-between items-center">
          <div className="flex items-center">
            <FaBuilding className="mr-2" />
            <h2 
              className="text-xl font-bold cursor-pointer hover:underline"
              onClick={() => navigate("/company_uv", { state: { companyEmail } })}
            >
              {companyName}
            </h2>
          </div>
          <span className="text-xs bg-white text-blue-700 px-2 py-1 rounded-full font-medium">
            {businessType}
          </span>
        </div>
        
        {/* Main Content */}
        <div className="p-5">
          {/* Investment Summary in a Card */}
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 mb-4 border border-yellow-200">
            <h3 className="text-gray-700 font-semibold mb-2 text-center">Investment Opportunity</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white p-2 rounded text-center">
                <div className="text-sm text-gray-500">Investment</div>
                <div className="font-bold text-gray-900">LKR {investment}</div>
              </div>
              <div className="bg-white p-2 rounded text-center">
                <div className="text-sm text-gray-500">Equity</div>
                <div className="font-bold text-green-600">{percentage}%</div>
              </div>
            </div>
          </div>

          {/* Description with clean styling */}
          <div className="mb-4">
            <h3 className="text-gray-700 font-semibold mb-2">About the Opportunity</h3>
            <div className="text-gray-600 bg-gray-50 p-3 rounded-lg text-sm">
              {expanded ? description : `${description.slice(0, 100)}...`}
              {description.length > 100 && (
                <button
                  className="text-blue-600 font-medium ml-1 hover:underline flex items-center text-sm mt-1"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? "Show Less" : "Read More"} 
                  <FaArrowRight className={`ml-1 transition-transform ${expanded ? "rotate-180" : ""}`} size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center text-yellow-400 mb-4">
            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
            <span className="text-xs text-gray-500 ml-2">Verified Opportunity</span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              className="flex items-center justify-center bg-blue-600 text-white py-2 px-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              onClick={fetchPrediction}
            >
              <FaChartLine className="mr-1" /> Predict Returns
            </button>
            <button
              className="flex items-center justify-center bg-green-600 text-white py-2 px-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              onClick={() => setShowChat(true)}
            >
              <FaComments className="mr-1" /> Chat
            </button>
          </div>
        </div>

        {/* Prediction Popup */}
        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md border-2 border-blue-500">
              <h2 className="text-2xl font-bold mb-4 text-blue-800 border-b pb-2">Investment Forecast</h2>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <div className="text-gray-800 text-lg font-semibold mb-3">
                  📈 Predicted Monthly Sales: 
                  <div className="text-2xl text-blue-700">
                    LKR {predictedSale ? predictedSale.toFixed(2) : "N/A"}
                  </div>
                </div>
                <div className="text-gray-800 text-lg font-semibold">
                  💰 Your Potential Return:
                  <div className="text-2xl text-green-600">
                    LKR {predictedROI ? predictedROI.toFixed(2) : "N/A"}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Based on {percentage}% equity of your LKR {investment} investment
                  </div>
                </div>
              </div>
              <button
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-bold"
                onClick={() => setShowPopup(false)}
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Chat Popup */}
      {showChat && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowChat(false)}></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-90 z-10">
            <ChatPopup companyName={companyName} companyEmail={companyEmail} onClose={() => setShowChat(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default AdCard;