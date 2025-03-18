import React, { useState, useEffect } from "react";
import WalletConnect from "./components/WalletConnect/WalletConnect"; 
import AdminView from "./views/Admin/AdminView";
import VoterView from "./views/Voter/VoterView";

const App = () => {
    const [view, setView] = useState(localStorage.getItem("view") || "login");

    useEffect(() => {
        localStorage.setItem("view", view);
    }, [view]);

    return (
        <div className="app-container">
            <WalletConnect />
            <button onClick={() => setView("admin")}>Admin</button>
            <button onClick={() => setView("voter")}>Voter</button>

            {view === "admin" && <AdminView />}
            {view === "voter" && <VoterView />}
        </div>
    );
};

export default App;
