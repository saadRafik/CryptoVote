import { expect } from "chai";
import { ethers } from "hardhat";
import { expectEvent, expectRevert } from "@openzeppelin/test-helpers";
import { Voting } from "../typechain-types";

describe("Voting Contract", function () {
    let voting: Voting;
    let owner: any, voter1: any, voter2: any;

    beforeEach(async function () {
        // Recuperation des comptes disponibles via ethers
        [owner, voter1, voter2] = await ethers.getSigners();

        // Deploiement du contrat
        const VotingFactory = await ethers.getContractFactory("Voting");
        voting = await VotingFactory.deploy();
    });

    // Test des fonctionnalités existantes
    it("Should set the correct admin", async function () {
        expect(await voting.admin()).to.equal(owner.address);
    });

    it("Should register a voter", async function () {
        const tx = await voting.registerVoter(voter1.address);
        await expectEvent(tx, "VoterRegistered", {
            voterAddress: voter1.address,
        });
        
        const voter = await voting.voters(voter1.address);
        expect(voter.isRegistered).to.be.true;
    });

    it("Should not allow unregistered voters to submit proposals", async function () {
        await voting.startProposalRegistration();  // Ouvre l'enregistrement des propositions
        await expectRevert(
            voting.connect(voter1).submitProposal("New Proposal"),
            "Vous n'etes pas un votant enregistre !"
        );
    });

    it("Should allow a registered voter to submit a proposal", async function () {
        await voting.registerVoter(voter1.address);
        await voting.startProposalRegistration();  // Ouvre l'enregistrement des propositions
        const tx = await voting.connect(voter1).submitProposal("Proposal 1");
        await expectEvent(tx, "ProposalRegistered", {
            proposalId: "0",
        });

        const proposal = await voting.proposals(0);
        expect(proposal.description).to.equal("Proposal 1");
    });

    it("Should start proposal registration", async function () {
        const tx = await voting.startProposalRegistration();
        await expectEvent(tx, "WorkflowStatusChange", {
            previousStatus: "0", // RegisteringVoters
            newStatus: "1", // ProposalsRegistrationStarted
        });

        const status = await voting.status();
        expect(status).to.equal(1); // ProposalsRegistrationStarted
    });

    it("Should end proposal registration", async function () {
        await voting.startProposalRegistration();
        const tx = await voting.endProposalRegistration();
        await expectEvent(tx, "WorkflowStatusChange", {
            previousStatus: "1", // ProposalsRegistrationStarted
            newStatus: "2", // ProposalsRegistrationEnded
        });

        const status = await voting.status();
        expect(status).to.equal(2); // ProposalsRegistrationEnded
    });

    it("Should start voting session", async function () {
        await voting.startProposalRegistration();
        await voting.endProposalRegistration();
        const tx = await voting.startVotingSession();
        await expectEvent(tx, "WorkflowStatusChange", {
            previousStatus: "2", // ProposalsRegistrationEnded
            newStatus: "3", // VotingSessionStarted
        });

        const status = await voting.status();
        expect(status).to.equal(3); // VotingSessionStarted
    });

    it("Should allow a voter to vote", async function () {
        await voting.registerVoter(voter1.address);
        await voting.startProposalRegistration();
        await voting.connect(voter1).submitProposal("Proposal 1");
        await voting.endProposalRegistration();
        await voting.startVotingSession();

        const tx = await voting.connect(voter1).vote(0);
        await expectEvent(tx, "Voted", {
            voter: voter1.address,
            proposalId: "0",
        });

        const voter = await voting.voters(voter1.address);
        expect(voter.hasVoted).to.be.true;
    });

    it("Should end voting session", async function () {
        await voting.startProposalRegistration();
        await voting.endProposalRegistration();
        await voting.startVotingSession();
        const tx = await voting.endVotingSession();
        await expectEvent(tx, "WorkflowStatusChange", {
            previousStatus: "3", // VotingSessionStarted
            newStatus: "4", // VotingSessionEnded
        });

        const status = await voting.status();
        expect(status).to.equal(4); // VotingSessionEnded
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
        await expectEvent(tx, "WorkflowStatusChange", {
            previousStatus: "4", // VotingSessionEnded
            newStatus: "5", // VotesTallied
        });

        const winner = await voting.getWinner();
        expect(winner).to.equal(0); // Le gagnant doit être la proposition 0
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
        await expectEvent(tx, "WorkflowStatusChange", {
            previousStatus: "5", // VotesTallied
            newStatus: "0", // RegisteringVoters
        });

        const status = await voting.status();
        expect(status).to.equal(0); // RegisteringVoters

        // Vérifier que les votants sont réinitialisés
        const voter1Data = await voting.voters(voter1.address);
        const voter2Data = await voting.voters(voter2.address);
        expect(voter1Data.hasVoted).to.be.false;
        expect(voter2Data.hasVoted).to.be.false;

        // Vérifier que les propositions sont supprimées
        const totalProposals = await voting.proposals.length;
        expect(totalProposals).to.equal(0);
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
        expect(totalVotes).to.equal(2); // 2 votes
    });

    describe("Unit Tests", function () {
        it("Should set the correct initial admin and status", async function () {
            // L'admin initial doit être le propriétaire du contrat
            expect(await voting.admin()).to.equal(owner.address);
            // L'état initial doit être 'RegisteringVoters' (0)
            const status = await voting.status();
            expect(status).to.equal(0); // RegisteringVoters
        });

        it("Should register a voter correctly", async function () {
            const tx = await voting.registerVoter(voter1.address);
            await expectEvent(tx, "VoterRegistered", {
                voterAddress: voter1.address,
            });

            const voter = await voting.voters(voter1.address);
            expect(voter.isRegistered).to.be.true;
            expect(voter.hasVoted).to.be.false;
        });

        it("Should revert if voter is already registered", async function () {
            await voting.registerVoter(voter1.address);
            await expectRevert(
                voting.registerVoter(voter1.address),
                "Le votant est deja enregistre !"
            );
        });

        it("Should revert if unregistered voter tries to submit a proposal", async function () {
            await voting.startProposalRegistration();
            await expectRevert(
                voting.connect(voter1).submitProposal("Proposal 1"),
                "Vous n'etes pas un votant enregistre !"
            );
        });

        it("Should revert if proposals registration is not open", async function () {
            await expectRevert(
                voting.connect(voter1).submitProposal("Proposal 1"),
                "Les propositions ne sont pas encore ouvertes !"
            );
        });

        it("Should revert if voter tries to vote multiple times", async function () {
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
    });
});
