import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, Sparkles, Smile, Image, Paperclip } from "lucide-react";
import axios from "axios";
import Footer from "./components/footer";
import Navbar from "./components/navbar"; 

const ChatbotUI = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AI assistant. How can I help you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [theme, setTheme] = useState("slate");
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  const themeColors = {
    slate: {
      primary: "bg-slate-700",
      secondary: "bg-slate-600",
      accent: "bg-slate-400",
      text: "text-slate-700",
      border: "border-slate-600",
      hover: "hover:bg-slate-800",
      gradient: "from-slate-600 to-slate-800",
    },
    blue: {
      primary: "bg-blue-600",
      secondary: "bg-blue-500",
      accent: "bg-blue-300",
      text: "text-blue-600",
      border: "border-blue-500",
      hover: "hover:bg-blue-700",
      gradient: "from-blue-400 to-cyan-500",
    },
    teal: {
      primary: "bg-teal-600",
      secondary: "bg-teal-500",
      accent: "bg-teal-300",
      text: "text-teal-600",
      border: "border-teal-500",
      hover: "hover:bg-teal-700",
      gradient: "from-teal-400 to-green-500",
    },
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await axios.post("http://127.0.0.1:5000/chat", {
        message: input,
      });
      const botText = response.data.response;

      setTimeout(() => {
        setIsTyping(false);
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
          }, index * 30); 
        });
      }, 1000); 
    } catch (error) {
      setIsTyping(false);
      setMessages((prev) => [...prev, { 
        sender: "bot", 
        text: "Sorry, I encountered an error. Please try again later." 
      }]);
      console.error("Error communicating with chatbot:", error);
    }
  };

  const changeTheme = () => {
    const themes = Object.keys(themeColors);
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const colors = themeColors[theme];

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-gray-50 overflow-hidden">
      <Navbar />

      {/* Background animations */}
      <motion.div
        className={`absolute w-[600px] h-[600px] ${colors.accent} opacity-20 rounded-full blur-3xl`}
        animate={{ 
          scale: [1, 1.2, 1], 
          rotate: [0, 20, 0],
          x: ["-10%", "10%", "-10%"],
          y: ["-5%", "5%", "-5%"]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={`absolute w-[500px] h-[500px] ${colors.secondary} opacity-20 rounded-full blur-2xl`}
        animate={{ 
          scale: [1.2, 1, 1.2], 
          rotate: [0, -20, 0],
          x: ["5%", "-5%", "5%"],
          y: ["10%", "-10%", "10%"]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Theme selector */}
      <motion.button
        onClick={changeTheme}
        className="absolute top-24 right-4 z-20 p-3 bg-white rounded-full shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Sparkles size={20} className={colors.text} />
      </motion.button>

      <motion.div
        className={`relative w-[450px] max-w-full h-[600px] bg-white shadow-2xl border-4 ${colors.border} rounded-2xl p-6 flex flex-col z-10 mt-40 mb-16 overflow-hidden`}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Header */}
        <motion.div 
          className={`p-4 rounded-xl mb-4 bg-gradient-to-r ${colors.gradient} text-white`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mr-3"
            >
              <Bot size={30} />
            </motion.div>
            <div>
              <h2 className="text-xl font-bold">AI Assistant</h2>
              <p className="text-sm opacity-80">Always here to help</p>
            </div>
          </div>
        </motion.div>

        {/* Chat container */}
        <div 
          className="flex flex-col flex-grow bg-gray-50 shadow-inner rounded-lg p-4 overflow-y-auto mb-4" 
          ref={chatContainerRef}
          onClick={focusInput}
        >
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: msg.sender === "user" ? 20 : -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} my-2`}
              >
                <div className={`p-4 max-w-xs rounded-2xl ${
                  msg.sender === "user" 
                    ? `${colors.primary} text-white` 
                    : "bg-white border border-gray-200 text-gray-800 shadow-sm"
                }`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex justify-start my-2"
              >
                <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm">
                  <div className="flex space-x-2">
                    <motion.div
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, delay: 0.2, repeat: Infinity }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, delay: 0.4, repeat: Infinity }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input area */}
        <div className="relative">
          <div className="flex items-center mb-1">
            <motion.button className="p-2 text-gray-400 hover:text-gray-600 rounded-full" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Smile size={20} />
            </motion.button>
            <motion.button className="p-2 text-gray-400 hover:text-gray-600 rounded-full" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Paperclip size={20} />
            </motion.button>
            <motion.button className="p-2 text-gray-400 hover:text-gray-600 rounded-full" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Image size={20} />
            </motion.button>
          </div>
          
          <div className="flex items-center">
            <input
              ref={inputRef}
              type="text"
              className="flex-grow p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-slate-400 bg-white"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <motion.button 
              className={`ml-2 p-4 ${colors.primary} text-white rounded-lg ${colors.hover}`} 
              onClick={handleSend} 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Send size={20} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="w-full">
        <Footer />
      </div>
    </div>
  );
};

export default ChatbotUI;