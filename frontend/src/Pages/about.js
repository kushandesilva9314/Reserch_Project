import Navbar from "./components/navbar";
import Footer from "./components/footer";
import AboutImage from "./Assets/abt.jpg";
import { motion } from "framer-motion";

const AboutUs = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
            <Navbar />
            <main className="flex-grow pt-60 pb-40">
                <div className="container mx-auto px-8 flex flex-col md:flex-row items-center gap-12">
                    <motion.div 
                        className="md:w-1/2"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <h1 className="text-5xl font-extrabold text-gray-800 leading-tight uppercase tracking-wide">
                            About Us
                        </h1>
                        <p className="text-lg text-gray-700 mt-6 leading-relaxed max-w-lg">
                            Investo is a next-generation investment platform that leverages advanced data analytics
                            to predict the Return on Investment (ROI) of various companies. By analyzing past sales data
                            and market trends, we empower investors with actionable financial insights.
                        </p>
                        <div className="mt-8">
                        <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-white text-black rounded-lg text-lg shadow-md transition-transform transform hover:scale-105">
                Learn More
              </button>
                        </div>
                    </motion.div>
                    <motion.div 
                        className="md:w-1/2 flex justify-center relative"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5 }}
                    >
                        <div className="relative w-full max-w-lg overflow-hidden rounded-xl shadow-xl">
                            <img src={AboutImage} alt="About Investo" className="w-full h-auto object-cover" />
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AboutUs;