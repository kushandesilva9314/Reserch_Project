import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Search, Filter, RefreshCw } from "lucide-react";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

const MarketNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "All News" },
    { id: "stocks", name: "Stocks" },
    { id: "crypto", name: "Crypto" },
    { id: "economy", name: "Economy" },
    { id: "business", name: "Business" }
  ];

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:3001/api/market-news");
      setNews(response.data.articles);
    } catch (error) {
      console.error("Error fetching market news:", error);
      setError("Failed to load market news. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleRefresh = () => {
    fetchNews();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const filteredNews = news.filter((article) => {
    const matchesSearch = article.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          article.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeCategory === "all") return matchesSearch;
    
    
    const categoryMatches = {
      stocks: ["stock", "market", "trading", "investor"],
      crypto: ["crypto", "bitcoin", "blockchain", "ethereum"],
      economy: ["economy", "inflation", "federal reserve", "economic"],
      business: ["business", "company", "corporate", "industry"]
    };
    
    const keywords = categoryMatches[activeCategory] || [];
    const matchesCategory = keywords.some(keyword => 
      (article.title?.toLowerCase().includes(keyword) || 
       article.description?.toLowerCase().includes(keyword))
    );
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-gray-950 text-gray-100 min-h-screen flex flex-col">
      <Navbar />

      <main className="container mx-auto py-8 px-4 md:py-12 lg:py-16 flex-1">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-center mb-6 text-purple-400">
              📊 Market Insights & Trends
            </h1>
            
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              {/* Search Bar */}
              <div className="relative w-full md:w-96">
                <input
                  type="text"
                  placeholder="Search market news..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full bg-gray-800 text-white py-3 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>

              {/* Category Pills */}
              <div className="flex items-center space-x-2 overflow-x-auto py-2 w-full md:w-auto">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      activeCategory === category.id
                        ? "bg-purple-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}

                <button
                  onClick={handleRefresh}
                  className="p-2 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
                  aria-label="Refresh news"
                  title="Refresh news"
                >
                  <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                </button>
              </div>
            </div>
          </header>
          
          {error && (
            <div className="bg-red-900/40 border border-red-700 text-white p-4 rounded-lg mb-8 text-center">
              <p>{error}</p>
              <button 
                onClick={handleRefresh} 
                className="mt-2 px-4 py-2 bg-red-700 hover:bg-red-600 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {loading && !error ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-900 rounded-xl shadow-lg overflow-hidden">
                  <div className="w-full h-52 bg-gray-800 animate-pulse"></div>
                  <div className="p-5">
                    <div className="h-6 bg-gray-800 rounded animate-pulse mb-3"></div>
                    <div className="h-4 bg-gray-800 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-800 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-800 rounded animate-pulse mb-4"></div>
                    <div className="h-10 bg-gray-800 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {filteredNews.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {filteredNews.map((article, index) => (
                    <motion.article
                      key={index}
                      className="bg-gray-900 rounded-xl shadow-lg overflow-hidden flex flex-col h-full transition-all hover:shadow-purple-900/20 hover:shadow-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <div className="relative">
                        {article.urlToImage ? (
                          <img
                            src={article.urlToImage}
                            alt={article.title}
                            className="w-full h-52 object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/api/placeholder/400/320";
                            }}
                          />
                        ) : (
                          <div className="w-full h-52 bg-gray-800 flex items-center justify-center">
                            <span className="text-gray-600">No image available</span>
                          </div>
                        )}
                        <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs px-2 py-1 m-2 rounded">
                          {new Date(article.publishedAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-purple-300 mb-3 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                          {article.description || "No description available."}
                        </p>
                        <div className="mt-auto">
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-center bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200"
                          >
                            Read Full Article
                          </a>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Filter className="mx-auto text-gray-500 mb-4" size={48} />
                  <h3 className="text-xl font-medium text-gray-300 mb-2">No matching articles found</h3>
                  <p className="text-gray-500 mb-6">Try adjusting your search terms or category filters</p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setActiveCategory("all");
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MarketNews;