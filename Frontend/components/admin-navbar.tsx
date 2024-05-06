import { useTranslations } from 'next-intl'

import { Link } from '@/navigation'

import ThemeButton from './theme-button'
import LogoutButton from './logout-button'
import LanguageSwitcher from './language-switcher'

import { Label } from "./ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminNavbar() {

	const t = useTranslations("navigation")

	return (
		<nav className='flex w-full justify-between items-center h-26 py-2 px-4 border-b border-separate sticky top-0 backdrop-blur-md bg-transparent'>
			<Label className="text-2xl font-semibold whitespace-nowrap">
				{t("title")}
			</Label>

			<Tabs className="w-3/5 mx-auto pr-5">

				<TabsList defaultValue="admin" className="grid grid-cols-5">

					<Link href="/admin">
						<TabsTrigger value="admin" className="w-full">
							{t("dashboard")}
						</TabsTrigger>
					</Link>

					<Link href="/admin/scheduler">
						<TabsTrigger value="scheduler" className="w-full">
							{t("shifts")}
						</TabsTrigger>
					</Link>

					<Link href="/admin/employees">
						<TabsTrigger value="employees" className="w-full">
							{t("admin.employees")}
						</TabsTrigger>
					</Link>

					<Link href="/admin/departments">
						<TabsTrigger value="departments" className="w-full">
							{t("admin.departments")}
						</TabsTrigger>
					</Link>

					<Link href="/admin/vacations">
						<TabsTrigger value="vacations" className="w-full">
							{t("admin.vacations")}
						</TabsTrigger>
					</Link>

				</TabsList>

			</Tabs>

			<div className='flex flex-row gap-x-2'>
				<LanguageSwitcher />
				<ThemeButton />
				<LogoutButton />
			</div>
		</nav>
	)
}