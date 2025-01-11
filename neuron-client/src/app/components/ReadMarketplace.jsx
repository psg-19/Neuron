"use client"
import React, { useState, useEffect } from "react";
import { useReadContract, useReadContracts } from "wagmi";
import { ABI, contractAddress } from "../abis/SmartContractMarketplace";
import { Card, CardContent, Typography, Grid, CircularProgress } from "@mui/material";
import { formatEther } from "viem";

const ReadMarketplace = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch total number of token IDs
  const { data: totalTokens } = useReadContract({
    abi: ABI,
    address: contractAddress,
    functionName: "getTotalTokenIds",
  });
  console.log(totalTokens)

  // Create an array of contract reading configurations
  const getContractConfigs = () => {
    if (!totalTokens) return [];
    
    return Array.from({ length: Number(totalTokens) }, (_, i) => ({
      abi: ABI,
      address: contractAddress,
      functionName: "getContractDetails",
      args: [i + 1],
    }));
  };

  // Read all contracts at once
  const { data: contractsData } = useReadContracts({
    contracts: getContractConfigs(),
  });
  console.log(contractsData)

  useEffect(() => {
    if (!contractsData) return;

    const processContractsData = () => {
      const fetchedContracts = contractsData
        .map((result, index) => {
          // The previous condition was incorrect
          // Changed from: if (!result.status === 'success' || !result.data)
          if (!result || !result.result) return null;
          
          try {
            const [creator, tags, usageFee] = result.result;
            return {
              tokenId: index + 1,
              creator,
              tags,
              usageFee: Number(usageFee),
            };
          } catch (error) {
            console.error(`Error processing contract ${index + 1}:`, error);
            return null;
          }
        })
        .filter(Boolean); // Remove null entries

      setContracts(fetchedContracts);
      console.log('Processed Contracts:', fetchedContracts);
      setLoading(false);
    };

    // Add debugging logs
    console.log('Raw contractsData:', contractsData);
    processContractsData();
  }, [contractsData]);

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Smart Contracts Marketplace
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {contracts.length > 0 ? (
            contracts.map(({ tokenId, creator, tags, usageFee }) => (
              <Grid item xs={12} sm={6} md={4} key={tokenId}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Contract #{tokenId}</Typography>
                    <Typography variant="body1">
                      <strong>Creator:</strong> {creator}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Usage Fee:</strong> {formatEther(usageFee.toString())} Ether
                    </Typography>
                    <Typography variant="body1">
                      <strong>Tags:</strong> {tags.join(", ")}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography>No contracts available.</Typography>
          )}
        </Grid>
      )}
    </div>
  );
};

export default ReadMarketplace;