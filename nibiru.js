const { ethers } = require("ethers");
const { NibiruTxClient, newSignerFromMnemonic, Testnet, NibiruQuerier, BECH32_PREFIX } = require("@nibiruchain/nibijs");
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
    this.provider = new ethers.JsonRpcProvider(localUrl);
  }

  async executeMint(tokenId, chainType, ownerAddress, tokenURI, extension, requester) {
    try {
      const BRIDGE_WALLET = "nibi18ekzv8cgm3htj4nkqajnc2e6npnazemcqg8usn";
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
  
      if (address !== BRIDGE_WALLET) {
        throw new Error(`Unauthorized: Only bridge wallet can execute. Expected: ${BRIDGE_WALLET}, Got: ${address}`);
      }
  
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
  
      // Format mint message according to contract expectations
      const mintMsg = {
        mint: {  // Match contract's ExecuteMsg variant name
          token_id: tokenId,
          owner: {
            chain_type: chainType,     // Original chain type
            address: ownerAddress      // Original address on that chain
          },
          token_uri: tokenURI || "",
          extension: metadata
        }
      };
  
      console.log("Mint message:", JSON.stringify(mintMsg, null, 2));
  
      // Execute transaction
      console.log("Executing transaction...");
      const txResp = await txClient.wasmClient.execute(
        address,  // Bridge wallet address is the sender, not the owner
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

  // async executeBurn(tokenId) {
  //   try {
  //     console.log("\n=== Starting Burn Execution ===");
  //     console.log("Token ID:", tokenId);

  //     // Initialize signer and clients
  //     console.log("Initializing signer with mnemonic...");
  //     const signer = await newSignerFromMnemonic(process.env.NIBIRU_MNEMONIC);

  //     console.log("Connecting to Nibiru network...");
  //     console.log("RPC Endpoint:", CHAIN.endptTm);
  //     const querier = await NibiruQuerier.connect(CHAIN.endptTm);

  //     console.log("Setting up transaction client...");
  //     const txClient = await NibiruTxClient.connectWithSigner(
  //       CHAIN.endptTm,
  //       signer
  //     );

  //     console.log("Getting signer account...");
  //     const [{ address }] = await signer.getAccounts();
  //     console.log("Signer address:", address);

  //     // Prepare Burn message
  //     const burnMsg = {
  //       burn: {
  //         token_id: tokenId,
  //       }
  //     };
  //     console.log("Burn message:", JSON.stringify(burnMsg));

  //     // Execute burn transaction
  //     console.log("Executing burn transaction...");
  //     const txResp = await txClient.wasmClient.execute(
  //       address,
  //       process.env.COSMWASM_CONTRACT_ADDRESS,
  //       burnMsg,
  //       "auto"
  //     );

  //     console.log("Transaction response:", txResp);
  //     return txResp;
  //   } catch (error) {
  //     console.error("Burn failed:", error);
  //     throw error;
  //   }
  // }

//   async executeTransfer(to, tokenId) {
//     try {
//       console.log("\n=== Starting Transfer Execution ===");
//       console.log("To:", to);
//       console.log("Token ID:", tokenId);

//       // Initialize signer and clients
//       console.log("Initializing signer with mnemonic...");
//       const signer = await newSignerFromMnemonic(process.env.NIBIRU_MNEMONIC);

//       console.log("Connecting to Nibiru network...");
//       console.log("RPC Endpoint:", CHAIN.endptTm);
//       const querier = await NibiruQuerier.connect(CHAIN.endptTm);

//       console.log("Setting up transaction client...");
//       const txClient = await NibiruTxClient.connectWithSigner(
//         CHAIN.endptTm,
//         signer
//       );

//       console.log("Getting signer account...");
//       const [{ address }] = await signer.getAccounts();
//       console.log("Signer address:", address);

//       // const tokenQuery = {
//       //   all_nft_info: {
//       //     token_id: tokenId.toString(),
//       //     include_expired: false  // Filter out expired approvals
//       //   }
//       // };
//       // console.log("Token query:", JSON.stringify(tokenQuery));

//       // const tokenInfo = await txClient.wasmClient.queryContractSmart(
//       //   process.env.COSMWASM_CONTRACT_ADDRESS,
//       //   tokenQuery
//       // );

//       // console.log("Token info:", tokenInfo);

//       // if (!tokenInfo) {
//       //   throw new Error(`Token ${tokenId} not found`);
//       // }

//       // Prepare Transfer message
//       const transferMsg = {
//         transfer_nft: {
//           recipient: to,
//           token_id: tokenId,
//         }
//       };
//       console.log("Transfer message:", JSON.stringify(transferMsg));

//       // Execute transfer transaction
//       console.log("Executing transfer transaction...");
//       const txResp = await txClient.wasmClient.execute(
//         address,
//         process.env.COSMWASM_CONTRACT_ADDRESS,
//         transferMsg,
//         "auto"
//       );

//       console.log("Transaction response:", txResp);
//       return txResp;
//     } catch (error) {
//       console.error("Transfer failed:", error);
//       throw error;
//     }    
// }

  async start() {
    const contract = new ethers.Contract(
      process.env.LOCAL_CONTRACT_ADDRESS,  // Use LOCAL_CONTRACT_ADDRESS for local testing
      ABI,
      this.provider
    );

    console.log("Starting bridge service...");
    contract.on("MintRequest", async (requester, tokenId, chainType, ownerAddress, tokenURI, extension, event) => {
      try {
        console.log("MintRequest Event Detected:", {
          blockNumber: event.log.blockNumber,
          transactionHash: event.log.transactionHash,
          requester,
          tokenId,
          chainType,
          ownerAddress,
          tokenURI,
          extension: extension && typeof extension === 'object' ? 
            (extension.length > 0 ? ethers.toUtf8String(extension) : null) : 
            null
        });
        
        // Pass ALL parameters in the correct order
        await this.executeMint(tokenId, chainType, ownerAddress, tokenURI, extension, requester);
      } catch (error) {
        console.error("Failed to process mint request:", error);
      }
    });

    // contract.on("BurnRequest", async (requester, tokenId, event) => {
    //   try {
    //     console.log("Burn Request Event Detected:", {
    //       blockNumber: event.log.blockNumber,
    //       transactionHash: event.log.transactionHash,
    //       requester,
    //       tokenId
    //     });
    //     await this.executeBurn(tokenId, requester);
    //   }
    //   catch (error) {
    //     console.error("Failed to process burn request:", error);
    //   }
    // });

    // contract.on("TransferRequest", async (from, to, tokenId, event) => {
    //   try {
    //     console.log("Transfer Request Event Detected:", {
    //       blockNumber: event.log.blockNumber,
    //       transactionHash: event.log.transactionHash,
    //       from,
    //       to,
    //       tokenId
    //     });
    //     await this.executeTransfer(to, tokenId);
    //   }
    //   catch (error) {
    //     console.error("Failed to process transfer request:", error);
    //   }
    // });
  }
}

async function main() {
  const bridge = new BridgeService();
  await bridge.start();
  process.stdin.resume();
}

main().catch(console.error);