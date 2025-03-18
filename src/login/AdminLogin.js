import React, { useState } from "react";

const AdminLogin = ({ setAdmin }) => {
    const [username, setUsername] = useState("");
    const [adminId, setAdminId] = useState("");

    const handleLogin = (event) => {
        event.preventDefault();
        if (username.trim() && adminId.trim()) {
            setAdmin({ username, adminId });
            localStorage.setItem("adminData", JSON.stringify({ username, adminId }));
        } else {
            alert("Please enter a valid username and admin ID.");
        }
    };

    return (
        <div className="admin-login">
            <h2>Admin Login</h2>
            <form onSubmit={handleLogin}>
                <input 
                    type="text" 
                    placeholder="Enter Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Enter Admin ID" 
                    value={adminId} 
                    onChange={(e) => setAdminId(e.target.value)}
                    required 
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default AdminLogin;
