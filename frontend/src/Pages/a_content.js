import { useState, useEffect } from "react";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { addContent, getAllContent, deleteContent } from "./api";
import ContentDetailPopup from "./components/content_detail_pop";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Menu, X, Home, Users, Briefcase, FileText, TrendingUp, AlertTriangle } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [contentList, setContentList] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [contentToDelete, setContentToDelete] = useState(null);

  useEffect(() => {
    fetchContent();
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

  const fetchContent = async () => {
    const data = await getAllContent();
    setContentList(data);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const removeImage = () => {
    setImage(null);
  };

  const handleAddContent = async () => {
    if (!title || !description) {
      alert("Title and description are required!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) formData.append("image", image);

    await addContent(formData);
    fetchContent();
    setTitle("");
    setDescription("");
    setImage(null);
  };

  const confirmDelete = (content) => {
    setContentToDelete(content);
    setShowDeleteConfirm(true);
  };

  const handleConfirmedDelete = async () => {
    if (!contentToDelete) return;
    
    await deleteContent(contentToDelete._id);
    fetchContent();
    setShowDeleteConfirm(false);
    setContentToDelete(null);
  };

  const handleViewContent = (content) => {
    setSelectedContent(content);
  };

  const closePopup = () => {
    setSelectedContent(null);
  };

  const navItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/admin", active: false },
    { name: "Investor Management", icon: <Users size={20} />, path: "/investor-admin", active: false },
    { name: "Company Management", icon: <Briefcase size={20} />, path: "/company-admin", active: false },
    { name: "Content Management", icon: <FileText size={20} />, path: "/content-admin", active: true }
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
              <h1 className="text-xl font-semibold text-slate-800">Content Management</h1>
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
              Content Management Panel
            </h2>
            <p className="text-slate-600">
              Create and manage content for the platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Add Content Section */}
            <div className="bg-white p-6 shadow-md rounded-xl">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <FileText size={20} className="mr-2 text-slate-600" />
                Add New Content
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Title
                  </label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring focus:ring-slate-200 focus:border-slate-500 transition-all" 
                    placeholder="Enter content title" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring focus:ring-slate-200 focus:border-slate-500 transition-all" 
                    placeholder="Enter content description" 
                    rows="4"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Image
                  </label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring focus:ring-slate-200 focus:border-slate-500 transition-all" 
                  />
                </div>
                
                {image && (
                  <div className="mt-2">
                    <img 
                      src={URL.createObjectURL(image)} 
                      alt="Preview" 
                      className="max-w-full h-auto rounded-lg shadow-md" 
                    />
                    <button 
                      onClick={removeImage} 
                      className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Remove Image
                    </button>
                  </div>
                )}
                
                <button 
                  onClick={handleAddContent} 
                  className="w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Add Content
                </button>
              </div>
            </div>

            {/* Content List Section */}
            <div className="bg-white p-6 shadow-md rounded-xl">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <FileText size={20} className="mr-2 text-slate-600" />
                Content List
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 text-left">
                      <th className="p-3 font-semibold rounded-tl-lg">Title</th>
                      <th className="p-3 font-semibold text-right rounded-tr-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contentList.length > 0 ? (
                      contentList.map((content) => (
                        <tr
                          key={content._id}
                          className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                        >
                          <td className="p-3">{content.title}</td>
                          <td className="p-3">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleViewContent(content)}
                                className="bg-slate-500 text-white p-2 rounded-lg hover:bg-slate-600 transition-colors"
                                title="View Details"
                              >
                                <FontAwesomeIcon icon={faEye} />
                              </button>
                              <button
                                onClick={() => confirmDelete(content)}
                                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                                title="Delete"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="text-center p-6 text-slate-400">
                          No content available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white p-4 border-t text-center text-slate-500 text-sm">
          <p>© 2025 Investo. All rights reserved.</p>
        </footer>
      </div>

      {/* Content Details Popup */}
      {selectedContent && (
        <ContentDetailPopup
          content={selectedContent}
          onClose={closePopup}
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
              Are you sure you want to delete "{contentToDelete?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setContentToDelete(null);
                }}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmedDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;