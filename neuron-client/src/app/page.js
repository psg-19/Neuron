import React from 'react'
import { Spotlight } from '../components/ui/Spotlight'
import { TypewriterEffectSmooth } from "../components/ui/typewriter-effect";
import { FeaturesSectionDemo } from '../components/ui/FeaturesSectionDemo';
import { SmartContractsMarquee } from '../components/SmartContractsMarquee';
import { EndToEndToolsSection } from '../components/EndToEndToolsSection';
import { ModernFooter } from '../components/Footer';


const words = [
  {
    text: "Build",
  },
  {
    text: "AI-driven",
  },
  {
    text: "Contracts",
  },
  {
    text: "with",
  },
  {
    text: "Neuron",
    className: "text-blue-500 dark:text-blue-500",
  },
];

const page = () => {
  return (
    <main className="min-h-screen overflow-hidden bg-black/[0.96] antialiased bg-grid-white/[0.02]">
      {/* The spotlight effect */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />

      {/* Your existing floating nav */}

      {/* Hero Section */}
      <section className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center max-w-4xl mx-auto mt-50">
        
          <TypewriterEffectSmooth words={words} />
          <p className="text-gray-300 text-lg md:text-xl mb-8">
            Transform smart contract development with Arc. Write, deploy, and manage
            contracts effortlessly with AI-driven tools and one-click deployment to
            Kiichain’s testnet.
          </p>
          <button
      type="button"
      className="inline-flex items-center px-10 py-4 rounded-md bg-white text-black font-medium shadow-sm hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
    >
      {/* Lightning icon (SVG) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 mr-2"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
      Get started
    </button>
        </div>
      </section>
      <FeaturesSectionDemo />
      <SmartContractsMarquee />
      <EndToEndToolsSection />
      <ModernFooter />

    </main>
  )
}

export default page
