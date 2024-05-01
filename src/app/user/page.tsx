import { Button } from "@/components/ui/button";
import { getServerSession } from "../api/authOptions";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

export default async function User() {
	const session = await getServerSession();

	console.log(session,"sssssss")
	if (!session) {
		return redirect("/")
	}

	return (
		<main className="bg-gray-600 flex h-dvh w-full flex-col items-center justify-between p-24">
			<div className="flex w-full h-full items-center gap-4 justify-center flex-col">
				<w3m-button />
				<Button variant={"outline"} className="p-8 rounded-xl bg-yellow-300 w-full  text-wrap">
					<i className=" text-gray-500 text-wrap">
						{JSON.stringify(session)}
					</i>

				</Button>
			</div>
		</main>
	);
}
