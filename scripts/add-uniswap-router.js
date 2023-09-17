// scripts/interact.js
const { ethers } = require("hardhat");

async function main() {
    console.log('Getting bot prevention...\n');
    const contractAddress = '0x34090A3f0e8171F1041Bd07045e67A1d24Bda80a';
    const botPrevention = await ethers.getContractAt('BotPrevention', contractAddress);

    console.log(botPrevention)

    console.log("Adding uniswap router");
    const uniswapRouterAddress = '0xE592427A0AEce92De3Edee1F18E0157C05861564'

    const result = await botPrevention.addRouters([uniswapRouterAddress]);

    console.log(result);

    console.log("Finished adding uniswap router");





}   
  
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });