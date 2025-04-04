import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { addContent, getAllContent, deleteContent } from "./api";
import ContentDetailPopup from "./components/content_detail_pop";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


const Dashboard = () => {
    const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [contentList, setContentList] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(null);

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
      setIsModalOpen(true);
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

  const handleDeleteContent = async (id) => {
    await deleteContent(id);
    fetchContent();
  };

  const handleViewContent = (content) => {
    setSelectedContent(content);
  };

  const closePopup = () => {
    setSelectedContent(null);
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
              className="text-gray-300 hover:bg-gray-700 p-2 rounded-lg cursor-pointer"
              onClick={() => navigate("/company-admin")}
            >
              Company Management
            </li>
            <li
              className="text-white font-medium hover:bg-gray-700 p-2 rounded-lg cursor-pointer"
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
          <button className="text-white focus:outline-none" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>☰</button>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md max-w-lg w-full">
            <h1 className="text-xl font-semibold text-gray-800 mb-4">Content Management</h1>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg mb-2" placeholder="Title" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg mb-2" placeholder="Description" rows="2" />
            <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full p-2 border border-gray-300 rounded-lg mb-2" />
            {image && (
              <div className="mt-2">
                <img src={URL.createObjectURL(image)} alt="Preview" className="max-w-xs rounded-lg shadow-md" />
                <button onClick={removeImage} className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg">Remove Image</button>
              </div>
            )}
            <button onClick={handleAddContent} className="w-full bg-blue-500 text-white py-2 rounded-lg mt-2">Add Content</button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex-1">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Content List</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-600">
                  <th className="p-2 text-left">Title</th>
                  <th className="p-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {contentList.length > 0 ? (
                  contentList.map((content) => (
                    <tr key={content._id} className="border-b hover:bg-gray-100">
                      <td className="p-2">{content.title}</td>
                      <td className="p-2 flex justify-end space-x-2">
                        <button onClick={() => handleViewContent(content)} className="bg-blue-500 text-white p-1 rounded-lg"><FontAwesomeIcon icon={faEye} /></button>
                        <button onClick={() => handleDeleteContent(content._id)} className="bg-red-500 text-white p-1 rounded-lg"><FontAwesomeIcon icon={faTrash} /></button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center p-3 text-gray-500">No content available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {selectedContent && <ContentDetailPopup content={selectedContent} onClose={closePopup} />}
    </div>
  );
};

export default Dashboard;