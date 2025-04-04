import React from "react";
import { motion } from "framer-motion";

const fadeUp = (delay) => {
  return {
    hidden: { opacity: 0, y: 100 },
    show: {
      opacity: 1, y: 0,
      transition: { delay: delay, duration: 0.5 },
    },
  };
};

const ServiceData = [
  {
    id: 1,
    title: "AI-Powered Predictions",
    description: "Leverage AI for accurate return forecasts and make data-driven decisions.",
    icon: "https://cdn-icons-png.flaticon.com/512/4144/4144530.png",
    delay: 0.5,
  },
  {
    id: 2,
    title: "Smart Investment Strategies",
    description: "Customized strategies designed to optimize your financial growth.",
    icon: "https://cdn-icons-png.flaticon.com/512/2846/2846126.png",
    delay: 0.8,
  },
  {
    id: 3,
    title: "Real-Time Analytics",
    description: "Track investments with live market data and actionable insights.",
    icon: "https://cdn-icons-png.flaticon.com/512/1040/1040215.png",
    delay: 1.1,
  },
];

function Services() {
  return (
    <section className="bg-gray-100 py-8">
      <div className="container py-14">
        <motion.h1
          variants={fadeUp(0.2)}
          initial="hidden"
          whileInView="show"
          className="text-lg font-semibold text-center text-gray-800 pb-10"
        >
          Our Services
        </motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {ServiceData.map((data) => (
            <motion.div
              key={data.id}
              variants={fadeUp(data.delay)}
              initial="hidden"
              whileInView="show"
              className="flex flex-col justify-center items-center p-5 max-w-[300px] mx-auto shadow-lg rounded-xl bg-white"
            >
              <div>
                <img src={data.icon} alt={data.title} className="w-[100px] mb-4" />
              </div>

              <div className="text-center space-y-2">
                <h2 className="text-m font-semibold">{data.title}</h2>
                <p className="text-small text-center">{data.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
