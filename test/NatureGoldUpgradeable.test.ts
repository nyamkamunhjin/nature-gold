import { expect } from 'chai';
import "@openzeppelin/hardhat-upgrades"
import { ethers, upgrades } from "hardhat";

describe('NatureGoldUpgradeable', function () {
  before(async function () {
    this.natureGoldUpgradeableContract = await ethers.getContractFactory('NatureGoldUpgradeable');
  });

  beforeEach(async function () {
    this.natureGoldUpgradeable = await upgrades.deployProxy(this.natureGoldUpgradeableContract, [], {
      initializer: "initialize",
      kind: "transparent"
    });
    await this.natureGoldUpgradeable.waitForDeployment();

    const signers = await ethers.getSigners();

    this.ownerAddress = await signers[0].getAddress();
    this.recipientAddress = await signers[1].getAddress();

    this.signerContract = this.natureGoldUpgradeable.connect(signers[1]);
  });

  // Test cases
  it('Has a correct token name', async function () {
    expect(await this.natureGoldUpgradeable.name()).to.exist;
    expect(await this.natureGoldUpgradeable.name()).to.equal('NatureGold');
  });


  it('Has a correct token symbol', async function () {
    expect(await this.natureGoldUpgradeable.symbol()).to.exist;
    expect(await this.natureGoldUpgradeable.symbol()).to.equal('NG');
  });

  it('Has a correct decimal', async function () {
    expect((await this.natureGoldUpgradeable.decimals()).toString()).to.equal('18');
  })

  it('Has a correct initial total supply', async function () {
    const expectedSupply = ethers.parseUnits('388793750', this.decimals);
    expect((await this.natureGoldUpgradeable.totalSupply()).toString()).to.equal(expectedSupply);
  });

  it('Is able to query account balances', async function () {
    const ownerBalance = await this.natureGoldUpgradeable.balanceOf(this.ownerAddress);
    expect(await this.natureGoldUpgradeable.balanceOf(this.ownerAddress)).to.equal(ownerBalance);
  });

});