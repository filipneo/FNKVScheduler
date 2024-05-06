"use client"

import { useEffect, useState } from "react";

import { getAllDepartments } from "@/api/department/actions";
import { getAllAmbulances } from "@/api/ambulance/actions";
import { getAllEmployees } from "@/api/employee/actions";

import { Department } from "@/api/department/model";
import { Ambulance } from "@/api/ambulance/model";
import { Employee } from "@/api/employee/model";

import AddDepartmentDialog from "./create-department-dialog";
import UpdateDepartmentDialog from "./update-department-dialog";
import DeleteDepartmentAlert from "./delete-department-alert";
import Ambulances from "./ambulances";
import AddAmbulanceDialog from "./create-ambulance-dialog";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, User } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

export default function Departments() {

	const [departments, setDepartments] = useState<Department[]>([]);
	const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
	const [employees, setEmployees] = useState<Employee[]>([]);

	async function fetchData() {
		try {
			const ambulancesResponse = await getAllAmbulances();
			setAmbulances(ambulancesResponse);

			const departmentsResponse = await getAllDepartments();
			setDepartments(departmentsResponse);

			const employeesResponse = await getAllEmployees();
			setEmployees(employeesResponse);
		} catch (error) {
			console.error(error);
		}
	}

	const getHeadEmployeeName = (departmentHeadEmpId: number) => {
		const matchingEmployee = employees?.find(employee => departmentHeadEmpId === employee.employeeId);
		return matchingEmployee ? `${matchingEmployee.firstName} ${matchingEmployee.lastName}` : '';
	};

	const handlePostDepartment = (newDepartment: Department) => {
		const updatedDepartments = departments ? [...departments] : [];
		updatedDepartments.push(newDepartment);
		setDepartments(updatedDepartments);
	}

	const handlePostAmbulance = (newAmbulance: Ambulance) => {
		const updatedAmbulances = ambulances ? [...ambulances] : [];
		updatedAmbulances.push(newAmbulance);
		setAmbulances(updatedAmbulances);
	}

	const handlePutDepartment = (updatedDepartment: Department) => {
		const updatedDepartments = departments ? [...departments] : [];
		const index = updatedDepartments.findIndex(
			(department) => department.departmentId === updatedDepartment.departmentId
		);
		if (index !== -1)
			updatedDepartments[index] = updatedDepartment;
		setDepartments(updatedDepartments);
	}

	const handleDeleteDepartment = (deletedDepartmentId: number) => {
		const updatedAmbulanceList = departments?.filter(department => department.departmentId !== deletedDepartmentId);
		if (updatedAmbulanceList !== undefined)
			setDepartments(updatedAmbulanceList);
	}

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<section className="flex flex-col mt-2 space-y-4 lg:w-4/5 mx-auto justify-between">
			{departments?.map((department) => (
				<Card className="w-full" key={department.departmentId}>

					<CardHeader className="flex flex-row justify-between items-center border-b h-16">
						<CardTitle>
							{department.name}
						</CardTitle>

						<div className="flex flex-row gap-x-2 items-center">
							
							{
								department.headEmpId &&

								<div className="flex flex-row items-center gap-x-1 mr-4">
									<User />
									<Label>
										{getHeadEmployeeName(department.headEmpId)}
									</Label>
								</div>
							}
	
							<div className="flex flex-row items-center gap-x-2 mr-4">
								{department.minCap !== null && <Label>Min: {department.minCap}</Label>}
								{department.optCap !== null && <Label>Opt: {department.optCap}</Label>}
								{department.maxCap !== null && <Label>Max: {department.maxCap}</Label>}
							</div>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant={'outline'} size={'icon'}>
										<MoreHorizontal />
									</Button>
								</DropdownMenuTrigger>

								<DropdownMenuContent align="end">

									<DropdownMenuItem
										onClick={(e) => { e.preventDefault(); }}>
										<AddAmbulanceDialog departmentId={department.departmentId} onPost={handlePostAmbulance} />
									</DropdownMenuItem>

									<DropdownMenuItem
										onClick={(e) => { e.preventDefault(); }}>
										<UpdateDepartmentDialog department={department} employees={employees} onPut={handlePutDepartment} />
									</DropdownMenuItem>

									<DropdownMenuSeparator />

									<DropdownMenuItem className="text-red-600"
										onClick={(e) => { e.preventDefault(); }}>
										<DeleteDepartmentAlert departmentId={department.departmentId} onDelete={handleDeleteDepartment} />
									</DropdownMenuItem>

								</DropdownMenuContent>
							</DropdownMenu>

						</div>
					</CardHeader>

					<CardContent>
						<Ambulances key={ambulances?.length} departmentId={department.departmentId} ambulances={ambulances} />
					</CardContent>

				</Card>
			))}

			<div className="flex justify-end !mb-2">
				<AddDepartmentDialog employees={employees} onPost={handlePostDepartment} />
			</div>
		</section>
	)
}