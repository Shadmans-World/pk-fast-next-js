"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Bike, User, UserCog } from "lucide-react";
import axios from "axios";
export default function EditRoleAndMobile() {
  const [roles, setRoles] = useState([
    { id: "admin", label: "Admin", icon: UserCog },
    { id: "user", label: "User", icon: User },
    { id: "deliveryBoy", label: "Delivery Boy", icon: Bike },
  ]);
  const [selectedRoles,setSelectedRoles] = useState("")
  const [mobiles,setMobiles] = useState("")

  const handleEdit = async()=>{
    try {
        const result = await axios.post("/api/user/edit-role-mobile",{
            role:selectedRoles,
            mobile:mobiles
        })
        console.log(result.data)
    } catch (error) {
        console.error(error)
    }
  }
  return (
    <div className="flex flex-col items-center min-h-screen p-6 w-full bg-white">
      <motion.h1
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="text-3xl md:text-4xl font-extrabold text-green-700 text-center mt-8"
      >
        Select Your Role
      </motion.h1>
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-10">
        {roles.map((role,idx)=>{
            const Icon = role.icon
            const isSelected = selectedRoles == role.id
            return(
                <motion.div onClick={()=>setSelectedRoles(role.id)} key={idx} className={`flex flex-col items-center justify-center w-48 h-44 rounded-2xl border-2 transition-all ${
                    isSelected 
                    ? "border-green-600 bg-green-100 shadow-lg"
                    : "border-gray-300 bg-white hover:border-green-400"
                }`}
                whileTap={{scale:0.94}}
                >
                     <Icon/>
                     <span>{role.label}</span>
                </motion.div>
            )
        })}
      </div>
      <motion.div initial={{
          opacity: 0,
          
        }}
        animate={{
          opacity: 1,
          
        }}
        transition={{
            delay:0.5,
          duration: 0.6,
        }}
        className="flex flex-col items-center mt-10">
            <label htmlFor="mobile" className="text-gray-700 font-medium mb-2">Enter Your Mobile No.</label>
            <input 
            type="tel" 
            id="mobile" 
            placeholder="eg. 01788****39" className="w-64 md:w-80 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-no text-gray-800"
            onChange={(e)=>setMobiles(e.target.value)}
            />
        </motion.div>
        <motion.button
         initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay:0.7
        }}
        disabled ={mobiles.length!==11 || !selectedRoles}
        className={`inline-flex items-center gap-2 font-semibold py-3 px-8 rounded-2xl shadow-md transition-all duration-200 min-w-25 mt-5 ${
            selectedRoles && mobiles.length === 11 
            ? "bg-green-600 hover:bg-green-700 text-white"
            :"bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
        onClick={handleEdit}
        >
            Go to Home <ArrowRight/>
        </motion.button>
    </div>
  );
}
