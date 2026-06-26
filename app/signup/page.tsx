"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaUserPlus } from "react-icons/fa";
import { supabase } from "../../lib/supabase";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Account created successfully!");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 overflow-hidden relative">
      
      {/* Animated Background Blob */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
        className="absolute w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-[420px] backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl"
      >
        <div className="flex justify-center mb-4">
          <div className="bg-cyan-500 p-4 rounded-full">
            <FaUserPlus className="text-white text-2xl" />
          </div>
        </div>

        <h1 className="text-center text-4xl font-bold text-white">
          Create Account
        </h1>

        <p className="text-center text-gray-300 mt-2 mb-8">
          Join SourceIt today
        </p>

        <input
          type="email"
          placeholder="Email Address"
          className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 mb-4 outline-none"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 mb-6 outline-none"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={signUp}
          className="w-full bg-cyan-500 hover:bg-cyan-600 transition-all duration-300 text-white font-semibold py-4 rounded-xl"
        >
          Sign Up
        </button>

        <p className="text-center text-gray-300 mt-6">
          Already have an account?
          <span
            onClick={() => router.push("/login")}
            className="text-cyan-400 ml-2 cursor-pointer"
          >
            Login
          </span>
        </p>
      </motion.div>
    </div>
  );
}