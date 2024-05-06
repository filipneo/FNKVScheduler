import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { CalEvent } from "@/api/calevent/model";
import { format } from "date-fns";
import { Employee } from "@/api/employee/model";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string): string {
	const [year, month, day] = dateStr.split("T")[0].split("-");
	return `${day}.${month}.${year}`;
};

export function getMonday(date: Date): Date {
	const dayOfWeek = date.getDay();
	const mondayDate = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
	const monday = new Date(date.setDate(mondayDate));

	return monday;
};

export function formatDateForAPI(dateToFormat: Date): string {
	const formattedDateString = format(dateToFormat, "yyyy-MM-dd");
	return formattedDateString;
}

export const getEventDayIndexes = (event: CalEvent) => {
	const eventStartDate = new Date(event.from);
	const eventEndDate = new Date(event.to);
	const startDayIndex = (eventStartDate.getDay() + 6) % 7;
	const endDayIndex = (eventEndDate.getDay() + 6) % 7;
	return { start: startDayIndex, end: endDayIndex };
};

export const partOfTheDayClass: Record<number, string> = {
	0: "col-span-1 col-start-1 h-6",
	1: "col-span-1 col-start-2 h-6",
	2: "col-span-2 h-6"
};

export const partOfTheDayText: Record<number, string> = {
	0: "morningShift",
	1: "afternoonShift",
	2: "dayShift"
};

export const filterEmployeesByFixedAmbulanceId = (employees: Employee[], currentAmbulanceId: number): Employee[] => {

	if (!employees) return [];

    return employees.filter(employee => {
        
        if (employee.fixedAmbIds == null || employee.fixedAmbIds.length == 0) return true;
        
        return employee.fixedAmbIds.includes(currentAmbulanceId);
    });
};