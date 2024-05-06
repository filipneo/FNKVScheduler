"use client"

import { useState, useEffect, useMemo } from "react";

import { useTranslations } from "next-intl";
import Cookies from "js-cookie";

import { formatDate } from "@/lib/utils";

import { getAllEmployees } from "@/api/employee/actions";
import { getAllVacations } from "@/api/vacation/actions";
import { getAllEmpCategories } from "@/api/empCategory/actions";

import { Employee } from "@/api/employee/model";
import { Vacation } from "@/api/vacation/model";
import { EmpCategory } from "@/api/empCategory/model";

import { MoreHorizontal } from "lucide-react"

import DetailDialog from "./detail-dialog";
import AddVacationDialog from "./create-vacation-dialog";
import DeleteVacationAlert from "./delete-vacation-alert";
import UpdateVacationDialog from "./update-vacation-dialog";

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const stateText: Record<number, string> = {
	0: "approved",
	1: "denied",
	2: "waiting",
	3: "changed"
};

const stateColors: Record<number, string> = {
	0: "font-semibold text-green-500",
	1: "font-semibold text-red-500",
	2: "font-semibold text-yellow-500",
	3: "font-semibold text-orange-500"
};

export default function VacationPage() {

	const t = useTranslations("pages.vacations");
	const authToken = Cookies.get("authToken");

	async function fetchData() {
		try {
			const response = await getAllEmployees();
			setEmployees(response);
		} catch (error) {
			console.log(error);
		}

		try {
			const response = await getAllVacations(authToken);
			setVacations(response);
		} catch (error) {
			console.log(error);
		}

		try {
			const response = await getAllEmpCategories();
			setEmpCategories(response)
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		fetchData();
	}, []);

	const [employees, setEmployees] = useState<Employee[]>([]);
	const [vacations, setVacations] = useState<Vacation[]>([]);
	const [empCategories, setEmpCategories] = useState<EmpCategory[]>([]);

	const [searchTerm, setSearchTerm] = useState<string>("");
	const [selectedState, setSelectedState] = useState<string>("none");

	const handleVacationDelete = (deletedVacationId: number) => {
		const filteredVacations = vacations.filter((vacation) => vacation.vacationId !== deletedVacationId);
		setVacations(filteredVacations);
		//window.location.reload(); // TODO more elegant way
	};

	var filteredVacations = useMemo(() => {
		if (!vacations) return [];
		const filteredList = vacations.filter((vacation) => {

			const nameMatch =
				vacation.employee?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				vacation.employee?.lastName.toLowerCase().includes(searchTerm.toLowerCase());

			const empCategoryMatch =
				selectedState == "none" || vacation.vacationState === Number(selectedState);

			return nameMatch && empCategoryMatch;
		});

		return filteredList;
	}, [searchTerm, vacations, selectedState]);

	return (
		<main className="flex flex-col lg:w-3/5 mx-auto my-auto justify-between !mb-4">
			<div className="flex flex-row justify-between items-center py-4">
				<div className="flex flex-row gap-x-2 w-1/2">
					<Input
						placeholder={t("searchEmployee")} className="w-2/3"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>

					<Select
						value={selectedState !== "none" ? selectedState : ""}
						onValueChange={(value) => setSelectedState(value)}
					>
						<SelectTrigger className="w-1/3">
							<SelectValue placeholder={t("state")} />
						</SelectTrigger>

						<SelectContent>
							<SelectItem value="0">{t("approved")}</SelectItem>
							<SelectItem value="1">{t("denied")}</SelectItem>
							<SelectItem value="2">{t("waiting")}</SelectItem>
							<SelectItem value="3">{t("changed")}</SelectItem>
							{
								selectedState !== "none" &&

								<>
									<Separator orientation="horizontal" className="my-1" />
									<SelectItem value={"none"} className="text-red-500">{t("cancel")}</SelectItem>
								</>
							}
						</SelectContent>
					</Select>
				</div>

				<AddVacationDialog employees={employees} />
			</div>

			<Card className="p-2">
				<Table>
					<TableHeader>
						<TableRow className="">
							<TableHead className="pl-6">{t("name")}</TableHead>
							<TableHead>{t("from")}</TableHead>
							<TableHead>{t("to")}</TableHead>
							<TableHead>{t("state")}</TableHead>
							<TableHead></TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{filteredVacations.map((vacation) => (
							<TableRow key={vacation.vacationId}>
								{
									vacation.employee !== undefined

									&&

									<TableCell>
										<DetailDialog vacation={vacation}
											trigger={`${vacation.employee.firstName} ${vacation.employee.lastName}`} />
									</TableCell>

									||

									<TableCell>
										<DetailDialog vacation={vacation}
											trigger={`${vacation.newEmpName}`} />
									</TableCell>
								}
								<TableCell>{formatDate(vacation.from as string)}</TableCell>
								<TableCell>{formatDate(vacation.to as string)}</TableCell>
								<TableCell>
									<UpdateVacationDialog
										vacation={vacation}
										triggerText={stateText[vacation.vacationState]}
										triggerClasses={stateColors[vacation.vacationState]}
									/>
								</TableCell>
								<TableCell>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant={"ghost"} size={"icon"}>
												<MoreHorizontal />
											</Button>
										</DropdownMenuTrigger>

										<DropdownMenuContent align="end">
											<DropdownMenuItem onClick={(e) => { e.preventDefault(); }}>
												<DetailDialog vacation={vacation} />
											</DropdownMenuItem>

											<DropdownMenuItem asChild onClick={(e) => { e.preventDefault(); }}>
												<UpdateVacationDialog vacation={vacation} />
											</DropdownMenuItem>

											<DropdownMenuSeparator />

											<DropdownMenuItem onClick={(e) => { e.preventDefault(); }}>
												<DeleteVacationAlert vacationId={vacation.vacationId} onDelete={handleVacationDelete} />
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Card>
		</main >
	)
}