const { ethers } = require("ethers");
const { NibiruTxClient, newSignerFromMnemonic, Testnet, NibiruQuerier, BECH32_PREFIX } = require("@nibiruchain/nibijs");
const { Transaction } = require("ethers");
require('dotenv').config();

const { ALCHEMY_API_KEY, SEPOLIA_CONTRACT_ADDRESS, LOCAL_CONTRACT_ADDRESS } = process.env;

// Use WebSocket provider for better event handling
const localWsUrl = "ws://127.0.0.1:8545/"; // WebSocket URL
const localHttpUrl = "http://127.0.0.1:8545/"; // HTTP URL for fallback
const sepoliaUrl = `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

const ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ReentrancyGuardReentrantCall",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "requester",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "tokenId",
        "type": "string"
      }
    ],
    "name": "BurnRequest",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "requester",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "tokenId",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "chainType",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "ownerAddress",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "tokenURI",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "extension",
        "type": "bytes"
      }
    ],
    "name": "MintRequest",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "tokenId",
        "type": "string"
      }
    ],
    "name": "TransferRequest",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "tokenId",
        "type": "string"
      }
    ],
    "name": "getTokenOwner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "tokenId",
        "type": "string"
      }
    ],
    "name": "requestBurn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "tokenId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "chainType",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "ownerAddress",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "tokenURI",
        "type": "string"
      },
      {
        "internalType": "bytes",
        "name": "extension",
        "type": "bytes"
      }
    ],
    "name": "requestMint",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "tokenId",
        "type": "string"
      }
    ],
    "name": "requestTransfer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

// Define testnet chain
const CHAIN = Testnet(2); // nibiru-testnet-1

class BridgeService {
  constructor() {
    try {
      // Try WebSocket provider first (better for events)
      this.provider = new ethers.WebSocketProvider(localWsUrl);
      console.log("Using WebSocket provider for events");
    } catch (error) {
      console.log("WebSocket provider failed, falling back to HTTP provider:", error.message);
      this.provider = new ethers.JsonRpcProvider(localHttpUrl);
    }
    
    this.BRIDGE_WALLET = "nibi18ekzv8cgm3htj4nkqajnc2e6npnazemcqg8usn";
    this.isRunning = false;
  }
  
  // Helper method to initialize clients
  async initializeClients() {
    console.log("Initializing signer with mnemonic...");
    const signer = await newSignerFromMnemonic(process.env.NIBIRU_MNEMONIC);
    
    console.log("Connecting to Nibiru network...");
    console.log("RPC Endpoint:", CHAIN.endptTm);
    const querier = await NibiruQuerier.connect(CHAIN.endptTm);
    
    console.log("Setting up transaction client...");
    const txClient = await NibiruTxClient.connectWithSigner(
      CHAIN.endptTm, 
      signer
    );

    console.log("Getting signer account...");
    const [{ address }] = await signer.getAccounts();
    console.log("Signer address:", address);

    if (address !== this.BRIDGE_WALLET) {
      throw new Error(`Unauthorized: Only bridge wallet can execute. Expected: ${this.BRIDGE_WALLET}, Got: ${address}`);
    }

    return { signer, querier, txClient, address };
  }

  // Helper to get token information
  async getTokenInfo(querier, tokenId) {
    try {
      const tokenInfo = await querier.nibiruExtensions.wasm.queryContractSmart(
        process.env.COSMWASM_CONTRACT_ADDRESS,
        { 
          nft_info: { 
            token_id: tokenId 
          } 
        }
      );
      console.log("Token info:", tokenInfo);
      
      try {
        const ownerInfo = await querier.nibiruExtensions.wasm.queryContractSmart(
          process.env.COSMWASM_CONTRACT_ADDRESS,
          { 
            owner_of: { 
              token_id: tokenId 
            } 
          }
        );
        console.log("Current token owner:", ownerInfo);
        return { tokenInfo, ownerInfo };
      } catch (e) {
        console.log("Could not query owner info:", e.message);
        return { tokenInfo, ownerInfo: null };
      }
    } catch (e) {
      console.log("Could not query token info:", e.message);
      return { tokenInfo: null, ownerInfo: null };
    }
  }

  // Try to execute a transaction with multiple message formats
  async tryExecuteWithFormats(txClient, address, formats) {
    let lastError = null;
    
    for (const format of formats) {
      try {
        console.log(`Trying ${format.name} message format:`, JSON.stringify(format.msg, null, 2));
        
        const txResp = await txClient.wasmClient.execute(
          address,
          process.env.COSMWASM_CONTRACT_ADDRESS,
          format.msg,
          "auto"
        );
        
        console.log(`${format.name} succeeded:`, txResp);
        return txResp;
      } catch (error) {
        console.log(`${format.name} failed:`, error.message);
        lastError = error;
      }
    }
    
    throw new Error(`All attempts failed. Last error: ${lastError?.message}`);
  }

  async executeMint(tokenId, chainType, ownerAddress, tokenURI, extension, requester) {
    try {
      console.log("\n=== Starting Request Mint Execution ===");
      console.log("Token ID:", tokenId);
      console.log("Chain Type:", chainType);
      console.log("Owner Address:", ownerAddress);
      console.log("Token URI:", tokenURI || "(none)");
      console.log("Requester:", requester);
  
      // Initialize clients
      const { querier, txClient, address } = await this.initializeClients();
  
      // Parse metadata
      let metadata = {};
      if (extension && extension.length > 0) {
        try {
          const decodedHex = ethers.toUtf8String(extension.slice(64));
          const jsonStart = decodedHex.indexOf('{');
          const jsonEnd = decodedHex.lastIndexOf('}') + 1;
          
          if (jsonStart >= 0 && jsonEnd > jsonStart) {
            const jsonStr = decodedHex.substring(jsonStart, jsonEnd);
            const parsedData = JSON.parse(jsonStr);
            metadata = parsedData;
            console.log("Successfully parsed extension metadata:", metadata);
          }
        } catch (e) {
          console.log("Could not parse extension metadata:", e.message);
        }
      }
  
      // Try different mint message formats
      const mintFormats = [
        {
          name: "standard_mint",
          msg: {
            mint: {
              token_id: tokenId,
              owner: {
                chain_type: chainType,
                address: ownerAddress
              },
              token_uri: tokenURI || "",
              extension: metadata
            }
          }
        },
        {
          name: "simple_mint",
          msg: {
            mint: {
              token_id: tokenId,
              owner: ownerAddress,
              token_uri: tokenURI || ""
            }
          }
        }
      ];
  
      return await this.tryExecuteWithFormats(txClient, address, mintFormats);
    } catch (error) {
      console.error("Mint failed:", error);
      throw error;
    }
  }

  async executeBurn(tokenId, requester) {
    try {
      console.log("\n=== Starting Burn Execution ===");
      console.log("Token ID:", tokenId);
      console.log("Requester:", requester);

      // Initialize clients
      const { querier, txClient, address } = await this.initializeClients();
      
      // Get token information
      await this.getTokenInfo(querier, tokenId);

      // Define burn formats to try
      const burnFormats = [
        {
          name: "standard_burn",
          msg: {
            burn: {
              token_id: tokenId
            }
          }
        },
        {
          name: "bridge_burn",
          msg: {
            bridge_burn: {
              token_id: tokenId,
              requester: requester
            }
          }
        },
        {
          name: "ethereum_burn",
          msg: {
            burn: {
              token_id: tokenId,
              requester: {
                chain_type: "ethereum",
                address: requester
              }
            }
          }
        }
      ];

      return await this.tryExecuteWithFormats(txClient, address, burnFormats);
    } catch (error) {
      console.error("Burn failed:", error);
      throw error;
    }
  }

  async executeTransfer(to, tokenId) {
    try {
      console.log("\n=== Starting Transfer Execution ===");
      console.log("To:", to);
      console.log("Token ID:", tokenId);
  
      // Initialize clients
      const { querier, txClient, address } = await this.initializeClients();
      
      // Get token information to check current ownership
      const tokenInfo = await this.getTokenInfo(querier, tokenId);
      if (!tokenInfo.ownerInfo) {
        throw new Error(`Token ${tokenId} not found or doesn't have an owner`);
      }
      
      const currentOwner = tokenInfo.ownerInfo.owner;
      console.log(`Current token owner: ${currentOwner}`);
      
      // Is destination an Ethereum address?
      const isEthereumAddress = to.startsWith('0x');
      
      // Based on successful execution patterns, prioritize the extension message format
      const transferFormats = [
        // The successful format for Ethereum transfers
        {
          name: "transfer_nft_to_ethereum",
          msg: {
            extension: {
              msg: {
                transfer_to_chain: {
                  chain_type: isEthereumAddress ? "ethereum" : "nibiru",
                  recipient: to,
                  token_id: tokenId
                }
              }
            }
          }
        },
        // Keep update_ownership as a fallback
        {
          name: "update_ownership_direct",
          msg: {
            update_ownership: {
              token_id: tokenId,
              owner: isEthereumAddress ? 
                { chain_type: "ethereum", address: to } : 
                to
            }
          }
        }
      ];
  
      // For non-Ethereum addresses, still try standard transfer first
      if (!isEthereumAddress) {
        transferFormats.unshift({
          name: "standard_transfer_nft",
          msg: {
            transfer_nft: {
              recipient: to,
              token_id: tokenId
            }
          }
        });
      }
  
      return await this.tryExecuteWithFormats(txClient, address, transferFormats);
    } catch (error) {
      console.error("Transfer failed:", error);
      throw error;
    }
  }

  // Add this method to your BridgeService class
  async transferNFT(from, to, tokenId) {
    try {
      console.log("\n=== Executing Direct Transfer ===");
      console.log("From:", from);
      console.log("To:", to);
      console.log("Token ID:", tokenId);
      
      // Initialize clients
      const { querier, txClient, address } = await this.initializeClients();
      
      // Get current token information and check ownership
      const tokenInfo = await this.getTokenInfo(querier, tokenId);
      if (!tokenInfo.ownerInfo) {
        throw new Error(`Token ${tokenId} not found or doesn't have an owner`);
      }
      
      console.log(`Current token owner: ${tokenInfo.ownerInfo.owner}`);
      
      // Check if destination is an Ethereum address or Nibiru address
      const isEthereumAddress = to.startsWith('0x');
      const isNibiruAddress = to.startsWith('nibi');
      
      if (!isEthereumAddress && !isNibiruAddress) {
        throw new Error(`Invalid recipient address: ${to}. Must start with 0x (Ethereum) or nibi (Nibiru)`);
      }
      
      // Based on the error messages, the contract only supports certain message formats
      // Try with formats specifically listed in the error message
      const transferFormats = [
        // From error message: expected one of `transfer_nft`, ... etc.
        {
          name: "standard_transfer_nft",
          msg: {
            transfer_nft: {
              recipient: to,
              token_id: tokenId
            }
          }
        },
        // Try with send_nft pattern - commonly used in CosmWasm
        {
          name: "send_nft",
          msg: {
            send_nft: {
              contract: to,
              token_id: tokenId,
              msg: Buffer.from(JSON.stringify({
                bridge_to: {
                  chain_type: isEthereumAddress ? "ethereum" : "nibiru",
                  address: to
                }
              })).toString('base64')
            }
          }
        },
        // Try with extension message if that's supported
        {
          name: "extension_transfer",
          msg: {
            extension: {
              msg: {
                transfer: {
                  recipient: to,
                  token_id: tokenId
                }
              }
            }
          }
        },
        // Try with approve pattern first, then transfer
        {
          name: "approve_first",
          msg: {
            approve: {
              spender: address, // approve ourselves
              token_id: tokenId,
              expires: { never: {} } // or some other expiry format
            }
          }
        }
      ];
      
      // If approve first was successful, follow with transfer
      let txResult;
      try {
        txResult = await this.tryExecuteWithFormats(txClient, address, transferFormats);
        
        // If we used the approve_first method, now we need to do the actual transfer
        if (txResult && txResult.msgName === "approve_first") {
          console.log("Approval successful, now executing transfer...");
          const transferAfterApproveFormats = [
            {
              name: "transfer_after_approve",
              msg: {
                transfer_nft: {
                  recipient: to,
                  token_id: tokenId
                }
              }
            }
          ];
          txResult = await this.tryExecuteWithFormats(txClient, address, transferAfterApproveFormats);
        }
      } catch (error) {
        console.error("All transfer attempts failed. Trying alternative approach...");
        
        // If direct transfer fails, let's try the update_ownership method mentioned in the error
        const ownershipFormats = [
          {
            name: "update_ownership",
            msg: {
              update_ownership: {
                token_id: tokenId,
                owner: isEthereumAddress ? 
                  { chain_type: "ethereum", address: to } : 
                  to
              }
            }
          }
        ];
        
        txResult = await this.tryExecuteWithFormats(txClient, address, ownershipFormats);
      }
      
      console.log("\n✅ Transfer action completed");
      console.log("Transaction info:", txResult);
      
      // Verify the new owner if possible
      try {
        console.log("\nVerifying ownership after transfer attempt...");
        const newOwnerInfo = await this.getTokenInfo(querier, tokenId);
        console.log("Current token status:", newOwnerInfo);
      } catch (verifyError) {
        console.log("Could not verify new ownership:", verifyError.message);
      }
      
      return txResult;
    } catch (error) {
      console.error("\n❌ Transfer failed:", error.message);
      throw error;
    }
  }

  // Add this method to make direct transfers available via command line
  async directTransfer(from, to, tokenId) {
    try {
      console.log("\n=== Starting Direct Transfer Request ===");
      
      // Validate addresses
      if (!from) {
        throw new Error("Source address (from) is required");
      }
      
      if (!to) {
        throw new Error("Destination address (to) is required");
      }
      
      if (!tokenId) {
        throw new Error("Token ID is required");
      }
      
      // Execute the transfer
      return await this.transferNFT(from, to, tokenId);
      
    } catch (error) {
      console.error("\n❌ Direct transfer request failed:", error.message);
      throw error;
    }
  }

  async setupEventListener(contract, eventName, handler) {
    try {
      contract.on(eventName, handler);
      console.log(`✅ ${eventName} event listener ready`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to setup ${eventName} event listener:`, error.message);
      return false;
    }
  }

  async start() {
    try {
      // Check if already running
      if (this.isRunning) {
        console.log("Bridge service is already running");
        return;
      }
      
      console.log("Starting bridge service...");
      console.log(`Contract address: ${process.env.LOCAL_CONTRACT_ADDRESS}`);
      
      let contract;
      
      try {
        contract = new ethers.Contract(
          process.env.LOCAL_CONTRACT_ADDRESS,
          ABI,
          this.provider
        );
      } catch (err) {
        console.error("Failed to create contract instance:", err.message);
        throw err;
      }
      
      console.log("Contract instance created successfully");
      
      // Verify contract connectivity
      try {
        const ownerAddress = await contract.owner();
        console.log(`Contract owner: ${ownerAddress}`);
      } catch (err) {
        console.error(`❌ Could not query contract owner: ${err.message}`);
        console.error("Check if your local Ethereum node is running and the contract address is correct");
        
        // Try to fallback to HTTP provider if using WebSocket
        if (this.provider instanceof ethers.WebSocketProvider) {
          console.log("Attempting to fallback to HTTP provider...");
          this.provider = new ethers.JsonRpcProvider(localHttpUrl);
          contract = new ethers.Contract(
            process.env.LOCAL_CONTRACT_ADDRESS,
            ABI,
            this.provider
          );
          
          try {
            const ownerAddress = await contract.owner();
            console.log(`Contract owner (via HTTP fallback): ${ownerAddress}`);
          } catch (fallbackErr) {
            console.error("HTTP fallback also failed:", fallbackErr.message);
            throw fallbackErr;
          }
        } else {
          throw err;
        }
      }
      
      console.log("\nSetting up event listeners...");
      
      // Use a more resilient approach for event listeners
      const mintSuccess = await this.setupEventListener(
        contract, 
        "MintRequest", 
        async (requester, tokenId, chainType, ownerAddress, tokenURI, extension, event) => {
          try {
            console.log("\n📣 MintRequest Event Detected:", {
              blockNumber: event.log.blockNumber,
              transactionHash: event.log.transactionHash,
              requester,
              tokenId,
              chainType,
              ownerAddress,
              tokenURI: tokenURI || "(none)"
            });
            
            await this.executeMint(tokenId, chainType, ownerAddress, tokenURI, extension, requester);
          } catch (error) {
            console.error("Failed to process mint request:", error);
          }
        }
      );
      
      const burnSuccess = await this.setupEventListener(
        contract,
        "BurnRequest",
        async (requester, tokenId, event) => {
          try {
            console.log("\n📣 BurnRequest Event Detected:", {
              blockNumber: event.log.blockNumber,
              transactionHash: event.log.transactionHash,
              requester,
              tokenId
            });
            await this.executeBurn(tokenId, requester);
          } catch (error) {
            console.error("Failed to process burn request:", error);
          }
        }
      );
      
      const transferSuccess = await this.setupEventListener(
        contract,
        "TransferRequest",
        async (from, to, tokenId, event) => {
          try {
            console.log("\n📣 TransferRequest Event Detected:", {
              blockNumber: event.log.blockNumber,
              transactionHash: event.log.transactionHash,
              from,
              to,
              tokenId
            });
            await this.executeTransfer(to, tokenId);
          } catch (error) {
            console.error("Failed to process transfer request:", error);
          }
        }
      );
      
      if (!mintSuccess || !burnSuccess || !transferSuccess) {
        console.warn("⚠️ Some event listeners failed to initialize");
      }
      
      // Set up error handlers
      this.provider.on("error", (error) => {
        console.error("\n❌ Provider error:", error.message);
        console.log("Attempting to reconnect...");
        this.reconnect();
      });
      
      console.log("\n🚀 Bridge service is running and waiting for events");
      console.log("Press Ctrl+C to stop the service\n");
      
      // Heartbeat
      let heartbeatCount = 0;
      this.heartbeat = setInterval(() => {
        heartbeatCount++;
        if (heartbeatCount % 12 === 0) { // Every minute (assuming 5-second interval)
          console.log(`[${new Date().toLocaleTimeString()}] Bridge service is still listening...`);
        }
      }, 5000);
      
      this.isRunning = true;
      return contract;
      
    } catch (error) {
      console.error("Failed to start bridge service:", error);
      throw error;
    }
  }
  
  async reconnect() {
    try {
      console.log("Attempting to reconnect to provider...");
      
      // Clear heartbeat
      if (this.heartbeat) {
        clearInterval(this.heartbeat);
      }
      
      // Set isRunning to false
      this.isRunning = false;
      
      // Try to close the existing provider
      try {
        if (this.provider instanceof ethers.WebSocketProvider) {
          await this.provider.destroy();
        }
      } catch (err) {
        console.log("Error closing provider:", err.message);
      }
      
      // Create a new provider
      try {
        this.provider = new ethers.WebSocketProvider(localWsUrl);
      } catch (err) {
        console.log("WebSocket reconnection failed, trying HTTP:", err.message);
        this.provider = new ethers.JsonRpcProvider(localHttpUrl);
      }
      
      // Restart the service
      console.log("Restarting bridge service...");
      await this.start();
      console.log("Bridge service restarted successfully");
    } catch (error) {
      console.error("Reconnection failed:", error.message);
      console.log("Will try again in 10 seconds...");
      setTimeout(() => this.reconnect(), 10000);
    }
  }
  
  async stop() {
    console.log("Stopping bridge service...");
    
    if (this.heartbeat) {
      clearInterval(this.heartbeat);
    }
    
    if (this.provider instanceof ethers.WebSocketProvider) {
      try {
        await this.provider.destroy();
        console.log("WebSocket connection closed");
      } catch (err) {
        console.error("Error closing WebSocket connection:", err.message);
      }
    }
    
    this.isRunning = false;
    console.log("Bridge service stopped");
  }
}

async function main() {
  let bridge = null;
  try {
    // Handle process shutdown gracefully
    process.on('SIGINT', async () => {
      console.log("\nShutdown signal received...");
      if (bridge) {
        await bridge.stop();
      }
      process.exit(0);
    });
    
    // Debug connection
    console.log("\n=== Checking Connection ===");
    const provider = new ethers.JsonRpcProvider(localHttpUrl);
    
    try {
      const blockNumber = await provider.getBlockNumber();
      console.log(`Connected to Ethereum node. Current block: ${blockNumber}`);
    } catch (err) {
      console.error(`❌ Failed to connect to Ethereum node: ${err.message}`);
      console.error("Make sure your local node is running at:", localHttpUrl);
      process.exit(1);
    }
    
    // Check for required environment variables
    const requiredEnvVars = [
      'LOCAL_CONTRACT_ADDRESS',
      'COSMWASM_CONTRACT_ADDRESS',
      'NIBIRU_MNEMONIC'
    ];
    
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error("\n❌ Missing required environment variables:");
      missingVars.forEach(varName => {
        console.error(`  - ${varName}`);
      });
      console.error("\nPlease set these variables in your .env file and try again.");
      process.exit(1);
    }
    
    console.log("\n✅ All required environment variables are set");
    
    // Start the bridge service
    console.log("\n=== Starting Bridge Service ===");
    bridge = new BridgeService();
    await bridge.start();
    
    // Keep process alive
    process.stdin.resume();
    
  } catch (error) {
    console.error("\n❌ Fatal error:", error);
    if (bridge) {
      try {
        await bridge.stop();
      } catch (err) {
        console.error("Error during shutdown:", err);
      }
    }
    process.exit(1);
  }
}

main().catch(error => {
  console.error("Unhandled error:", error);
  process.exit(1);
});