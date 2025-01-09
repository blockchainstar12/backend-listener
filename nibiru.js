const { ethers } = require("ethers");
const { NibiruTxClient, newSignerFromMnemonic, Testnet, NibiruQuerier } = require("@nibiruchain/nibijs");
const { Transaction } = require("ethers");
require('dotenv').config();

const { ALCHEMY_API_KEY, SEPOLIA_CONTRACT_ADDRESS, LOCAL_CONTRACT_ADDRESS } = process.env;

const localUrl = "http://127.0.0.1:8545/";
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
];

// Define testnet chain
const CHAIN = Testnet(1); // nibiru-testnet-1

class BridgeService {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(sepoliaUrl);
  }

  async executeMint(tokenId, tokenURI, extension) {
    try {
      console.log("\n=== Starting Request Mint Execution ===");

      // Initialize signer and clients
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

      // Check client methods
      console.log("Available txClient methods:", Object.keys(txClient));

      // Prepare mint message
      const mintMsg = {
        mint: {
          token_id: tokenId,
          owner: address,
          token_uri: tokenURI || null,
          extension: {
            name: null,
            description: null,
            image: [],
            attributes: [],
            external_url: tokenURI
          }
        }
      };

      console.log("Mint message:", JSON.stringify(mintMsg));

      // Execute transaction using correct method
      console.log("Executing transaction...");
      const txResp = await txClient.wasmClient.execute(
        address,
        process.env.COSMWASM_CONTRACT_ADDRESS,
        mintMsg,
        "auto"
      );

      console.log("Transaction response:", txResp);
      return txResp;

    } catch (error) {
      console.error("Mint failed:", error);
      throw error;
    }
  }

  async executeBurn(tokenId) {
    try {
      console.log("\n=== Starting Burn Execution ===");
      console.log("Token ID:", tokenId);

      // Initialize signer and clients
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

      // Prepare Burn message
      const burnMsg = {
        burn: {
          token_id: tokenId,
        }
      };
      console.log("Burn message:", burnMsg);

      // Execute burn transaction
      console.log("Executing burn transaction...");
      const txResp = await txClient.sendTokens(
        address,
        process.env.COSMWASM_CONTRACT_ADDRESS,
        [{ amount: "1", denom: "unibi" }],
        5000,
        burnMsg
      );

      console.log("Transaction response:", txResp);
      return txResp;
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

      // Initialize signer and clients
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

      // Prepare Transfer message
      const transferMsg = {
        transfer: {
          recipient: to,
          token_id: tokenId,
        }
      };
      console.log("Transfer message:", transferMsg);

      // Execute transfer transaction
      console.log("Executing transfer transaction...");
      const txResp = await txClient.sendTokens(
        address,
        process.env.COSMWASM_CONTRACT_ADDRESS,
        [{ amount: "1", denom: "unibi" }],
        5000,
        transferMsg
      );

      console.log("Transaction response:", txResp);
      return txResp;
    } catch (error) {
      console.error("Transfer failed:", error);
      throw error;
    }    
}

  async start() {
    const contract = new ethers.Contract(
      process.env.SEPOLIA_CONTRACT_ADDRESS,  // Use LOCAL_CONTRACT_ADDRESS for local testing
      ABI,
      this.provider
    );

    console.log("Starting bridge service...");
    console.log("Listening to Request on Sepolia contract:", process.env.SEPOLIA_CONTRACT_ADDRESS);

    contract.on("MintRequest", async (requester, tokenId, tokenURI, extension, event) => {
      try {
        console.log("MintRequest Event Detected:", {
          blockNumber: event.log.blockNumber,
          transactionHash: event.log.transactionHash, 
          requester,
          tokenId,
          tokenURI,
          extension: ethers.toUtf8String(extension)
        });
        await this.executeMint(tokenId, tokenURI, extension);
      } catch (error) {
        console.error("Failed to process mint request:", error);
      }
    });

    contract.on("BurnRequest", async (requester, tokenId, event) => {
      try {
        console.log("Burn Request Event Detected:", {
          blockNumber: event.log.blockNumber,
          transactionHash: event.log.transactionHash,
          requester,
          tokenId
        });
        await this.executeBurn(tokenId, requester);
      }
      catch (error) {
        console.error("Failed to process burn request:", error);
      }
    });

    contract.on("TransferRequest", async (from, to, tokenId, event) => {
      try {
        console.log("Transfer Request Event Detected:", {
          blockNumber: event.log.blockNumber,
          transactionHash: event.log.transactionHash,
          from,
          to,
          tokenId
        });
        await this.executeTransfer(to, tokenId);
      }
      catch (error) {
        console.error("Failed to process transfer request:", error);
      }
    });
  }
}

async function main() {
  const bridge = new BridgeService();
  await bridge.start();
  process.stdin.resume();
}

main().catch(console.error);