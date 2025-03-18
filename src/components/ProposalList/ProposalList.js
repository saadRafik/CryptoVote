import React from "react";

const ProposalList = ({ proposals = [], voteForProposal, isAdmin }) => {
    return (
        <div id="proposal-list">
            {proposals.length > 0 ? (
                <ul>
                    {proposals.map((proposal, index) => (
                        <li key={index} className="proposal-item">
                            <span>{proposal.text} ({proposal.votes} votes)</span>
                            {!isAdmin && (
                                <button onClick={() => voteForProposal(index)}>Vote</button>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No proposals available.</p>
            )}
        </div>
    );
};

export default ProposalList;
