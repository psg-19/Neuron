import React from 'react';
import { RiAddLine, RiFileList2Line } from 'react-icons/ri';

const EditorSidebar = ({ files, setFiles, activeFile, setActiveFile, createNewFile }) => {
  return (
    <div className="p-4 text-gray-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Files</h2>
        <button 
          onClick={createNewFile} 
          className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <RiAddLine className="w-5 h-5" /> New File
        </button>
      </div>

      <ul className="space-y-2">
        {Object.keys(files).map((file, index) => (
          <li 
            key={index}
            onClick={() => setActiveFile(file)}
            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
              activeFile === file ? 'bg-blue-500 text-white' : 'hover:bg-gray-700'
            }`}
          >
            <RiFileList2Line className="w-5 h-5" />
            {file}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EditorSidebar;
