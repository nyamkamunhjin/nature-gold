import "@nomiclabs/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";
import { ethers, upgrades } from "hardhat";
import { Contract } from "ethers";

const PROTECTED_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("PROTECTED_ROLE"));

async function main() {
    const [owner] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", owner.address);
    console.log("Account balance:", (await owner.getBalance()).toString());

    let natureGold: Contract,
        bp: Contract;

    const deploy = async () => {
        // -- Token
        const NatureGoldV3 = await ethers.getContractFactory("NatureGoldV3");
        const BotPrevention = await ethers.getContractFactory("BotPreventionBlacklist");

        bp = await BotPrevention.deploy();

        // SC Main Token
        natureGold = await NatureGoldV3.deploy(
            bp.address
        );
    };

    const botPreventionConfig = async () => {
        await (await bp.connect(owner).grantRole(PROTECTED_ROLE, natureGold.address)).wait();
    };

    const consoleAddresses = async () => {
        console.table({
            natureGold: natureGold.address,
            bp: bp.address,
        });
    };

    await deploy();
    await consoleAddresses();
    await botPreventionConfig();
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
