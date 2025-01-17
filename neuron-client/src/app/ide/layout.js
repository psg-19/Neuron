import React from 'react'
import { IconBrain, IconAudit, IconCode, IconDownload, IconEdit, IconEye } from '@tabler/icons-react'

const layout = ({ children }) => {
  const ideNavItems = [
    {
      name: "AI Analysis",
      icon: <IconBrain className="w-5 h-5" />,
      onClick: () => console.log("AI Analysis clicked")
    },
    {
      name: "Audit",
      icon: <IconAudit className="w-5 h-5" />,
      onClick: () => console.log("Audit clicked")
    },
    {
      name: "Compile",
      icon: <IconCode className="w-5 h-5" />,
      onClick: () => console.log("Compile clicked")
    },
    {
      name: "Download",
      icon: <IconDownload className="w-5 h-5" />,
      onClick: () => console.log("Download clicked")
    },
    {
      name: "Editor",
      icon: <IconEdit className="w-5 h-5" />,
      onClick: () => console.log("Editor clicked")
    },
    {
      name: "Preview",
      icon: <IconEye className="w-5 h-5" />,
      onClick: () => console.log("Preview clicked")
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="sticky top-24 z-40 w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center px-4 py-3 space-x-4">
          {ideNavItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg 
                       text-gray-600 dark:text-gray-300 
                       hover:bg-gray-100 dark:hover:bg-gray-700 
                       transition-colors duration-200"
            >
              {item.icon}
              <span className="text-sm font-medium">{item.name}</span>
            </button>
          ))}
        </div>
      </div>
      {children}
    </div>
  )
}

export default layout