import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { mainnet, goerli } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import ProposalForm from "./components/ProposalForm";
import ProposalList from "./components/ProposalList";
import WinnerDisplay from "./components/WinnerDisplay";

const { chains, publicClient } = configureChains(
  [goerli], // Use Goerli testnet
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "CryptoVote",
  projectId: "YOUR_PROJECT_ID", // Get from RainbowKit dashboard
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <div>
          <h1>CryptoVote DApp</h1>
          <ProposalForm />
          <ProposalList />
          <WinnerDisplay />
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
