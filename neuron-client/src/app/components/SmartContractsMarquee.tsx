"use client";

import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

const CONTRACTS = [
  {
    version: "v2.3.2",
    title: "Split",
    description:
      "Enables the division of funds between multiple recipients based on predefined proportions.",
  },
  {
    version: "v1.4.5",
    title: "VoteERC20",
    description: "A contract that allows voting on proposals using ERC20 tokens.",
  },
  {
    version: "v0.6.3",
    title: "MarketplaceV3",
    description:
      "A decentralized marketplace for buying & selling digital assets, featuring flexible listing options and robust security.",
  },
  // Add more cards as needed
];

export function SmartContractsMarquee() {
  const controls = useAnimation();

  const marqueeVariants = {
    animate: {
      x: [0, -2000], // Move from x=0 to x=-2000 (adjust for total width)
      transition: {
        repeat: Infinity,
        duration: 20, // Scroll speed (lower = faster)
        ease: "linear",
      },
    },
  };

  useEffect(() => {
    controls.start("animate");
  }, [controls]);

  const handleMouseEnter = () => controls.stop();
  const handleMouseLeave = () => controls.start("animate");

  return (
    <section className="relative w-full h-full py-12 my-16 px-4">
      {/* Heading */}
      <h2 className="text-center mb-8 font-extrabold text-5xl md:text-5xl bg-white bg-clip-text text-transparent tracking-tight">
        Smart contracts for every use case
      </h2>

      {/* Marquee Container */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative w-full "
      >
        <motion.div
          className="flex gap-8"
          variants={marqueeVariants}
          animate={controls}
        >
          {/* Original set of cards */}
          {CONTRACTS.map((card, idx) => (
            <MarqueeCard card={card} key={idx} />
          ))}
          {/* Repeat cards to simulate infinite scroll */}
          {CONTRACTS.map((card, idx) => (
            <MarqueeCard card={card} key={"repeat-" + idx} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/** Single Card Layout */
function MarqueeCard({ card }: { card: typeof CONTRACTS[number] }) {
  return (
    <motion.div
      whileHover={{ scale: 1.07 }}
      className="relative shrink-0 w-[30vw] h-[30vh] rounded-lg p-4 bg-neutral-900/60 border border-neutral-800
                 shadow-md hover:shadow-lg transition-shadow duration-300
                 flex flex-col justify-between text-white"
    >
      <div>
        <p className="text-xs text-green-400 font-medium tracking-wide">
          Flags • {card.version}
        </p>
        <h3 className="font-semibold text-lg mt-1">{card.title}</h3>
        <p className="text-sm mt-2 text-neutral-400">{card.description}</p>
      </div>
      <div className="flex items-center justify-between text-sm mt-4">
        <button className="px-3 py-1 rounded-md border border-neutral-700 hover:border-green-400 transition-colors">
          Customize
        </button>
        <button className="text-neutral-400 hover:text-green-400 transition-colors">
          Deploy
        </button>
      </div>
      {/* Subtle gradient highlight at the top edge */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-green-400/30 to-transparent rounded-t-lg" />
    </motion.div>
  );
}
