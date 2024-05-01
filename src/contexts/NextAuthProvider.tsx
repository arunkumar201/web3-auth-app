'use client'

import type { PropsWithChildren } from 'react';
import React from 'react';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

type SessionProviderProps = PropsWithChildren<{
	session?: Session | null;
}>;

export const NextAuthProvider: React.FC<SessionProviderProps> = ({ session,children }) => (
	<SessionProvider session={session}>{children}</SessionProvider>
);
