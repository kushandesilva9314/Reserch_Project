import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import OrgDetailsPopup from "./components/c_v_pop";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pendingOrgs, setPendingOrgs] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  useEffect(() => {
    fetchPendingOrganizations();
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
  
      setTimeout(() => {
        window.location.reload();
      }, 5000); 
  
    } catch (error) {
      console.error("Error approving organization:", error);
    }
  };
  
  

  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    fetchOrganizations();
  }, []);

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

  return (
    <div className="flex h-screen bg-gray-100">
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
              className="text-gray-300 hover:bg-gray-700 p-2 rounded-lg cursor-pointer"
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
              className="text-white font-medium hover:bg-gray-700 p-2 rounded-lg cursor-pointer"
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

        <h1 className="text-3xl font-semibold text-gray-800">
          Company Management Panel
        </h1>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Pending Organizations
          </h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-600">
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-right pr-10">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingOrgs.length > 0 ? (
                pendingOrgs.map((org) => (
                  <tr
                    key={org._id}
                    className="border-b hover:bg-gray-100 transition"
                  >
                    <td className="p-3">{org.companyEmail}</td>
                    <td className="p-3 flex justify-end space-x-3">
                      <button
                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
                        onClick={() => fetchOrganizationDetails(org._id)}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition"
                        onClick={() => approveOrganization(org._id)}
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </button>

                      <button
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                        onClick={() => deleteOrganization(org._id)}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center p-4 text-gray-500">
                    No pending organizations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Organizations
          </h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-600">
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-right pr-10">Action</th>
              </tr>
            </thead>
            <tbody>
              {organizations.length > 0 ? (
                organizations.map((org) => (
                  <tr
                    key={org._id}
                    className="border-b hover:bg-gray-100 transition"
                  >
                    <td className="p-3">{org.companyEmail}</td>
                    <td className="p-3 flex justify-end space-x-3">
                      <button
                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
                        onClick={() => fetchAppOrganizationDetails(org._id)}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                        onClick={() => deleteAccOrganization(org._id)}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center p-4 text-gray-500">
                    No organizations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrg && (
        <OrgDetailsPopup
          organization={selectedOrg}
          onClose={() => setSelectedOrg(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
