import { expect } from 'chai';
import { ethers } from "hardhat";

describe('NatureGold', function () {
  before(async function () {
    this.natureGoldContract = await ethers.getContractFactory('NatureGold');
  });

  beforeEach(async function () {
    this.natureGold = await this.natureGoldContract.deploy()
    await this.natureGold.waitForDeployment();

    const signers = await ethers.getSigners();

    this.ownerAddress = signers[0].address;
    this.recipientAddress = signers[1].address;

    this.signerContract = this.natureGold.connect(signers[1]);
  });

  // Test cases
  it('Has a correct token name', async function () {
    expect(await this.natureGold.name()).to.exist;
    expect(await this.natureGold.name()).to.equal('NatureGold');
  });

  it('Has a correct token symbol', async function () {
    expect(await this.natureGold.symbol()).to.exist;
    expect(await this.natureGold.symbol()).to.equal('NG');
  });

  it('Has a correct decimal', async function () {
    expect((await this.natureGold.decimals()).toString()).to.equal('18');
  })

  it('Has a correct initial total supply', async function () {
    const expectedSupply = ethers.parseUnits('388793750', this.decimals);
    expect((await this.natureGold.totalSupply()).toString()).to.equal(expectedSupply);
  });

  it('Is able to query account balances', async function () {
    const ownerBalance = await this.natureGold.balanceOf(this.ownerAddress);
    expect(await this.natureGold.balanceOf(this.ownerAddress)).to.equal(ownerBalance);
  });

  it('Transfers the right amount of tokens to/from an account', async function () {
    const transferAmount = 1000;

    console.log(this.natureGold)

    await expect(this.natureGold.transfer(this.recipientAddress, transferAmount)).to.changeTokenBalance(
      this.natureGold,
      [this.ownerAddress, this.recipientAddress],
      [-transferAmount, transferAmount]
    );
  });

  it('Emits a transfer event with the right arguments', async function () {
    const transferAmount = 100000;
    await expect(this.natureGold.transfer(this.recipientAddress, ethers.parseUnits(transferAmount.toString(), this.decimals)))
      .to.emit(this.natureGold, "Transfer")
      .withArgs(this.ownerAddress, this.recipientAddress, ethers.parseUnits(transferAmount.toString(), this.decimals))
  });

  it('Allows for allowance approvals and queries', async function () {
    const approveAmount = 10000;
    await this.signerContract.approve(this.ownerAddress, ethers.parseUnits(approveAmount.toString(), this.decimals));
    
    expect((await this.natureGold.allowance(this.recipientAddress, this.ownerAddress))).to.equal(ethers.parseUnits(approveAmount.toString(), this.decimals));
  });

  it('Emits an approval event with the right arguments', async function () {
    const approveAmount = 10000;
    await expect(this.signerContract.approve(this.ownerAddress, ethers.parseUnits(approveAmount.toString(), this.decimals)))
      .to.emit(this.natureGold, "Approval")
      .withArgs(this.recipientAddress, this.ownerAddress, ethers.parseUnits(approveAmount.toString(), this.decimals))
  });

  it('Allows an approved spender to transfer from owner', async function () {
    const transferAmount = 10000;
    await this.natureGold.transfer(this.recipientAddress, ethers.parseUnits(transferAmount.toString(), this.decimals))
    await this.signerContract.approve(this.ownerAddress, ethers.parseUnits(transferAmount.toString(), this.decimals))
    await expect((this.natureGold).transferFrom(this.recipientAddress, this.ownerAddress, transferAmount)).to.changeTokenBalances(
      this.natureGold,
      [this.ownerAddress, this.recipientAddress],
      [transferAmount, -transferAmount]
    );
  });

  it('Emits a transfer event with the right arguments when conducting an approved transfer', async function () {
    const transferAmount = 10000;
    await this.natureGold.transfer(this.recipientAddress, ethers.parseUnits(transferAmount.toString(), this.decimals))
    await this.signerContract.approve(this.ownerAddress, ethers.parseUnits(transferAmount.toString(), this.decimals))
    await expect(this.natureGold.transferFrom(this.recipientAddress, this.ownerAddress, ethers.parseUnits(transferAmount.toString(), this.decimals)))
      .to.emit(this.natureGold, "Transfer")
      .withArgs(this.recipientAddress, this.ownerAddress, ethers.parseUnits(transferAmount.toString(), this.decimals))
  });
});