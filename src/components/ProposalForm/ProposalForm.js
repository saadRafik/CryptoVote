import { useState } from "react";
import { useContractWrite } from "wagmi";
import { VOTING_CONTRACT_ADDRESS, VOTING_ABI } from "../config";

const ProposalForm = () => {
  const [proposalText, setProposalText] = useState("");

  const { write: submitProposal } = useContractWrite({
    address: VOTING_CONTRACT_ADDRESS,
    abi: VOTING_ABI,
    functionName: "submitProposal",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    submitProposal({ args: [proposalText] });
    setProposalText("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={proposalText}
        onChange={(e) => setProposalText(e.target.value)}
        placeholder="Enter proposal text"
        required
      />
      <button type="submit">Submit Proposal</button>
    </form>
  );
};

export default ProposalForm;
