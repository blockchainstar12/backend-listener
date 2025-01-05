// const { ethers } = require("ethers");
// const { CosmWasmClient, SigningCosmWasmClient } = require("@cosmjs/cosmwasm-stargate");
// const { DirectSecp256k1HdWallet } = require("@cosmjs/proto-signing");
// require('dotenv').config();

// const { 
//   LOCAL_CONTRACT_ADDRESS, 
//   COSMWASM_CONTRACT_ADDRESS, 
//   NIBIRU_RPC, 
//   NIBIRU_MNEMONIC 
// } = process.env;

// const ABI = [
//   {
//     "inputs": [],
//     "stateMutability": "nonpayable",
//     "type": "constructor"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "owner",
//         "type": "address"
//       }
//     ],
//     "name": "OwnableInvalidOwner",
//     "type": "error"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "account",
//         "type": "address"
//       }
//     ],
//     "name": "OwnableUnauthorizedAccount",
//     "type": "error"
//   },
//   {
//     "inputs": [],
//     "name": "ReentrancyGuardReentrantCall",
//     "type": "error"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": true,
//         "internalType": "address",
//         "name": "requester",
//         "type": "address"
//       },
//       {
//         "indexed": false,
//         "internalType": "string",
//         "name": "tokenId",
//         "type": "string"
//       }
//     ],
//     "name": "BurnRequest",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": true,
//         "internalType": "address",
//         "name": "requester",
//         "type": "address"
//       },
//       {
//         "indexed": false,
//         "internalType": "string",
//         "name": "tokenId",
//         "type": "string"
//       },
//       {
//         "indexed": false,
//         "internalType": "string",
//         "name": "tokenURI",
//         "type": "string"
//       },
//       {
//         "indexed": false,
//         "internalType": "bytes",
//         "name": "extension",
//         "type": "bytes"
//       }
//     ],
//     "name": "MintRequest",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": true,
//         "internalType": "address",
//         "name": "previousOwner",
//         "type": "address"
//       },
//       {
//         "indexed": true,
//         "internalType": "address",
//         "name": "newOwner",
//         "type": "address"
//       }
//     ],
//     "name": "OwnershipTransferred",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": true,
//         "internalType": "address",
//         "name": "from",
//         "type": "address"
//       },
//       {
//         "indexed": true,
//         "internalType": "address",
//         "name": "to",
//         "type": "address"
//       },
//       {
//         "indexed": false,
//         "internalType": "string",
//         "name": "tokenId",
//         "type": "string"
//       }
//     ],
//     "name": "TransferRequest",
//     "type": "event"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "string",
//         "name": "tokenId",
//         "type": "string"
//       }
//     ],
//     "name": "getTokenOwner",
//     "outputs": [
//       {
//         "internalType": "address",
//         "name": "",
//         "type": "address"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "owner",
//     "outputs": [
//       {
//         "internalType": "address",
//         "name": "",
//         "type": "address"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "renounceOwnership",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "string",
//         "name": "tokenId",
//         "type": "string"
//       }
//     ],
//     "name": "requestBurn",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "string",
//         "name": "tokenId",
//         "type": "string"
//       },
//       {
//         "internalType": "string",
//         "name": "tokenURI",
//         "type": "string"
//       },
//       {
//         "internalType": "bytes",
//         "name": "extension",
//         "type": "bytes"
//       }
//     ],
//     "name": "requestMint",
//     "outputs": [],
//     "stateMutability": "payable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "to",
//         "type": "address"
//       },
//       {
//         "internalType": "string",
//         "name": "tokenId",
//         "type": "string"
//       }
//     ],
//     "name": "requestTransfer",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "newOwner",
//         "type": "address"
//       }
//     ],
//     "name": "transferOwnership",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   }
// ];

// // ETH setup
// const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
// const contract = new ethers.Contract(LOCAL_CONTRACT_ADDRESS, ABI, provider);


