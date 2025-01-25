"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ModernFooter } from "../components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-b from-blue-900 via-black to-black pt-20 pb-32 flex items-center justify-center">
        <div className="max-w-5xl px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-extrabold mb-4"
          >
            About <span className="text-blue-500">Neuron</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="text-neutral-300 text-sm md:text-base max-w-2xl mx-auto"
          >
            We’re revolutionizing smart contract development with a suite of AI-driven
            tools. Our mission is to empower developers with seamless deployment,
            powerful analytics, and an unparalleled user experience.
          </motion.p>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Mission</h2>
          <p className="text-neutral-300 text-sm md:text-base max-w-2xl mx-auto">
            At <span className="text-blue-500 font-semibold">Neuron</span>, we strive to
            simplify complex blockchain operations. Our AI-driven approach ensures 
            that anyone can build secure, scalable, and reliable applications in record time.
          </p>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {[
            { title: "Innovation", text: "Pushing boundaries with AI-powered smart contracts." },
            { title: "Security", text: "Ensuring every contract meets top-tier security standards." },
            { title: "Community", text: "Building an inclusive ecosystem of developers & visionaries." }
          ].map((value, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="p-6 bg-neutral-900 rounded-lg border border-neutral-800 cursor-pointer"
            >
              <h3 className="font-semibold text-xl mb-2 text-blue-400">{value.title}</h3>
              <p className="text-sm text-neutral-300">{value.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Meet the Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: "Raj Rakshit", role: "Web3 Developer", img: "/team/raj.jpg" },
            { name: "Akshat Bhansali", role: "Lead Developer", img: "/team/michael.jpg" },
            { name: "Rohan Prakash", role: "Web Developer", img: "/team/sarah.jpg" },
          ].map((member, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center bg-neutral-900 p-6 rounded-lg border border-neutral-800 cursor-pointer"
            >
              <div className="relative w-32 h-32 mb-4">
                <Image
                  src={member.img}
                  alt={member.name}
                  width={128}
                  height={128}
                  className="object-cover rounded-full"
                />
              </div>
              <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
              <p className="text-sm text-blue-400">{member.role}</p>
              <p className="text-xs text-neutral-400 text-center mt-2">
                Passionate about AI and blockchain development.
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <ModernFooter />
    </div>
  );
}
