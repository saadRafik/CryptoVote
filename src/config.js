export const VOTING_CONTRACT_ADDRESS = "0xYourSmartContractAddressHere"; // Replace with your deployed contract address

export const VOTING_ABI = [
  {
    "inputs": [{"internalType": "string","name": "description","type": "string"}],
    "name": "submitProposal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256","name": "proposalId","type": "uint256"}],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getProposals",
    "outputs": [{"internalType": "struct Proposal[]","name": "","type": "tuple[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getWinningProposal",
    "outputs": [{"internalType": "struct Proposal","name": "","type": "tuple"}],
    "stateMutability": "view",
    "type": "function"
  }
];
