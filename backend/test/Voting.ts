import { expect } from "chai";
import { ethers } from "hardhat";
import { expectEvent, expectRevert } from '@openzeppelin/test-helpers';
import { Voting } from "../typechain-types";

describe("Voting Contract", function () {
  let voting: Voting;
  let owner: any, voter1: any, voter2: any;

  beforeEach(async function () {
    [owner, voter1, voter2] = await ethers.getSigners();
    const VotingFactory = await ethers.getContractFactory("Voting");
    voting = await VotingFactory.deploy();
  });

  it("Should set the correct admin", async function () {
    expect(await voting.admin()).to.equal(owner.address);
  });

  it("Should register a voter", async function () {
    const tx = await voting.registerVoter(voter1.address);
    const receipt = await tx.wait();
    // Vérification de l'émission de l'événement VoterRegistered
    expectEvent(receipt, "VoterRegistered", { voterAddress: voter1.address });

    const voter = await voting.voters(voter1.address);
    expect(voter.isRegistered).to.be.true;
    expect(voter.hasVoted).to.be.false;
  });

  it("Should revert if the voter is already registered", async function () {
    await voting.registerVoter(voter1.address);
    await expectRevert(
      voting.registerVoter(voter1.address),
      "Le votant est deja enregistre !"
    );
  });

  it("Should not allow unregistered voters to submit proposals", async function () {
    await voting.startProposalRegistration();
    await expectRevert(
      voting.connect(voter1).submitProposal("New Proposal"),
      "Vous n'etes pas un votant enregistre !"
    );
  });

  it("Should allow a registered voter to submit a proposal", async function () {
    await voting.registerVoter(voter1.address);
    await voting.startProposalRegistration();
    const tx = await voting.connect(voter1).submitProposal("Proposal 1");
    const receipt = await tx.wait();
    // Pour ProposalRegistered, le proposalId est de type uint donc on vérifie avec un nombre
    expectEvent(receipt, "ProposalRegistered", { proposalId: 0 });

    const proposal = await voting.proposals(0);
    expect(proposal.description).to.equal("Proposal 1");
  });

  it("Should revert if proposals registration is not started", async function () {
    await expectRevert(
      voting.connect(voter1).submitProposal("Proposal 1"),
      "Les propositions ne sont pas encore ouvertes !"
    );
  });

  it("Should start proposal registration", async function () {
    const tx = await voting.startProposalRegistration();
    const receipt = await tx.wait();
    // Pour WorkflowStatusChange, les statuts sont des uint (0, 1, etc.)
    expectEvent(receipt, "WorkflowStatusChange", {
      previousStatus: 0, // RegisteringVoters
      newStatus: 1, // ProposalsRegistrationStarted
    });

    const status = await voting.status();
    expect(status).to.equal(1);
  });

  it("Should revert if trying to start proposal registration when not in RegisteringVoters", async function () {
    await voting.startProposalRegistration();
    await expectRevert(
      voting.startProposalRegistration(),
      "L'etape actuelle ne permet pas de demarrer l'enregistrement des propositions !"
    );
  });

  it("Should end proposal registration", async function () {
    await voting.startProposalRegistration();
    const tx = await voting.endProposalRegistration();
    const receipt = await tx.wait();
    expectEvent(receipt, "WorkflowStatusChange", {
      previousStatus: 1, // ProposalsRegistrationStarted
      newStatus: 2, // ProposalsRegistrationEnded
    });

    const status = await voting.status();
    expect(status).to.equal(2);
  });

  it("Should revert if trying to end proposal registration when not in ProposalsRegistrationStarted", async function () {
    await expectRevert(
      voting.endProposalRegistration(),
      "Les propositions doivent etre ouvertes pour les fermer !"
    );
  });

  it("Should start voting session", async function () {
    await voting.startProposalRegistration();
    await voting.endProposalRegistration();
    const tx = await voting.startVotingSession();
    const receipt = await tx.wait();
    expectEvent(receipt, "WorkflowStatusChange", {
      previousStatus: 2, // ProposalsRegistrationEnded
      newStatus: 3, // VotingSessionStarted
    });

    const status = await voting.status();
    expect(status).to.equal(3);
  });

  it("Should revert if trying to start voting session before proposal registration ends", async function () {
    await expectRevert(
      voting.startVotingSession(),
      "Les propositions doivent etre fermees avant de voter !"
    );
  });

  it("Should allow a voter to vote", async function () {
    await voting.registerVoter(voter1.address);
    await voting.startProposalRegistration();
    await voting.connect(voter1).submitProposal("Proposal 1");
    await voting.endProposalRegistration();
    await voting.startVotingSession();

    const tx = await voting.connect(voter1).vote(0);
    const receipt = await tx.wait();
    expectEvent(receipt, "Voted", { voter: voter1.address, proposalId: 0 });

    const voter = await voting.voters(voter1.address);
    expect(voter.hasVoted).to.be.true;
  });

  it("Should revert if a voter tries to vote twice", async function () {
    await voting.registerVoter(voter1.address);
    await voting.startProposalRegistration();
    await voting.connect(voter1).submitProposal("Proposal 1");
    await voting.endProposalRegistration();
    await voting.startVotingSession();

    await voting.connect(voter1).vote(0);
    await expectRevert(
      voting.connect(voter1).vote(0),
      "Vous avez deja vote !"
    );
  });

  it("Should end voting session", async function () {
    await voting.startProposalRegistration();
    await voting.endProposalRegistration();
    await voting.startVotingSession();
    const tx = await voting.endVotingSession();
    const receipt = await tx.wait();
    expectEvent(receipt, "WorkflowStatusChange", {
      previousStatus: 3, // VotingSessionStarted
      newStatus: 4, // VotingSessionEnded
    });

    const status = await voting.status();
    expect(status).to.equal(4);
  });

  it("Should tally votes correctly", async function () {
    await voting.registerVoter(voter1.address);
    await voting.registerVoter(voter2.address);
    await voting.startProposalRegistration();
    await voting.connect(voter1).submitProposal("Proposal 1");
    await voting.endProposalRegistration();
    await voting.startVotingSession();
    await voting.connect(voter1).vote(0);
    await voting.connect(voter2).vote(0);
    await voting.endVotingSession();

    const tx = await voting.tallyVotes();
    const receipt = await tx.wait();
    expectEvent(receipt, "WorkflowStatusChange", {
      previousStatus: 4, // VotingSessionEnded
      newStatus: 5, // VotesTallied
    });

    const winner = await voting.getWinner();
    expect(winner).to.equal(0);
  });

  it("Should reset voting", async function () {
    await voting.registerVoter(voter1.address);
    await voting.registerVoter(voter2.address);
    await voting.startProposalRegistration();
    await voting.connect(voter1).submitProposal("Proposal 1");
    await voting.endProposalRegistration();
    await voting.startVotingSession();
    await voting.connect(voter1).vote(0);
    await voting.connect(voter2).vote(0);
    await voting.endVotingSession();
    await voting.tallyVotes();

    const tx = await voting.resetVoting();
    const receipt = await tx.wait();
    expectEvent(receipt, "WorkflowStatusChange", {
      previousStatus: 5, // VotesTallied
      newStatus: 0, // RegisteringVoters
    });

    const status = await voting.status();
    expect(status).to.equal(0);

    const voter1Data = await voting.voters(voter1.address);
    const voter2Data = await voting.voters(voter2.address);
    expect(voter1Data.hasVoted).to.be.false;
    expect(voter2Data.hasVoted).to.be.false;

    const proposalsArray = voting.proposals;
    expect(proposalsArray.length).to.equal(0);
  });

  it("Should return total votes", async function () {
    await voting.registerVoter(voter1.address);
    await voting.registerVoter(voter2.address);
    await voting.startProposalRegistration();
    await voting.connect(voter1).submitProposal("Proposal 1");
    await voting.endProposalRegistration();
    await voting.startVotingSession();
    await voting.connect(voter1).vote(0);
    await voting.connect(voter2).vote(0);

    const totalVotes = await voting.getTotalVotes();
    expect(totalVotes).to.equal(2);
  });

  it("Should return the correct admin", async function () {
    const admin = voting.admin;
    expect(admin).to.equal(owner.address);
  });

  it("Should revert if trying to tally votes before voting session ends", async function () {
    await expectRevert(
      voting.tallyVotes(),
      "Le vote doit etre termine avant de compter les votes !"
    );
  });
});
