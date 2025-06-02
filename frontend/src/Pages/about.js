import Navbar from "./components/navbar";
import Footer from "./components/footer";
import AboutVideo from "./Assets/about-video.mp4"; 
import { motion } from "framer-motion";

const AboutUs = () => {
    return (
        <div>
            <div className="flex flex-col min-h-screen relative">
                {/* Video Background */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <video
                        className="object-cover w-full h-full brightness-50"
                        autoPlay
                        loop
                        muted
                        src={AboutVideo}
                    />
                    {/* Dark overlay for better text readability */}
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                </div>
                
                <Navbar />
                <main className="flex-grow pt-60 pb-40 relative z-10">
                    <div className="container mx-auto px-8">
                        <motion.div 
                            className="w-full text-center"
                            initial={{ opacity: 0, y: -30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                        >
                            <h1 className="text-5xl font-extrabold text-white leading-tight uppercase tracking-wide mx-auto drop-shadow-lg">
                                About Us
                            </h1>
                            <p className="text-lg text-gray-100 mt-6 leading-relaxed max-w-2xl mx-auto drop-shadow-md backdrop-blur-sm bg-black bg-opacity-20 p-6 rounded-lg">
                                Investo is a next-generation investment platform that leverages advanced data analytics
                                to predict the Return on Investment (ROI) of various companies. By analyzing past sales data
                                and market trends, we empower investors with actionable financial insights.
                            </p>
                            <div className="mt-8 flex justify-center">
                                <motion.button 
                                    className="px-8 py-3 bg-sky-600 font-medium rounded-2xl text-lg shadow-lg hover:bg-white hover:text-black"
                                    whileHover={{ 
                                        scale: 1.05,
                                        backgroundColor: "#7D928E",
                                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ 
                                        delay: 0.5,
                                        duration: 0.6,
                                        type: "spring",
                                        stiffness: 200
                                    }}
                                >
                                    Learn More
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default AboutUs;