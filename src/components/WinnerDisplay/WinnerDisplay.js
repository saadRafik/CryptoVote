import { useContractRead } from "wagmi";
import { VOTING_CONTRACT_ADDRESS, VOTING_ABI } from "../config";

const WinnerDisplay = () => {
  const { data: winner } = useContractRead({
    address: VOTING_CONTRACT_ADDRESS,
    abi: VOTING_ABI,
    functionName: "getWinningProposal",
    watch: true,
  });

  return (
    <div className="winner-container">
      {winner ? (
        <h2>Winner: {winner.description} with {winner.voteCount.toString()} votes</h2>
      ) : (
        <h2>No winner yet</h2>
      )}
    </div>
  );
};

export default WinnerDisplay;
