import React, { useState } from "react";

const ProposalForm = ({ addProposal }) => {
    const [proposalText, setProposalText] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (proposalText.trim()) {
            addProposal(proposalText);
            setProposalText("");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={proposalText}
                onChange={(e) => setProposalText(e.target.value)}
                placeholder="Enter proposal"
                required
            />
            <button type="submit">Submit Proposal</button>
        </form>
    );
};

export default ProposalForm;
