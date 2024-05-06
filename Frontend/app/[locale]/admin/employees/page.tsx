"use client"

import { useState, useEffect, useMemo } from "react";

import { useTranslations } from "next-intl";

import { Employee } from "@/api/employee/model"
import { EmpCategory } from "@/api/empCategory/model";
import { Ambulance } from "@/api/ambulance/model";

import { getAllEmployees } from "@/api/employee/actions"
import { getAllEmpCategories } from "@/api/empCategory/actions";
import { getAllAmbulances } from "@/api/ambulance/actions";

import { MoreHorizontal } from "lucide-react"

import EmployeeDetailDialog from "./employee-detail-dialog"
import CreateEmployeeDialog from "./create-employee-dialog"
import UpdateEmployeeDialog from "./update-employee-dialog"
import DeleteEmployeeAlert from "./delete-employee-alert";
import EmpCategoryDialog from "./empcategory-dialog"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function EmployeesPage() {

	const t = useTranslations("pages.employees");

	async function fetchData() {
		try {
			const response = await getAllEmployees();
			setEmployees(response);
		} catch (error) {
			console.log(error);
		}

		try {
			const response = await getAllAmbulances();
			setAmbulances(response);
		} catch (error) {
			console.log(error);
		}

		try {
			const response = await getAllEmpCategories();
			setEmpCategories(response);
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		fetchData();
	}, []);

	const [employees, setEmployees] = useState<Employee[]>([]);
	const [empCategories, setEmpCategories] = useState<EmpCategory[]>([]);
	const [ambulances, setAmbulances] = useState<Ambulance[]>([])

	var [searchTerm, setSearchTerm] = useState<string>("");
	var [selectedEmpCategory, setSelectedEmpCategory] = useState<string>("none");

	const handleDeleteEmployee = (deletedEmployeeId: number) => {
		const filteredEmployees = employees.filter((employee) => employee.employeeId !== deletedEmployeeId);
		setEmployees(filteredEmployees);
		window.location.reload(); // TODO more elegant way
	};

	var filteredEmployees = useMemo(() => {
		const filteredList = employees.filter((employee) => {

			const nameMatch =
				employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				employee.lastName.toLowerCase().includes(searchTerm.toLowerCase());

			const empCategoryMatch =
				selectedEmpCategory == "none" || employee.empCategoryId === Number(selectedEmpCategory);

			return nameMatch && empCategoryMatch
		});

		return filteredList;
	}, [searchTerm, employees, selectedEmpCategory]);

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
						value={selectedEmpCategory !== "none" ? selectedEmpCategory : ""}
						onValueChange={(value) => setSelectedEmpCategory(value)}
					>
						<SelectTrigger className="w-1/3">
							<SelectValue placeholder={t("workRole")} />
						</SelectTrigger>

						<SelectContent>
							{empCategories.map(category => (
								<SelectItem
									key={category.empCategoryId}
									value={String(category.empCategoryId)}
								>
									{category.name}
								</SelectItem>
							))}
							{
								selectedEmpCategory !== "none" &&

								<>
									<Separator orientation="horizontal" className="my-1" />
									<SelectItem value={"none"} className="text-red-500">{t("cancel")}</SelectItem>
								</>
							}
						</SelectContent>
					</Select>
				</div>

				<div className="flex flex-row gap-x-2">
					<EmpCategoryDialog empCategories={empCategories} />
					<CreateEmployeeDialog empCategories={empCategories} ambulances={ambulances} />
				</div>
			</div>

			<Card className="p-2">
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-white dark:hover:bg-black">
							<TableHead className="pl-6">{t("name")}</TableHead>
							<TableHead>{t("email")}</TableHead>
							<TableHead>{t("nameCode")}</TableHead>
							<TableHead>{t("workRole")}</TableHead>
							<TableHead></TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{filteredEmployees.map((employee) => (
							<TableRow key={employee.employeeId}>
								<TableCell>
									<Button variant={"ghost"} asChild>
										<EmployeeDetailDialog employee={employee} ambulances={ambulances} trigger={`${employee.firstName} ${employee.lastName}`} />
									</Button>
								</TableCell>
								<TableCell>{employee.email}</TableCell>
								<TableCell>{employee.nameCode}</TableCell>
								<TableCell>{employee.empCategory.name}</TableCell>
								<TableCell>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant={"ghost"} size={"icon"}>
												<MoreHorizontal />
											</Button>
										</DropdownMenuTrigger>

										<DropdownMenuContent align="end">
											<DropdownMenuItem
												onClick={(e) => { e.preventDefault(); }}>
												<EmployeeDetailDialog employee={employee} ambulances={ambulances} />
											</DropdownMenuItem>

											<DropdownMenuItem asChild
												onClick={(e) => { e.preventDefault(); }}>
												<UpdateEmployeeDialog employee={employee} empCategories={empCategories}  ambulances={ambulances}/>
											</DropdownMenuItem>

											<DropdownMenuItem
												onClick={() => {
													navigator.clipboard.writeText(employee.email)
												}}>
												{t("copyEmail")}
											</DropdownMenuItem>

											<DropdownMenuSeparator />

											<DropdownMenuItem
												onClick={(e) => { e.preventDefault(); }}>
												<DeleteEmployeeAlert employeeId={employee.employeeId} onDelete={handleDeleteEmployee} />
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