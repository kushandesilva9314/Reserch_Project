import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import UserDetailsPopup from "../Pages/components/u_v_pop"; 
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Menu, X, Home, Users, Briefcase, FileText, TrendingUp, AlertTriangle } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); 
  const [isAdmin, setIsAdmin] = useState(null);
  const [investors, setInvestors] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [userToAction, setUserToAction] = useState(null);
  const [actionType, setActionType] = useState(null); 

  useEffect(() => {
    fetchPendingUsers();
    fetchInvestors();
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

  const fetchInvestors = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/investors");
      const data = await response.json();
      setInvestors(data);
    } catch (error) {
      console.error("Error fetching investors:", error);
    }
  };

  const confirmAction = (user, type) => {
    setUserToAction(user);
    setActionType(type);
    
    if (type === "delete-pending" || type === "delete-investor") {
      setShowDeleteConfirm(true);
    } else if (type === "approve") {
      setShowApproveConfirm(true);
    }
  };

  const handleConfirmedAction = async () => {
    if (!userToAction) return;

    try {
      if (actionType === "delete-pending") {
        await deleteUser(userToAction._id);
      } else if (actionType === "approve") {
        await approveInvestor(userToAction._id);
      } else if (actionType === "delete-investor") {
        await deleteInvestor(userToAction._id);
      }
      
      
      setShowDeleteConfirm(false);
      setShowApproveConfirm(false);
      setUserToAction(null);
      setActionType(null);
    } catch (error) {
      console.error("Error performing action:", error);
    }
  };

  const deleteUser = async (id) => {
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
      
      fetchInvestors();
    } catch (error) {
      console.error("Error approving investor:", error);
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

  const navItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/admin", active: false },
    { name: "Investor Management", icon: <Users size={20} />, path: "/investor-admin", active: true },
    { name: "Company Management", icon: <Briefcase size={20} />, path: "/company-admin", active: false },
    { name: "Content Management", icon: <FileText size={20} />, path: "/content-admin", active: false }
  ];

  return (
    <div className="flex h-screen bg-slate-100">
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
              <h1 className="text-xl font-semibold text-slate-800">Investor Management</h1>
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
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Investor Management Panel
            </h2>
            <p className="text-slate-600">
              Manage investor registration requests and existing accounts.
            </p>
          </div>

          {/* Pending Users Section */}
          <div className="bg-white p-6 shadow-md rounded-xl mb-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <Users size={20} className="mr-2 text-slate-600" />
              Pending Approval Requests
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 text-left">
                    <th className="p-3 font-semibold rounded-tl-lg">Email</th>
                    <th className="p-3 font-semibold text-right rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingUsers.length > 0 ? (
                    pendingUsers.map((user, index) => (
                      <tr
                        key={index}
                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                      >
                        <td className="p-3">{user.email}</td>
                        <td className="p-3">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="bg-slate-500 text-white p-2 rounded-lg hover:bg-slate-600 transition-colors"
                              title="View Details"
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </button>

                            <button
                              className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors"
                              onClick={() => confirmAction(user, "approve")}
                              title="Approve"
                            >
                              <FontAwesomeIcon icon={faCheck} />
                            </button>

                            <button
                              onClick={() => confirmAction(user, "delete-pending")}
                              className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                              title="Reject"
                            >
                              <FontAwesomeIcon icon={faTimes} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center p-6 text-slate-400">
                        No pending approval requests.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Active Investors Section */}
          <div className="bg-white p-6 shadow-md rounded-xl">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <Users size={20} className="mr-2 text-slate-600" />
              Active Investors
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 text-left">
                    <th className="p-3 font-semibold rounded-tl-lg">Email</th>
                    <th className="p-3 font-semibold text-right rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {investors.length > 0 ? (
                    investors.map((investor, index) => (
                      <tr
                        key={index}
                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                      >
                        <td className="p-3">{investor.email}</td>
                        <td className="p-3">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setSelectedUser(investor)}
                              className="bg-slate-500 text-white p-2 rounded-lg hover:bg-slate-600 transition-colors"
                              title="View Details"
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </button>
                            <button
                              onClick={() => confirmAction(investor, "delete-investor")}
                              className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                              title="Delete"
                            >
                              <FontAwesomeIcon icon={faTimes} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center p-6 text-slate-400">
                        No active investors found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white p-4 border-t text-center text-slate-500 text-sm">
          <p>© 2025 Investo. All rights reserved.</p>
        </footer>
      </div>

      {/* User Details Popup */}
      {selectedUser && (
        <UserDetailsPopup
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
      
      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center text-red-500 mb-4">
              <AlertTriangle size={24} className="mr-2" />
              <h3 className="text-xl font-bold">Confirm Deletion</h3>
            </div>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete {userToAction?.email}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setUserToAction(null);
                }}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmedAction}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Approve Confirmation Popup */}
      {showApproveConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center text-green-500 mb-4">
              <FontAwesomeIcon icon={faCheck} className="mr-2" size="lg" />
              <h3 className="text-xl font-bold">Confirm Approval</h3>
            </div>
            <p className="text-slate-600 mb-6">
              Are you sure you want to approve {userToAction?.email} as an investor?
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => {
                  setShowApproveConfirm(false);
                  setUserToAction(null);
                }}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmedAction}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;