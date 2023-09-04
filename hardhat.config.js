const dotenv = require('dotenv')

require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades")
require("@nomicfoundation/hardhat-chai-matchers")

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
        runs: 200,
      },
    },
  },
  networks: {
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [PRIVATE_KEY]
    }
  },
  allowUnlimitedContractSize: true,
  etherscan: {
    apiKey: {
      polygon: process.env.POLYGON_SCAN_API_KEY
    }
  }
};
