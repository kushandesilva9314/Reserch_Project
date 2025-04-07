import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

const CompanyPostUV = ({ companyEmail }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!companyEmail) return;

    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/posts/company/${companyEmail}`
        );
        setPosts(res.data);
      } catch (error) {
        setError("No posts uploaded by this company.");
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [companyEmail]);

  if (loading)
    return (
      <div className="flex justify-center items-center py-20 bg-gray-900">
        <p className="text-gray-300 font-medium">Loading activities...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 bg-gray-900 py-20">
        {error}
      </div>
    );

  if (posts.length === 0) return null;

  return (
    <div className="bg-gray-900 py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Heading */}
        <div className="relative mb-16">
          <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
          <div className="flex justify-center">
            <div className="bg-gray-900 px-6 -mt-3 relative">
              <div className="absolute inset-0 bg-gray-800 opacity-30 rounded-md transform rotate-1"></div>
              <div className="absolute inset-0 bg-gray-800 opacity-30 rounded-md transform -rotate-1"></div>
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold text-center text-white uppercase tracking-wider relative z-10"
              >
                <span className="text-amber-500">//</span> Company Activities{" "}
                <span className="text-amber-500">//</span>
              </motion.h2>
            </div>
          </div>
          <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent transform translate-y-3"></div>
        </div>

        {/* Posts List */}
        <motion.div
          className="flex flex-col gap-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {posts.map((post, index) => (
            <motion.div
              key={post._id}
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.2 }}
            >
              {/* Frame Border */}
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-gray-600 to-gray-700 rounded-xl opacity-70"></div>

              {/* Card Container */}
              <div className="relative bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-xl">
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-500"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-500"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-500"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-500"></div>

                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  {post.image && (
                    <div className="md:w-2/5 relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-gray-900/40 z-10 opacity-60 group-hover:opacity-40 transition-opacity"></div>
                      <img
                        src={`http://localhost:3001${post.image}`}
                        alt={post.title}
                        className="w-full h-[400px] md:h-full object-cover"
                      />
                      <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-amber-500 opacity-70"></div>
                    </div>
                  )}

                  {/* Post Content */}
                  <div className="p-10 text-white flex-1 relative">
                    {/* Background dots */}
                    <div
                      className="absolute inset-0 opacity-5"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle, #fff 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                      }}
                    ></div>

                    <div className="relative z-10">
                      {/* Date Badge */}
                      {post.date && (
                        <div className="inline-flex items-center bg-gray-900 px-3 py-1 rounded-sm mb-4 border-l-2 border-amber-500">
                          <Calendar className="h-4 w-4 text-amber-500 mr-2" />
                          <span className="text-xs text-gray-400 font-mono">
                            {new Date(post.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="text-3xl font-bold tracking-wide text-white relative inline-block">
                        {post.title}
                        <div className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 to-transparent"></div>
                      </h3>

                      {/* Description */}
                      <p className="text-gray-300 mt-6 leading-relaxed border-l-2 border-gray-700 pl-4 text-lg">
                        {post.description}
                      </p>

                      {/* Tag Info */}
                      <div className="mt-6">
                        <span className="inline-block px-4 py-1 text-sm border border-amber-500 text-amber-400 rounded-full font-semibold tracking-wider bg-gray-900">
                          Shared by Company
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default CompanyPostUV;
