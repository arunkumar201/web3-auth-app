'use client'

import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Home() {
  const { status } = useSession();

  if (status == "authenticated") {
    redirect("/user");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button>
        <w3m-button />
      </Button>
    </main>
  );
}
