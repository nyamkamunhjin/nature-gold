const { ethers, upgrades } = require("hardhat");
const dayjs = require('dayjs')

const utc = require('dayjs/plugin/utc')

dayjs.extend(utc)
dayjs.utc()

console.log(dayjs().utc().isUTC())

const PROTECTED_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("PROTECTED_ROLE"));


async function main() {
  const [owner] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", owner.address);
  console.log("Account balance:", (await owner.getBalance()).toString());

  let natureGold;
  let bp;
  let governance;

  const deploy = async () => {
    // -- Token
    const NatureGoldV3 = await ethers.getContractFactory("NatureGoldV3");
    const BotPrevention = await ethers.getContractFactory("BotPreventionBlacklist");
    const Governance = await ethers.getContractFactory("Governance");

    console.log("==> begin / deploy: bot prevention blacklist");

    bp = await BotPrevention.deploy();

    await bp.deployed();

    console.log("==> end / deploy: bot prevention blacklist");

  };


  const botPreventionConfig = async () => {
    await (await bp.connect(owner).grantRole(PROTECTED_ROLE, '0xa64a329876a27192c7f8bde4430bdec70ea4b2f9')).wait();
  };

  const consoleAddresses = async () => {
    console.table({
      bp: bp.address,
    });
  };

  await deploy();
  await consoleAddresses();
  await botPreventionConfig();
}



main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
