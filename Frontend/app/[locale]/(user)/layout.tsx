import Navbar from "@/components/navbar";

export default function UserLayout({ children }: { children: React.ReactNode }) {
	return (
		<section>
			<Navbar />
			<main className='px-4 py-2'>
				{children}
			</main>
		</section>
	)
}