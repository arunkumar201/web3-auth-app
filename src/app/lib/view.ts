import {
	bsc,
	bscTestnet,
	mainnet,
	polygon,
	polygonAmoy,
	sepolia,
} from "wagmi/chains";
import { fallback, http } from "viem";

import type { Chain } from "viem";
import { env } from "@/env.mjs";

export const transports = {
	[mainnet.id]: http(),
	[polygon.id]: http(),
	[polygonAmoy.id]: http(),
	[bsc.id]: http(),
	[bscTestnet.id]: http(),
	[sepolia.id]: http(),
} as const;

export type SupportedChain = Chain & {
	id: keyof typeof transports;
};
