import { useTranslations } from "next-intl";
import Cookies from "js-cookie";

import { useForm, Controller } from "react-hook-form";

import { Department } from "@/api/department/model";
import { Employee } from "@/api/employee/model";
import { createDepartment } from "@/api/department/actions";

import { Plus } from "lucide-react"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogHeader, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function AddDepartmentDialog({ employees, onPost }: { employees: Employee[], onPost: (newDepartment: Department) => void }) {

	const t = useTranslations("pages.departments");
	const authToken = Cookies.get("authToken");

	const {
		control,
		register,
		setValue,
		trigger,
		handleSubmit,
		reset,
		formState: { isValid }
	} = useForm<Department>();

	const dialogClose = () => {
		document.getElementById('closeDialog')?.click();
	};

	const onSubmit = async (newDepartment: Department) => {
		// Removing empty string fields from the payload
		const payload = {
			...newDepartment,
			/** @ts-expect-error */
			minCap: newDepartment.minCap !== "" ? Number(newDepartment.minCap) : null,
			/** @ts-expect-error */
			optCap: newDepartment.optCap !== "" ? Number(newDepartment.optCap) : null,
			/** @ts-expect-error */
			maxCap: newDepartment.maxCap !== "" ? Number(newDepartment.maxCap) : null
		};
	
		console.log(payload);
		var responseDepartment = await createDepartment(payload, authToken);
		onPost(responseDepartment);
		reset();
		dialogClose();
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="gap-x-2 items-center">
					<Plus />
					{t("addDepartment")}
				</Button>
			</DialogTrigger>

			<DialogContent>

				<DialogHeader>
					<DialogTitle>
						{t("newDepartment")}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className='space-y-4 mt-4'>
					<div className="flex flew-row justify-between gap-x-2">
						<Input type='text' placeholder={t("name")}
							{...register('name', { required: true })}
						/>

						<Controller
							control={control}
							name="headEmpId"
							render={({ field }) => (
								<Select
									value={field.value?.toString()}
									onValueChange={(value) => {
										setValue("headEmpId", Number(value));
										trigger("headEmpId");
									}}>
									<SelectTrigger>
										<SelectValue placeholder={t("headEmployee")} />
									</SelectTrigger>

									<SelectContent>
										<ScrollArea className="h-auto max-h-72 rounded-md">
											{employees?.map((employee) => (
												<SelectItem
													key={employee.employeeId}
													value={String(employee.employeeId)}
												>
													<div className="flex flex-row items-center gap-x-2">
														<div style={{ backgroundColor: employee.empCategory.color }} className="rounded-full w-3 h-3" />
														<p>{employee.firstName} {employee.lastName}</p>
													</div>
												</SelectItem>
											))}
										</ScrollArea>
									</SelectContent>
								</Select>
							)}
						/>
					</div>

					<div className="flex flew-row justify-between gap-x-2">

						<Input type='number' placeholder="Min"
							{...register('minCap')}
						/>

						<Input type='number' placeholder="Opt"
							{...register('optCap')}
						/>

						<Input type='number' placeholder="Max"
							{...register('maxCap')}
						/>

					</div>

					<DialogFooter>
						<Button type="submit" disabled={!isValid}>
							{t("create")}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}