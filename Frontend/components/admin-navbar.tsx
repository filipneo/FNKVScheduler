import { useTranslations } from 'next-intl';

import { Link } from '@/navigation';
import ThemeButton from './theme-button';
import LogoutButton from './logout-button';
import LanguageSwitcher from './language-switcher';

import { Label } from "./ui/label";
import { Users } from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminNavbar() {
	const t = useTranslations("navigation");

	const tabTriggerClasses = "lg:w-48 w-auto";

	return (
		<nav className='flex w-full justify-between items-center h-26 py-2 px-4 border-b border-separate sticky top-0 backdrop-blur-md bg-transparent'>
			<div className='flex items-center'>
				<Label className="text-2xl font-semibold whitespace-nowrap">
					{t("title")}
				</Label>
			</div>

			<div className='absolute left-1/2 transform -translate-x-1/2'>
				<Tabs className="w-auto">
					<TabsList defaultValue="admin" className="flex">
						<Link href="/admin">
							<TabsTrigger value="admin" className={tabTriggerClasses}>
								{t("dashboard")}
							</TabsTrigger>
						</Link>

						<Link href="/admin/scheduler">
							<TabsTrigger value="scheduler" className={tabTriggerClasses}>
								{t("shifts")}
							</TabsTrigger>
						</Link>

						<Link href="/admin/employees">
							<TabsTrigger value="employees" className={tabTriggerClasses}>
								{t("admin.employees")}
							</TabsTrigger>
						</Link>

						<Link href="/admin/departments">
							<TabsTrigger value="departments" className={tabTriggerClasses}>
								{t("admin.departments")}
							</TabsTrigger>
						</Link>

						<Link href="/admin/vacations">
							<TabsTrigger value="vacations" className={tabTriggerClasses}>
								{t("admin.vacations")}
							</TabsTrigger>
						</Link>
					</TabsList>
				</Tabs>
			</div>

			<div className='flex items-center gap-x-2'>
				<LanguageSwitcher />
				<ThemeButton />
				<Link href="/admin/users">
					<Button variant="outline" size="icon">
						<Users className="p-0.5" />
					</Button>
				</Link>
				<LogoutButton />
			</div>
		</nav>
	);
}
