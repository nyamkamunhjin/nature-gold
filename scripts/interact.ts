import { ethers } from "hardhat";

async function main() {
    console.log('Getting the nature gold token contract...\n');
    const contractAddress = '0x18aCcAc3A58D40861689953fC6BdcF0e36C9CA6c';
    const natureGold = await ethers.getContractAt('NatureGold', contractAddress);

    // List of all ERC20 public functions called via Hardhat

    // name()
    console.log('Querying token name...');
    const name = await natureGold.name();
    console.log(`Token Name: ${name}\n`);

    // symbol()
    console.log('Querying token symbol...');
    const symbol = await natureGold.symbol();
    console.log(`Token Symbol: ${symbol}\n`);

    // decimals()
    console.log('Querying decimals...');
    const decimals = await natureGold.decimals();
    console.log(`Token Decimals: ${decimals}\n`);

    // totalSupply()
    console.log('Querying token supply...');
    const totalSupply = await natureGold.totalSupply();
    console.log(`Total Supply including all decimals: ${totalSupply}`);
    console.log(`Total supply including all decimals comma separated: ${totalSupply}`);
    console.log(`Total Supply in NG: ${ethers.formatUnits(totalSupply, decimals)}\n`);

    // balanceOf(address account)
    console.log('Getting the balance of contract owner...');
    const signers = await ethers.getSigners();
    const ownerAddress = signers[0].address;
    let ownerBalance = await natureGold.balanceOf(ownerAddress);
    console.log(`Contract owner at ${ownerAddress} has a ${symbol} balance of ${ethers.formatUnits(ownerBalance, decimals)}\n`);

    // transfer(to, amount)
    console.log('Initiating a transfer...');
    const recipientAddress = '0x9d2420c125AB0f4cc56dC93d29233213a128743d'; // custom generated address in metamask
    const transferAmount = 10000;
    console.log(`Transferring ${transferAmount} ${symbol} tokens to ${recipientAddress} from ${ownerAddress}`);
    await natureGold.transfer(recipientAddress, ethers.parseUnits(transferAmount.toString(), decimals));
    console.log('Transfer completed');
    ownerBalance = await natureGold.balanceOf(ownerAddress);
    console.log(`Balance of owner (${ownerAddress}): ${ethers.formatUnits(ownerBalance, decimals)} ${symbol}`);
    let recipientBalance = await natureGold.balanceOf(recipientAddress);
    console.log(`Balance of recipient (${recipientAddress}): ${ethers.formatUnits(recipientBalance, decimals)} ${symbol}\n`);

    // allowance(address owner, address spender)
    console.log(`Getting the contracOwner spending allowance over recipient\'s ${symbol} tokens...`);
    let allowance = await natureGold.allowance(recipientAddress, ownerAddress);
    console.log(`contractOwner Allowance: ${ethers.formatUnits(allowance, decimals)} ${symbol}\n`);

    // transferFrom(address from, address to, uint256 amount)
    const transferFromAmount = 100;
    console.log(`contracOwner transfers ${transferFromAmount} ${symbol} from recipient\'s account into own account...`);
    await natureGold.transferFrom(recipientAddress, ownerAddress, ethers.parseUnits(transferFromAmount.toString(), decimals));
    ownerBalance = await natureGold.balanceOf(ownerAddress);
    console.log(`New owner balance (${ownerAddress}): ${ethers.formatUnits(ownerBalance, decimals)} ${symbol}`);
    recipientBalance = await natureGold.balanceOf(recipientAddress);
    console.log(`New recipient balance (${recipientAddress}): ${ethers.formatUnits(recipientBalance, decimals)} ${symbol}`);
    allowance = await natureGold.allowance(recipientAddress, ownerAddress);
    console.log(`Remaining allowance: ${ethers.formatUnits(allowance, decimals)} ${symbol}\n`);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });