import { format } from "date-fns";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Employee } from "@/api/employee/model";
import { Ambulance } from "@/api/ambulance/model";
import { Dialog, DialogContent, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";

export default function EmployeeDetailDialog({ employee, ambulances, trigger }: { employee: Employee, ambulances: Ambulance[] | null, trigger?: string }) {

	const t = useTranslations("pages.employees")

	const getPreferredAmbulanceNames = () => {
		const preferredAmbNames: string[] = [];
		employee.preferredAmbIds.forEach(preferredAmbId => {
			const preferredAmbulance = ambulances?.find(ambulance => ambulance.ambulanceId == preferredAmbId);
			if (preferredAmbulance) {
				preferredAmbNames.push(preferredAmbulance.name);
			}
		});
		return preferredAmbNames.length > 0 ? preferredAmbNames.join(" ") : "N/A";
	};

	const getFixedAmbulanceNames = () => {
		const fixedAmbName: string[] = [];
		employee.fixedAmbIds.forEach(fixedAmbId => {
			const preferredAmbulance = ambulances?.find(ambulance => ambulance.ambulanceId == fixedAmbId);
			if (preferredAmbulance) {
				fixedAmbName.push(preferredAmbulance.name);
			}
		});
		return fixedAmbName.length > 0 ? fixedAmbName.join(", ") : "N/A";
	};


	return (
		<Dialog>

			{trigger

				&&

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
						<Label className="text-lg -mt-4">{employee?.firstName} {employee?.lastName}</Label>
					</div>
					<div className="w-1/2">
						<DialogDescription>{t("nameCode")}</DialogDescription>
						<Label className="text-lg -mt-4">{employee?.nameCode}</Label>
					</div>
				</div>

				<div className="flex flex-row gap-x-2 w-full">
					<div className="w-1/2">
						<DialogDescription>{t("email")}</DialogDescription>
						<Label className="text-lg -mt-4">{employee?.email}</Label>
					</div>
					<div className="w-1/2">
						<DialogDescription>{t("phone")}</DialogDescription>
						<Label className="text-lg -mt-4">{employee?.phone.replace(/(.{3})/g, "$1 ")}</Label>
					</div>
				</div>

				<div className="flex flex-row gap-x-2 w-full">
					<div className="w-1/2">
						<DialogDescription>{t("workRole")}</DialogDescription>
						<Label className="text-lg -mt-4">{employee?.empCategory.name}</Label>
					</div>

					{
						(employee.fromLimit !== employee.toLimit) &&

						<div className="w-1/2">
							<DialogDescription>{t("range")}</DialogDescription>
							<Label className="text-lg -mt-4">
								{format(new Date(employee.fromLimit as string), "dd. MM. ")} - {" "}
								{format(new Date(employee.toLimit as string), "dd. MM. y")}
							</Label>
						</div>
					}
				</div>

				{
					employee.preferredAmbIds.length > 0 &&

					<div>
						<DialogDescription>{t("preferredAmbulances")}</DialogDescription>
						<Label className="text-lg -mt-4">{getPreferredAmbulanceNames()}</Label>
					</div>
				}

				{
					employee.fixedAmbIds.length > 0 &&

					<div>
						<DialogDescription>{t("fixedAmbulances")}</DialogDescription>
						<Label className="text-lg -mt-4">{getFixedAmbulanceNames()}</Label>
					</div>
				}

				{
					employee.fixedDays &&

					<div>
						<DialogDescription>{t("fixedDays")}</DialogDescription>
						<Label className="text-lg -mt-4">
							{
								employee.fixedDays.split(",").map((day, index, array) => (
									<span key={day}>{t(day)}{index !== array.length - 1 && ", "}</span>
								))
							}
						</Label>
					</div>
				}
			</DialogContent>
		</Dialog>
	);
}