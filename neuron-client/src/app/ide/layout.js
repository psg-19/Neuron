'use client'
import React, { useState } from 'react'
import { 
  RiBrainLine, 
  RiCheckboxMultipleLine, 
  RiCodeSSlashLine, 
  RiDownloadLine, 
  RiEditLine, 
  RiEyeLine 
} from 'react-icons/ri'

const Layout = ({ children }) => {
  const [activeTab, setActiveTab] = useState('Editor')
  
  const ideNavItems = [
    {
      name: "AI Analysis",
      icon: <RiBrainLine className="w-4 h-4" />,
      onClick: () => setActiveTab("AI Analysis")
    },
    {
      name: "Audit",
      icon: <RiCheckboxMultipleLine className="w-4 h-4" />,
      onClick: () => setActiveTab("Audit")
    },
    {
      name: "Compile",
      icon: <RiCodeSSlashLine className="w-4 h-4" />,
      onClick: () => setActiveTab("Compile")
    },
    {
      name: "Download",
      icon: <RiDownloadLine className="w-4 h-4" />,
      onClick: () => setActiveTab("Download")
    },
    {
      name: "Editor",
      icon: <RiEditLine className="w-4 h-4" />,
      onClick: () => setActiveTab("Editor")
    },
    {
      name: "Preview",
      icon: <RiEyeLine className="w-4 h-4" />,
      onClick: () => setActiveTab("Preview")
    },
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="sticky top-28 z-40 flex justify-center">
        <div className="w-fit bg-gray-800/95 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-lg">
          <div className="flex items-center gap-1 px-2 py-2">
            {ideNavItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className={`
                  relative flex items-center gap-2 px-3 py-2 rounded-lg
                  text-sm font-medium transition-all duration-200
                  ${activeTab === item.name 
                    ? 'text-white bg-gray-700/50' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/30'}
                `}
              >
                {item.icon}
                <span>{item.name}</span>
                {activeTab === item.name && (
                  <div className="absolute inset-0 rounded-lg bg-white/5 animate-fadeIn" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8">
        {children}
      </div>
    </div>
  )
}

export default Layout