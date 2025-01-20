'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  RiBrainLine, 
  RiCheckboxMultipleLine, 
  RiCodeSSlashLine, 
  RiDownloadLine, 
  RiEditLine, 
  RiEyeLine
} from 'react-icons/ri'

const Layout = ({ children }) => {
  const router = useRouter()
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState('editor')

  useEffect(() => {
    const path = pathname.split('/').pop()
    setActiveTab(path || 'editor')
  }, [pathname])
  
  const ideNavItems = [
    {
      name: "AI Analysis",
      path: "aianalysis",
      icon: <RiBrainLine className="w-4 h-4" />,
      onClick: () => {
        setActiveTab("aianalysis")
        router.push('/ide/aiAnalysis')
      }
    },
    {
      name: "Audit",
      path: "audit",
      icon: <RiCheckboxMultipleLine className="w-4 h-4" />,
      onClick: () => {
        setActiveTab("audit")
        router.push('/ide/audit')
      }
    },
    {
      name: "Compile",
      path: "compile",
      icon: <RiCodeSSlashLine className="w-4 h-4" />,
      onClick: () => {
        setActiveTab("compile")
        router.push('/ide/compile')
      }
    },
    {
      name: "Download",
      path: "download",
      icon: <RiDownloadLine className="w-4 h-4" />,
      onClick: () => {
        setActiveTab("download")
        router.push('/ide/download')
      }
    },
    {
      name: "Editor",
      path: "editor",
      icon: <RiEditLine className="w-4 h-4" />,
      onClick: () => {
        setActiveTab("editor")
        router.push('/ide/editor')
      }
    },
    {
      name: "Preview",
      path: "preview",
      icon: <RiEyeLine className="w-4 h-4" />,
      onClick: () => {
        setActiveTab("preview")
        router.push('/ide/preview')
      }
    },
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Navigation */}
      <div className="sticky top-24 z-40 flex justify-center mx-auto max-w-7xl px-4">
        <div className="w-[750px] bg-gray-800/90 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between gap-2 px-3 py-2">
            {ideNavItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className={`
                  relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl
                  text-sm font-medium transition-all duration-300 ease-in-out
                  hover:scale-105 active:scale-95
                  ${activeTab === item.path 
                    ? 'text-white bg-gradient-to-br from-blue-500/20 to-purple-500/20 shadow-inner' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}
                `}
              >
                <span className="relative z-10">{item.icon}</span>
                <span className="relative z-10">{item.name}</span>
                {activeTab === item.path && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-purple-500/10 animate-gradient" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-6 mx-auto max-w-7xl px-4">
        <div className="bg-gray-800 border border-gray-700/50 rounded-xl p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout