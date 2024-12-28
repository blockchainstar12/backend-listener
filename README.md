# Listen.js Script

This script listens for events emitted by a smart contract deployed on the Ethereum Sepolia testnet. It uses the ethers.js library to interact with the blockchain.

## Prerequisites

- Node.js installed
- npm or yarn installed
- An Alchemy API key
- A deployed smart contract on the Sepolia testnet or a local Ethereum node

## Setup

1. Clone the repository:
    ```sh
    git clone https://github.com/blockchainstar12/backend-listener
    cd backend-listener
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add the following environment variables:
    ```sh
    ALCHEMY_API_KEY=your-alchemy-api-key
    SEPOLIA_CONTRACT_ADDRESS=your-sepolia-contract-address
    LOCAL_CONTRACT_ADDRESS=your-local-contract-address
    ```

4. Update the `listen.js` script to use your contract address and Alchemy API key.

## Running the Script

To run the script, use the following command:
```sh
npm start
```

This will start listening for `MintRequest` events on the specified contract address.

## Smart Contract Repository

For more details on the smart contract, visit the [Smart Contract Repository](https://github.com/blockchainstar12/solidity-proxy).