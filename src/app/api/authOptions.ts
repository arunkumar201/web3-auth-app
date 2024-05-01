import "server-only";

import { ethers } from "ethers";
import {
	type NextAuthOptions,
	getServerSession as getServerSessionInternal,
} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { SiweMessage } from "siwe";

import { env } from "@/env.mjs";
import { prisma } from "@/database/db";
import { getCsrfToken } from "next-auth/react";

const projectId = env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

export const userSelection = {
	chainId: true,
	role: true,
	id: true,
	walletAddress: true,
};

export const authOptions: NextAuthOptions = {
	session: {
		strategy: "jwt",
		maxAge: 30 * 60, // 30 minutes
	},
	providers: [
		Credentials({
			id: "web3",
			name: "WEB3",
			credentials: {
				message: {
					label: "Message",
					type: "text",
					placeholder: "0x0",
				},
				signature: {
					label: "Signature",
					type: "text",
					placeholder: "0x0",
				},
				csrfToken: {
					label: "CSRF Token",
					type: "text",
					placeholder: "0x0",
				},
			},
			async authorize(credentials, req) {
				try {
					if (!credentials) throw new Error("No credentials");
					if (!req.headers) throw new Error("No headers");

					const siwe = new SiweMessage(credentials.message);
					const provider = new ethers.JsonRpcProvider(
						`https://rpc.walletconnect.com/v1?chainId=eip155:${siwe.chainId}&projectId=${projectId}`
					);

					const result = await siwe.verify(
						{
							signature: credentials.signature,
							domain: req.headers.host,
							nonce: credentials.csrfToken,
						},
						{
							provider,
						}
					);
					if (result.data.uri !== env.NEXTAUTH_URL) {
						throw new Error(`Invalid domain: ${result.data.domain}`);
					}

					const nonce = await getCsrfToken({ req: { headers: req.headers } });

					if (result.data.nonce !== nonce) {
						throw new Error(`Invalid nonce: ${result.data.nonce}`);
					}
					if (result.success) {
						let user = null;
						user = await prisma.user.findFirst({
							where: {
								walletAddress: siwe.address,
							},
							select: userSelection,
						});
						if (!user) {
							user = await prisma.user.create({
								data: {
									walletAddress: siwe.address,
									chainId: siwe.chainId,
									role: "USER",
								},
								select: userSelection,
							});
						}
						return user;
					} else {
						return null;
					}
				} catch (e) {
					console.error(e);
					return null;
				}
			},
		}),
	],
	callbacks: {
		jwt: async ({ token, user }) => {
			if (user) {
				// Persist the data to the token right after authentication
				token.id = user.id;
				// @ts-expect-error
				token.chainId = user.chainId;
				// @ts-expect-error
				token.role = user.role;
				// @ts-expect-error
				token.walletAddress = user.walletAddress;
			} else {
				const dbUser = await prisma.user.findUnique({
					where: {
						id: token.id as string,
					},
					select: userSelection,
				});
				token.id = dbUser?.id;
				token.chainId = dbUser?.chainId;
				token.role = dbUser?.role;
				token.walletAddress = dbUser?.walletAddress;
			}

			// console.log(`Token: ${JSON.stringify(token)}`);
			return token;
		},
		session({ session, token }: any) {
			session.user.id = token.id;
			session.user.role = token.role;
			session.user.chainId = token.chainId;
			session.user.walletAddress = token.walletAddress;
			session.iat = token.iat;
			session.exp = token.exp;

			// console.log(`Session: ${JSON.stringify(session)}`);
			return session;
		},
	},
	pages: {
		signIn: "/user",
		signOut: "/",
	},
};

export async function getServerSession() {
	const session = await getServerSessionInternal(authOptions);

	return session;
}
