import { Shift } from "@/api/shift/model";

import { formatDate, partOfTheDayClass, partOfTheDayText } from "@/lib/utils";

import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";

export default function ShiftDetailDialog({ shift }: { shift: Shift }) {

	const t = useTranslations("pages.scheduler.shiftDialog")

	return (
		<Dialog>
			<DialogTrigger asChild className={partOfTheDayClass[shift.partOfTheDay]}>
				{shift.employee?.empCategory ? (
					<div style={{ backgroundColor: shift.employee.empCategory.color }}
						className="inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-sm font-semibold transition-colors cursor-pointer
					hover:bg-opacity-80 text-black"
					>
						{shift.employee.nameCode}
					</div>
				) : (
					<div className="inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-sm font-semibold transition-colors cursor-pointer bg-primary hover:bg-primary/80 text-primary-foreground">
						{shift.employee?.nameCode}
					</div>
				)}
			</DialogTrigger>

			<DialogContent>
				<div className="space-y-2 px-4">
					<div className="flex flex-row gap-x-2 w-full">
						<div className="w-1/2">
							<DialogDescription>{t("name")}</DialogDescription>
							<Label className="text-lg -mt-4">{shift.employee?.firstName} {shift.employee?.lastName}</Label>
						</div>
						<div className="w-1/2">
							<DialogDescription>{t("typeOfShift")}</DialogDescription>
							<Label className="text-lg -mt-4">{t(partOfTheDayText[shift.partOfTheDay])}</Label>
						</div>
					</div>

					<div className="flex flex-row gap-x-2 w-full">
						<div className="w-1/2">
							<DialogDescription>{t("date")}</DialogDescription>
							<Label className="text-lg -mt-4">{formatDate(shift.date as string)}</Label>
						</div>

						{shift.note &&
							<div className="w-1/2">
								<DialogDescription>{t("note")}</DialogDescription>
								<Label className="text-lg -mt-4">{shift.note}</Label>
							</div>
						}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}