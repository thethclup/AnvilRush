import { ReactNode } from 'react';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected, baseAccount } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Attribution } from 'ox/erc8021';

// Configure wagmi for Base Mainnet
// Ideally we'd use a WalletConnect projectId, but we'll setup base configuration
const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    injected(),
    baseAccount({
      appName: 'Mythic Anvil Rush',
    }),
  ],
  transports: {
    [base.id]: http(),
  },
  dataSuffix: Attribution.toDataSuffix({ codes: ["bc_xhh7du90"] })
});

const queryClient = new QueryClient();

export function OnchainProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
