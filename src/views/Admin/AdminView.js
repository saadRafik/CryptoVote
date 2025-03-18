import React, { useState, useEffect } from "react";
import ProposalList from "../../components/ProposalList/ProposalList";
import ProposalForm from "../../components/ProposalForm/ProposalForm";

const AdminView = ({ setProposals }) => {
    const [proposals, setLocalProposals] = useState([]);
    const [admin, setAdmin] = useState(localStorage.getItem("admin") || "");

    const handleAdminLogin = (username) => {
        if (username.trim()) {
            setAdmin(username);
            localStorage.setItem("admin", username);
        }
    };

    return (
        <div className="admin-container">
            <h1>Admin Dashboard</h1>
            {!admin ? (
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleAdminLogin(e.target.username.value);
                }}>
                    <input type="text" name="username" placeholder="Enter Admin Username" required />
                    <button type="submit">Login</button>
                </form>
            ) : (
                <>
                    <p>Welcome, {admin}!</p>
                    <ProposalForm addProposal={(proposal) => {
                        const updatedProposals = [...proposals, { text: proposal, votes: 0 }];
                        setLocalProposals(updatedProposals);
                        setProposals(updatedProposals);
                        localStorage.setItem("proposals", JSON.stringify(updatedProposals));
                    }} />
                    <ProposalList proposals={proposals} isAdmin={true} />
                </>
            )}
        </div>
    );
};

export default AdminView;
