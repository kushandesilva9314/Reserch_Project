import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Enhanced animation variants
const fadeUp = (delay) => ({
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      delay: delay,
      duration: 0.6,
      ease: "easeOut",
    },
  },
});

const hoverAnimation = {
  rest: { scale: 1, boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)" },
  hover: {
    scale: 1.05,
    boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.15)",
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

const iconAnimation = {
  rest: { y: 0 },
  hover: {
    y: -10,
    transition: {
      duration: 0.4,
      ease: "easeInOut",
      yoyo: Infinity,
      repeatDelay: 0.5,
    },
  },
};

// Updated service data with more visually appealing icons and better organization
const ServiceData = [
  
  {
    id: 1,
    title: "AI-Powered Predictions",
    description:
      "Leverage cutting-edge AI algorithms for accurate return forecasts that help you make data-driven investment decisions with confidence.",
    icon: "https://cdn-icons-png.flaticon.com/512/4144/4144530.png",
    delay: 0.3,
    color: "from-blue-500 to-cyan-400",
  },
  {
    id: 2,
    title: "Smart Investment Strategies",
    description:
      "Unlock personalized investment strategies tailored to your goals, risk tolerance, and timeline that optimize your financial growth.",
    icon: "https://cdn-icons-png.flaticon.com/512/2846/2846126.png",
    delay: 0.5,
    color: "from-green-500 to-emerald-400",
  },
  {
    id: 3,
    title: "Real-Time Analytics",
    description:
      "Stay informed with comprehensive real-time market data, performance tracking, and actionable insights to maximize your returns.",
    icon: "https://cdn-icons-png.flaticon.com/512/1040/1040215.png",
    delay: 0.7,
    color: "from-purple-500 to-indigo-400",
  },
];

function Services() {
  const navigate = useNavigate();
  return (
    <section className="relative py-32 md:py-40 bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[30%] h-[30%] rounded-full bg-blue-100 opacity-30 blur-3xl"></div>
        <div className="absolute top-[50%] -right-[5%] w-[25%] h-[25%] rounded-full bg-green-100 opacity-30 blur-3xl"></div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header with enhanced styling */}
        <div className="text-center mb-24">
          <motion.div
            variants={fadeUp(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
          >
            <span className="text-sm font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 uppercase">
              What We Offer
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp(0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="mt-4 text-3xl md:text-4xl font-bold text-gray-800 leading-tight"
          >
            Our Premium Services
          </motion.h2>

          <motion.div
            variants={fadeUp(0.3)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="mt-6 max-w-2xl mx-auto"
          >
            <p className="text-lg text-gray-600">
              Discover how our innovative solutions can revolutionize your
              investment strategy
            </p>
          </motion.div>
        </div>

        {/* Services grid with responsive design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {ServiceData.map((service) => (
            <motion.div
              key={service.id}
              variants={fadeUp(service.delay)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              whileHover="hover"
              animate="rest"
              variants={hoverAnimation}
              className="rounded-2xl bg-white p-8 lg:p-10 relative overflow-hidden group"
            >
              {/* Decorative gradient background that appears on hover */}
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-500 ease-in-out"></div>

              {/* Service icon with animation */}
              <motion.div
                className={`w-16 h-16 mb-8 p-3 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg`}
                variants={iconAnimation}
              >
                <img
                  src={service.icon}
                  alt={service.title}
                  className="w-full h-full object-contain filter invert"
                />
              </motion.div>

              {/* Service content */}
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>

              {/* Learn more button */}
              <div className="mt-8 flex items-center">
                <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center group">
                  Learn more
                  <svg
                    className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call-to-action button */}
        <motion.div
          className="mt-24 text-center"
          variants={fadeUp(0.8)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          <button
            onClick={() => navigate("/ads")}
            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            Explore All Services
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default Services;
