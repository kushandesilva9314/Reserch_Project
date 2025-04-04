import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

const MarketNews = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/market-news");
        setNews(response.data.articles);
      } catch (error) {
        console.error("Error fetching market news:", error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="bg-gray-950 text-gray-100 min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* News Section */}
      <div className="container mx-auto py-16 px-6 md:px-12 lg:px-20 flex-1">
        <h1 className="text-5xl font-extrabold text-center mb-12 text-purple-400">
          📊 Market Insights & Trends
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {news.map((article, index) => (
            <motion.div
              key={index}
              className="bg-gray-900 rounded-3xl shadow-lg overflow-hidden transform transition duration-300 hover:shadow-xl hover:scale-105"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {article.urlToImage && (
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="w-full h-52 object-cover rounded-t-3xl"
                />
              )}

              <div className="p-6">
                <h3 className="text-xl font-bold text-purple-300 mb-3">
                  {article.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {article.description || "No description available."}
                </p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                >
                  Read More
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MarketNews;