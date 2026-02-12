"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { categories } from "../data/categories";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
export default function CategorySlider() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = direction == "left" ? -300 : 300;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };
  const [showLeft,setShowLeft] = useState<boolean>();
  const [showRight,setShowRight] = useState<boolean>();
  const checkScroll = () => {
    if (!scrollRef.current) return;
    const {scrollLeft,scrollWidth,clientWidth} = scrollRef.current;
    setShowLeft(scrollLeft>0);
    setShowRight(scrollLeft+clientWidth <= scrollWidth-5)
  }

// Auto Scroll
  useEffect(()=>{
    const autoScroll =setInterval(()=>{
      
       if (!scrollRef.current) return;
    const {scrollLeft,scrollWidth,clientWidth} = scrollRef.current;
      if(scrollLeft+clientWidth >= scrollWidth-5){
       scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
    } else{
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }

    },2000)
    return ()=>clearInterval(autoScroll)
  },[])

  useEffect(()=>{
    scrollRef.current?.addEventListener("scroll",checkScroll)
    checkScroll()
    return ()=> removeEventListener("scroll",checkScroll)
  },[])
  return (
    <motion.div
      className="w-[90%] md:w-[80%] mx-auto mt-10 relative"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: false, amount: 0.5 }}
    >
      <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-6 text-center">
        🛒 Shop By Category
      </h2>
      {showLeft && <button
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-green-100 rounded-full w-10 h-10 flex-center transition-all"
        onClick={() => scroll("left")}
      >
        <ChevronLeft className="w-6 h-6 text-green-700" />
      </button>}
      
      {/* Slider */}
      <div
        className="flex gap-6 overflow-x-auto px-10 pb-4 scrollbar-hide scroll-smooth"
        ref={scrollRef}
      >
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={idx}
              className={`min-w-37.5 md:min-w-45 flex-center col rounded-2xl ${cat.color} shadow-md hover:shadow-xl transition-all cursor-pointer`}
            >
              <div className="flex-center col p-5">
                <Icon className="w-10 h-10 text-green700 mb-3" />
                <p className="text-center text-sm md:text-base font-semibold text-gray-700">
                  {cat.name}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
      {showRight && <button
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-green-100 rounded-full w-10 h-10 flex-center transition-all"
        onClick={() => scroll("right")}
      >
        <ChevronRight className="w-6 h-6 text-green-700" />
      </button>}
    </motion.div>
  );
}
