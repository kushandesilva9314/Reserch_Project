import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function SliderComponent() {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/slider/all");
        setSlides(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load slides.");
        setLoading(false);
        console.error("Error fetching slides:", err);
      }
    };

    fetchSlides();
  }, []);

  const nextSlide = () => {
    if (isTransitioning || slides.length === 0) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  const prevSlide = () => {
    if (isTransitioning || slides.length === 0) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  const goToSlide = (index) => {
    if (isTransitioning || slides.length === 0) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => nextSlide(), 6000);
    return () => clearInterval(interval);
  }, [currentSlide, isTransitioning, slides.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 text-xl">
        Loading...
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 text-xl">
        No slides available
      </div>
    );
  }

  return (
    <div className="relative w-full h-[75vh] bg-gray-900 overflow-hidden">
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-md z-50">
          {error}
        </div>
      )}

      {/* Slide Content */}
      <div className="w-full h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          {slides.map((slide, index) =>
            index === currentSlide ? (
              <motion.div
                key={slide._id}
                className="flex w-full h-full items-center justify-between px-8 md:px-20"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.8 }}
              >
                {/* Text Section - Left */}
                <div className="text-white max-w-xl flex flex-col justify-center">
                  <p className="text-sm md:text-lg uppercase tracking-wider text-white/70 mb-2">
                    Top Investment Picks
                  </p>
                  <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
                    {slide.title}
                  </h1>
                  <p className="text-base md:text-lg text-white/80">
                    {slide.description}
                  </p>
                </div>

                {/* Image Section - Right */}
                <motion.img
                  src={slide.image}
                  alt={slide.title}
                  className="w-[300px] md:w-[450px] h-auto rounded-2xl shadow-xl object-cover"
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1 }}
                />
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index ? "bg-white scale-125" : "bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white rounded-full p-2"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white rounded-full p-2"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-30">
        <div
          className="h-full bg-white transition-all duration-300 ease-linear"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>

      {/* Slide Info */}
      <div className="absolute bottom-16 right-8 z-30 text-white text-sm font-mono opacity-70">
        <div className="flex items-center gap-2">
          <span>{String(currentSlide + 1).padStart(2, "0")}</span>
          <span className="w-8 h-px bg-white/70"></span>
          <span>{String(slides.length).padStart(2, "0")}</span>
        </div>
      </div>
    </div>
  );
}

export default SliderComponent;
