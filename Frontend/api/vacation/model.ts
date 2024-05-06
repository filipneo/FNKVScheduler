import { Employee } from "../employee/model"

export type Vacation = {
	vacationId: number,
	from: Date| string,
	to: Date | string,
	note: string,
	vacationState: number,
	employeeId: number,
	employee: Employee,
	newEmpName: string,
}