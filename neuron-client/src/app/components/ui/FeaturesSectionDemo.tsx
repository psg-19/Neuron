"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import createGlobe from "cobe";
import { motion } from "motion/react";
import { IconBrandYoutubeFilled } from "@tabler/icons-react";
import { cn } from "../../utils/cn";

export function FeaturesSectionDemo() {
  const features = [
    {
      title: "Seamless Smart Contract Creation",
      description:
        "Easily write and deploy smart contracts with our intuitive code editor, which includes AI-powered auto-complete and dynamic import resolution for a smooth development experience.",
        
      skeleton: <SkeletonOne />,
      className: "lg:col-span-4 border-b lg:border-r dark:border-neutral-800",
    },
    {
      title: "AI-Driven Code Assistance",
      description:
        "Enhance your coding efficiency with AI-powered features like real-time code vulnerability checking, automatic documentation generation, and interactive contract chat.",
      skeleton: <SkeletonTwo />,
      className: "lg:col-span-2 border-b dark:border-neutral-800",
    },
    {
      title: "Comprehensive Contract Management",
      description:
        "Manage and monitor your deployed contracts with our detailed dashboard. Access pre-deployed contracts, view metrics, and make adjustments effortlessly.",
      skeleton: <SkeletonThree />,
      className: "lg:col-span-3 lg:border-r dark:border-neutral-800",
    },
    {
      title: "One-Click Deployment",
      description:
        "Deploy your smart contracts to the Sonic testnet with a single click. Our platform integrates with a testnet faucet to ensure you have the necessary tokens for deployment.",
      skeleton: <SkeletonFour />,
      className: "lg:col-span-3 border-b lg:border-none",
    },
  ];

  return (
    <div className="relative mt-75 z-20 py-12 lg:py-16 max-w-6xl mx-auto">
      {/* Heading */}
      <div className="px-4 text-center">
        <h4 className="text-3xl lg:text-5xl font-semibold tracking-tight text-black dark:text-white">
        Empowering Your Smart Contract Journey
        </h4>
        <p className="mt-2 text-sm lg:text-base text-neutral-500 dark:text-neutral-300 max-w-xl mx-auto">
        Discover how Neuron transforms smart contract development with cutting-edge AI features. From seamless code creation to comprehensive contract management, our platform provides everything you need for efficient and secure smart contract deployment.
        </p>
      </div>

      {/* Features Grid */}
      <div className="mt-10 xl:border rounded-md dark:border-neutral-800 mx-4">
        <div className="grid grid-cols-1 lg:grid-cols-6">
          {features.map((feature) => (
            <FeatureCard key={feature.title} className={feature.className}>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <div className="h-full w-full mt-2">{feature.skeleton}</div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative p-4 sm:p-6 border-neutral-100 dark:border-neutral-800",
        "overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  );
}

function FeatureTitle({ children }: { children?: React.ReactNode }) {
  return (
    <p className="text-lg font-semibold tracking-tight text-black dark:text-white">
      {children}
    </p>
  );
}

function FeatureDescription({ children }: { children?: React.ReactNode }) {
  return (
    <p className="text-sm mt-1 text-neutral-500 dark:text-neutral-300">
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------
   SKELETON COMPONENTS
   ------------------------------------------------------------------ */

export function SkeletonOne() {
  return (
    <div className="relative flex items-center gap-4">
      <div className="flex-1 bg-white dark:bg-neutral-900 shadow-xl p-4 rounded-md">
        <Image
          src=""
          alt="header"
          width={800}
          height={600}
          className="w-full h-auto rounded-md object-cover"
        />
      </div>
      {/* Fade Gradients */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-black to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white dark:from-black to-transparent pointer-events-none" />
    </div>
  );
}

export function SkeletonTwo() {
  const images = [
    "https://images.unsplash.com/photo-1517322048670-4fba75cbbb62?q=80&w=3000&auto=&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=3425&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1554931670-4ebfabf6e7a9?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1546484475-7f7bd55792da?q=80&w=2581&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  const imageVariants = {
    whileHover: { scale: 1.08, zIndex: 1 },
    whileTap: { scale: 1.08, zIndex: 1 },
  };

  return (
    <div className="relative flex flex-col items-start gap-30 overflow-hidden">
      {/* Row 1 */}
      <div className="flex -ml-6">
        {images.map((image, idx) => (
          <motion.div
            key={`row1-${idx}`}
            variants={imageVariants}
            whileHover="whileHover"
            whileTap="whileTap"
            style={{ rotate: Math.random() * 15 - 7.5 }}
            className="mr-[-1rem] mt-3 p-1 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-md"
          >
            <Image
              src={image}
              alt="bali images"
              width={500}
              height={500}
              className="h-20 w-20 md:h-28 md:w-28 object-cover rounded-md"
            />
          </motion.div>
        ))}
      </div>
      {/* Row 2 */}
      <div className="flex">
        {images.map((image, idx) => (
          <motion.div
            key={`row2-${idx}`}
            variants={imageVariants}
            whileHover="whileHover"
            whileTap="whileTap"
            style={{ rotate: Math.random() * 15 - 7.5 }}
            className="mr-[-1rem] mt-3 p-1 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-md"
          >
            <Image
              src={image}
              alt="bali images"
              width={500}
              height={500}
              className="h-20 w-20 md:h-28 md:w-28 object-cover rounded-md"
            />
          </motion.div>
        ))}
      </div>
      {/* Side Gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white dark:from-black to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white dark:from-black to-transparent pointer-events-none" />
    </div>
  );
}

export function SkeletonThree() {
  return (
    <Link
      href="https://www.youtube.com/watch?v=RPa3_AD1_Vs"
      target="__blank"
      className="relative flex group"
    >
      <div className="relative w-full">
        <IconBrandYoutubeFilled className="w-16 h-16 md:w-20 md:h-20 text-red-500 absolute inset-0 m-auto z-10 transition-transform duration-200 group-hover:scale-110" />
        <Image
          src="https://assets.aceternity.com/fireship.jpg"
          alt="header"
          width={800}
          height={800}
          className="rounded-md w-full h-auto object-cover blur-none transition-all duration-200 group-hover:blur-sm"
        />
      </div>
    </Link>
  );
}

export function SkeletonFour() {
  return (
    <div className="relative bg-transparent dark:bg-transparent mt-4">
      <Globe className="absolute -right-10 md:-right-8 -bottom-64 md:-bottom-60" />
    </div>
  );
}

function Globe({ className }: { className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
  
    useEffect(() => {
      let phi = 0;
      if (!canvasRef.current) return;
  
      const globe = createGlobe(canvasRef.current, {
        devicePixelRatio: 2,
        width: 600,
        height: 600,
        phi: 0,
        theta: 0,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor: [0.3, 0.3, 0.3],
        markerColor: [0.1, 0.8, 1],
        glowColor: [1, 1, 1],
        markers: [
          { location: [37.7595, -122.4367], size: 0.03 },
          { location: [40.7128, -74.006], size: 0.1 },
        ],
        onRender: (state) => {
          state.phi = phi;
          phi += 0.01;
        },
      });
  
      return () => globe.destroy();
    }, []);
  
    return (
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          // You can tweak the inline style dimensions as needed.
          style={{ width: 400, height: 400 }}
          className={cn("max-w-full aspect-square", className)}
        />
      </div>
    );
  }
  