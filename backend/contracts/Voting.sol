// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;
import "@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable {

    address public admin;
    address[] public voterAddresses;
    mapping(address => Voter) public voters;

    Proposal[] public proposals;
    uint public winningProposalId;

    WorkflowStatus public status;

    constructor() Ownable(msg.sender) {
        admin = msg.sender;
        status = WorkflowStatus.RegisteringVoters;
    }

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }

    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted(address voter, uint proposalId);
    event WinnerDeclared(uint winningProposalId, uint voteCount);

    modifier onlyAdmin {
        require(msg.sender == admin, "Seul l'admin peut faire cette action ^^");
        _;
    }

    function getAdmin() public view returns (address) {
        return admin;
    }

    function registerVoter(address _voter) public onlyAdmin {
        require(status == WorkflowStatus.RegisteringVoters, "L'enregistrement des votants est termine !");
        require(!voters[_voter].isRegistered, "Le votant est deja enregistre !");
        voters[_voter] = Voter(true, false, 0);
        voterAddresses.push(_voter);
        emit VoterRegistered(_voter);
    }

    function startProposalRegistration() public onlyAdmin {
        require(status == WorkflowStatus.RegisteringVoters, "L'etape actuelle ne permet pas de demarrer l'enregistrement des propositions !");
        status = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, status);
    }

    function submitProposal(string memory _description) public {
        require(status == WorkflowStatus.ProposalsRegistrationStarted, "Les propositions ne sont pas encore ouvertes !");
        require(voters[msg.sender].isRegistered, "Vous n'etes pas un votant enregistre !");
        require(bytes(_description).length > 0, "La description ne peut pas etre vide !");
        proposals.push(Proposal(_description, 0));
        emit ProposalRegistered(proposals.length - 1);
    }

    function endProposalRegistration() public onlyAdmin {
        require(status == WorkflowStatus.ProposalsRegistrationStarted, "Les propositions doivent etre ouvertes pour les fermer !");
        status = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, status);
    }

    function startVotingSession() public onlyAdmin {
        require(status == WorkflowStatus.ProposalsRegistrationEnded, "Les propositions doivent etre fermees avant de voter !");
        status = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, status);
    }

    function vote(uint _proposalId) public {
        require(status == WorkflowStatus.VotingSessionStarted, "Le vote n'est pas encore ouvert !");
        require(voters[msg.sender].isRegistered, "Vous n'etes pas un votant enregistre !");
        require(!voters[msg.sender].hasVoted, "Vous avez deja vote !");
        require(_proposalId < proposals.length, "ID de proposition invalide !");

        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedProposalId = _proposalId;
        proposals[_proposalId].voteCount++;

        emit Voted(msg.sender, _proposalId);
    }

    function endVotingSession() public onlyAdmin {
        require(status == WorkflowStatus.VotingSessionStarted, "Le vote doit etre en cours pour etre ferme !");
        status = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, status);
    }

    function tallyVotes() public onlyAdmin {
        require(status == WorkflowStatus.VotingSessionEnded, "Le vote doit etre termine avant de compter les votes !");

        uint maxVotes = 0;

        for (uint i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount > maxVotes) {
                maxVotes = proposals[i].voteCount;
                winningProposalId = i;
            }
        }

        status = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, status);
        emit WinnerDeclared(winningProposalId, maxVotes);
    }

    function getWinner() public view returns (uint) {
        require(status == WorkflowStatus.VotesTallied, "Les votes doivent etre comptes avant d'afficher le gagnant !");
        return winningProposalId;
    }

    function resetVoting() public onlyAdmin {
        require(status == WorkflowStatus.VotesTallied, "Le vote doit etre termine pour etre reinitialise !");

        // Réinitialisation des votants
        for (uint i = 0; i < voterAddresses.length; i++) {
            voters[voterAddresses[i]].hasVoted = false;
            voters[voterAddresses[i]].votedProposalId = 0;
        }

        // Suppression des propositions
        while (proposals.length > 0) {
            proposals.pop();
        }

        // Réinitialisation du statut
        status = WorkflowStatus.RegisteringVoters;

        emit WorkflowStatusChange(WorkflowStatus.VotesTallied, status);
    }

    function getTotalVotes() public view returns (uint) {
        uint totalVotes = 0;
        for (uint i = 0; i < proposals.length; i++) {
            totalVotes += proposals[i].voteCount;
        }
        return totalVotes;
    }
}
