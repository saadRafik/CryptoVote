import { useContractWrite } from "wagmi";
import { VOTING_CONTRACT_ADDRESS, VOTING_ABI } from "../config";

const AdminControls = () => {
  const { write: startVotingSession } = useContractWrite({
    address: VOTING_CONTRACT_ADDRESS,
    abi: VOTING_ABI,
    functionName: "startVotingSession",
  });

  const { write: endVotingSession } = useContractWrite({
    address: VOTING_CONTRACT_ADDRESS,
    abi: VOTING_ABI,
    functionName: "endVotingSession",
  });

  return (
    <div>
      <h2>Admin Controls</h2>
      <button onClick={() => startVotingSession()}>Start Voting</button>
      <button onClick={() => endVotingSession()}>End Voting</button>
    </div>
  );
};

export default AdminControls;
