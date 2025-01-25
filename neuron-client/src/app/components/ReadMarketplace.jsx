"use client";
import React, { useState, useEffect } from "react";
import { useReadContract, useWriteContract, useReadContracts } from "wagmi";
import { ABI, contractAddress } from "../abis/SmartContractMarketplace";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Box,
  IconButton,
  Tooltip,
  TextField,
  Chip,
  Container,
  Paper,
  Avatar,
  Button,
  Divider,
  Skeleton,
  Alert,
  Snackbar,
  AppBar,
  Toolbar,
  InputAdornment
} from "@mui/material";
import { formatEther } from "viem";
import {
  InsertDriveFile as InsertDriveFileIcon,
  Search as SearchIcon,
  AccountBalanceWallet as WalletIcon,
  Code as CodeIcon,
  Tag as TagIcon,
  Person as PersonIcon,
  Clear as ClearIcon
} from "@mui/icons-material";
import { useRouter } from 'next/navigation';

const ReadMarketplace = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState({ open: false, message: "", severity: "info" });
  const { writeContract } = useWriteContract();
  const router = useRouter();

  // Fetch total number of token IDs
  const { data: totalTokens } = useReadContract({
    abi: ABI,
    address: contractAddress,
    functionName: "getTotalTokenIds",
  });

  // Create an array of contract reading configurations
  const getContractConfigs = () => {
    if (!totalTokens) return [];

    const configs = [];
    for (let i = 0; i < Number(totalTokens); i++) {
      configs.push({
        abi: ABI,
        address: contractAddress,
        functionName: "getContractDetails",
        args: [i + 1],
      });
      configs.push({
        abi: ABI,
        address: contractAddress,
        functionName: "tokenURI",
        args: [i + 1],
      });
    }
    return configs;
  };

  const { data: contractsData } = useReadContracts({
    contracts: getContractConfigs(),
  });

  useEffect(() => {
    if (!contractsData) return;
    const processContractsData = async () => {
      const fetchedContracts = [];

      for (let i = 0; i < contractsData.length; i += 2) {
        const contractResult = contractsData[i];
        const uriResult = contractsData[i + 1];

        if (!contractResult?.result || !uriResult?.result) continue;

        try {
          const [creator, tags, usageFee] = contractResult.result;
          const tokenURI = uriResult.result;

          fetchedContracts.push({
            tokenId: i / 2 + 1,
            creator,
            tags,
            usageFee: Number(usageFee),
            tokenURI,
          });
        } catch (error) {
          console.error(`Error processing contract ${i / 2 + 1}:`, error);
        }
      }

      setContracts(fetchedContracts);
      setLoading(false);
    };

    processContractsData();
  }, [contractsData]);

  const getIpfsUrl = (tokenURI) => {
    return tokenURI.startsWith('ipfs://')
      ? `https://ipfs.io/ipfs/${tokenURI.slice(7)}`
      : tokenURI;
  };

  const handleDownload = async (tokenURI, id, price) => {
    try {
      setNotification({ open: true, message: "Processing your purchase...", severity: "info" });

      const tx = await writeContract({
        abi: ABI,
        address: contractAddress,
        functionName: "accessContract",
        args: [id],
        value: price
      });

      setNotification({ open: true, message: "Purchase successful! Downloading contract...", severity: "success" });

      const ipfsUrl = getIpfsUrl(tokenURI);
      const response = await fetch(ipfsUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const filename = tokenURI.split("/").pop().replace(/\.[^/.]+$/, "") + ".sol";
      a.download = `contract-${filename}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
      setNotification({ open: true, message: "Transaction failed. Please try again.", severity: "error" });
    }
  };

  // Filter contracts based on search query
  const filteredContracts = contracts.filter((contract) =>
    contract.tags.some((tag) =>
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Helper to truncate address for display
  const truncateAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // To close notification
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Clear search query
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="mt-40"
    >
    

      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            background: 'linear-gradient(to right, #f5f7fa, #e4e7eb)'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <div>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: "medium" }}>
                Discover Smart Contracts
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Browse and purchase verified smart contracts from developers around the world
              </Typography>
            </div>
            <Button
              variant="contained"
              onClick={() => router.push('/marketplace')}
              sx={{
                backgroundColor: '#90CAF9',
                color: '#0D0D0D',
                fontWeight: 'bold',
                borderRadius: 2,
                padding: '10px 20px',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#64B5F6',
                  boxShadow: '0 3px 10px rgba(144,202,249,0.3)'
                }
              }}
            >
              Create Contract
            </Button>
          </Box>
          {!loading && (
           <Paper
           elevation={2}
           sx={{
             display: 'flex',
             alignItems: 'center',
             borderRadius: 3,
             mb: 2,
             background: "linear-gradient(145deg, #1E1E1E, #2C2C2C)",
             boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
             transition: "transform 0.3s ease, box-shadow 0.3s ease",
             "&:hover": {
               transform: "translateY(-2px)",
               boxShadow: "0 4px 12px rgba(0,0,0,0.4)"
             }
           }}
         >
           <TextField
             fullWidth
             placeholder="Search by tags (e.g., DeFi, NFT, Exchange)"
             variant="standard"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             InputProps={{
               startAdornment: (
                 <InputAdornment position="start">
                   <SearchIcon sx={{ color: "#BDBDBD" }} />
                 </InputAdornment>
               ),
               endAdornment: searchQuery && (
                 <InputAdornment position="end">
                   <IconButton
                     edge="end"
                     onClick={handleClearSearch}
                     size="small"
                     sx={{ color: "#BDBDBD" }}
                   >
                     <ClearIcon fontSize="small" />
                   </IconButton>
                 </InputAdornment>
               ),
               disableUnderline: true,
               sx: {
                 color: "#ECECEC",
                 ml: 1,
                 fontSize: '1rem',
                 '& input::placeholder': {
                   color: '#BDBDBD'
                 },
                 '& input': {
                   py: 1.5,
                   px: 0.5
                 }
               }
             }}
           />
         </Paper>
         
          )}

          {searchQuery && (
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Showing results for:
              </Typography>
              <Chip
                label={searchQuery}
                onDelete={handleClearSearch}
                color="primary"
                size="small"
                sx={{ ml: 1 }}
              />
            </Box>
          )}
        </Paper>

        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item}>
                <Card elevation={2} sx={{ borderRadius: 2, height: "100%" }}>
                  <CardContent>
                    <Skeleton variant="text" width="60%" height={40} />
                    <Skeleton variant="text" width="90%" height={30} />
                    <Skeleton variant="text" width="70%" height={30} />
                    <Skeleton variant="text" width="80%" height={30} />
                    <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                      <Skeleton variant="rectangular" width={60} height={32} />
                      <Skeleton variant="rectangular" width={60} height={32} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <>
            {filteredContracts.length > 0 ? (
              <Grid container spacing={3}>
                {filteredContracts.map(({ tokenId, creator, tags, usageFee, tokenURI }) => (
                  <Grid item xs={12} sm={6} md={4} key={tokenId}>
                    <Card
                      elevation={4}
                      sx={{
                        p: 2,
                        background: "linear-gradient(145deg, #1E1E1E, #2C2C2C)",
                        color: "#ECECEC",
                        borderRadius: 3,
                        boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 5px 15px rgba(0,0,0,0.4)"
                        }
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <Avatar
                            sx={{
                              mr: 1,
                              backgroundColor: "rgba(255,255,255,0.1)",
                              color: "#fff"
                            }}
                          >
                            <CodeIcon />
                          </Avatar>
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            Contract #{tokenId}
                          </Typography>
                        </Box>

                        <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.12)" }} />

                        <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                          <PersonIcon sx={{ mr: 1, color: "#BDBDBD" }} />
                          <Typography variant="body2" sx={{ color: "#BDBDBD", mr: 0.5 }}>
                            Created by:
                          </Typography>
                          <Tooltip title={creator}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {truncateAddress(creator)}
                            </Typography>
                          </Tooltip>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <WalletIcon sx={{ mr: 1, color: "#BDBDBD" }} />
                          <Typography variant="body2" sx={{ color: "#BDBDBD" }}>
                            Usage Fee:
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              ml: 0.5,
                              fontWeight: "bold",
                              color: "#90CAF9"
                            }}
                          >
                            {formatEther(usageFee.toString())} ETH
                          </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                            <TagIcon sx={{ mr: 1, color: "#BDBDBD" }} />
                            <Typography variant="body2" sx={{ color: "#BDBDBD" }}>
                              Tags:
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {tags.map((tag, index) => (
                              <Chip
                                key={index}
                                label={tag}
                                size="small"
                                variant="outlined"
                                onClick={() => setSearchQuery(tag)}
                                sx={{
                                  cursor: "pointer",
                                  borderColor: "rgba(255,255,255,0.2)",
                                  color: "#ECECEC",
                                  backgroundColor: "rgba(255,255,255,0.06)",
                                  "&:hover": {
                                    backgroundColor: "rgba(255,255,255,0.12)"
                                  }
                                }}
                              />
                            ))}
                          </Box>
                        </Box>

                        <Button
                          variant="contained"
                          fullWidth
                          startIcon={<InsertDriveFileIcon />}
                          onClick={() => tokenURI && handleDownload(tokenURI, tokenId, usageFee)}
                          sx={{
                            mt: 1,
                            textTransform: "none",
                            borderRadius: 1.5,
                            backgroundColor: "#90CAF9",
                            color: "#0D0D0D",
                            fontWeight: "bold",
                            boxShadow: "none",
                            "&:hover": {
                              backgroundColor: "#64B5F6",
                              boxShadow: "0 3px 10px rgba(144,202,249,0.3)"
                            }
                          }}
                        >
                          Purchase & Download
                        </Button>
                      </CardContent>
                    </Card>

                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2, bgcolor: "rgba(0,0,0,0.02)" }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No contracts found matching "{searchQuery}"
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Try using different keywords or browse all available contracts
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleClearSearch}
                  startIcon={<ClearIcon />}
                >
                  Clear Search
                </Button>
              </Paper>
            )}
          </>
        )}
      </Container>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ReadMarketplace;