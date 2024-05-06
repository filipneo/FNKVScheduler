import { useTranslations } from "next-intl"

import AuthButton from './auth-button'
import ThemeButton from './theme-button'
import LanguageSwitcher from "./language-switcher"

import { Link } from "@/navigation"
import { Button } from "./ui/button"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"

export default function Navbar() {

	const t = useTranslations("navigation")

	return (
		<nav className='flex w-full justify-between items-center h-26 py-2 px-4 border-b border-separate sticky top-0 backdrop-blur-md bg-transparent'>
			<Link href="/">
				<Button className="text-2xl font-semibold" variant={"link"}>
					{t("title")}
				</Button>
			</Link>

			<Tabs className="w-1/3 mx-auto pr-5">
				<TabsList defaultValue="dashboard" className="grid grid-cols-2">
					<Link href="/dashboard">
						<TabsTrigger value="dashboard" className="w-full">
							{t("dashboard")}
						</TabsTrigger>
					</Link>

					<Link href="/schedule">
						<TabsTrigger value="schedule" className="w-full">
							{t("shifts")}
						</TabsTrigger>
					</Link>
				</TabsList>
			</Tabs>

			<div className='flex flex-row space-x-2'>
				<LanguageSwitcher />
				<ThemeButton />
				<AuthButton />
			</div>
		</nav>
	)
}