"use client";
import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { useDeployContract,useSwitchChain,useAccount } from "wagmi";
const SolidityEditor = () => {
  const {deployContract} = useDeployContract()
  const { isConnected, address } = useAccount()
  const { switchChain } = useSwitchChain()
  const [txHash,setTxHash] = useState()

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

  // Handle editor changes
  const handleEditorChange = (value) => {
    setCode(value);
  };

  // Call the API to compile Solidity code
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

  // Function to copy text to clipboard
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };
  const contractDeployment=async()=>{
    await switchChain({ chainId: 57054})

    const contract = deployContract(
      {
      abi: abi,
      bytecode: bytecode,
      },
      {
        onError: (error) => {
          console.error("Deployment error:", error)
          toast.error("Contract deployment failed!")
        },
        onSuccess: (data) => {
          console.log("Contract deployed successfully:", data)
          console.log(`Transaction hash: ${data}`)
          setTxHash(data)                     
        },
        onSettled: (data, error) => {
          if (error) {
            console.error("Transaction failed or was rejected:", error)
          } else {
            console.log("Transaction completed:", data)
          }
        },
      }
     )
          


  }
  const viewOnExplorer = () => {
    const explorerUrl = `https://testnet.sonicscan.org/tx/${txHash}`
    window.open(explorerUrl, '_blank')
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
            <button onClick={() => handleCopy(abi)} className="bg-blue-500 px-3 py-1 rounded text-white hover:bg-blue-400">
              Copy
            </button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <label className="text-yellow-400 font-bold">Bytecode:</label>
            <input type="text" readOnly value={bytecode} className="flex-1 bg-gray-700 p-2 rounded text-sm" />
            <button onClick={() => handleCopy(bytecode)} className="bg-blue-500 px-3 py-1 rounded text-white hover:bg-blue-400">
              Copy
            </button>
          </div>
        </div>
      )}
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
    </div>
  );
};

export default SolidityEditor;
