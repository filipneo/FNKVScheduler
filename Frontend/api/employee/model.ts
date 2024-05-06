import { Option } from '@/components/ui/multiple-selector';

export type Employee = {
	employeeId: number,
	firstName: string,
	lastName: string,
	phone: string,
	email: string,
	empCategoryId: number,
	nameCode: string,
	fromLimit: Date | string | null,
	toLimit: Date | string | null,
	preferredAmbIds: number[],
	fixedAmbIds: number[],
	fixedDays: string | null,
	empCategory: {
		empCategoryId: number,
		name: string,
		color: string
	}
}