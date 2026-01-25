"use client";
import {
 
  EyeIcon,
  EyeOff,
  Leaf,
  Loader2,
  Lock,
  LogIn,
  Mail,
} from "lucide-react";
import React, { useState } from "react";
import { motion } from "motion/react";
import { FcGoogle } from "react-icons/fc";

import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";



export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  // 🔹 form states

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const isDisabled = !email || !password;
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)
    try {
      await signIn("credentials", {
        email,
        password,
        redirect:true,
        callbackUrl
      });
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-white relative">
      {/* Title */}
      <motion.h1
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-green-700 mb-2"
      >
        Welcome Back
      </motion.h1>

      <p className="flex items-center mb-8 text-gray-600">
        Login to PK-FAST <Leaf className="w-5 h-5 text-green-600" />
      </p>

      {/* Form */}
      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-5 w-full max-w-sm"
      >
        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-10 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff /> : <EyeIcon />}
          </button>
        </div>

        {/* Login */}
        <button
          type="submit"
          disabled={isDisabled}
          className={`py-3 flex items-center justify-center text-center rounded-xl font-semibold transition w-full
            ${
              isDisabled
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login"}
        </button>

        {/* OR */}
        <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
          <span className="flex-1 h-px bg-gray-200"></span>
          OR
          <span className="flex-1 h-px bg-gray-200"></span>
        </div>

        {/* Google */}
        <button
        onClick={()=>signIn('google',{callbackUrl})}
          type="button"
          className="flex w-full items-center justify-center gap-3 border border-gray-300 hover:bg-gray-50 py-3 rounded-xl text-gray-700 font-medium transition-all duration-200 cursor-pointer"
        >
          <FcGoogle className="flex items-center rounded-full border border-gray-300 hover:bg-gray-50 w-10 h-10 " />
          Continue with Google
        </button>
      </motion.form>

      <p
        className="cursor-pointer text-gray-600 mt-6 text-sm flex items-center gap-1"
        onClick={() => router.push("/register")}
      >
        Want to create an account? <LogIn className="w-4 h-4" />{" "}
        <span className="text-green-600">Sign Up</span>
      </p>
    </div>
  );
}
