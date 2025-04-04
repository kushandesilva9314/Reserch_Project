import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../Pages/Assets/logo.png";

export default function SalesTracker() {
  const navigate = useNavigate();
  const [sales, setSales] = useState(Array(24).fill(""));
  const [currentMonthSales, setCurrentMonthSales] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/sales/get-sales", { withCredentials: true });
        const fetchedSales = res.data.sales || [];
        setSales(fetchedSales.slice(0, 24).map((val) => (val !== null ? val : "")));
        setSubmitted(fetchedSales.length === 24);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sales data:", error);
        alert("Failed to fetch sales data.");
      }
    };
    fetchSales();
  }, []);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const timeLeft = nextMonth - now;

      if (timeLeft > 0) {
        setIsButtonDisabled(true);
        const interval = setInterval(() => {
          const remainingTime = nextMonth - new Date();
          if (remainingTime <= 0) {
            clearInterval(interval);
            setTimer("00d 00:00:00");
            setIsButtonDisabled(false);
          } else {
            const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
            const hours = String(Math.floor((remainingTime / (1000 * 60 * 60)) % 24)).padStart(2, "0");
            const minutes = String(Math.floor((remainingTime / (1000 * 60)) % 60)).padStart(2, "0");
            const seconds = String(Math.floor((remainingTime / 1000) % 60)).padStart(2, "0");
            setTimer(`${days}d ${hours}:${minutes}:${seconds}`);
          }
        }, 1000);
        return () => clearInterval(interval);
      } else {
        setIsButtonDisabled(false);
      }
    };
    updateTimer();
  }, [sales]);

  const getMonthYearLabel = (index) => {
    const now = new Date();
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const startMonth = new Date(prevMonth);
    startMonth.setMonth(prevMonth.getMonth() - 23 + index);

    return startMonth.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
  };

  const getCurrentMonthYear = () => {
    const now = new Date();
    return now.toLocaleString("default", { month: "long", year: "numeric" });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      <div className="p-6 max-w-6xl mx-auto">
        <img
          src={logo}
          alt="Logo"
          className="w-12 h-12 cursor-pointer mb-6"
          onClick={() => navigate("/company")}
        />

        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Sales Information</h1>

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : !submitted ? (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center bg-white p-4 rounded-xl shadow">
                <span className="text-sm font-semibold text-gray-600 mb-2">{getMonthYearLabel(i)}</span>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-lg text-center focus:outline-none appearance-none"
                  value={sales[i] || ""}
                  onChange={(e) => {
                    const updatedSales = [...sales];
                    updatedSales[i] = e.target.value;
                    setSales(updatedSales);
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mt-6">
            <p className="text-lg font-semibold text-gray-700">Delete all sales information</p>
            <button
              onClick={() => {
                axios
                  .delete("http://localhost:3001/api/sales/delete-sales", { withCredentials: true })
                  .then(() => {
                    setSubmitted(false);
                    setSales(Array(24).fill(""));
                    setCurrentMonthSales("");
                  })
                  .catch((error) => {
                    console.error("Error deleting sales data:", error);
                    alert("Failed to delete sales data.");
                  });
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-red-600 transition-all"
            >
              Delete
            </button>
          </div>
        )}

        {!submitted && (
          <button
            onClick={() => {
              const numericSales = sales.map((value) => parseFloat(value) || 0);
              if (numericSales.length !== 24 || numericSales.some(isNaN)) {
                alert("Please enter valid sales data for all 24 months.");
                return;
              }
              axios
                .post("http://localhost:3001/api/sales/add-sales", { sales: numericSales }, { withCredentials: true })
                .then(() => {
                  setSubmitted(true);
                })
                .catch((error) => {
                  console.error("Error adding initial sales data:", error);
                  alert("Failed to add initial sales data.");
                });
            }}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg mt-6 w-full hover:bg-blue-600 transition-all"
          >
            Add All Sales
          </button>
        )}

        {submitted && (
          <div className="mt-10 bg-white p-6 rounded-xl shadow-md text-center">
            <h2 className="text-xl font-bold text-gray-800">{getCurrentMonthYear()} (Ongoing)</h2>
            <input
              type="number"
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-lg text-center focus:outline-none appearance-none mt-4"
              placeholder="Enter sales amount"
              value={currentMonthSales}
              onChange={(e) => setCurrentMonthSales(e.target.value)}
            />
            <button
              onClick={() => {
                const amount = parseFloat(currentMonthSales);
                if (isNaN(amount) || amount <= 0) {
                  alert("Please enter a valid Sales information.");
                  return;
                }
                axios
                  .post("http://localhost:3001/api/sales/add-sales", { amount }, { withCredentials: true })
                  .then(() => {
                    alert("Sales added successfully!");
                    setIsButtonDisabled(true);
                    setCurrentMonthSales("");
                  })
                  .catch((error) => {
                    console.error("Error updating sales data:", error);
                    alert("Failed to update sales data.");
                  });
              }}
              disabled={isButtonDisabled}
              className={`px-6 py-3 rounded-lg mt-4 w-full ${
                isButtonDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600 transition-all"
              }`}
            >
              Add Sales
            </button>
            <div className="mt-4 text-sm text-gray-600">Next update available in: {timer}</div>
          </div>
        )}
      </div>

      <style>{`
        input[type="number"] {
          -moz-appearance: textfield;
        }
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
