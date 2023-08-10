const { expect } = require('chai');
const { ethers, upgrades } = require("hardhat");

describe('Governance', function () {
  beforeEach(async function () {
    this.natureGold = await upgrades.deployProxy(await ethers.getContractFactory('NatureGold'));
    await this.natureGold.deployed();
  
    this.governance = await upgrades.deployProxy(await ethers.getContractFactory('Governance'), [this.natureGold.address]);
    await this.governance.deployed();

    [this.owner, ...users] = await ethers.getSigners();
    this.recipient = users[1];

    this.signerContract = this.natureGold.connect(this.recipient);
  });

  // Test cases

  it("should initialize with correct values", async function () {
    expect(await this.governance.name()).to.equal("NatureGold Governance");
    expect((await this.governance.votingDelay()).toString()).to.equal("7200");
    expect((await this.governance.votingPeriod()).toString()).to.equal("50400");
    expect((await this.governance.proposalThreshold()).toString()).to.equal("0");
  });

  it("should allow for proposal creation", async function () {
    const targets = [this.owner.address];
    const values = [1];
    const calldatas = [1];
    const description = "Test proposal";

    const proposalId = await this.governance.propose(targets, values, calldatas, description);
    expect(proposalId).to.emit(this.governance, "ProposalCreated");
  });

  it("should vote for a proposal", async function () {
    const targets = [this.owner.address];
    const values = [1];
    const calldatas = [1];
    const description = "Test proposal";

    await this.natureGold.delegate(this.owner.address);

    // Call propose
    const proposeTx = await this.governance.propose(targets, values, calldatas, description);
    expect(proposeTx).to.emit(this.governance, "ProposalCreated");
    const tx = await proposeTx.wait();
    const proposalId = tx.events.find((e) => e.event == 'ProposalCreated').args.proposalId;

    // Fast forward to the voting phase
    const blocksToSkip = (await this.governance.votingDelay()).toNumber();
    for (let i = 0; i < blocksToSkip; i++) {
        await ethers.provider.send("evm_mine");
    }
    // Call vote
    const castVoteTx = await this.governance.castVote(proposalId, 1, { from: this.owner.address });
    expect(castVoteTx).to.emit(this.governance, "VoteCast");
    console.log(await this.governance.get)
  });

  it("should not allow voting on a non-existent proposal", async function () {
    await expect(this.governance.castVote(9999, 1))
        .to.be.revertedWith('Governor: unknown proposal id');
  });
});