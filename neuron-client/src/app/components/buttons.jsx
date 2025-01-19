"use client";
import React from "react";
import { toast, Toaster } from "sonner";
import { motion } from "framer-motion";

export function TailwindcssButton() {
  const copyToClipboard = async () => {
    const text = `
    <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
        Border Magic
      </span>
    </button>
    `;

    try {
      await navigator.clipboard.writeText(text);
      toast.success("Welcome to Neuron");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="min-hflex items-center justify-center bg-black">
      <Toaster position="top-center" />

      {/* Animated Button Wrapper */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center"
      >
        {/* Border Magic Button */}
        <button
          onClick={copyToClipboard}
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
