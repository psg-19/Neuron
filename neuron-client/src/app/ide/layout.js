'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import EditorSidebar from '../components/EditorSidebar'
import { RiBrainLine, RiCheckboxMultipleLine, RiCodeSSlashLine, RiDownloadLine, RiEditLine, RiEyeLine } from 'react-icons/ri'
import Editor from '@monaco-editor/react'

const Layout = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState('editor')
  const [files, setFiles] = useState({
    "README.md": "# Welcome to the IDE\n\nStart coding in Solidity!"
  });
  const [activeFile, setActiveFile] = useState("README.md");
  const [code, setCode] = useState(files[activeFile]);

  useEffect(() => {
    const path = pathname.split('/').pop()
    setActiveTab(path || 'editor')
  }, [pathname]);

  useEffect(() => {
    setCode(files[activeFile] || "");
  }, [activeFile]);

  const handleEditorChange = (value) => {
    setFiles((prevFiles) => ({
      ...prevFiles,
      [activeFile]: value
    }));
  };

  const createNewFile = () => {
    const fileCount = Object.keys(files).filter(f => f.startsWith("contract_")).length;
    const newFileName = `contract_${fileCount + 1}.sol`;
  
    setFiles(prevFiles => ({
      ...prevFiles,
      [newFileName]: `// SPDX-License-Identifier: MIT\npragma solidity ^0.8.0;\n\ncontract NewContract {\n}`
    }));
  
    setActiveFile(newFileName);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Navigation */}
      <div className="sticky top-32 z-40 flex justify-center mx-auto max-w-7xl px-4">
        <div className="w-[750px] bg-gray-800/90 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between gap-2 px-3 py-2">
            {[
              { name: "AI Analysis", path: "aianalysis", icon: <RiBrainLine className="w-4 h-4" />, route: '/ide/aiAnalysis' },
              { name: "Audit", path: "audit", icon: <RiCheckboxMultipleLine className="w-4 h-4" />, route: '/ide/audit' },
              { name: "Compile", path: "compile", icon: <RiCodeSSlashLine className="w-4 h-4" />, route: '/ide/compile' },
              { name: "Download", path: "download", icon: <RiDownloadLine className="w-4 h-4" />, route: '/ide/download' },
              { name: "Editor", path: "editor", icon: <RiEditLine className="w-4 h-4" />, route: '/ide/editor' },
              { name: "Preview", path: "preview", icon: <RiEyeLine className="w-4 h-4" />, route: '/ide/preview' },
            ].map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveTab(item.path);
                  router.push(item.route);
                }}
                className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 ${
                  activeTab === item.path ? 'text-white bg-gradient-to-br from-blue-500/20 to-purple-500/20 shadow-inner' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <span className="relative z-10">{item.icon}</span>
                <span className="relative z-10">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
     \
    </div>
  );
}

export default Layout;
