import { useState } from "react";
import { FaChartLine, FaComments } from "react-icons/fa";
import ChatPopup from "./chatpop";

const AdCard = ({ ad }) => {
  const { companyName, businessType, investment, percentage, description, companyEmail } = ad;
  const [expanded, setExpanded] = useState(false);
  const [predictedSale, setPredictedSale] = useState(null);
  const [predictedROI, setPredictedROI] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const fetchPrediction = async () => {
    const url = `http://localhost:3001/api/predict/${companyEmail}`;
    console.log("Fetching prediction:", url);
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
    <div className="w-full sm:w-80 p-4 shadow-lg rounded-2xl border border-gray-300 bg-white">
      <div className="flex flex-col sm:flex-row justify-between font-semibold text-lg mb-2">
        <span>{companyName}</span>
        <span className="text-sm text-gray-500 mt-2 sm:mt-0">{businessType}</span>
      </div>
      <div className="flex flex-col sm:flex-row justify-between text-gray-700 mb-2">
        <span>Investment: LKR {investment}</span>
        <span>{percentage}% Equity</span>
      </div>
      <div className="text-sm text-gray-600 mb-3">
        {expanded ? description : `${description.slice(0, 100)}...`}
        {description.length > 100 && (
          <button
            className="text-blue-600 text-xs ml-1 underline"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Read Less" : "Read More"}
          </button>
        )}
      </div>
      <div className="flex flex-col sm:flex-row justify-between mt-2">
        <button
          className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 mb-2 sm:mb-0"
          onClick={fetchPrediction}
        >
          <FaChartLine className="mr-2" /> Predict
        </button>
        <button
          className="flex items-center bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
          onClick={() => setShowChat(true)}
        >
          <FaComments className="mr-2" /> Chat
        </button>
      </div>
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Predicted Sales & ROI</h2>
            <div className="text-gray-700 text-lg font-semibold mb-2">
              📈 Predicted Sales for Next Month: <br />
              <span className="text-xl">LKR {predictedSale ? predictedSale.toFixed(2) : "N/A"}</span>
            </div>
            <div className="text-gray-700 text-lg font-semibold">
              💰 Predicted ROI for your investment of <span className="font-bold">LKR {investment}</span> 
              at <span className="font-bold">{percentage}%</span> equity:
              <br />
              <span className="text-xl">LKR {predictedROI ? predictedROI.toFixed(2) : "N/A"}</span>
            </div>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showChat && <ChatPopup
          companyName={companyName}
          companyEmail={companyEmail} 
          onClose={() => setShowChat(false)}
        />}
    </div>
  );
};

export default AdCard;
