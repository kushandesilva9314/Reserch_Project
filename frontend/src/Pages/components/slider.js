import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const fadeUp = (delay) => ({
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: delay,
      duration: 0.6,
      ease: "easeOut",
    },
  },
});

const SliderComponent = () => {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/slider/all");
        setSlides(response.data);
      } catch (error) {
        console.error("Error fetching slider data:", error);
      }
    };
    fetchSlides();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000, 
    fade: true, 
    arrows: false,
    pauseOnHover: false, 
    appendDots: (dots) => (
      <div className="absolute bottom-5 w-full flex justify-center">
        <ul className="flex space-x-2">{dots}</ul>
      </div>
    ),
    customPaging: (i) => (
      <div className="w-3 h-3 bg-gray-500 hover:bg-white rounded-full transition-all"></div>
    ),
  };

  return (
    <div className="relative overflow-hidden bg-gray-900 text-white">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide._id}>
            <div className="flex flex-col-reverse md:flex-row gap-4 p-5 md:px-24 md:py-20 w-full">
              {/* Left Side - Text */}
              <div className="flex-1 flex flex-col md:gap-6 gap-4">
                <h2 className="text-gray-400 text-sm md:text-lg uppercase tracking-wider">
                  Top Investment Picks
                </h2>
                <div className="flex flex-col gap-4">
                  <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 1, ease: "easeIn" }}
                    className="md:text-5xl text-2xl font-bold leading-tight"
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    transition={{ delay: 1, duration: 1 }}
                    className="text-gray-300 md:text-lg text-sm max-w-2xl"
                  >
                    {slide.description}
                  </motion.p>
                </div>
              </div>

              {/* Right Side - Image */}
              <div className="flex justify-center md:justify-end">
                <motion.img
                  variants={fadeUp}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 1 }}
                  className="h-[16rem] md:h-[26rem] object-contain"
                  src={slide.image}
                  alt={slide.title}
                />
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SliderComponent;
