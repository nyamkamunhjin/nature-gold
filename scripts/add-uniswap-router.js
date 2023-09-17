// scripts/interact.js
const { ethers } = require("hardhat");

async function main() {
    console.log('Getting bot prevention...\n');
    const contractAddress = '0x34090A3f0e8171F1041Bd07045e67A1d24Bda80a';
    const botPrevention = await ethers.getContractAt('BotPrevention', contractAddress);

    console.log(botPrevention)

    console.log("Adding uniswap router");
    
    const uniswapRouterAddress = [
        '0xE592427A0AEce92De3Edee1F18E0157C05861564',
        '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
        '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD'
    ]

    const result = await botPrevention.addRouters(uniswapRouterAddress);

    console.log(result);

    console.log("Finished adding uniswap router");





}   
  
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });