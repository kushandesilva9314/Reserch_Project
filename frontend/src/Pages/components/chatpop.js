import { motion } from "framer-motion";
import { useState } from "react";
import { FaPaperPlane, FaTimes } from "react-icons/fa";

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
        credentials: "include", // ✅ Ensure cookies (token) are sent
        body: JSON.stringify({
          recipientEmail: companyEmail, // ✅ Correctly send ad owner's email
          subject: "Request for Investment", // ✅ Fixed common subject
          message, // ✅ Typed message from user
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      alert("Message sent successfully!");
      setMessage("");
      onClose();
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl flex flex-col relative"
      >
        {/* Close Button */}
        <button className="absolute top-4 left-4 text-gray-600 hover:text-gray-900" onClick={onClose}>
          <FaTimes size={20} />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-center mb-6">Chat with {companyName}</h2>

        {/* Message Input */}
        <textarea
          className="w-full p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg h-40"
          placeholder="Enter your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {/* Send Button */}
        <div className="flex justify-between items-center mt-6">
          <span className="text-sm text-gray-500">
            This message will be sent as an email. You can continue your chat via email.
          </span>
          <button
            className="flex items-center bg-blue-500 text-white px-5 py-3 rounded-lg hover:bg-blue-600 text-lg"
            onClick={handleSend}
            disabled={loading}
          >
            <FaPaperPlane className="mr-2" /> {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatPopup;
