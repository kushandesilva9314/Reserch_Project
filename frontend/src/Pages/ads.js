import React, { useState, useEffect } from "react";
import Navbar from "./components/navbar";
import AdCard from "./components/ad";
import axios from "axios";

const Ads = () => {
  const [ads, setAds] = useState([]);
  const [filters, setFilters] = useState({
    businessType: "",
    investment: "",
    percentage: "",
  });

  const [allAds, setAllAds] = useState([]); // Store all ads from API
  useEffect(() => {
    console.log("Filters applied:", filters);
    fetchAds(filters);
  }, [filters]);

  useEffect(() => {
    applyFilters();
  }, [filters, allAds]); // Re-filter whenever filters change or ads are fetched

  const fetchAds = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/public-ads", { withCredentials: true });
      console.log("Fetched ads:", response.data);
      setAllAds(response.data); // Store all ads
      setAds(response.data); // Initially display all ads
    } catch (error) {
      console.error("Error fetching ads:", error.response?.data || error.message);
    }
  };
  
  

  const applyFilters = () => {
    let filteredAds = allAds.filter((ad) => {
      const { businessType, investment, percentage } = filters;

      // Filter Business Type
      const matchesBusinessType = businessType ? ad.businessType === businessType : true;

      // Filter Investment Amount
      const matchesInvestment =
        investment === "<100000"
          ? ad.investment < 100000
          : investment === "100000-500000"
          ? ad.investment >= 100000 && ad.investment <= 500000
          : investment === ">500000"
          ? ad.investment > 500000
          : true;

      // Filter Percentage
      const matchesPercentage =
        percentage === "<10"
          ? ad.percentage < 10
          : percentage === "10-25"
          ? ad.percentage >= 10 && ad.percentage <= 25
          : percentage === ">25"
          ? ad.percentage > 25
          : true;

      return matchesBusinessType && matchesInvestment && matchesPercentage;
    });

    setAds(filteredAds);
  };

  const handleFilterChange = (category, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [category]: prevFilters[category] === value ? "" : value,
    }));
  };

  const resetFilters = () => {
    setFilters({ businessType: "", investment: "", percentage: "" });
  };
  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      <div className="flex flex-grow">
        {/* Sidebar */}
        <aside className="w-64 p-4 bg-gray-800 text-white border-r fixed top-32 left-0 h-[calc(100vh-7rem)]
 overflow-y-auto pb-10 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          <h2 className="font-semibold mb-4">Categorization</h2>

          {/* Reset Filters Button */}
          <button
            onClick={resetFilters}
            className={`w-full px-4 py-2 mb-4 rounded-lg text-sm font-medium transition ${
              !filters.businessType && !filters.investment && !filters.percentage
                ? "bg-blue-500 text-white"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            All
          </button>

          <div className="space-y-6">
            {/* Business Type Filter */}
            <div>
              <h3 className="font-medium mb-2">Business Type</h3>
              {["Startups", "SMEs", "Large Scale"].map((type) => (
                <button
                  key={type}
                  onClick={() => handleFilterChange("businessType", type)}
                  className={`w-full px-4 py-2 mb-2 rounded-lg text-sm font-medium transition ${
                    filters.businessType === type
                      ? "bg-blue-500 text-white"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Investment Amount Filter */}
            <div>
              <h3 className="font-medium mb-2">Investment Amount</h3>
              {["<100000", "100000-500000", ">500000"].map((range) => (
                <button
                  key={range}
                  onClick={() => handleFilterChange("investment", range)}
                  className={`w-full px-4 py-2 mb-2 rounded-lg text-sm font-medium transition ${
                    filters.investment === range
                      ? "bg-green-500 text-white"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>

            {/* Percentage Filter */}
            <div>
              <h3 className="font-medium mb-2">Percentage</h3>
              {["<10", "10-25", ">25"].map((range) => (
                <button
                  key={range}
                  onClick={() => handleFilterChange("percentage", range)}
                  className={`w-full px-4 py-2 mb-2 rounded-lg text-sm font-medium transition ${
                    filters.percentage === range
                      ? "bg-red-500 text-white"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  {range}%
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Scrollable Ads Section */}
        <main
          className="flex-grow px-6 grid grid-cols-1 md:grid-cols-2 gap-6 mt-40 ml-72
                     h-[calc(100vh-4rem)] overflow-y-auto pb-10 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
        >
          {ads.length > 0 ? (
            ads.map((ad) => (
              <div key={ad._id} className="w-full">
                <AdCard ad={ad} />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-2">No ads found</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Ads;