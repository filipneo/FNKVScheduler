import { useTranslations } from "next-intl";
import Cookies from "js-cookie";

import { updateDepartment } from "@/api/department/actions";
import { Department } from "@/api/department/model";
import { Employee } from "@/api/employee/model";
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogHeader,
	DialogContent,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { Controller, useForm } from "react-hook-form";

export default function UpdateDepartmentDialog({
	department,
	employees,
	onPut
}: {
	department: Department,
	employees: Employee[],
	onPut: (updatedDepartment: Department) => void
}) {

	const t = useTranslations("pages.departments");
	const authToken = Cookies.get("authToken");

	const {
		control,
		register,
		handleSubmit,
		setValue,
		trigger,
		formState: { isValid }
	} = useForm<Department>({ defaultValues: department });

	const dialogClose = () => {
		document.getElementById('closeDialog')?.click();
	};

	const onSubmit = async (updatedDepartment: Department) => {
		updatedDepartment.departmentId = department.departmentId

		const payload = {
			...updatedDepartment,
			/** @ts-expect-error */
			minCap: updatedDepartment.minCap !== "" ? Number(updatedDepartment.minCap) : null,
			/** @ts-expect-error */
			optCap: updatedDepartment.optCap !== "" ? Number(updatedDepartment.optCap) : null,
			/** @ts-expect-error */
			maxCap: updatedDepartment.maxCap !== "" ? Number(updatedDepartment.maxCap) : null
		};

		var responseDepartment = await updateDepartment(payload, authToken);
		onPut(responseDepartment)
		dialogClose();
	}

	return (
		<Dialog>
			<DialogTrigger className="w-full text-left">
				{t("edit")}
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{t("editDepartment")}
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
									value={field.value ? field.value.toString() : undefined}
									onValueChange={(value) => {
										setValue("headEmpId", (value !== "" && value !== "none") ? Number(value) : null);
										trigger("headEmpId");
									}}>
									<SelectTrigger>
										{
											department.headEmpId &&

											<SelectValue />

											||

											<SelectValue placeholder={t("headEmployee")} />
										}
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
										{
											department.headEmpId &&

											<>
												<Separator orientation="horizontal" className="my-1" />

												<SelectItem value={"none"}>
													{t("noHeadEmployee")}
												</SelectItem>
											</>
										}
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
						<Button type="submit" disabled={!isValid}
							onClick={handleSubmit(onSubmit)}>
							{t("save")}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}