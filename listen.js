const { ethers } = require("ethers");

const localhost_url = "http://127.0.0.1:8545/"; // Your Localhost URL
const provider = new ethers.JsonRpcProvider(localhost_url)

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

const Contract_Address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Your Deployed Contract Address

const contract = new ethers.Contract(Contract_Address, ABI, provider);

console.log(`Listening for events on contract ${Contract_Address}...`);

contract.on("MintRequest", (requester, tokenId, tokenURI, extension, event) => {
    console.log("MintRequest Event Detected:");
    console.log("Requester:", requester);
    console.log("Token ID:", tokenId);
    console.log("Token URI:", tokenURI);
    console.log("Extension:", ethers.toUtf8String(extension));
    console.log("Transaction Hash:", event.log.transactionHash);
})