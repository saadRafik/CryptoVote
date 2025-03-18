import React, { useState, useEffect } from "react";
import ProposalList from "../../components/ProposalList/ProposalList";

const VoterView = () => {
    const [proposals, setProposals] = useState([]);

    useEffect(() => {
        const updateProposals = () => {
            const storedProposals = JSON.parse(localStorage.getItem("proposals"));
            if (storedProposals) {
                setProposals(storedProposals);
            }
        };

        updateProposals();
        window.addEventListener("storage", updateProposals);

        return () => window.removeEventListener("storage", updateProposals);
    }, []);

    return (
        <div className="voter-container">
            <h1>Voter Dashboard</h1>
            <ProposalList proposals={proposals} voteForProposal={() => {}} isAdmin={false} />
        </div>
    );
};

export default VoterView;
