"use client"
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import axios from "axios";
import { useReadContract, useWriteContract } from "wagmi";
import { ABI, contractAddress } from "../abis/SmartContractMarketplace";
import { parseEther } from "viem";
import { useRouter } from "next/navigation"; // Import useRouter

export default function UploadContractForm() {
  const [tokenURI, setTokenURI] = useState("");
  const [tags, setTags] = useState([]);
  const [customTag, setCustomTag] = useState("");
  const [usageFee, setUsageFee] = useState("");
  const router = useRouter(); // Initialize useRouter

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

  const handleTagSelection = (e) => {
    const selectedTag = e.target.value;
    if (selectedTag && !tags.includes(selectedTag)) {
      setTags([...tags, selectedTag]);
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

  const { writeContract } = useWriteContract();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log({
        tokenURI,
        tags,
        usageFee,
      });

      const tx = await writeContract({
        abi: ABI,
        address: contractAddress,
        functionName: "uploadContract",
        args: [tokenURI, tags, parseEther(usageFee)],
      });

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
        console.log(tokenURI);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-gray-900 p-8 mt-40 rounded-lg shadow-lg border border-gray-700">
      {/* Back Button */}
      <button
        onClick={() => router.push("/marketplace/view")} // Navigate to /marketplace/view
        className="mb-6 text-gray-300 hover:text-white transition flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Marketplace
      </button>

      <h2 className="text-3xl font-bold text-center mb-6 text-white">Upload Smart Contract</h2>

      <div className="flex justify-center mb-6">
        <ConnectButton />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-300 font-medium mb-2">Smart Contract File</label>
          <input
            type="file"
            className="w-full p-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
            onChange={uploadToIpfs}
            required
          />
        </div>

        {/* Predefined Tags Dropdown */}
        <div>
          <label className="block text-gray-300 font-medium mb-2">Select Tags</label>
          <select
            onChange={handleTagSelection}
            className="w-full p-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
          >
            <option value="">Select a tag</option>
            {predefinedTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
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
          <label className="block text-gray-300 font-medium mb-2">Add Custom Tag</label>
          <div className="flex">
            <input
              type="text"
              className="w-full p-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              placeholder="Enter a custom tag"
            />
            <button
              type="button"
              className="ml-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              onClick={handleAddCustomTag}
            >
              Add
            </button>
          </div>
        </div>

        {/* Usage Fee */}
        <div>
          <label className="block text-gray-300 font-medium mb-2">Usage Fee (in Wei)</label>
          <input
            type="number"
            className="w-full p-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
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