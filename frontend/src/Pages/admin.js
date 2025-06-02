import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area
} from "recharts";
import { format, subDays } from "date-fns";
import { Menu, X, Home, Users, Briefcase, FileText, TrendingUp } from "lucide-react";

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

  const navItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/admin", active: true },
    { name: "Investor Management", icon: <Users size={20} />, path: "/investor-admin" },
    { name: "Company Management", icon: <Briefcase size={20} />, path: "/company-admin" },
    { name: "Content Management", icon: <FileText size={20} />, path: "/content-admin" }
  ];

  return (
    <div className="flex h-screen bg-slate-100">
      {userRole === "admin" ? (
        <>
          {/* Sidebar */}
          <aside
            className={`bg-slate-800 shadow-xl p-6 space-y-8 fixed md:relative h-full w-72 transition-all duration-300 z-20 ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white cursor-pointer flex items-center">
                <TrendingUp className="mr-2" />
                <Link to="/" className="hover:text-slate-300 transition-colors">Investo</Link>
              </h2>
              <button
                className="text-white md:hidden"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            <div className="bg-slate-700 rounded-lg p-4 text-center">
              <div className="w-16 h-16 bg-slate-300 rounded-full mx-auto mb-2 flex items-center justify-center text-slate-800 text-xl font-bold">
                AD
              </div>
              <p className="text-white font-medium">Admin Dashboard</p>
              <p className="text-slate-300 text-sm">Full Access</p>
            </div>

            <nav>
              <ul className="space-y-2">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <button
                      className={`w-full text-left flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        item.active 
                          ? "bg-slate-700 text-white font-medium" 
                          : "text-slate-300 hover:bg-slate-700 hover:text-white"
                      }`}
                      onClick={() => navigate(item.path)}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            {/* Header */}
            <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <button
                    className="md:hidden mr-4 text-slate-700 focus:outline-none"
                    onClick={() => setIsSidebarOpen(true)}
                  >
                    <Menu size={24} />
                  </button>
                  <h1 className="text-xl font-semibold text-slate-800">Admin Dashboard</h1>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-white">
                    A
                  </div>
                </div>
              </div>
            </header>

            {/* Dashboard Content */}
            <main className="p-6">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  Welcome back, Admin
                </h2>
                <p className="text-slate-600">
                  Here's what's happening with your platform today.
                </p>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 shadow-md rounded-xl border-l-4 border-slate-500 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Total Companies</p>
                      <h3 className="text-3xl font-bold text-slate-800">{stats.totalCompanies}</h3>
                      <p className="text-xs text-green-600 mt-2">↑ 12% from last month</p>
                    </div>
                    <div className="bg-slate-200 p-3 rounded-lg">
                      <Briefcase size={24} className="text-slate-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 shadow-md rounded-xl border-l-4 border-slate-400 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Total Investors</p>
                      <h3 className="text-3xl font-bold text-slate-800">{stats.totalInvestors}</h3>
                      <p className="text-xs text-green-600 mt-2">↑ 8% from last month</p>
                    </div>
                    <div className="bg-slate-200 p-3 rounded-lg">
                      <Users size={24} className="text-slate-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 shadow-md rounded-xl border-l-4 border-slate-300 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Total Ads</p>
                      <h3 className="text-3xl font-bold text-slate-800">{stats.totalAds}</h3>
                      <p className="text-xs text-green-600 mt-2">↑ 15% from last month</p>
                    </div>
                    <div className="bg-slate-200 p-3 rounded-lg">
                      <FileText size={24} className="text-slate-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="bg-white p-6 shadow-md rounded-xl mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-slate-800">
                    Ads Published - Last 30 Days
                  </h2>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={stats.adsOverTime}>
                    <defs>
                      <linearGradient id="colorAds" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#475569" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#475569" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '0.5rem',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="adsCount" 
                      stroke="#475569" 
                      fillOpacity={1} 
                      fill="url(#colorAds)" 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </main>

            {/* Footer */}
            <footer className="bg-white p-4 border-t text-center text-slate-500 text-sm">
              <p>© 2025 Investo. All rights reserved.</p>
            </footer>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center w-full">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <X size={48} className="text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-2">Unauthorized Access</h2>
            <p className="text-slate-600 mb-4">You don't have permission to view this page.</p>
            <button 
              onClick={() => navigate("/")}
              className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;