// // Nibiru setup
// async function initNibiruClient() {
//   const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
//     NIBIRU_MNEMONIC,
//     { prefix: "nibi" }
//   );
  
//   const [account] = await wallet.getAccounts();
  
//   const client = await SigningCosmWasmClient.connect(NIBIRU_RPC);
//   const signer = await SigningCosmWasmClient.connectWithSigner(
//     NIBIRU_RPC,
//     wallet,
//     { prefix: "nibi" }
//   );

//   return { signer, account };
// }

// async function mintOnNibiru(signer, account, data) {
//   const { requester, tokenId, tokenURI, extension } = data;
  
//   const msg = {
//     mint: {
//       token_id: tokenId,
//       owner: requester,
//       token_uri: tokenURI,
//       extension: ethers.toUtf8String(extension)
//     }
//   };

//   const fee = {
//     amount: [{ amount: "5000", denom: "unibi" }],
//     gas: "200000",
//   };

//   try {
//     const result = await signer.execute(
//       account.address,
//       COSMWASM_CONTRACT_ADDRESS,
//       msg,
//       fee
//     );
//     console.log("Nibiru mint success:", result.transactionHash);
//     return result;
//   } catch (error) {
//     console.error("Nibiru mint failed:", error.message);
//     return null;
//   }
// }

// async function main() {
//   try {
//     console.log("Initializing bridges...");
//     const { signer, account } = await initNibiruClient();
    
//     console.log("Listening for ETH events...");
//     contract.on("MintRequest", async (requester, tokenId, tokenURI, extension) => {
//       console.log("ETH event received:", { requester, tokenId });
      
//       await mintOnNibiru(signer, account, {
//         requester,
//         tokenId,
//         tokenURI,
//         extension
//       });
//     });

//     // Keep alive
//     process.on('SIGINT', () => {
//       console.log('Shutting down...');
//       process.exit();
//     });

//   } catch (error) {
//     console.error("Fatal error:", error.message);
//     process.exit(1);
//   }
// }

// main().catch(console.error);


const { ethers } = require("ethers");
const { SigningCosmWasmClient } = require("@cosmjs/cosmwasm-stargate");
const { DirectSecp256k1HdWallet } = require("@cosmjs/proto-signing");
const { Registry } = require("@cosmjs/proto-signing");
const { defaultRegistryTypes } = require("@cosmjs/stargate");
const { EthAccount } = require('@tharsis/proto');
const { ethermint } = require("@horoscope/evmos-proto");
const { MsgExecuteContract } = require("cosmjs-types/cosmwasm/wasm/v1/tx");
const { accountFromAny } = require("@cosmjs/stargate");
require('dotenv').config();

const { ALCHEMY_API_KEY, SEPOLIA_CONTRACT_ADDRESS, LOCAL_CONTRACT_ADDRESS, COSMWASM_CONTRACT_ADDRESS, NIBIRU_RPC, NIBIRU_MNEMONIC } = process.env;

const localhost_url = "http://127.0.0.1:8545/";
const provider = new ethers.JsonRpcProvider(localhost_url);



