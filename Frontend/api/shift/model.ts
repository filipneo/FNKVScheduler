import { Ambulance } from "../ambulance/model";
import { Employee } from "../employee/model";

export type Shift = {
	shiftId: number;
	partOfTheDay: number;
	date: Date | string;
	note: string;
	employeeId: number;
	ambulanceId: number;
	ambulance?: Ambulance;
	employee?: Employee;
}