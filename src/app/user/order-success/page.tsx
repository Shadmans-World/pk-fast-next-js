'use client'
import React from "react";
import {motion} from "motion/react"
import { ArrowRight, CheckCircle, Package } from "lucide-react";
import Link from "next/link";
export default function OrderSuccess() {
  return (
    <div className="flex-center col min-h-screen px-6 text-center bg-linear-to-b from-green-50 to-white">
      
      <motion.div
       initial={{scale:0, rotate:-180}}
      animate={{scale:1, rotate:0}}
      transition={{
        type:"spring",
        damping:10,
        stiffness:100
      }}
      className="relative"
      >
        <CheckCircle className="text-green-600 w-24 h-24 md:w-28 md:h-28"/>
        <motion.div 
        className="absolute inset-0"
        initial={{opacity:0,scale:0.6}}
        animate={{opacity:[0.3,0,0.3], scale:[1,0.6,1]}}
        transition={{
            repeat:Infinity,
            duration:2,
            ease:'easeInOut'
        }}
        >
            <div className="W-full h-full rounded-full bg-green-900 blur-2xl"></div>
        </motion.div>
      </motion.div>
      
      <motion.h1 className="text-3xl md:text-4xl font-bold text-green-700 mt-6"
      initial={{opacity:0, y:30}}
      animate={{opacity:1, y:0}}
      transition={{duration:0.4, delay:0.3}}
      >
        Order Placed Successfully
      </motion.h1>
      <motion.p 
       initial={{opacity:0, y:30}}
      animate={{opacity:1, y:0}}
      transition={{duration:0.4 , delay:0.6}}
      
      className="text-gray-600 mt-3 text-sm md:text-base max-w-md">
        Thank you for shopping with us! Your order has been placed and is being processed. You can track its progress in your <span className="font-semibold text-green-700">My Orders</span> section.
      </motion.p>
      <motion.div
      initial={{opacity:0,y:40}}
        animate={{opacity:1, y:[0,-10,0]}}
        transition={{
            repeat:Infinity,
            duration:2,
            ease:'easeInOut',
            delay:1
        }}
        className="mt-10"
      >
        <Package className="w-16 h-16 md:w-20 md:h-20 text-green-500 "/>
      </motion.div>
      <motion.div 
      initial={{opacity:0, scale: 0.9}}
      animate={{opacity:1,scale:1}}
      transition={{delay:1.2, duration:0.4}}
      className="mt-12"
      >
        <Link href={'/user/my-orders'}>
            <motion.div 
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-base font-semibold px-8 py-3 rounded-full shadow-lg transition-all"
            whileHover={{scale:1.04}}
            whileTap={{scale:1}}
            >
                Go to My Orders <ArrowRight/></motion.div> 
        </Link>
      </motion.div>
    </div>
  );
}