async function main() {
  // Create custom registry with ETH account support
  const myRegistry = new Registry();
  
  // Register all default types
  for (const [typeUrl, type] of defaultRegistryTypes) {
    myRegistry.register(typeUrl, type);
  }
  
  // Register additional required types
  myRegistry.register("/ethermint.types.v1.EthAccount", EthAccount);
  myRegistry.register("/eth.types.v1.EthAccount", EthAccount);
  myRegistry.register("/cosmwasm.wasm.v1.MsgExecuteContract", MsgExecuteContract);

  // Create wallet and get account
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(NIBIRU_MNEMONIC, {
    prefix: "nibi",
  });
  const [account] = await wallet.getAccounts();

  // Custom account parser that handles both standard and ETH account types
  function parseAccount(accountData) {
    try {
      if (!accountData) return null;
      
      // Handle ethermint account types
      if (accountData["@type"] === "/ethermint.types.v1.EthAccount" || 
          accountData["@type"] === "/eth.types.v1.EthAccount") {
        return {
          ...accountData,
          pubkey: accountData.base_account?.pub_key || null,
          address: accountData.base_account?.address || accountData.address,
          accountNumber: accountData.base_account?.account_number.toString() || "0",
          sequence: accountData.base_account?.sequence.toString() || "0",
        };
      }
      
      // Return standard account format
      return accountData;
    } catch (error) {
      console.error("Account parsing error:", error);
      return accountData;
    }
  }

  // Initialize client with custom registry and parser
  const cosmwasmClient = await SigningCosmWasmClient.connectWithSigner(
    NIBIRU_RPC,
    wallet,
    {
      registry: myRegistry,
      accountParser: parseAccount,
      gasPrice: { amount: "0.025", denom: "unibi" }
    }
  );

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

const contract = new ethers.Contract(LOCAL_CONTRACT_ADDRESS, ABI, provider);

console.log(`Listening for events on contract ${LOCAL_CONTRACT_ADDRESS}...`);
console.log(`Using Nibiru contract: ${process.env.COSMWASM_CONTRACT_ADDRESS}`);

contract.on("MintRequest", async (requester, tokenId, tokenURI, extension, event) => {
  console.log("MintRequest Event Detected:");
  console.log("Requester:", requester);
  console.log("Token ID:", tokenId);
  console.log("Token URI:", tokenURI);
  console.log("Extension:", ethers.toUtf8String(extension));
  console.log("To:", event.log.address);
  console.log("Transaction Hash:", event.log.transactionHash);

  try {
    const response = await cosmwasmClient.execute(
      account.address,
      COSMWASM_CONTRACT_ADDRESS,
      {
        mint: {
          token_id: tokenId,
          owner: account.address,
          token_uri: tokenURI,
          extension: ethers.toUtf8String(extension)
        }
      },
      "auto"
    );
    console.log("Nibiru mint success:", response.transactionHash);
  } catch (error) {
    console.error("Nibiru mint failed:", error);
    // Log additional error details
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
  }
});
}


main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

// contract.on("TransferRequest", async (from, to, tokenId, event) => {
//   console.log("TransferRequest Event Detected:");
//   console.log("From:", from);
//   console.log("To:", to);
//   console.log("Token ID:", tokenId);
//   console.log("Transaction Hash:", event.log.transactionHash);

//   // Forward to CosmWasm
//   await cosmwasmClient.execute(
//     COSMWASM_CONTRACT_ADDRESS,
//     {
//       transfer_nft: {
//         recipient: to,
//         token_id: tokenId,
//         original_owner: from
//       }
//     },
//     "auto"
//   );
// });

// contract.on("BurnRequest", async (requester, tokenId, event) => {
//   console.log("BurnRequest Event Detected:");
//   console.log("Requester:", requester);
//   console.log("Token ID:", tokenId);
//   console.log("Transaction Hash:", event.log.transactionHash);

//   // Forward to CosmWasm
//   await cosmwasmClient.execute(
//     COSMWASM_CONTRACT_ADDRESS,
//     {
//       burn: {
//         token_id: tokenId,
//         original_owner: requester
//       }
//     },
//     "auto"
//   );
// });



// const { ethers } = require("ethers");
// const { SigningCosmWasmClient } = require("@cosmjs/cosmwasm-stargate");
// const { DirectSecp256k1HdWallet } = require("@cosmjs/proto-signing");
// const { Registry } = require("@cosmjs/proto-signing");
// const { defaultRegistryTypes } = require("@cosmjs/stargate");
// const { MsgExecuteContract } = require("cosmjs-types/cosmwasm/wasm/v1/tx");
// const { BaseAccount } = require("cosmjs-types/cosmos/auth/v1beta1/auth");

// const axios = require('axios');
// require('dotenv').config();

// const { LOCAL_CONTRACT_ADDRESS, COSMWASM_CONTRACT_ADDRESS, NIBIRU_RPC, NIBIRU_MNEMONIC } = process.env;

