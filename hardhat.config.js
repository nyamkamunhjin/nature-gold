const dotenv = require('dotenv')

require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades")

dotenv.config()

// Go to https://www.alchemyapi.io, sign up, create
// a new App in its dashboard, and replace "KEY" with its key
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Beware: NEVER put real Ether into testing accounts
const PRIVATE_KEY = process.env.META_MASK_PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      chainId: 137,
      timeout: 2_147_483_647,
      accounts: [PRIVATE_KEY],
      gasPrice: 100000000000
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [PRIVATE_KEY],
      gas: 2100000,
      gasPrice: 30000000000
    }
  },
  abiExporter: {
    path: "data/abi",
    runOnCompile: true,
    clear: true,
    flat: true,
    only: [],
    spacing: 4,
  },
  allowUnlimitedContractSize: true,
  etherscan: {
    apiKey: {
      polygon: process.env.POLYGON_SCAN_API_KEY,
      polygonMumbai: process.env.POLYGON_SCAN_API_KEY
    }
  },
  mocha: {
    timeout: 20000
  }
};
