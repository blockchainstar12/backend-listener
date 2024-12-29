const { ethers } = require("ethers");
require('dotenv').config();

const { ALCHEMY_API_KEY, SEPOLIA_CONTRACT_ADDRESS, LOCAL_CONTRACT_ADDRESS } = process.env;

const sepoliaUrl = `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

const localhost_url = "http://127.0.0.1:8545/"; // Your Localhost URL
const provider = new ethers.JsonRpcProvider(localhost_url); // Change to localhost_url for local testing

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

console.log(`Listening for events on contract ${LOCAL_CONTRACT_ADDRESS}...`); //  use LOCAL_CONTRACT_ADDRESS for local testing (replace SEPOLIA_CONTRACT_ADDRESS => LOCAL_CONTRACT_ADDRESS EVERYWHERE)

contract.on("MintRequest", (requester, tokenId, tokenURI, extension, event) => {
    console.log("MintRequest Event Detected:");
    console.log("Requester:", requester);
    console.log("Token ID:", tokenId);
    console.log("Token URI:", tokenURI);
    console.log("Extension:", ethers.toUtf8String(extension));
    console.log("To:", event.log.address);
    console.log("Transaction Hash:", event.log.transactionHash);
  
        // Forward to CosmWasm
      //   await cosmwasmClient.execute(
      //     COSMWASM_CONTRACT_ADDRESS,
      //     "mint",
      //     {
      //         token_id: tokenId,
      //         owner: requester,
      //         token_uri: tokenURI,
      //         extension: extension
      //     }
      // );
})

contract.on("TransferRequest", async (from, to, tokenId, event) => {
  console.log("TransferRequest Event Detected:");
  console.log("From:", from);
  console.log("To:", to);
  console.log("Token ID:", tokenId);
  console.log("Transaction Hash:", event.log.transactionHash);

    //   // Forward to CosmWasm
    //   await cosmwasmClient.execute(
    //     COSMWASM_CONTRACT_ADDRESS,
    //     "transfer_nft",
    //     {
    //         recipient: to,
    //         token_id: tokenId,
    //         original_owner: from
    //     }
    // );
});

contract.on("BurnRequest", async (requester, tokenId, event) => {
  console.log("BurnRequest Event Detected:");
  console.log("Requester:", requester);
  console.log("Token ID:", tokenId);
  console.log("Transaction Hash:", event.log.transactionHash);


    //   // Forward to CosmWasm
    //   await cosmwasmClient.execute(
    //     COSMWASM_CONTRACT_ADDRESS,
    //     "burn",
    //     {
    //         token_id: tokenId,
    //         original_owner: requester
    //     }
    // );
});