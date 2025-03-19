import React from "react";
import { ethers } from "ethers";
import { VOTING_CONTRACT_ADDRESS, VOTING_ABI } from "../../config"; 

const AdminLogin = () => {
    const startVotingSession = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_ABI, signer);

        try {
            await contract.startVotingSession();
            alert("Voting session started!");
        } catch (error) {
            console.error("Error starting session:", error);
        }
    };

    const endVotingSession = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_ABI, signer);

        try {
            await contract.endVotingSession();
            alert("Voting session ended!");
        } catch (error) {
            console.error("Error ending session:", error);
        }
    };

    return (
        <div>
            <h2>Admin Controls</h2>
            <button onClick={startVotingSession}>Start Voting</button>
            <button onClick={endVotingSession}>End Voting</button>
        </div>
    );
};

export default AdminLogin;
