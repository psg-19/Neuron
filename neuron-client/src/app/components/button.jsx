"use client";
import React from "react";
import { toast, Toaster } from "sonner";
import { motion } from "framer-motion";

export function TailwindcssButton() {
 

  return (
    <div className="min-h flex items-center justify-center bg-black">
      <Toaster position="top-center" />

      {/* Animated Button Wrapper */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center"
      >
        {/* Border Magic Button */}
        <button
         
          className="relative inline-flex h-12 w-[18vw] overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#4F46E5_0%,#D946EF_50%,#4F46E5_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-black px-6 py-2 text-sm font-medium text-white backdrop-blur-3xl">
            Get Started
          </span>
        </button>

      </motion.div>
    </div>
  );
}
