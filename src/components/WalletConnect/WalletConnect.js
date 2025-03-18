import React, { useState } from "react";
import { ethers } from "ethers";

const WalletConnect = ({ setUserAddress }) => {
    const [walletAddress, setWalletAddress] = useState("");

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await window.ethereum.request({ method: "eth_requestAccounts" });
                const signer = provider.getSigner();
                const address = await signer.getAddress();
                setWalletAddress(address);
                setUserAddress(address);
            } catch (error) {
                console.error("Wallet connection failed", error);
            }
        } else {
            alert("Please install MetaMask to use this feature!");
        }
    };

    return (
        <button onClick={connectWallet}>
            {walletAddress ? `Connected: ${walletAddress.substring(0, 6)}...` : "Connect Wallet"}
        </button>
    );
};

export default WalletConnect;