// const localhost_url = "http://127.0.0.1:8545/";
// const provider = new ethers.JsonRpcProvider(localhost_url);

// async function getAccountInfo(address) {
//   try {
//     const response = await axios.get(
//       `https://lcd.testnet-1.nibiru.fi/cosmos/auth/v1beta1/accounts/${address}`
//     );
    
//     return {
//       address: response.data?.account?.base_account?.address || address,
//       accountNumber: parseInt(response.data?.account?.base_account?.account_number || '0'),
//       sequence: parseInt(response.data?.account?.base_account?.sequence || '0')
//     };
//   } catch (error) {
//     console.warn("Failed to fetch account info:", error.message);
//     return null;
//   }
// }

// async function main() {
//   // Setup registry with Base Account
//   const registry = new Registry([
//     ["/cosmos.auth.v1beta1.BaseAccount", BaseAccount],
//     ["/cosmwasm.wasm.v1.MsgExecuteContract", MsgExecuteContract],
//     ...defaultRegistryTypes
//   ]);

//   const wallet = await DirectSecp256k1HdWallet.fromMnemonic(NIBIRU_MNEMONIC, {
//     prefix: "nibi"
//   });
  
//   const [account] = await wallet.getAccounts();

//   // Track sequence locally
//   let sequence = 0;

//   // Initialize client with base account support
//   const cosmwasmClient = await SigningCosmWasmClient.connectWithSigner(
//     NIBIRU_RPC,
//     wallet,
//     {
//       registry,
//       prefix: "nibi",
//       gasPrice: { amount: "0.025", denom: "unibi" },
//       gasAdjustment: 1.5
//     }
//   );

//   console.log(`Listening for events on contract ${LOCAL_CONTRACT_ADDRESS}...`);
//   console.log(`Using Nibiru contract: ${COSMWASM_CONTRACT_ADDRESS}`);
//   console.log(`Using account address: ${account.address}`);

//   const ABI = [
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "requester",
//           "type": "address"
//         },
//         {
//           "indexed": false,
//           "internalType": "string",
//           "name": "tokenId",
//           "type": "string"
//         },
//         {
//           "indexed": false,
//           "internalType": "string",
//           "name": "tokenURI",
//           "type": "string"
//         },
//         {
//           "indexed": false,
//           "internalType": "bytes",
//           "name": "extension",
//           "type": "bytes"
//         }
//       ],
//       "name": "MintRequest",
//       "type": "event"
//     }
//   ];

//   const contract = new ethers.Contract(LOCAL_CONTRACT_ADDRESS, ABI, provider);

//   contract.on("MintRequest", async (requester, tokenId, tokenURI, extension, event) => {
//     console.log("MintRequest Event Detected:");
//     console.log("Requester:", requester);
//     console.log("Token ID:", tokenId);
//     console.log("Token URI:", tokenURI);
//     console.log("Extension:", ethers.toUtf8String(extension));
//     console.log("To:", event.log.address);
//     console.log("Transaction Hash:", event.log.transactionHash);

//     try {
//       const msg = {
//         mint: {
//           token_id: tokenId,
//           owner: account.address,
//           token_uri: tokenURI,
//           extension: ethers.toUtf8String(extension)
//         }
//       };

//       const fee = {
//         amount: [{ amount: "5000", denom: "unibi" }],
//         gas: "1000000"
//       };

//       const response = await cosmwasmClient.execute(
//         account.address,
//         COSMWASM_CONTRACT_ADDRESS,
//         msg,
//         fee
//       );

//       console.log("Nibiru mint success:", response.transactionHash);
//       sequence++;
//     } catch (error) {
//       console.error("Nibiru mint failed:", error);
//     }
//   });
// }

// // Error handlers
// process.on('SIGINT', () => {
//   console.log('Received SIGINT. Cleaning up...');
//   process.exit(0);
// });

