const { ethers } = require("ethers");
const { CosmWasmClient, SigningCosmWasmClient } = require("@cosmjs/cosmwasm-stargate");
const { DirectSecp256k1HdWallet } = require("@cosmjs/proto-signing");
require('dotenv').config();

const { 
  LOCAL_CONTRACT_ADDRESS, 
  COSMWASM_CONTRACT_ADDRESS, 
  NIBIRU_RPC, 
  NIBIRU_MNEMONIC 
} = process.env;

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

// ETH setup
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
const contract = new ethers.Contract(LOCAL_CONTRACT_ADDRESS, ABI, provider);


// Nibiru setup
async function initNibiruClient() {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
    NIBIRU_MNEMONIC,
    { prefix: "nibi" }
  );
  
  const [account] = await wallet.getAccounts();
  
  const client = await SigningCosmWasmClient.connect(NIBIRU_RPC);
  const signer = await SigningCosmWasmClient.connectWithSigner(
    NIBIRU_RPC,
    wallet,
    { prefix: "nibi" }
  );

  return { signer, account };
}

async function mintOnNibiru(signer, account, data) {
  const { requester, tokenId, tokenURI, extension } = data;
  
  const msg = {
    mint: {
      token_id: tokenId,
      owner: requester,
      token_uri: tokenURI,
      extension: ethers.toUtf8String(extension)
    }
  };

  const fee = {
    amount: [{ amount: "5000", denom: "unibi" }],
    gas: "200000",
  };

  try {
    const result = await signer.execute(
      account.address,
      COSMWASM_CONTRACT_ADDRESS,
      msg,
      fee
    );
    console.log("Nibiru mint success:", result.transactionHash);
    return result;
  } catch (error) {
    console.error("Nibiru mint failed:", error.message);
    return null;
  }
}

async function main() {
  try {
    console.log("Initializing bridges...");
    const { signer, account } = await initNibiruClient();
    
    console.log("Listening for ETH events...");
    contract.on("MintRequest", async (requester, tokenId, tokenURI, extension) => {
      console.log("ETH event received:", { requester, tokenId });
      
      await mintOnNibiru(signer, account, {
        requester,
        tokenId,
        tokenURI,
        extension
      });
    });

    // Keep alive
    process.on('SIGINT', () => {
      console.log('Shutting down...');
      process.exit();
    });

  } catch (error) {
    console.error("Fatal error:", error.message);
    process.exit(1);
  }
}

main().catch(console.error);