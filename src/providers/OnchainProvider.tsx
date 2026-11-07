import { ReactNode } from 'react';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected, baseAccount } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Attribution } from 'ox/erc8021';

// Base Mainnet (Denim Upgrade - 200ms native canonical blocks)
export const baseDenim = {
  ...base,
  name: 'Base Mainnet (Denim)',
};

const wagmiConfig = createConfig({
  chains: [baseDenim],
  connectors: [
    injected(),
    baseAccount({
      appName: 'Mythic Anvil Rush',
    }),
  ],
  transports: {
    [baseDenim.id]: http(undefined, {
      batch: false, // Direct canonical RPC dispatch for Denim 200ms blocks
    }),
  },
  pollingInterval: 1_000, // Optimized polling interval for Denim 200ms blocks
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
