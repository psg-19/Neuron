"use client";
import React, { useState, useEffect } from "react";
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
  const publicClient = usePublicClient();//

  // State variables
  const [txHash, setTxHash] = useState();
  const [contractAddress, setContractAddress] = useState("");
  const [data, setData] = useState({}); // Stores only the data, e.g., {"myNumber": 0}
  const [returnedVar, setReturnedVar] = useState(""); // Stores the name of the returned variable, e.g., "myNumber"
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
  const [functionInputs, setFunctionInputs] = useState({}); // New state for function arguments

  // Track contract address after deployment
  useEffect(() => {
    const fetchContractAddress = async () => {
      if (txHash) {
        const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
        setContractAddress(receipt.contractAddress);
      }
    };
    fetchContractAddress();
  }, [txHash, publicClient]);//

  // Handle editor changes
  const handleEditorChange = (value) => {
    setCode(value);
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

  // Handle function execution
  const handleExecute = async (functionName) => {
    const inputs = functionInputs[functionName] || '';
    let temp = {
      function: functionName,
      args: inputs.split(',').map(arg => arg.trim())
    };

    try {
      const response = await resolveQuery(data, temp, code);
      const res = JSON.parse(response);
      setData(res.data); // Update data with the res data, e.g., {"myNumber": 0}
      setReturnedVar(res.return); // Update returnedVar with the name of the returned variable, e.g., "myNumber"
    } catch (error) {
      console.error("Error executing function:", error);
      alert("Function execution failed!");
    }
  };

  // Render contract functions
  const renderContractFunctions = () => {
    if (!contractAddress || !abi) return null;

    try {
      const parsedAbi = JSON.parse(abi);
      return parsedAbi
        .filter(item => item.type === "function")
        .map((func, index) => (
          <div key={index} className="mb-4 p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold">{func.name}</h3>
              
              {func.inputs.length > 0 && (
                <input
                  type="text"
                  placeholder={`Args: ${func.inputs.map(input => input.type).join(', ')}`}
                  className="flex-1 p-2 bg-gray-700 rounded"
                  value={functionInputs[func.name] || ''}
                  onChange={(e) => setFunctionInputs(prev => ({
                    ...prev,
                    [func.name]: e.target.value
                  }))}
                />
              )}

              <button
                onClick={() => handleExecute(func.name)}
                className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-400"
              >
                Execute
              </button>

              {returnedVar && data[returnedVar] && (
                <div className="mt-2 p-2 bg-gray-700 rounded">
                  <span className="text-green-400">Response: {data[returnedVar]}</span>
                </div>
              )}
            </div>
          </div>
        ));
    } catch (error) {
      return <div className="text-red-500">Error loading functions</div>;
    }
  };
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
  const copyToClipboard = (text) => {

  }
  const downloadStandalone = async () => {

  }
  const highlightErrors=async()=>{
    
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
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
        <button className="bg-orange-500 px-4 py-2 rounded text-white font-bold hover:bg-green-400" onClick={getTestnet}>
          Testnet
        </button>
        <button className="bg-orange-500 px-4 py-2 rounded text-white font-bold hover:bg-green-400" onClick={getVulnerabilityReport}>
        Report
        </button>
        <button className="bg-orange-500 px-4 py-2 rounded text-white font-bold hover:bg-green-400" onClick={highlightErrors}>
        Find Errors
        </button>
        

      </div>

      {/* Solidity Code Editor */}
      <Editor
        height="400px"
        width="100%"
        theme="vs-dark"
        defaultLanguage="solidity"
        defaultValue={code}
        onChange={handleEditorChange}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          wordWrap: "on",
          lineNumbers: "on",
          automaticLayout: true,
        }}
      />

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
    </div>
  );
};

export default SolidityEditor;