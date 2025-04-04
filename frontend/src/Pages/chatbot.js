import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send, Bot } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import logo from "./Assets/logo.png";
import Footer from "./components/footer";

const ChatbotUI = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const chatContainerRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await axios.post("http://127.0.0.1:5000/chat", {
        message: input,
      });
      const botText = response.data.response;

      setTimeout(() => {
        let currentText = "";
        const botMessage = { sender: "bot", text: currentText };
        setMessages((prev) => [...prev, botMessage]);

        botText.split("").forEach((char, index) => {
          setTimeout(() => {
            currentText += char;
            setMessages((prev) => {
              const updatedMessages = [...prev];
              updatedMessages[updatedMessages.length - 1] = {
                sender: "bot",
                text: currentText,
              };
              return updatedMessages;
            });
          }, index * 50);
        });
      }, 2200);
    } catch (error) {
      console.error("Error communicating with chatbot:", error);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      setTimeout(() => {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }, 100);
    }
  }, [messages]);

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-gray-100 overflow-hidden">
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 w-full px-6 py-4 flex items-center justify-between z-50 shadow-md bg-gradient-to-r from-purple-500 to-white"
      >
        <div>
          <Link to="/">
            <img src={logo} alt="Logo" className="h-16 md:h-20" />
          </Link>
        </div>
        <ul className="flex-1 flex justify-center space-x-6 font-semibold text-gray-800">
          {["Home", "News", "Ads", "About"].map((item, index) => (
            <motion.li key={index} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link to={`/${item.toLowerCase()}`} className="hover:text-gray-600 transition">
                {item}
              </Link>
            </motion.li>
          ))}
        </ul>
      </motion.nav>

      <motion.div
        className="absolute w-[600px] h-[600px] bg-purple-400 opacity-30 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] bg-purple-300 opacity-30 rounded-full blur-2xl"
        animate={{ scale: [1.2, 1, 1.2], rotate: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="relative w-[400px] h-[500px] bg-white shadow-2xl border-4 border-purple-500 rounded-2xl p-6 flex flex-col z-10 mt-40 mb-20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.h2 className="text-2xl font-bold text-center text-purple-600 mb-2" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          Chatbot Assistant
        </motion.h2>
        <motion.div className="flex justify-center mb-4" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <Bot size={40} className="text-purple-500" />
        </motion.div>

        <div className="flex flex-col flex-grow bg-gray-50 shadow-inner rounded-lg p-4 overflow-y-auto" ref={chatContainerRef}>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: msg.sender === "user" ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-3 my-2 max-w-xs rounded-lg ${msg.sender === "user" ? "bg-purple-500 text-white self-end" : "bg-gray-200 text-black self-start"}`}
            >
              {msg.text}
            </motion.div>
          ))}
        </div>

        <div className="flex items-center mt-4">
          <input
            type="text"
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <motion.button className="ml-2 p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700" onClick={handleSend} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Send size={20} />
          </motion.button>
        </div>
      </motion.div>

      <div className="w-full">
        <Footer />
      </div>
    </div>
  );
};

export default ChatbotUI;