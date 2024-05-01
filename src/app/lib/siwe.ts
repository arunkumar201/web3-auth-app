import type {
	SIWECreateMessageArgs,
	SIWEVerifyMessageArgs,
} from "@web3modal/siwe";
import { getCsrfToken, getSession, signIn, signOut } from "next-auth/react";

import { SiweMessage } from "siwe";
import { createSIWEConfig } from "@web3modal/siwe";

/* Function that creates a SIWE message */
function createMessage({ nonce, address, chainId }: SIWECreateMessageArgs) {
	const message = new SiweMessage({
		version: "1",
		domain: window.location.host,
		uri: window.location.origin,
		address,
		chainId,
		nonce,
		statement: "Sign in With Ethereum.",
	});

	return message.prepareMessage();
}

const getSiweSession = async () => {
	const session = await getSession();
	if (!session) {
		throw new Error("Failed to get session!");
	}
	if (!session.user) {
		throw new Error("Failed to get user!");
	}

	return {
		// @ts-expect-error
		id: session.user.id,
		// @ts-expect-error
		address: session.user.walletAddress,
		// @ts-expect-error
		chainId: session.user.chainId,
	};
};

const getNonce = async () => {
	const nonce = await getCsrfToken();
	if (!nonce) {
		throw new Error("Failed to get nonce!");
	}

	return nonce;
};
const verifyMessage = async ({ message, signature }: SIWEVerifyMessageArgs) => {
	const path = window.location.pathname;
	const searchParams = new URLSearchParams(window.location.search);
	const callbackUrl =
		searchParams.get("callbackUrl") || `${path}?${searchParams}`;
	try {
		const success = await signIn("web3", {
			message,
			signature,
			redirect: true,
			callbackUrl,
		});
		console.log(`Sign in ${success}`);
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
};
const siweSignOut = async () => {
	try {
		const success = await signOut({
			redirect: true,
		});
		console.log(`Sign out ${success}`);
		return true;
	} catch (error) {
		return false;
	}
};

/* Create a SIWE configuration object */
export const siweConfig = createSIWEConfig({
	enabled: true,
	createMessage,
	getNonce,
	getSession: getSiweSession,
	verifyMessage,
	signOut: siweSignOut,
	sessionRefetchIntervalMs: 100,
	onSignOut() {
		alert("Sing out callbackHello World from siwe");
	},
	onSignIn() {
		alert("Sing in callback Hello World from siwe");
	},
});
