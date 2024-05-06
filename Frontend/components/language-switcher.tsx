'use client';

import { useRouter, usePathname } from '@/navigation';
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Languages } from 'lucide-react';


export default function LanguageSwitcher() {
	const router = useRouter();
	const pathname = usePathname();

	const langSwitch = (lang: string) => {
		router.push(pathname, { locale: lang });
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<Languages className='p-0.5 transition-all rotate'/>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => langSwitch("cs")}>
					Čeština
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => langSwitch("en")}>
					English
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}