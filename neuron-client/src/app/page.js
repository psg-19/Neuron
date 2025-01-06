import { ConnectButton } from '@rainbow-me/rainbowkit';
import SolidityEditor from './components/SolidityEditor';

export default function Home() {
  return (
    <div>
      <h1>Welcome to My dApp</h1>
      <ConnectButton />
      <SolidityEditor/>
    </div>
  );
}
