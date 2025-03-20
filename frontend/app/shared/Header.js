import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header() {
  return (
    <header style={{ padding: '10px 20px', backgroundColor: '#282c34', color: 'white', textAlign: 'center' }}>
      <h1>Application de Vote Décentralisée</h1>
      <ConnectButton onConnect={(address) => checkIfAdmin(address)} />
    </header>
  );
}
