import { cookies } from 'next/headers'
import { redirect } from "next/navigation";
import AdminNavbar from "@/components/admin-navbar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {

	const token = cookies().get("authToken");

	if (!token) redirect("/auth");

	return (
		<section>
			<AdminNavbar />
			<main className='px-4 py-2'>
				{children}
			</main>
		</section>
	)
}