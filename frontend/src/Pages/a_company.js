import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import OrgDetailsPopup from "./components/c_v_pop";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Menu, X, Home, Users, Briefcase, FileText, TrendingUp, AlertTriangle } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pendingOrgs, setPendingOrgs] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [orgToAction, setOrgToAction] = useState(null);
  const [actionType, setActionType] = useState(null); 

  useEffect(() => {
    fetchPendingOrganizations();
    fetchOrganizations();
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

  const fetchPendingOrganizations = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/pending-organizations"
      );
      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setPendingOrgs(data);
    } catch (error) {
      console.error("Error fetching pending organizations:", error);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/organizations");
      if (!response.ok) throw new Error("Failed to fetch organizations");
  
      const data = await response.json();
      setOrganizations(data);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  const fetchOrganizationDetails = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/pending-organizations/${id}`
      );
      if (!response.ok) throw new Error("Failed to fetch details");

      const data = await response.json();
      setSelectedOrg(data);
    } catch (error) {
      console.error("Error fetching organization details:", error);
    }
  };

  const fetchAppOrganizationDetails = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/organizations/${id}`
      );
      if (!response.ok) throw new Error("Failed to fetch organization details");
  
      const data = await response.json();
      setSelectedOrg(data);
    } catch (error) {
      console.error("Error fetching organization details:", error);
    }
  };

  const confirmAction = (org, type) => {
    setOrgToAction(org);
    setActionType(type);
    
    if (type === "delete-pending" || type === "delete-org") {
      setShowDeleteConfirm(true);
    } else if (type === "approve") {
      setShowApproveConfirm(true);
    }
  };

  const handleConfirmedAction = async () => {
    if (!orgToAction) return;

    try {
      if (actionType === "delete-pending") {
        await deleteOrganization(orgToAction._id);
      } else if (actionType === "approve") {
        await approveOrganization(orgToAction._id);
      } else if (actionType === "delete-org") {
        await deleteAccOrganization(orgToAction._id);
      }
      
      
      setShowDeleteConfirm(false);
      setShowApproveConfirm(false);
      setOrgToAction(null);
      setActionType(null);
    } catch (error) {
      console.error("Error performing action:", error);
    }
  };

  const deleteOrganization = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/pending-organizations/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete");

      setPendingOrgs(pendingOrgs.filter((org) => org._id !== id));
    } catch (error) {
      console.error("Error deleting organization:", error);
    }
  };

  const approveOrganization = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/companies/approve/${id}`,
        { method: "POST" }
      );
  
      if (!response.ok) throw new Error("Failed to approve");
  
      setPendingOrgs((prevOrgs) => prevOrgs.filter((org) => org._id !== id));
      
    
      fetchOrganizations();
    } catch (error) {
      console.error("Error approving organization:", error);
    }
  };

  const deleteAccOrganization = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/organizations/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete");

      setOrganizations(organizations.filter((org) => org._id !== id));
    } catch (error) {
      console.error("Error deleting organization:", error);
    }
  };

  const navItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/admin", active: false },
    { name: "Investor Management", icon: <Users size={20} />, path: "/investor-admin", active: false },
    { name: "Company Management", icon: <Briefcase size={20} />, path: "/company-admin", active: true },
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
              <h1 className="text-xl font-semibold text-slate-800">Company Management</h1>
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
              Company Management Panel
            </h2>
            <p className="text-slate-600">
              Manage company registration requests and existing accounts.
            </p>
          </div>

          {/* Pending Organizations Section */}
          <div className="bg-white p-6 shadow-md rounded-xl mb-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <Briefcase size={20} className="mr-2 text-slate-600" />
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
                  {pendingOrgs.length > 0 ? (
                    pendingOrgs.map((org) => (
                      <tr
                        key={org._id}
                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                      >
                        <td className="p-3">{org.companyEmail}</td>
                        <td className="p-3">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => fetchOrganizationDetails(org._id)}
                              className="bg-slate-500 text-white p-2 rounded-lg hover:bg-slate-600 transition-colors"
                              title="View Details"
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </button>

                            <button
                              className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors"
                              onClick={() => confirmAction(org, "approve")}
                              title="Approve"
                            >
                              <FontAwesomeIcon icon={faCheck} />
                            </button>

                            <button
                              onClick={() => confirmAction(org, "delete-pending")}
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

          {/* Active Organizations Section */}
          <div className="bg-white p-6 shadow-md rounded-xl">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <Briefcase size={20} className="mr-2 text-slate-600" />
              Active Companies
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
                  {organizations.length > 0 ? (
                    organizations.map((org) => (
                      <tr
                        key={org._id}
                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                      >
                        <td className="p-3">{org.companyEmail}</td>
                        <td className="p-3">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => fetchAppOrganizationDetails(org._id)}
                              className="bg-slate-500 text-white p-2 rounded-lg hover:bg-slate-600 transition-colors"
                              title="View Details"
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </button>
                            <button
                              onClick={() => confirmAction(org, "delete-org")}
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
                        No active companies found.
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

      {/* Organization Details Popup */}
      {selectedOrg && (
        <OrgDetailsPopup
          organization={selectedOrg}
          onClose={() => setSelectedOrg(null)}
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
              Are you sure you want to delete {orgToAction?.companyEmail}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setOrgToAction(null);
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
              Are you sure you want to approve {orgToAction?.companyEmail} as a company?
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => {
                  setShowApproveConfirm(false);
                  setOrgToAction(null);
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