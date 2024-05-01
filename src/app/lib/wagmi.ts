import {
	Chain,
	bsc,
	bscTestnet,
	mainnet,
	polygon,
	polygonAmoy,
	sepolia,
} from "viem/chains";
import { cookieStorage, createStorage } from "wagmi";

import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { env } from "@/env.mjs";
import { transports } from "./view";

export const projectId = env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

const metadata = {
	name: "NextJS 14 + Wagmi + SIWE+ Web3Modal",
	description: "Complete Web3 Auth Application",
	url: "",
	icons: [
		"https://static-00.iconduck.com/assets.00/nextjs-icon-512x512-y563b8iq.png",
	],
};
// Chains Constants
export const DEV_CHAINS: [Chain, ...Chain[]] = [
	sepolia,
	polygonAmoy,
	bscTestnet,
];

export const PROD_CHAINS: [Chain, ...Chain[]] = [mainnet, polygon, bsc];

const getSupportedChains = (): [Chain, ...Chain[]] => {
	if (process.env.NODE_ENV != "production") {
		return PROD_CHAINS;
	}
	return DEV_CHAINS;
};

export const config = defaultWagmiConfig({
	chains: getSupportedChains(),
	projectId,
	metadata,
	ssr: true,
	// transports: transports,
	storage: createStorage({
		storage: cookieStorage,
	}),
});
