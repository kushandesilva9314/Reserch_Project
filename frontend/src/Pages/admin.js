import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subDays } from "date-fns";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalInvestors: 0,
    totalAds: 0,
    adsOverTime: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/protected", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();
        if (!response.ok || data.user.role !== "admin") {
          navigate("/");
        } else {
          setUserRole(data.user.role);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        navigate("/");
      }
    };

    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/admin/stats");
        const data = await res.json();

        const today = new Date();
        const allDates = [];
        for (let i = 29; i >= 0; i--) {
          const d = subDays(today, i);
          allDates.push(format(d, "yyyy-MM-dd"));
        }

        const adsMap = {};
        data.adsOverTime.forEach((item) => {
          adsMap[item._id] = item.adsCount;
        });

        const dailyData = allDates.map((dateStr) => ({
          date: format(new Date(dateStr), "MMM d"),
          adsCount: adsMap[dateStr] || 0,
        }));

        setStats({ ...data, adsOverTime: dailyData });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    checkAuth();
    fetchStats();
  }, [navigate]);

  return (
    <div className="flex h-screen bg-gray-100">
      {userRole === "admin" ? (
        <>
          <aside
            className={`bg-gray-800 shadow-md p-6 space-y-6 fixed md:relative h-full w-64 transition-transform ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-64"
            } md:translate-x-0`}
          >
            <h2 className="text-2xl font-bold text-white cursor-pointer">
              <Link to="/">Investo</Link>
            </h2>
            <nav>
              <ul className="space-y-4">
                <li
                  className="text-white font-medium hover:bg-gray-700 p-2 rounded-lg cursor-pointer"
                  onClick={() => navigate("/admin")}
                >
                  Dashboard
                </li>
                <li
                  className="text-gray-300 hover:bg-gray-700 p-2 rounded-lg cursor-pointer"
                  onClick={() => navigate("/investor-admin")}
                >
                  Investor Management
                </li>
                <li
                  className="text-gray-300 hover:bg-gray-700 p-2 rounded-lg cursor-pointer"
                  onClick={() => navigate("/company-admin")}
                >
                  Company Management
                </li>
                <li
                  className="text-gray-300 hover:bg-gray-700 p-2 rounded-lg cursor-pointer"
                  onClick={() => navigate("/content-admin")}
                >
                  Content Management
                </li>
              </ul>
            </nav>
          </aside>

          <div className="flex-1 p-6">
            <div className="md:hidden flex justify-between items-center bg-gray-800 text-white p-4 rounded-md mb-4">
              <h2 className="text-xl font-bold">Investo</h2>
              <button
                className="text-white focus:outline-none"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                ☰
              </button>
            </div>

            <h1 className="text-3xl font-semibold text-gray-800 mb-6">
              Welcome to the Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 shadow-lg rounded-lg">
                <h2 className="text-xl font-semibold text-gray-700">
                  Total Companies
                </h2>
                <p className="text-3xl font-bold text-indigo-600">
                  {stats.totalCompanies}
                </p>
              </div>
              <div className="bg-white p-6 shadow-lg rounded-lg">
                <h2 className="text-xl font-semibold text-gray-700">
                  Total Investors
                </h2>
                <p className="text-3xl font-bold text-green-600">
                  {stats.totalInvestors}
                </p>
              </div>
              <div className="bg-white p-6 shadow-lg rounded-lg">
                <h2 className="text-xl font-semibold text-gray-700">
                  Total Ads
                </h2>
                <p className="text-3xl font-bold text-red-600">
                  {stats.totalAds}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 shadow-lg rounded-lg">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Ads Published Over the Past 30 Days
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.adsOverTime}>
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="adsCount"
                    stroke="#4A90E2"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      ) : (
        <p className="text-red-500 text-center mt-20">Unauthorized Access</p>
      )}
    </div>
  );
};

export default Dashboard;
