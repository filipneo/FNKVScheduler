import { useTranslations } from "next-intl";

import { Vacation } from "@/api/vacation/model";

import { formatDate } from "@/lib/utils";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTrigger } from "@/components/ui/dialog";

export default function DetailDialog({ vacation, trigger }: { vacation: Vacation, trigger?: string }) {

	const t = useTranslations("pages.vacations");

	const stateText: Record<number, string> = {
		0: 'approved',
		1: 'denied',
		2: 'waiting',
		3: 'changed'
	};

	return (
		<Dialog>
			{
				trigger &&

				<DialogTrigger className="text-left font-normal" asChild>
					<Button variant={'ghost'} className="-m-1">
						{trigger}
					</Button>
				</DialogTrigger>

				||

				<DialogTrigger className="w-full text-left">
					Detail
				</DialogTrigger>
			}

			<DialogContent>
				<div className="flex flex-row gap-x-2 w-full">
					<div className="w-1/2">
						<DialogDescription>{t("name")}</DialogDescription>
						<Label className="text-lg -mt-4">{vacation.employee?.firstName} {vacation.employee.lastName}</Label>
					</div>
					<div className="w-1/2">
						<DialogDescription>{t("state")}</DialogDescription>
						<Label className="text-lg -mt-4">{t(stateText[vacation.vacationState])}</Label>
					</div>
				</div>

				<div className="flex flex-row gap-x-2 w-full">
					<div className="w-1/2">
						<DialogDescription>{t("from")}</DialogDescription>
						<Label className="text-lg -mt-4">{formatDate(vacation?.from as string)}</Label>
					</div>
					<div className="w-1/2">
						<DialogDescription>{t("to")}</DialogDescription>
						<Label className="text-lg -mt-4">{formatDate(vacation?.to as string)}</Label>
					</div>
				</div>

				{
					vacation.note !== "" &&

					<div className="w-full">
						<DialogDescription>{t("note")}</DialogDescription>
						<Label className="text-lg -mt-4">{vacation.note}</Label>
					</div>
				}
			</DialogContent>
		</Dialog>
	)
}