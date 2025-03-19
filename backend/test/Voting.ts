import { expect } from "chai";
import { ethers } from "hardhat";
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

    // Test des fonctionnalites existantes
    it("Should set the correct admin", async function () {
        expect(await voting.admin()).to.equal(owner.address);
    });

    it("Should register a voter", async function () {
        await voting.registerVoter(voter1.address);
        const voter = await voting.voters(voter1.address);
        expect(voter.isRegistered).to.be.true;
    });

    it("Should not allow unregistered voters to submit proposals", async function () {
        await voting.startProposalRegistration();  // Ouvre l'enregistrement des propositions
        await expect(
            voting.connect(voter1).submitProposal("New Proposal")
        ).to.be.revertedWith("Vous n'etes pas un votant enregistre !");
    });

    it("Should allow a registered voter to submit a proposal", async function () {
        await voting.registerVoter(voter1.address);
        await voting.startProposalRegistration();  // Ouvre l'enregistrement des propositions
        await voting.connect(voter1).submitProposal("Proposal 1");
        const proposal = await voting.proposals(0);
        expect(proposal.description).to.equal("Proposal 1");
    });

    it("Should start proposal registration", async function () {
        await voting.startProposalRegistration();
        const status = await voting.status();
        expect(status).to.equal(1); // ProposalsRegistrationStarted
    });

    it("Should end proposal registration", async function () {
        await voting.startProposalRegistration();
        await voting.endProposalRegistration();
        const status = await voting.status();
        expect(status).to.equal(2); // ProposalsRegistrationEnded
    });

    it("Should start voting session", async function () {
        await voting.startProposalRegistration();
        await voting.endProposalRegistration();
        await voting.startVotingSession();
        const status = await voting.status();
        expect(status).to.equal(3); // VotingSessionStarted
    });

    it("Should allow a voter to vote", async function () {
        await voting.registerVoter(voter1.address);
        await voting.startProposalRegistration();
        await voting.connect(voter1).submitProposal("Proposal 1");
        await voting.endProposalRegistration();
        await voting.startVotingSession();
        await voting.connect(voter1).vote(0);
        const voter = await voting.voters(voter1.address);
        expect(voter.hasVoted).to.be.true;
    });

    it("Should end voting session", async function () {
        await voting.startProposalRegistration();
        await voting.endProposalRegistration();
        await voting.startVotingSession();
        await voting.endVotingSession();
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
        await voting.tallyVotes();
        const winner = await voting.getWinner();
        expect(winner).to.equal(0); // Le gagnant doit etre la proposition 0
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
        await voting.resetVoting();
        
        const status = await voting.status();
        expect(status).to.equal(0); // RegisteringVoters

        // Verifier que les votants sont reinitialises
        const voter1Data = await voting.voters(voter1.address);
        const voter2Data = await voting.voters(voter2.address);
        expect(voter1Data.hasVoted).to.be.false;
        expect(voter2Data.hasVoted).to.be.false;

        // Verifier que les propositions sont supprimees
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
            // L'admin initial doit etre le proprietaire du contrat
            expect(await voting.admin()).to.equal(owner.address);
            // L'etat initial doit etre 'RegisteringVoters' (0)
            const status = await voting.status();
            expect(status).to.equal(0); // RegisteringVoters
        });

        it("Should register a voter correctly", async function () {
            await voting.registerVoter(voter1.address);
            const voter = await voting.voters(voter1.address);
            expect(voter.isRegistered).to.be.true;
            expect(voter.hasVoted).to.be.false;
        });

        it("Should revert if voter is already registered", async function () {
            await voting.registerVoter(voter1.address);
            await expect(
                voting.registerVoter(voter1.address)
            ).to.be.revertedWith("Le votant est deja enregistre !");
        });

        it("Should revert if unregistered voter tries to submit a proposal", async function () {
            await voting.startProposalRegistration();
            await expect(
                voting.connect(voter1).submitProposal("Proposal 1")
            ).to.be.revertedWith("Vous n'etes pas un votant enregistre !");
        });

        it("Should revert if proposals registration is not open", async function () {
            await expect(
                voting.connect(voter1).submitProposal("Proposal 1")
            ).to.be.revertedWith("Les propositions ne sont pas encore ouvertes !");
        });      
        
        it("Should revert if voter tries to vote multiple times", async function () {
            await voting.registerVoter(voter1.address);
            await voting.startProposalRegistration();
            await voting.connect(voter1).submitProposal("Proposal 1");
            await voting.endProposalRegistration();
            await voting.startVotingSession();
            await voting.connect(voter1).vote(0);
            await expect(
                voting.connect(voter1).vote(0)
            ).to.be.revertedWith("Vous avez deja vote !");
        });
    });
});
