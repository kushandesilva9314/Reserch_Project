import React, { useState, useEffect } from "react";
import Navbar from "./components/navbar";
import AdCard from "./components/ad";
import axios from "axios";

const Ads = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [ads, setAds] = useState([]);
  const [allAds, setAllAds] = useState([]);
  const [filters, setFilters] = useState({
    businessType: "",
    investment: "",
    percentage: "",
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/protected", {
          withCredentials: true,
        });
        if (response.status === 200) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  
  useEffect(() => {
    if (isAuthChecked && isAuthenticated) {
      fetchAds();
    } else if (isAuthChecked) {
      setIsLoading(false);
    }
  }, [isAuthChecked, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      applyFilters();
    }
  }, [filters, allAds, isAuthenticated]);

  const fetchAds = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:3001/api/public-ads", { withCredentials: true });
      setAllAds(response.data);
      setAds(response.data);
    } catch (error) {
      console.error("Error fetching ads:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filteredAds = allAds.filter((ad) => {
      const { businessType, investment, percentage } = filters;
      
      const matchesBusinessType = businessType ? ad.businessType === businessType : true;

      const matchesInvestment =
        investment === "<100000"
          ? ad.investment < 100000
          : investment === "100000-500000"
          ? ad.investment >= 100000 && ad.investment <= 500000
          : investment === ">500000"
          ? ad.investment > 500000
          : true;

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

  const formatInvestmentLabel = (range) => {
    if (range === "<100000") return "< $100K";
    if (range === "100000-500000") return "$100K - $500K";
    if (range === ">500000") return "> $500K";
    return range;
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* Main container with top padding to account for navbar height */}
      <div className="pt-32 min-h-screen">
        {/* Mobile filter toggle - show only if authenticated */}
        {isAuthenticated && (
          <div className="md:hidden sticky top-32 z-10 bg-white p-4 border-b shadow-sm">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        <div className="flex flex-grow">
          {/* Sidebar for filters - show only if authenticated */}
          {isAuthenticated && (
            <aside 
              className={`bg-white shadow-lg z-20 overflow-y-auto transition-all duration-300 
                ${sidebarOpen ? "fixed inset-0 pt-32 w-full bg-gray-800 bg-opacity-75" : "hidden"} 
                md:block md:sticky md:top-32 md:h-[calc(100vh-8rem)] md:w-72 md:flex-shrink-0 md:border-r md:overflow-y-auto`}
            >
              <div className="p-4 h-full bg-white md:bg-transparent">
                {/* Mobile close button */}
                <div className="flex justify-between items-center mb-4 md:hidden">
                  <h2 className="font-bold text-lg">Filters</h2>
                  <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="md:hidden h-px w-full bg-gray-200 mb-4"></div>

                {/* Desktop title */}
                <h2 className="hidden md:block font-bold text-lg mb-4">Filter Ads</h2>

                {/* Active Filters Summary */}
                {activeFiltersCount > 0 && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-blue-700">Active Filters</span>
                      <button 
                        onClick={resetFilters}
                        className="text-xs text-blue-700 hover:text-blue-900 font-medium"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {filters.businessType && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {filters.businessType}
                          <button onClick={() => handleFilterChange("businessType", filters.businessType)} className="ml-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </span>
                      )}
                      {filters.investment && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {formatInvestmentLabel(filters.investment)}
                          <button onClick={() => handleFilterChange("investment", filters.investment)} className="ml-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </span>
                      )}
                      {filters.percentage && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {filters.percentage}%
                          <button onClick={() => handleFilterChange("percentage", filters.percentage)} className="ml-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Business Type Filter */}
                  <div>
                    <h3 className="font-medium mb-3 text-gray-700">Business Type</h3>
                    <div className="space-y-2">
                      {["Startups", "SMEs", "Large Scale"].map((type) => (
                        <button
                          key={type}
                          onClick={() => handleFilterChange("businessType", type)}
                          className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition flex items-center ${
                            filters.businessType === type
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : "bg-white hover:bg-gray-50 border border-gray-200"
                          }`}
                        >
                          <span className={`h-4 w-4 rounded-full mr-2 border ${
                            filters.businessType === type 
                              ? "bg-blue-500 border-blue-500" 
                              : "bg-white border-gray-300"
                          }`}></span>
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Investment Amount Filter */}
                  <div>
                    <h3 className="font-medium mb-3 text-gray-700">Investment Amount</h3>
                    <div className="space-y-2">
                      {[
                        { value: "<100000", label: "< 100K LKR" },
                        { value: "100000-500000", label: "100K LKR - 500K LKR" },
                        { value: ">500000", label: "> 500K LKR" }
                      ].map((range) => (
                        <button
                          key={range.value}
                          onClick={() => handleFilterChange("investment", range.value)}
                          className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition flex items-center ${
                            filters.investment === range.value
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : "bg-white hover:bg-gray-50 border border-gray-200"
                          }`}
                        >
                          <span className={`h-4 w-4 rounded-full mr-2 border ${
                            filters.investment === range.value 
                              ? "bg-green-500 border-green-500" 
                              : "bg-white border-gray-300"
                          }`}></span>
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Percentage Filter */}
                  <div>
                    <h3 className="font-medium mb-3 text-gray-700">Percentage</h3>
                    <div className="space-y-2">
                      {["<10", "10-25", ">25"].map((range) => (
                        <button
                          key={range}
                          onClick={() => handleFilterChange("percentage", range)}
                          className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition flex items-center ${
                            filters.percentage === range
                              ? "bg-red-100 text-red-800 border border-red-200"
                              : "bg-white hover:bg-gray-50 border border-gray-200"
                          }`}
                        >
                          <span className={`h-4 w-4 rounded-full mr-2 border ${
                            filters.percentage === range 
                              ? "bg-red-500 border-red-500" 
                              : "bg-white border-gray-300"
                          }`}></span>
                          {range}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Main content area */}
          <main className={`flex-grow p-6 ${isAuthenticated ? 'md:ml-0' : ''} mt-4`}>
            {/* Loading state */}
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}

            {/* Not authenticated state */}
            {!isLoading && !isAuthenticated && (
              <div className="bg-white rounded-lg shadow p-8 text-center max-w-lg mx-auto">
                <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
                <p className="text-gray-500 mb-4">Please log in to view available opportunities.</p>
                <a href="/login" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Log In
                </a>
              </div>
            )}

            {/* Authenticated content */}
            {!isLoading && isAuthenticated && (
              <>
                {/* Ads count and sort options */}
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <h1 className="text-xl font-bold text-gray-900 mb-2 sm:mb-0">
                    Available Opportunities
                    {ads.length > 0 && (
                      <span className="ml-2 text-sm font-medium text-gray-500">
                        ({ads.length} {ads.length === 1 ? 'result' : 'results'})
                      </span>
                    )}
                  </h1>
                  {ads.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <label htmlFor="sort" className="text-sm font-medium text-gray-700">Sort by:</label>
                      <select
                        id="sort"
                        className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        defaultValue="newest"
                      >
                        <option value="newest">Newest First</option>
                        <option value="investment-high">Highest Investment</option>
                        <option value="investment-low">Lowest Investment</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* No results with filters applied */}
                {ads.length === 0 && (
                  <div className="bg-white rounded-lg shadow p-8 text-center">
                    <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No opportunities found</h3>
                    <p className="text-gray-500 mb-4">No ads match your selected filters. Try adjusting your criteria.</p>
                    <button
                      onClick={resetFilters}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}

                {/* Ads grid - adjusted to always have 2 columns */}
                {ads.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                    {ads.map((ad) => (
                      <div key={ad._id} className="w-full">
                        <AdCard ad={ad} />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Ads;