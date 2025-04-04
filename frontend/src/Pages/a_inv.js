import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import UserDetailsPopup from "../Pages/components/u_v_pop"; // Import Popup Component
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); 
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
        try {
            const response = await fetch("http://localhost:3001/api/protected", {
                method: "GET",
                credentials: "include",
            });

            const data = await response.json();
            console.log("User Data:", data);

            if (!response.ok || !data.user || data.user.role !== "admin") {
                navigate("/");
            } else {
                setIsAdmin(true);
            }
        } catch (error) {
            console.error("Error fetching user role:", error);
            navigate("/");
        }
    };
    checkAuth();
}, [navigate]);

  const fetchPendingUsers = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/pending-users");
      const data = await response.json();
      setPendingUsers(data);
    } catch (error) {
      console.error("Error fetching pending users:", error);
    }
  };

  const deleteUser = async (id) => {
    console.log("Deleting user with ID:", id);

    try {
      const response = await fetch(
        `http://localhost:3001/api/pending-users/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete: ${errorText}`);
      }

      setPendingUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== id)
      );
      console.log("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  const approveInvestor = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/investors/approve/${id}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) throw new Error("Failed to approve");

      setPendingUsers(pendingUsers.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error approving investor:", error);
    }
  };

  const [investors, setInvestors] = useState([]);

  useEffect(() => {
    fetchInvestors();
  }, []);

  const fetchInvestors = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/investors");
      const data = await response.json();
      setInvestors(data);
    } catch (error) {
      console.error("Error fetching investors:", error);
    }
  };

  const deleteInvestor = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/investors/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete");

      setInvestors((prevInvestors) =>
        prevInvestors.filter((investor) => investor._id !== id)
      );
    } catch (error) {
      console.error("Error deleting investor:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside
        className={`bg-gray-800 shadow-md p-6 space-y-6 fixed md:relative h-full w-64 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-64"
        } md:translate-x-0`}
      >
       

<h2 className="text-2xl font-bold text-white cursor-pointer">
  <Link to="/">Investo</Link>
</h2>

        <nav>
        <ul className="space-y-4">
            <li
              className="text-gray-300 hover:bg-gray-700 p-2 rounded-lg cursor-pointer"
              onClick={() => navigate("/admin")}
            >
              Dashboard
            </li>
            <li
              className="text-white font-medium hover:bg-gray-700 p-2 rounded-lg cursor-pointer"
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
            onClick={() => setIsSidebarOpen((prev) => !prev)}
          >
            ☰
          </button>
        </div>

        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          Investor Management Panel
        </h1>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Pending Users
          </h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-600">
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-right pr-10">Action</th>
              </tr>
            </thead>

            <tbody>
              {pendingUsers.length > 0 ? (
                pendingUsers.map((user, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-100 transition"
                  >
                    <td className="p-3">{user.email}</td>
                    <td className="p-3 flex justify-end space-x-3">
                      <button
                        onClick={() => setSelectedUser(user)} // Open Popup
                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>

                      <button
                        className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition"
                        onClick={() => approveInvestor(user._id)}
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </button>

                      <button
                        onClick={() => deleteUser(user._id)}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center p-4 text-gray-500">
                    No pending users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Investors
          </h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-600">
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-right pr-10">Action</th>
              </tr>
            </thead>
            <tbody>
              {investors.length > 0 ? (
                investors.map((investor, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-100 transition"
                  >
                    <td className="p-3">{investor.email}</td>
                    <td className="p-3 flex justify-end space-x-3">
                      <button
                        onClick={() => setSelectedUser(investor)}
                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        onClick={() => deleteInvestor(investor._id)}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center p-4 text-gray-500">
                    No investors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup Component (Renders When `selectedUser` is Set) */}
      {selectedUser && (
        <UserDetailsPopup
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
