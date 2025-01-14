"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

/** Update this array with your real articles and image URLs. */
const ARTICLES = [
  {
    id: 1,
    title: "Mastering Smart Contract Development with AI...",
    description:
      "Explore how Arc leverages AI to streamline smart contract development. From AI-powered code suggestions to automatic documentation generation,...",
    date: "14th September, 2023",
    image:
      "https://images.unsplash.com/photo-1517322048670-4fba75cbbb62?q=80&w=3000&auto=&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    title: "One-Click Deployment to Kiichain: How Arc Simplifies...",
    description:
      "Deploying smart contracts has never been easier. Learn how Arc integrates one-click deployment and a testnet faucet to simplify the process, getting...",
    date: "10th August, 2023",
    image:
      "https://images.unsplash.com/photo-1487014679447-9f8336841d58?q=80&w=3000&auto=&fit=crop&ixlib=rb-4.0.3",
  },
  {
    id: 3,
    title: "Comprehensive Contract Management with Arc’s...",
    description:
      "Arc’s dashboard allows users to manage and monitor deployed contracts efficiently. In this article, we walk through the features and how you can...",
    date: "5th July, 2023",
    image:
      "https://images.unsplash.com/photo-1546484475-7f7bd55792da?q=80&w=3000&auto=&fit=crop&ixlib=rb-4.0.3",
  },
  {
    id: 4,
    title: "Dynamic Import Resolution in Smart Contracts Explained",
    description:
      "Learn how Arc’s dynamic import resolution feature simplifies multi-file contract compilation and standard imports, making it easier for developer...",
    date: "1st September, 2023",
    image:
      "https://images.unsplash.com/photo-1597926613946-3e6cae6999ca?q=80&w=3000&auto=&fit=crop&ixlib=rb-4.0.3",
  },
  {
    id: 3,
    title: "Comprehensive Contract Management with Arc’s...",
    description:
      "Arc’s dashboard allows users to manage and monitor deployed contracts efficiently. In this article, we walk through the features and how you can...",
    date: "5th July, 2023",
    image:
      "https://images.unsplash.com/photo-1546484475-7f7bd55792da?q=80&w=3000&auto=&fit=crop&ixlib=rb-4.0.3",
  },
];

export function EndToEndToolsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll horizontally by 300px
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 py-12">
      {/* Section Heading */}
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
        End-to-end tools for smart contracts
      </h2>
      <p className="text-neutral-400 mb-8">
        Trusted and modular smart contracts that can be deployed securely on Kiichain.
      </p>

      {/* Left Arrow */}
      <button
        onClick={scrollLeft}
        className="hidden md:flex items-center justify-center w-10 h-10 absolute left-0 top-1/2 -translate-y-1/2 z-10
                   bg-black/50 hover:bg-black transition-colors rounded-full"
      >
        <IconChevronLeft className="text-white" size={20} />
      </button>

      {/* Cards Container */}
      <div
        ref={scrollRef}
        className="overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory flex gap-6"
      >
        {ARTICLES.map((item) => (
          <div
            key={item.id}
            className="min-w-[16rem] max-w-xs flex-shrink-0 snap-center
                       border border-neutral-800 rounded-lg bg-black
                       overflow-hidden shadow-md hover:shadow-lg
                       transition-shadow"
          >
            {/* Top Image */}
            <div className="relative w-full h-44 bg-neutral-800">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 300px) 100vw, 300px"
                className="object-cover rounded-t-lg"
              />
            </div>

            {/* Card Content */}
            <div className="p-4 flex flex-col h-60">
              <h3 className="text-white text-xl font-semibold leading-tight mb-2 line-clamp-2">
                {item.title}
              </h3>
              <p className="text-sm text-neutral-400 leading-normal mb-4 line-clamp-3">
                {item.description}
              </p>
              {/* Footer: Date & Read More Button */}
              <div className="mt-auto flex items-center justify-between">
                <p className="text-xs text-white/70">{item.date}</p>
                <button className="border border-white text-white text-sm py-1 px-3 rounded-md
                                   hover:bg-white hover:text-black transition-colors">
                  Read More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      <button
        onClick={scrollRight}
        className="hidden md:flex items-center justify-center w-10 h-10 absolute right-0 top-1/2 -translate-y-1/2 z-10
                   bg-black/50 hover:bg-black transition-colors rounded-full"
      >
        <IconChevronRight className="text-white" size={20} />
      </button>
    </section>
  );
}