// process.on('unhandledRejection', (error) => {
//   console.error('Unhandled promise rejection:', error);
// });

// main().catch((error) => {
//   console.error("Fatal error:", error);
//   process.exit(1);
// });




// const { ethers } = require("ethers");
// const { SigningCosmWasmClient } = require("@cosmjs/cosmwasm-stargate");
// const { DirectSecp256k1HdWallet, Registry } = require("@cosmjs/proto-signing");
// const { defaultRegistryTypes } = require("@cosmjs/stargate");
// const { MsgExecuteContract } = require("cosmjs-types/cosmwasm/wasm/v1/tx");
// require('dotenv').config();

// const { LOCAL_CONTRACT_ADDRESS, COSMWASM_CONTRACT_ADDRESS, NIBIRU_RPC, NIBIRU_MNEMONIC } = process.env;
// const localhost_url = "http://127.0.0.1:8545/";
// const provider = new ethers.JsonRpcProvider(localhost_url);

// // Verify mnemonic is loaded
// if (!NIBIRU_MNEMONIC) {
//   throw new Error("NIBIRU_MNEMONIC not found in environment variables");
// }

// async function main() {
//   // Initialize wallet with mnemonic
//   const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
//     NIBIRU_MNEMONIC.trim(),
//     {
//       prefix: "nibi",
//       hdPath: "m/44'/118'/0'/0/0"
//     }
//   );

//   const [account] = await wallet.getAccounts();
//   console.log("Account:", account);

//   // Initialize registry with required types
//   const registry = new Registry([
//     ["/cosmwasm.wasm.v1.MsgExecuteContract", MsgExecuteContract],
//     ...defaultRegistryTypes
//   ]);

//   // Initialize client
//   const cosmwasmClient = await SigningCosmWasmClient.connectWithSigner(
//     NIBIRU_RPC,
//     wallet,
//     {
//       registry,
//       prefix: "nibi",
//       gasPrice: { amount: "0.025", denom: "unibi" }
//     }
//   );

//     const ABI = [
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "requester",
//           "type": "address"
//         },
//         {
//           "indexed": false,
//           "internalType": "string",
//           "name": "tokenId",
//           "type": "string"
//         },
//         {
//           "indexed": false,
//           "internalType": "string",
//           "name": "tokenURI",
//           "type": "string"
//         },
//         {
//           "indexed": false,
//           "internalType": "bytes",
//           "name": "extension",
//           "type": "bytes"
//         }
//       ],
//       "name": "MintRequest",
//       "type": "event"
//     }
//   ];


//   // Setup contract listener
//   const contract = new ethers.Contract(LOCAL_CONTRACT_ADDRESS, ABI, provider);

//   contract.on("MintRequest", async (requester, tokenId, tokenURI, extension, event) => {
//     console.log("MintRequest Event Detected:");
//     console.log("Requester:", requester);
//     console.log("Token ID:", tokenId);
//     console.log("Token URI:", tokenURI);
//     console.log("Extension:", ethers.toUtf8String(extension));
//     console.log("To:", event.log.address);
//     console.log("Transaction Hash:", event.log.transactionHash);
//     try {
//       const response = await cosmwasmClient.execute(
//         account.address,
//         COSMWASM_CONTRACT_ADDRESS,
//         {
//           mint: {
//             token_id: tokenId,
//             owner: account.address,
//             token_uri: tokenURI,
//             extension: ethers.toUtf8String(extension)
//           }
//         },
//         "auto"
//       );
//       console.log("Nibiru mint success:", response.transactionHash);
//     } catch (error) {
//       console.error("Nibiru mint failed:", error);
//     }
//   });
// }

// process.on('SIGINT', () => {
//   console.log('Received SIGINT. Cleaning up...');
//   process.exit(0);
// });

// process.on('unhandledRejection', (error) => {
//   console.error('Unhandled promise rejection:', error);
// });

// main().catch((error) => {
//   console.error("Fatal error:", error);
//   process.exit(1);
// });
