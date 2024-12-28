const { ethers } = require("ethers");
require('dotenv').config();

const { ALCHEMY_API_KEY, SEPOLIA_CONTRACT_ADDRESS, LOCAL_CONTRACT_ADDRESS } = process.env;

const sepoliaUrl = `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

const localhost_url = "http://127.0.0.1:8545/"; // Your Localhost URL
const provider = new ethers.JsonRpcProvider(sepoliaUrl); // Change to localhost_url for local testing

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

const contract = new ethers.Contract(SEPOLIA_CONTRACT_ADDRESS, ABI, provider);

console.log(`Listening for events on contract ${SEPOLIA_CONTRACT_ADDRESS}...`); //  use LOCAL_CONTRACT_ADDRESS for local testing (replace SEPOLIA_CONTRACT_ADDRESS => LOCAL_CONTRACT_ADDRESS EVERYWHERE)

contract.on("MintRequest", (requester, tokenId, tokenURI, extension, event) => {
    console.log("MintRequest Event Detected:");
    console.log("Requester:", requester);
    console.log("Token ID:", tokenId);
    console.log("Token URI:", tokenURI);
    console.log("Extension:", ethers.toUtf8String(extension));
    console.log("Transaction Hash:", event.log.transactionHash);
})