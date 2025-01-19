import React from 'react'
import { Spotlight } from './components/ui/Spotlight'
import { TypewriterEffectSmooth } from "./components/ui/typewriter-effect";
import { FeaturesSectionDemo } from './components/ui/FeaturesSectionDemo';
import { SmartContractsMarquee } from './components/SmartContractsMarquee';
import { EndToEndToolsSection } from './components/EndToEndToolsSection';
import { ModernFooter } from './components/Footer';
import { TailwindcssButton } from './components/buttons';



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
          <TailwindcssButton />
    
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
