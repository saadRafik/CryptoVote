import { useContractRead, useContractWrite } from "wagmi";
import { VOTING_CONTRACT_ADDRESS, VOTING_ABI } from "../config";

const ProposalList = () => {
  const { data: proposals } = useContractRead({
    address: VOTING_CONTRACT_ADDRESS,
    abi: VOTING_ABI,
    functionName: "getProposals",
    watch: true,
  });

  const { write: voteForProposal } = useContractWrite({
    address: VOTING_CONTRACT_ADDRESS,
    abi: VOTING_ABI,
    functionName: "vote",
  });

  return (
    <div>
      <h2>Proposals</h2>
      <ul>
        {proposals && proposals.length > 0 ? (
          proposals.map((proposal, index) => (
            <li key={index}>
              <span>{proposal.description} ({proposal.voteCount.toString()} votes)</span>
              <button onClick={() => voteForProposal({ args: [index] })}>Vote</button>
            </li>
          ))
        ) : (
          <p>No proposals available.</p>
        )}
      </ul>
    </div>
  );
};

export default ProposalList;
