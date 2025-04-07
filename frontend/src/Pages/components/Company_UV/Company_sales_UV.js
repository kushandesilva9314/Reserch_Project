import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const CompanySalesUV = ({ companyEmail }) => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalLastYear: 0,
    totalThisYear: 0,
    average: 0,
    growthRate: 0,
  });

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

  const calculateStats = (data) => {
    const last12 = data.slice(0, 12).reduce((acc, cur) => acc + cur, 0);
    const current12 = data.slice(12).reduce((acc, cur) => acc + cur, 0);
    const average = data.reduce((acc, cur) => acc + cur, 0) / data.length;
    const growthRate = ((current12 - last12) / last12) * 100;
    setStats({
      totalLastYear: last12,
      totalThisYear: current12,
      average,
      growthRate,
    });
  };

  useEffect(() => {
    if (!companyEmail) return;

    const fetchSalesData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/sales/company/${companyEmail}`
        );
        if (response.data && response.data.sales.length === 24) {
          const formattedData = response.data.sales.map((value, index) => ({
            month: getMonthYearLabel(index),
            sales: value,
          }));
          setSalesData(formattedData);
          calculateStats(response.data.sales);
        } else {
          setError("No sales data found for this company.");
        }
      } catch (err) {
        console.error("Error fetching sales data:", err);
        setError("Error fetching sales data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [companyEmail]);

  const formatCurrency = (num) =>
    `LKR ${num.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

  return (
    <motion.div
      className="bg-[#0f172a] shadow-2xl rounded-2xl p-10 max-w-7xl mx-auto mt-24 mb-24"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-4xl font-bold text-white mb-12 text-center tracking-wide">
        📊 Company Sales Performance
      </h2>

      {loading ? (
        <div className="text-center text-gray-400 text-lg">
          Loading sales data...
        </div>
      ) : error ? (
        <div className="text-center text-red-400 font-semibold text-lg">
          {error}
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              {
                label: "Last Year Sales",
                value: formatCurrency(stats.totalLastYear),
                color: "text-blue-400",
              },
              {
                label: "Current Year Sales",
                value: formatCurrency(stats.totalThisYear),
                color: "text-purple-400",
              },
              {
                label: "Average Monthly Sales",
                value: formatCurrency(stats.average),
                color: "text-yellow-300",
              },
              {
                label: "Sales Growth Rate",
                value: `${stats.growthRate.toFixed(2)}%`,
                color:
                  stats.growthRate >= 0
                    ? "text-green-400"
                    : "text-red-400",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-gradient-to-tr from-gray-800 to-gray-900 p-6 rounded-2xl shadow-lg hover:shadow-blue-500/30 transition-shadow duration-300 text-center border border-gray-700"
              >
                <p className="text-gray-400 text-sm mb-1 uppercase tracking-wide">
                  {stat.label}
                </p>
                <h3 className={`text-2xl font-semibold ${stat.color}`}>
                  {stat.value}
                </h3>
              </div>
            ))}
          </div>

          {/* Sales Chart */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
            <ResponsiveContainer width="100%" height={500}>
              <LineChart
                data={salesData}
                margin={{ top: 10, right: 30, left: 20, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#cbd5e0" }}
                  angle={-45}
                  textAnchor="end"
                  dy={20}
                  interval={0}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#cbd5e0" }}
                  tickFormatter={(value) =>
                    `LKR ${value.toLocaleString()}`
                  }
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderColor: "#475569",
                  }}
                  itemStyle={{ color: "#f8fafc" }}
                  formatter={(value) => [`LKR ${value.toLocaleString()}`, "Sales"]}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  dot={{ r: 5, stroke: "#38bdf8", fill: "#1e3a8a" }}
                  activeDot={{ r: 7, fill: "#0ea5e9", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default CompanySalesUV;
