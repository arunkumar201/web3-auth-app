import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const env = createEnv({
	server: {
		DATABASE_URL: z.string().url().optional(),
		NEXTAUTH_URL: z.preprocess(
			// This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
			// Since NextAuth.js automatically uses the VERCEL_URL if present.
			(str) => (str ? str : `https://${process.env.VERCEL_URL}`),
			z.string().url().optional()
		),
	},
	client: {
		NEXT_PUBLIC_ALCHEMY_API_KEY: z.string(),
		NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: z.string(),
	},
	runtimeEnv: {
		NEXT_PUBLIC_ALCHEMY_API_KEY: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
		NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID:
			process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
		NEXTAUTH_URL: process.env.NEXTAUTH_URL,
	},
});

export { env };
