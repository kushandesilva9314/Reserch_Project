import { useEffect, useState } from "react";
import axios from "axios";
import { FaTrashAlt, FaEye } from "react-icons/fa";

const PostPage = () => {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    // ✅ Fetch only logged-in user's posts
    const fetchPosts = async () => {
        try {
            const response = await axios.get("http://localhost:3001/api/posts/user", { withCredentials: true });
            setPosts(response.data.posts);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    // ✅ Add a new post
    const handleAddPost = async () => {
        if (!title || !description) {
            alert("All fields are required!");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        if (image) formData.append("image", image);

        try {
            await axios.post("http://localhost:3001/api/posts/add", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
            alert("Post added successfully!");
            fetchPosts();
            setTitle("");
            setDescription("");
            setImage(null);
        } catch (error) {
            console.error("Error adding post:", error);
        }
    };

    // ✅ Delete a post
    const handleDeletePost = async (id) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        try {
            await axios.delete(`http://localhost:3001/api/posts/delete/${id}`, { withCredentials: true });
            alert("Post deleted successfully!");
            fetchPosts();
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    // ✅ View post details
    const handleViewPost = (post) => {
        setSelectedPost(post);
        setShowModal(true);
    };

    // ✅ Close modal
    const closeModal = () => {
        setShowModal(false);
        setSelectedPost(null);
    };

    return (
        <div className="flex flex-col md:flex-row gap-4">
            {/* Create Post Form */}
            <div className="bg-white p-4 rounded-lg shadow-md max-w-lg w-full">
                <h1 className="text-xl font-semibold text-gray-800 mb-4">Create Post</h1>
                <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg mb-2"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    className="w-full p-2 border border-gray-300 rounded-lg mb-2"
                    placeholder="Description"
                    rows="2"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    type="file"
                    accept="image/*"
                    className="w-full p-2 border border-gray-300 rounded-lg mb-2"
                    onChange={(e) => setImage(e.target.files[0])}
                />
                <button
                    className="w-full bg-blue-500 text-white py-2 rounded-lg mt-2"
                    onClick={handleAddPost}
                >
                    Add Post
                </button>
            </div>

            {/* Display User Posts */}
            <div className="bg-white p-4 rounded-lg shadow-md flex-1">
                <h2 className="text-lg font-semibold text-gray-700 mb-3">Your Posts</h2>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600">
                            <th className="p-2 text-left">Title</th>
                            <th className="p-2 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <tr key={post._id} className="border-b">
                                    <td className="p-2">{post.title}</td>
                                    <td className="p-2 flex justify-end space-x-2">
                                        <button
                                            className="bg-green-500 text-white p-1 rounded-lg"
                                            onClick={() => handleViewPost(post)}
                                        >
                                            <FaEye />
                                        </button>
                                        <button
                                            className="bg-red-500 text-white p-1 rounded-lg"
                                            onClick={() => handleDeletePost(post._id)}
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2" className="p-4 text-center text-gray-500">No posts found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* View Post Modal */}
            {showModal && selectedPost && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">{selectedPost.title}</h2>
                        <p className="text-gray-600 mb-4">{selectedPost.description}</p>
                        {selectedPost.image && (
                            <img
                                src={`http://localhost:3001${selectedPost.image}`}
                                alt={selectedPost.title}
                                className="w-full h-auto mb-4 rounded-lg shadow-md"
                            />
                        )}
                        <button
                            onClick={closeModal}
                            className="w-full bg-red-500 text-white py-2 rounded-lg"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostPage;
