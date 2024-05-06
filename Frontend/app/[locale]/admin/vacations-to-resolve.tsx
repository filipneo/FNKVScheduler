import { useTranslations } from "next-intl";
import Cookies from 'js-cookie';

import { updateVacation } from "@/api/vacation/actions";
import { Vacation } from "@/api/vacation/model";

import { formatDate } from "@/lib/utils";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function VacationsToResolve({
	vacationsToResolve,
	onVacationResolution
}: {
	vacationsToResolve: Vacation[]
	onVacationResolution: (resolvedVacationId: number) => void
}) {

	const t = useTranslations("components.vacationsToResolve");
	const authToken = Cookies.get("authToken");

	const handleVacationStateChange = async (vacation: Vacation, newVacatationState: number) => {
		vacation.vacationState = newVacatationState;
		var updatedVacation = await updateVacation(vacation.vacationId, vacation, authToken)
		onVacationResolution(vacation.vacationId);
	}

	return (
		<Card>
			<CardHeader className="flex items-left justify-center border-b h-16">
				<CardTitle>
					{t("title")}
				</CardTitle>
			</CardHeader>

			<CardContent className="flex flex-row gap-x-2 w-full container py-4">
				{vacationsToResolve.map((vacation) => (
					<Card key={vacation.vacationId} className="flex flex-col justify-between">
						<CardHeader>
							{
								(vacation.newEmpName !== null) ?

								<CardTitle className="text-lg">{vacation.newEmpName}</CardTitle>

								:

								<CardTitle className="text-lg">{vacation.employee.firstName} {vacation.employee.lastName}</CardTitle>
							}
						</CardHeader>

						<CardContent className="flex flex-col space-y-2">
							{
								(vacation.from == vacation.to) ?

									<Label>{t("on")}: {formatDate(vacation.from as string)}</Label>

									:

									<>
										<Label>{t("from")}: {formatDate(vacation.from as string)}</Label>
										<Label>{t("to")}: {formatDate(vacation.to as string)}</Label>
									</>
							}
						</CardContent>

						<CardFooter className="gap-x-2">
							<Button size={"sm"}
								onClick={() => handleVacationStateChange(vacation, 0)}>
								{t("approve")}
							</Button>

							<Button size={'sm'} variant={'secondary'}
								onClick={() => handleVacationStateChange(vacation, 1)}>
								{t("deny")}
							</Button>
						</CardFooter>
					</Card>
				))}
			</CardContent>
		</Card>
	)
}