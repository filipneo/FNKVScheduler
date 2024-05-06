import { useTranslations } from "next-intl";


import ModeToggle from '@/components/theme-button'
import LanguageSwitcher from "@/components/language-switcher";

import { Stethoscope, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Link } from "@/navigation";

export default function Home() {

	const t = useTranslations("pages.root")

	return (
		<section>
			<div className='flex justify-between items-center p-2 border-b'>
				<div className='w-10' />

				<Label className="text-2xl font-semibold">
					<h1>{t("title")}</h1>
				</Label>

				<div className="flex flex-row space-x-2">
					<LanguageSwitcher />
					<ModeToggle />
				</div>
			</div>

			<div className="h-screen -mt-20 flex flex-row w-2/3 mx-auto justify-between items-center">
				<Link href="/dashboard">
					<Button variant={"secondary"} className='w-96 h-72'>
						<div className='flex flex-col items-center space-y-4'>
							<Stethoscope size={"90"} />
							<Label className='text-lg font-semibold'>{t("link.user")}</Label>
						</div>
					</Button>
				</Link>

				<Link href="/auth">
					<Button variant={"secondary"} className='w-96 h-72'>
						<div className='flex flex-col items-center space-y-4'>
							<User size={"90"} />
							<Label className='text-lg font-semibold'>{t("link.admin")}</Label>
						</div>
					</Button>
				</Link>
			</div>
		</section>
	)
}