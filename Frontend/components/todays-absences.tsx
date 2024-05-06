import { EmpCategory } from "@/api/empCategory/model";
import { Vacation } from "@/api/vacation/model";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function TodaysAbsences({ absences, empCategories }: { absences: Vacation[], empCategories: EmpCategory[] }) {

	const t = useTranslations("components.absences")

	return (
		<Card>
			<CardHeader className="flex items-left justify-center border-b h-16">
				<CardTitle>
					{t("todaysAbsences")}
				</CardTitle>
			</CardHeader>

			<CardContent className="py-4 container flex flex-row space-x-2">
				{
					absences.length > 0 &&

					empCategories.map((category) => {
						const filteredAbsences = absences?.filter((absence) => absence.employee.empCategoryId === category.empCategoryId);

						return (
							<Card key={category.empCategoryId} className="w-full">
								<CardHeader className="border-b py-4">
									<CardTitle className="text-xl">
										{category.name}
									</CardTitle>
								</CardHeader>

								<CardContent className="flex flex-col mt-4 space-y-2">
									{
										filteredAbsences?.map((absence) => (
											<label key={absence.vacationId}>{absence.employee.firstName} {absence.employee.lastName}</label>
										))
									}
								</CardContent>
							</Card>
						);
					})

					||

					<CardDescription className="text-md">
						{t("noAbsences")}
					</CardDescription>
				}
			</CardContent>
		</Card>
	);
}
