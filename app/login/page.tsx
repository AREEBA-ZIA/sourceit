"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      router.push("/dashboard");
    } else {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-950 overflow-hidden">

      <motion.div
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 5,
        }}
        className="absolute w-72 h-72 bg-cyan-500 rounded-full blur-3xl opacity-20"
      />

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-10 w-[420px]"
      >
        <h1 className="text-white text-4xl font-bold mb-2">
          Welcome Back
        </h1>

        <p className="text-gray-300 mb-8">
          Login to SourceIt
        </p>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-4 rounded-xl mb-4 bg-white/10 text-white border border-white/20"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-4 rounded-xl mb-6 bg-white/10 text-white border border-white/20"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full bg-cyan-500 hover:bg-cyan-600 transition p-4 rounded-xl font-bold text-white"
        >
          Login
        </button>
      </motion.div>
    </div>
  );
}