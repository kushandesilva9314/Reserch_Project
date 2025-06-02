import { motion } from "framer-motion";
import { useState } from "react";
import { FaPaperPlane, FaTimes, FaUser, FaBuilding } from "react-icons/fa";

const ChatPopup = ({ companyName, companyEmail, onClose }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
        body: JSON.stringify({
          recipientEmail: companyEmail, 
          subject: "Request for Investment", 
          message, 
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      // Success feedback
      setSuccessMessage(true);
      setTimeout(() => {
        setMessage("");
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  const [successMessage, setSuccessMessage] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center p-4 z-50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", damping: 20 }}
        className="bg-gray-900 p-6 rounded-xl shadow-2xl w-full max-w-lg flex flex-col relative border border-purple-500"
      >
        {/* Close Button */}
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-white bg-gray-800 p-2 rounded-full transition-colors"
          onClick={onClose}
        >
          <FaTimes size={16} />
        </button>

        {/* Header with Company Info */}
        <div className="flex items-center mb-6 border-b border-gray-700 pb-4">
          <div className="bg-purple-700 p-3 rounded-full mr-3">
            <FaBuilding className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{companyName}</h2>
            <p className="text-gray-400 text-sm">{companyEmail}</p>
          </div>
        </div>

        {/* Message Input */}
        <div className="relative mb-4 flex-grow">
          <div className="absolute top-3 left-3 text-gray-500">
            <FaUser size={16} />
          </div>
          <textarea
            className="w-full p-4 pl-10 border border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-200 bg-gray-800 min-h-40"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {/* Character Count & Info */}
        <div className="flex justify-between items-center mb-4 text-sm">
          <span className="text-gray-400">
            {message.length} / 1000 characters
          </span>
          <span className="text-gray-400 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            This will be sent as an email
          </span>
        </div>

        {/* Send Button */}
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center justify-center ${
              message.trim() ? "bg-purple-600 hover:bg-purple-500" : "bg-gray-600 cursor-not-allowed"
            } text-white px-5 py-3 rounded-lg text-lg font-medium w-full sm:w-auto transition-colors`}
            onClick={handleSend}
            disabled={loading || !message.trim()}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            ) : (
              <span className="flex items-center">
                <FaPaperPlane className="mr-2" /> Send Message
              </span>
            )}
          </motion.button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 rounded-xl"
          >
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 text-white mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
              <p className="text-gray-300">Your message has been sent successfully.</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ChatPopup;