import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const CompanyPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get("http://localhost:3001/api/user/posts", { withCredentials: true });
                setPosts(res.data);
            } catch (error) {
                setError("No posts Uploaded");
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) return <p className="text-center text-lg text-gray-300">Loading activities...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (posts.length === 0) return null;

    return (
        <div className="flex justify-center bg-gray-900 py-16 px-4">
            <div className="container mx-auto max-w-5xl">
                {/* Section Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl font-bold text-center text-white uppercase tracking-wider mb-12"
                >
                    Company Activities & Updates
                </motion.h2>

                {/* Posts Grid */}
                <motion.div 
                    className="flex flex-col gap-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {posts.map((post) => (
                        <motion.div 
                            key={post._id}
                            className="bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-700"
                            whileHover={{ scale: 1.02 }}
                        >
                            {/* Image (Fully Visible) */}
                            {post.image && (
                                <div className="w-full h-[400px]">
                                    <img 
                                        src={`http://localhost:3001${post.image}`} 
                                        alt={post.title} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Post Content */}
                            <div className="p-8 text-white">
                                <h3 className="text-2xl font-bold tracking-wide">{post.title}</h3>
                                <p className="text-gray-400 text-lg mt-4 leading-relaxed">{post.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default CompanyPosts;
