'use client'

import { QueryClient,QueryClientProvider } from '@tanstack/react-query'
import { State,WagmiProvider } from 'wagmi'

import { ReactNode } from 'react';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
import { config } from '@/app/lib/wagmi'
import { createWeb3Modal } from '@web3modal/wagmi';
import { env } from '@/env.mjs';
import { polygon } from 'viem/chains';
import { siweConfig } from '@/app/lib/siwe';

const projectId = env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

const queryClient = new QueryClient()

createWeb3Modal({
	siweConfig: siweConfig,
	wagmiConfig: config,
	projectId,
	allowUnsupportedChain: false,
})

export function Web3Provider({ children,
	initialState,
}: {
	children: ReactNode;
	initialState?: State;
}) {
	return (
		<QueryClientProvider client={queryClient}>
			<WagmiProvider config={config} initialState={initialState}>
				<ReactQueryStreamedHydration queryClient={queryClient}>{children}</ReactQueryStreamedHydration>
			</WagmiProvider>
		</QueryClientProvider>
	)
}
