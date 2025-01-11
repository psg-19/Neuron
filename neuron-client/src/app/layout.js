'use client'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
  Chain
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query"
const sonic = {
  id: 57054,
  name: 'Sonic',
  iconBackground: '#fff',
  nativeCurrency: { name: 'Sonic', symbol: 'S', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.blaze.soniclabs.com'] },
  },
  testnet:true

} 


export const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID', // Replace with your WalletConnect project ID
  chains: [mainnet, polygon, optimism, arbitrum, base,sonic],
  ssr: true, // Required for Next.js SSR
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const queryClient = new QueryClient();


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});




export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <body>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider coolMode>
            {children} {/* Make sure your app components are inside this */}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </body>
  </html>
  );
}
