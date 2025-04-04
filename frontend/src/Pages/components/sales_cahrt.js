import { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const SalesChart = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getMonthYearLabel = (index) => {
    const now = new Date();
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const startMonth = new Date(prevMonth);
    startMonth.setMonth(prevMonth.getMonth() - 23 + index);

    return startMonth.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/sales/get-sales", { withCredentials: true });

        if (response.data && response.data.sales.length === 24) {
          const formattedData = response.data.sales.map((value, index) => ({
            month: getMonthYearLabel(index),
            sales: value,
          }));

          setSalesData(formattedData);
        } else {
          setError("No sales information is provided by the company.");
        }
      } catch (error) {
        console.error("Error fetching sales data:", error);
        setError("Error fetching sales data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  return (
    <motion.div 
      className="bg-gray-900 shadow-2xl rounded-2xl p-10 max-w-6xl mx-auto mt-24 mb-24"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl font-bold text-gray-200 mb-8 text-center">
        Company Sales Performance (Last 24 Months)
      </h2>

      {loading ? (
        <div className="text-center text-gray-400 text-lg">Loading sales data...</div>
      ) : error ? (
        <div className="text-center text-red-400 font-semibold text-lg">{error}</div>
      ) : (
        <ResponsiveContainer width="100%" height={550}>
          <LineChart data={salesData} margin={{ top: 10, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 14, fill: "#cbd5e0" }} 
              angle={-45}  // Rotating labels for better readability
              textAnchor="end" 
              dy={20}  // Adds spacing to prevent cutting
              interval={0}  // Ensures all months are shown
            />
            <YAxis tick={{ fontSize: 14, fill: "#cbd5e0" }} tickFormatter={(value) => `LKR ${value.toLocaleString()}`} />
            <Tooltip formatter={(value) => [`LKR ${value.toLocaleString()}`, "Sales"]} />
            <Line 
              type="monotone" 
              dataKey="sales" 
              stroke="#ff6b6b" 
              strokeWidth={4} 
              dot={{ r: 6, fill: "#ff6b6b" }} 
              activeDot={{ r: 8, fill: "#ff4757" }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
};

export default SalesChart;
