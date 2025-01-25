"use client";
import React, { useState, useEffect, useRef } from "react";
import { Modal, Input } from "antd";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { useDeployContract, useSwitchChain, useAccount, usePublicClient } from "wagmi";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { resolveQuery } from "../ai/chat";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const SolidityEditor = () => {
  const { deployContract } = useDeployContract();
  const { isConnected, address } = useAccount();
  const { switchChain } = useSwitchChain();
  const publicClient = usePublicClient();
  const editorRef = useRef(null);

  // State variables
  const [txHash, setTxHash] = useState();
  const [contractAddress, setContractAddress] = useState("");
  const [data, setData] = useState({});
  const [returnedVar, setReturnedVar] = useState("");
  const [code, setCode] = useState(`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyContract {
    uint256 public myNumber;

    function setNumber(uint256 _num) public {
        myNumber = _num;
    }

    function getNumber() public view returns (uint256) {
        return myNumber;
    }
}`);
  const [abi, setAbi] = useState("");
  const [bytecode, setBytecode] = useState("");
  const [compilationError, setCompilationError] = useState("");
  const [functionInputs, setFunctionInputs] = useState({});
  const iframeRef = useRef(null);
  
  // AI Assistant states
  const [showAiHelper, setShowAiHelper] = useState(false);
  const [helperPosition, setHelperPosition] = useState({ x: 0, y: 0 });
  const [selectedCode, setSelectedCode] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  const [showAiResponseModal, setShowAiResponseModal] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  // Preview function states
// Preview function states
const [showPreviewPanel, setShowPreviewPanel] = useState(false);
const [previewQuery, setPreviewQuery] = useState("");
const [generatedComponent, setGeneratedComponent] = useState("");
const [isGeneratingComponent, setIsGeneratingComponent] = useState(false);
const [previewCode, setPreviewCode] = useState("");
const reactEditorRef = useRef(null);
  // Handle editor mounting
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Add selection change listener to show AI helper button
    editor.onDidChangeCursorSelection((e) => {
      if (e.selection.isEmpty()) {
        setShowAiHelper(false);
        return;
      }
      
      const selectedText = editor.getModel().getValueInRange(e.selection);
      if (selectedText && selectedText.length > 0) {
        setSelectedCode(selectedText);
        
        // Get position for helper button (near selection end)
        const endPosition = editor.getScrolledVisiblePosition(e.selection.getEndPosition());
        if (endPosition) {
          // Position the button near the end of selection
          setHelperPosition({
            x: endPosition.left + 10,
            y: endPosition.top + 20
          });
          setShowAiHelper(true);
        }
      } else {
        setShowAiHelper(false);
      }
    });
    
    // Hide helper when editor loses focus
    editor.onDidBlurEditorWidget(() => {
      setTimeout(() => setShowAiHelper(false), 200);
    });
  };

  // Track contract address after deployment
  useEffect(() => {
    localStorage.setItem("files", JSON.stringify(["temp"]));
    localStorage.setItem(
      "temp",
      JSON.stringify(`// SPDX-License-Identifier: MIT
    pragma solidity ^0.8.0;
    
    contract MyContract {
        uint256 public myNumber;
    
        function setNumber(uint256 _num) public {
            myNumber = _num;
        }
    
        function getNumber() public view returns (uint256) {
            return myNumber;
        }
    }`)
    );
    const fetchContractAddress = async () => {
      if (txHash) {
        const receipt = await publicClient.waitForTransactionReceipt({
          hash: txHash,
        });
        setContractAddress(receipt.contractAddress);
      }
    };
    let storedFiles = JSON.parse(localStorage.getItem("files")) || [];
    setFiles(storedFiles);
    setCode(null);

    fetchContractAddress();
  }, [txHash, publicClient]); //
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileName, setFileName] = useState("");

  const addFile = () => {
    setIsModalOpen(true);
  };
  const saveFile = () => {
    localStorage.removeItem(fileName);
    localStorage.setItem(fileName, JSON.stringify(code));
  };
  const changeFile = (file) => {
    console.log(JSON.parse(localStorage.getItem(file)));
    setCode(null);
    setFileName(file);
    setCode(JSON.parse(localStorage.getItem(file)));
  };

  const handleCreateFile = () => {
    if (fileName.trim()) {
      const fileKey = `${fileName}`;
      // Get existing file list
      let storedFiles = JSON.parse(localStorage.getItem("files")) || [];

      // Add new file if not already present
      if (!storedFiles.includes(fileKey)) {
        setFiles(null);
        storedFiles.push(fileKey);
        localStorage.setItem("files", JSON.stringify(storedFiles));
        setFiles(storedFiles); // Update state
      }
      localStorage.setItem(fileKey, JSON.stringify(code));

      setIsModalOpen(false);
      setFileName("");
    }
  };

  // Handle editor changes
  const handleEditorChange = (value) => {
    setCode(value);
  };

  // Ask AI about selected code
  const askAi = async () => {
    if (!selectedCode) return;
    
    setIsAiLoading(true);
    setShowAiResponseModal(true);
    setAiResponse("Loading...");
    
    try {
      // Send the selected code to an AI service for analysis
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCHK_9m7dwti-kYYWmr-ciR-Kp9_QTgvOc",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          contents: [
            {
              parts: [{ 
                text: `Explain this Solidity code in detail. What does it do? Are there any potential issues or optimizations?
                
                ${selectedCode} and dont provide the output in github markdown and html elements keep it as short as possible mostly one or two lines` 
              }],
            },
          ],
        },
      });
      
      const aiText = response.data.candidates[0].content.parts[0].text;
      setAiResponse(aiText);
    } catch (error) {
      console.error("Error querying AI:", error);
      setAiResponse("Sorry, I couldn't analyze that code right now. Please try again.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Compile Solidity code
  const handleCompile = async () => {
    setCompilationError("");
    try {
      const response = await axios.post(
        "/api/compile",
        { sources: { "contract.sol": { content: code } } },
        { headers: { "Content-Type": "application/json" } }
      );

      const result = response.data;
      if (response.status !== 200) {
        throw new Error(result.error || "Compilation failed!");
      }

      const contractName = Object.keys(result.compiled.contracts["contract.sol"])[0];
      const compiledAbi = JSON.stringify(result.compiled.contracts["contract.sol"][contractName].abi);
      const compiledBytecode = result.compiled.contracts["contract.sol"][contractName].evm.bytecode.object;

      setAbi(compiledAbi);
      setBytecode(compiledBytecode);
    } catch (error) {
      console.error("Compilation Error:", error);
      setCompilationError(error.message || "Compilation failed! Check your Solidity code.");
    }
  };

  // Deploy contract
  const contractDeployment = async () => {
    await switchChain({ chainId: 57054 });

    const contract = deployContract(
      {
        abi:abi,
        bytecode: bytecode,
      },
      {
        onError: (error) => {
          console.error("Deployment error:", error);
          alert("Contract deployment failed!");
        },
        onSuccess: (data) => {
          console.log("Contract deployed successfully:", data);
          setTxHash(data);
        },
      }
    );
  };

  // View transaction on explorer
  const viewOnExplorer = () => {
    const explorerUrl = `https://testnet.sonicscan.org/tx/${txHash}`;
    window.open(explorerUrl, '_blank');
  };

  // Generate Hardhat project
  const hardhatDownload = async () => {
    const zip = new JSZip();
    const packageJson = {
      "name": "hardhat-project",
      "version": "1.0.0",
      "description": "Hardhat project with Ignition deployment",
      "scripts": {
        "deploy": "hardhat ignition deploy ./ignition/modules/deploy.js"
      },
      "dependencies": {
        "hardhat": "^2.19.1",
        "@nomicfoundation/hardhat-toolbox": "^4.0.0",
        "@nomicfoundation/hardhat-ignition": "^0.13.0"
      }
    };
    const hardhatConfig = `
    require("@nomicfoundation/hardhat-toolbox");
    require("@nomicfoundation/hardhat-ignition");
    
    /** @type import('hardhat/config').HardhatUserConfig */
    module.exports = {
      solidity: "0.8.19",
      networks: {
        sonic: {
          url: "https://testnet.sonicchain.com/rpc",
          chainId: 57054
        }
      }
    };`;
    const ignitionModule = `
    const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
    
    module.exports = buildModule("MyContractDeployment", (m) => {
      const contract = m.contract("MyContract");
      return { contract };
    });`;
    zip.file("package.json", JSON.stringify(packageJson, null, 2));
    zip.file("hardhat.config.js", hardhatConfig);
    zip.file("contracts/MyContract.sol", code);
    zip.file("ignition/modules/deploy.js", ignitionModule);
    const readme = `# Hardhat Project with Ignition`;
    zip.file("README.md", readme);

    try {
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "hardhat-project.zip");
    } catch (error) {
      console.error("Error creating zip file:", error);
    }
  };

  // Generate Foundry project
  const foundryDownload = async () => {
    const zip = new JSZip();
    const foundryConfig = `[profile.default]
  src = "src"
  out = "out"
  libs = ["lib"]
  remappings = ['@openzeppelin/=lib/openzeppelin-contracts/']
  
  [rpc_endpoints]
  sonic = "https://testnet.sonicchain.com/rpc"
  
  [etherscan]
  sonic = { key = "" }`;
    const scriptFile = `// SPDX-License-Identifier: UNLICENSED
  pragma solidity ^0.8.19;
  
  import "forge-std/Script.sol";
  import "../src/MyContract.sol";
  
  contract DeployScript is Script {
      function run() external {
          uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
          vm.startBroadcast(deployerPrivateKey);
  
          MyContract myContract = new MyContract();
  
          vm.stopBroadcast();
      }
  }`;
    const envExample = `PRIVATE_KEY=
  RPC_URL=https://testnet.sonicchain.com/rpc`;
    const readme = `# Foundry Project`;
    zip.file("foundry.toml", foundryConfig);
    zip.file("src/MyContract.sol", code);
    zip.file("script/Deploy.s.sol", scriptFile);
    zip.file(".env.example", envExample);
    zip.file("README.md", readme);
    const gitignore = `cache/
  out/
  .env
  broadcast/`;
    zip.file(".gitignore", gitignore);

    try {
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "foundry-project.zip");
    } catch (error) {
      console.error("Error creating zip file:", error);
    }
  };
  const [files, setFiles] = useState([]);

  // Handle function execution
  // const handleExecute = async (functionName) => {
  //   const inputs = functionInputs[functionName] || '';
  //   let temp = {
  //     function: functionName,
  //     args: inputs.split(',').map(arg => arg.trim())
  //   };

  //   try {
  //     const response = await resolveQuery(data, temp, code);
  //     const res = JSON.parse(response);
  //     setData(res.data);
  //     setReturnedVar(res.return);
  //   } catch (error) {
  //     console.error("Error executing function:", error);
  //     alert("Function execution failed!");
  //   }
  // };

  // Render contract functions
  // const renderContractFunctions = () => {
  //   if (!contractAddress || !abi) return null;

  //   try {
  //     const parsedAbi = JSON.parse(abi);
  //     return parsedAbi
  //       .filter(item => item.type === "function")
  //       .map((func, index) => (
  //         <div key={index} className="mb-4 p-4 bg-gray-800 rounded-lg">
  //           <div className="flex items-center gap-4">
  //             <h3 className="text-lg font-semibold">{func.name}</h3>

  //             {func.inputs.length > 0 && (
  //               <input
  //                 type="text"
  //                 placeholder={`Args: ${func.inputs.map(input => input.type).join(', ')}`}
  //                 className="flex-1 p-2 bg-gray-700 rounded"
  //                 value={functionInputs[func.name] || ''}
  //                 onChange={(e) => setFunctionInputs(prev => ({
  //                     ...prev,
  //                   [func.name]: e.target.value
  //                 }))}
  //               />
  //             )}

  //             <button
  //               onClick={() => handleExecute(func.name)}
  //               className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-400"
  //             >
  //               Execute
  //             </button>

  //             {returnedVar && data[returnedVar] && (
  //               <div className="mt-2 p-2 bg-gray-700 rounded">
  //                 <span className="text-green-400">Response: {data[returnedVar]}</span>
  //               </div>
  //             )}
  //           </div>
  //         </div>
  //       ));
  //   } catch (error) {
  //     return <div className="text-red-500">Error loading functions</div>;
  //   }
  // };
  
  const getTestnet = async () => {
    await switchChain({ chainId: 57054 });
  }
  
  const getVulnerabilityReport = async () => {
    try {
      const prompt = `Analyze this Solidity smart contract for security vulnerabilities, potential issues, and best practices. Provide a clear, concise report highlighting main security concerns, gas optimizations, and recommendations. Focus on:
      1. Critical vulnerabilities
      2. Gas optimization opportunities
      3. Code quality issues
      4. Best practices violations
      5.Keep it as concise as possible 
      6.Don't add github markdown and html elements in it
      
      Contract code:
      ${code}`;

      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCHK_9m7dwti-kYYWmr-ciR-Kp9_QTgvOc",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        },
      });

      // Extract the report text from response
      const reportText = response.data.candidates[0].content.parts[0].text;

      // Format the report with proper spacing and structure
      const formattedReport = `SMART CONTRACT SECURITY AUDIT REPORT
  Date: ${new Date().toLocaleDateString()}
  
  ${reportText}
  
  Generated using Gemini 1.5
  `;

      // Create and download the report file
      const blob = new Blob([formattedReport], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'vulnerability-report.txt';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
  
    } catch (error) {
      console.error("Error generating vulnerability report:", error);
      alert("Failed to generate vulnerability report. Please try again.");
    }
  };
  const cleanJsonString = (text) => {
    try {
      // Remove any markdown code block syntax and whitespace
      const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
      return cleaned;
    } catch (error) {
      console.error('Error cleaning JSON string:', error);
      return '[]'; // Return empty array if cleaning fails
    }
  };

  const handleReactEditorDidMount = (editor) => {
    reactEditorRef.current = editor;
  };
  
  const handleReactEditorChange = (value) => {
    setPreviewCode(value);
  };
  const generateReactComponent = async () => {
    if (!previewQuery.trim()) return;
    
    setIsGeneratingComponent(true);
    
    try {
      // Extract contract information from current code
      const contractFunctions = [];
      
      if (abi) {
        try {
          const parsedAbi = JSON.parse(abi);
          parsedAbi
            .filter(item => item.type === "function")
            .forEach(func => {
              contractFunctions.push({
                name: func.name,
                inputs: func.inputs,
                outputs: func.outputs,
                stateMutability: func.stateMutability
              });
            });
        } catch (error) {
          console.error("Error parsing ABI:", error);
        }
      }
  
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCHK_9m7dwti-kYYWmr-ciR-Kp9_QTgvOc",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          contents: [
            {
              parts: [{ 
                text: `Create a React component based on this description: "${previewQuery}"
                
                The component should interact with a smart contract that has these functions: ${JSON.stringify(contractFunctions)}
                
                Contract address: ${contractAddress || "0x..."}
                
                Return only valid React code that uses Tailwind CSS for styling. Don't include imports or explanations.
                Use standard React hooks (useState, useEffect) and assume wagmi hooks are available for blockchain interaction.
                Make sure the component looks professional and has good error handling.`
              }],
            },
          ],
        },
      });
      
      const generatedCode = response.data.candidates[0].content.parts[0].text;
      
      // Clean up the code to remove any markdown formatting
      const cleanedCode = generatedCode.replace(/```jsx|```react|```js|```/g, '').trim();
      
      setPreviewCode(cleanedCode);
      setGeneratedComponent(cleanedCode);
    } catch (error) {
      console.error("Error generating React component:", error);
      setGeneratedComponent("// Error generating component. Please try again.");
    } finally {
      setIsGeneratingComponent(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <Modal
        title="Enter File Name"
        open={isModalOpen}
        onOk={handleCreateFile}
        onCancel={() => setIsModalOpen(false)}
      >
        <Input
          placeholder="File name"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          addonAfter=".sol"
        />
      </Modal>
      <h2 className="text-2xl font-bold mb-4">Solidity Code Editor</h2>

      {/* Buttons */}
      <div className="flex gap-4 mb-4">
        <button onClick={handleCompile} className="bg-yellow-500 px-4 py-2 rounded text-black font-bold hover:bg-yellow-400">
          Compile
        </button>
        <button className="bg-green-500 px-4 py-2 rounded text-white font-bold hover:bg-green-400" onClick={contractDeployment}>
          Deploy
        </button>
        <button className="bg-yellow-500 px-4 py-2 rounded text-white font-bold hover:bg-green-400" onClick={hardhatDownload}>
          Hardhat-D
        </button>
        <button className="bg-red-500 px-4 py-2 rounded text-white font-bold hover:bg-green-400" onClick={foundryDownload}>
          Foundry-D
        </button>
        <ConnectButton/>
        <button className="bg-orange-500 px-4 py-2 rounded text-white font-bold hover:bg-green-400" onClick={getVulnerabilityReport}>
          Report
        </button>
        <button 
    onClick={() => setShowPreviewPanel(!showPreviewPanel)} 
    className="bg-purple-500 px-4 py-2 rounded text-white font-bold hover:bg-purple-400"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm12 0H5v10h10V5z" clipRule="evenodd" />
    </svg>
    {showPreviewPanel ? "Hide UI Preview" : "Show UI Preview"}
  </button>
        
      </div>

      <div className="flex gap-5">
        <div className="w-[20%] h-[400px] bg-gray-800 text-white p-4 rounded-lg shadow-md flex flex-col">
          <button
            className="bg-green-500 text-white py-2 px-4 rounded-md mb-4 hover:bg-green-600"
            onClick={() => saveFile()}
          >
            Save File
          </button>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md mb-4 hover:bg-blue-600"
            onClick={() => addFile()}
          >
            Add File
          </button>

          {/* File List */}
          <div className="flex flex-col gap-2 overflow-y-auto">
            {files && files.length > 0 ? (
              files.map((file, index) => (
                <div
                  key={index}
                  className={`bg-gray-700 ${
                    fileName == file ? "bg-green-700" : "bg-gray-700"
                  } p-2 rounded-md cursor-pointer `}
                  onClick={() => {
                    changeFile(file);
                  }}
                >
                  {file}.sol
                </div>
              ))
            ) : (
              <p className="text-gray-400">No files added</p>
            )}
          </div>
        </div>

        {code && (
          <Editor
            height="400px"
            width="80%"
            theme="vs-dark"
            defaultLanguage="solidity"
            defaultValue={code}
            value={code}
            onChange={handleEditorChange}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              wordWrap: "on",
              lineNumbers: "on",
              automaticLayout: true,
            }}
          />
        )}
      </div>
      {/* Editor Container - This wrapper is needed to position the AI helper correctly */}
      <div className="relative">

        {/* AI Helper Button */}
        {showAiHelper && (
          <div 
            className="absolute z-10 cursor-pointer"
            style={{ 
              left: `${helperPosition.x}px`, 
              top: `${helperPosition.y}px` 
            }}
          >
            <button 
              onClick={askAi}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm shadow-lg flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Ask AI
            </button>
          </div>
        )}
      </div>

      {/* AI Response Modal */}
      {showAiResponseModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-8 max-w-4xl w-full max-h-[85vh] overflow-hidden border border-gray-700/50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-purple-500/20 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            AI Analysis Report
          </h3>
        </div>
        <button 
          onClick={() => setShowAiResponseModal(false)}
          className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-6 overflow-y-auto max-h-[calc(85vh-12rem)] pr-4 custom-scrollbar">
        {/* Selected Code Section */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
          <div className="p-4 border-b border-gray-700/50">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <h4 className="font-bold text-yellow-400">Selected Code</h4>
            </div>
          </div>
          <pre className="p-4 text-sm font-mono text-gray-300 bg-black/20">{selectedCode}</pre>
        </div>

        {/* Analysis Section */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
          <div className="p-4 border-b border-gray-700/50">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h4 className="font-bold text-green-400">Analysis Results</h4>
            </div>
          </div>
          <div className="p-4">
            {isAiLoading ? (
              <div className="flex flex-col items-center justify-center p-8 gap-4">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
                <p className="text-gray-400">Analyzing your code...</p>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none">
                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">{aiResponse}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-700/50 flex justify-end gap-3">
        <button 
          onClick={() => {
            // Add copy to clipboard functionality
            navigator.clipboard.writeText(aiResponse);
          }}
          className="px-4 py-2 rounded-lg bg-gray-700/50 text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </button>
        <button 
          onClick={() => setShowAiResponseModal(false)}
          className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

      {/* Display Errors */}
      {compilationError && (
        <div className="mt-4 p-3 bg-red-500 text-white rounded">
          <h3 className="font-bold">Compilation Error</h3>
          <pre className="whitespace-pre-wrap">{compilationError}</pre>
        </div>
      )}

      {/* ABI & Bytecode Section */}
      {abi && bytecode && (
        <div className="mt-4 p-4 bg-gray-800 rounded">
          <h3 className="font-bold text-lg mb-2">Compiled Output</h3>
          <div className="flex items-center gap-2">
            <label className="text-yellow-400 font-bold">ABI:</label>
            <input type="text" readOnly value={abi} className="flex-1 bg-gray-700 p-2 rounded text-sm" />
            <button onClick={() => navigator.clipboard.writeText(abi)} className="bg-blue-500 px-3 py-1 rounded text-white hover:bg-blue-400">
              Copy
            </button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <label className="text-yellow-400 font-bold">Bytecode:</label>
            <input type="text" readOnly value={bytecode} className="flex-1 bg-gray-700 p-2 rounded text-sm" />
            <button onClick={() => navigator.clipboard.writeText(bytecode)} className="bg-blue-500 px-3 py-1 rounded text-white hover:bg-blue-400">
              Copy
            </button>
          </div>
        </div>
      )}

      {/* Transaction Hash */}
      {txHash && (
        <div className="mt-4 p-4 bg-gray-800 rounded">
          <div className="flex items-center justify-between">
            <span className="text-yellow-400 font-bold">Transaction Hash: </span>
            <div className="flex items-center gap-2">
              <span className="text-sm truncate max-w-md">{txHash}</span>
              <button
                onClick={viewOnExplorer}
                className="bg-purple-500 px-4 py-2 rounded text-white font-bold hover:bg-purple-400"
              >
                View on Explorer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Function testing section */}
      {contractAddress && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Contract Functions</h2>
          {renderContractFunctions()}
        </div>
      )}
      {/* Preview Feature */}
<div className="mt-8">

  
  {showPreviewPanel && (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">React Component Generator</h2>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={previewQuery}
          onChange={(e) => setPreviewQuery(e.target.value)}
          placeholder="Describe the UI component you want (e.g., 'Create a buy token form with price display')"
          className="flex-1 bg-gray-700 p-3 rounded text-white"
        />
        <button
          onClick={generateReactComponent}
          disabled={isGeneratingComponent}
          className={`px-4 py-2 rounded font-bold ${isGeneratingComponent ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {isGeneratingComponent ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin h-5 w-5 border-t-2 border-white rounded-full"></div>
              <span>Generating...</span>
            </div>
          ) : "Generate Component"}
        </button>
      </div>
      
      {generatedComponent && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="bg-gray-800 p-3 border-b border-gray-700">
              <h3 className="font-bold">Component Code</h3>
            </div>
            <Editor
              height="400px"
              width="100%"
              theme="vs-dark"
              defaultLanguage="javascript"
              value={previewCode}
              onChange={handleReactEditorChange}
              onMount={handleReactEditorDidMount}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                wordWrap: "on",
                lineNumbers: "on",
                automaticLayout: true,
              }}
            />
            <div className="bg-gray-800 p-3 border-t border-gray-700 flex justify-end">
              <button
                onClick={() => navigator.clipboard.writeText(previewCode)}
                className="bg-blue-500 px-3 py-1 rounded text-white hover:bg-blue-600 flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )}
</div>
    </div>
  );
};

export default SolidityEditor;