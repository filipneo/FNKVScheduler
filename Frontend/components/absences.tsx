import { useTranslations } from "next-intl";
import { Vacation } from "@/api/vacation/model";
import { EmpCategory } from "@/api/empCategory/model";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { addDays, isWithinInterval } from "date-fns";

export default function Absences({
	mondayDate,
	empCategories,
	absences
}: {
	mondayDate: Date;
	empCategories: EmpCategory[] | undefined;
	absences: Vacation[];
}) {
	const t = useTranslations("components.absences");

	const cellClasses = "flex flex-col space-y-2 border-r p-2";

	return (
		<Card>
			<CardHeader className="justify-center items-center pt-2 pb-0">
				<CardTitle className="text-lg">{t("absences")}</CardTitle>
			</CardHeader>

			<CardContent className="flex flex-col pt-2 pb-0 px-0">
				{empCategories?.map((category) => (
					<section key={category.empCategoryId} className="divide-y w-full grid grid-cols-8 grid-rows-1">
						<div className="flex flex-col h-14 min-h-full items-center justify-center border-r border-t">
							<Label className="font-semibold text-md">{category.name}</Label>
						</div>
						{[0, 1, 2, 3, 4, 5, 6]
						.map((day) => {
							const targetDate = addDays(mondayDate, day);
							return (
								<div key={day} className={cellClasses}>
									{absences
									.filter((absence) => absence.employee.empCategoryId === category.empCategoryId &&
										isWithinInterval(targetDate, {
											start: new Date(absence.from),
											end: addDays(new Date(absence.to), 1)
										}))
									.map((vacation) => (
										<Label key={vacation.vacationId}>{vacation.employee.firstName} {vacation.employee.lastName}</Label>
									))}
								</div>
							);
						})}
					</section>
				))}
			</CardContent>
		</Card>
	);
}
