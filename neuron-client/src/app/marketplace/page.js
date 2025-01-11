"use client"
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import axios from "axios";
import { useReadContract,useWriteContract } from "wagmi";
import { ABI, contractAddress } from "../abis/SmartContractMarketplace";
import { parseEther } from "viem";
import ReadMarketplace from "../components/ReadMarketplace";
export default function UploadContractForm() {
  const [tokenURI, setTokenURI] = useState("");
  const [tags, setTags] = useState([]);
  const [customTag, setCustomTag] = useState("");
  const [usageFee, setUsageFee] = useState("");

  const predefinedTags = [
    "L1", "L2", "Sidechain", "Rollup", "Plasma", "zk-Rollup", "Optimistic Rollup",
    "ERC20", "ERC721", "ERC1155", "ERC4626", "EIP-2535", "ERC404",
    "DEX", "AMM", "Lending", "Yield Farming", "Staking", "Flash Loan", "Liquidity Pool",
    "NFT Marketplace", "Gaming", "Metaverse", "Soulbound Token", "P2E", "Dynamic NFTs",
    "MultiSig", "Wallet", "MPC", "ZKP", "SBT",
    "DAO", "Token Voting", "Quadratic Voting", "Treasury", "MultiSig Governance",
    "Cosmos", "IBC", "Bridges", "Cross-Chain", "Omnichain",
    "Oracle", "Chainlink", "IPFS", "Data Storage", "Privacy", "AI on Blockchain"
  ];

  const handleTagSelection = (tag) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleAddCustomTag = (e) => {
    e.preventDefault();
    if (customTag && !tags.includes(customTag)) {
      setTags([...tags, customTag]);
      setCustomTag("");
    }
  };
  const {writeContract}=useWriteContract()

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      console.log({
        tokenURI,
        tags,
        usageFee,
      });
  
      // Ensure tags are formatted correctly (if passed as an array)
  
      const tx = await writeContract({
        abi: ABI,  // Ensure ABI is correctly imported
        address: contractAddress, // Ensure this is correctly set
        functionName: "uploadContract",
        args: [tokenURI, tags, parseEther(usageFee)], // Convert usageFee to BigInt for blockchain transactions
      });      
      // Optionally, wait for confirmation (if using ethers.js)
      // await tx.wait();
      console.log("Transaction confirmed!");
  
    } catch (error) {
      console.error("Error uploading contract:", error);
    }
  };
  

  const uploadToIpfs = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      try {
        const fileData = new FormData();
        fileData.append("file", file);
        const res = await axios.post(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          fileData,
          {
            headers: {
              pinata_api_key: "35cb1bf7be19d2a8fa0d",
              pinata_secret_api_key: "2c2e9e43bca7a619154cb48e8b060c5643ea6220d0b7c9deb565fa491b3b3a50",
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setTokenURI(`https://ipfs.io/ipfs/${res.data.IpfsHash}`);
        console.log(tokenURI)
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 mt-10 rounded-lg shadow-lg border border-gray-200">

      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Upload Smart Contract</h2>
      
      <div className="flex justify-center mb-6">
        <ConnectButton />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Smart Contract File</label>
          <input
            type="file"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={uploadToIpfs}
            required
          />
        </div>

        {/* Predefined Tags */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Select Tags</label>
          <div className="grid grid-cols-3 gap-2">
            {predefinedTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`px-3 py-1 rounded-full text-sm ${
                  tags.includes(tag) ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
                onClick={() => handleTagSelection(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Display Selected Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full flex items-center"
              >
                {tag}
                <button type="button" className="ml-2 text-white" onClick={() => handleRemoveTag(tag)}>×</button>
              </span>
            ))}
          </div>
        )}

        {/* Custom Tag Input */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Add Custom Tag</label>
          <div className="flex">
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              placeholder="Enter a custom tag"
            />
            <button
              type="button"
              className="ml-2 px-4 py-2 bg-green-500 text-white rounded-lg"
              onClick={handleAddCustomTag}
            >
              Add
            </button>
          </div>
        </div>

        {/* Usage Fee */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Usage Fee (in Wei)</label>
          <input
            type="number"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={usageFee}
            step="any"
            onChange={(e) => setUsageFee(e.target.value)}
            placeholder="Enter fee in Wei"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
        >
          Upload Contract
        </button>
      </form>
    </div>
  );
}
