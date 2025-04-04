import React from "react";
import { motion } from "framer-motion";

const fadeUp = (delay) => ({
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { delay, duration: 0.6 } },
});

const reviews = [
  {
    id: 1,
    name: "Sophia Patel",
    review: "This platform has significantly improved my investment strategy. The insights are invaluable!",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    delay: 0.3,
  },
  {
    id: 2,
    name: "Michael Lee",
    review: "Great analytics and easy-to-use interface. I've seen noticeable growth in my portfolio!",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    delay: 0.6,
  },
  {
    id: 3,
    name: "Emma Williams",
    review: "The AI-powered tools have helped me make informed decisions. Highly recommend!",
    rating: 4,
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    delay: 0.9,
  },
];

const InvestorReviews = () => {
  return (
    <section className="bg-gray-100 py-16 px-6">
      <div className="container mx-auto text-center">
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-gray-800 mb-10"
          variants={fadeUp(0.2)}
          initial="hidden"
          whileInView="show"
        >
          Investor Reviews
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              variants={fadeUp(review.delay)}
              initial="hidden"
              whileInView="show"
              className="bg-white p-6 rounded-lg shadow-lg text-center"
            >
              <img
                src={review.image}
                alt={review.name}
                className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-gray-300"
              />
              <h3 className="text-lg font-semibold text-gray-800">{review.name}</h3>
              <div className="flex justify-center mt-2">
                {Array(5)
                  .fill()
                  .map((_, i) => (
                    <span key={i} className={i < review.rating ? "text-yellow-500" : "text-gray-300"}>
                      ★
                    </span>
                  ))}
              </div>
              <p className="text-gray-600 mt-3">{review.review}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InvestorReviews;
