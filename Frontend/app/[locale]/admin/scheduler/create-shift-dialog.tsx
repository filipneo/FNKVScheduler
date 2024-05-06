import { Employee } from "@/api/employee/model";
import { Shift } from "@/api/shift/model";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogHeader, DialogContent, DialogFooter, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";

import { useForm, Controller } from "react-hook-form";
import { filterEmployeesByFixedAmbulanceId, formatDateForAPI } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function AddShiftDialog({
	ambulanceId,
	date,
	freeEmployees,
	onCreateShift,
	children
}: {
	ambulanceId: number;
	date: Date;
	freeEmployees: Employee[];
	onCreateShift: (newShift: Shift) => void;
	children?: React.ReactNode
}) {

	const t = useTranslations("pages.scheduler.shiftDialog")

	const {
		control,
		handleSubmit,
		register,
		setValue,
		trigger,
		reset,
		formState: { isValid }
	} = useForm<Shift>();

	const filteredFreeEmployees = filterEmployeesByFixedAmbulanceId(freeEmployees, ambulanceId);

	const onSubmit = async (newShift: Shift) => {
		newShift.date = formatDateForAPI(date);
		newShift.ambulanceId = ambulanceId;
		console.log(newShift);
		onCreateShift(newShift);
		reset()
	};

	return (
		<Dialog>
			<DialogTrigger className="w-full h-full pb-10 grid grid-cols-2 gap-1 p-1 hover:bg-secondary print:pb-1"
				onClick={(event) => event.stopPropagation()}>
				{children}
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("newShift")}</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
					<div className="flex flew-row justify-between gap-x-2">
						<Controller
							control={control}
							name="employeeId"
							rules={{ required: true }}
							render={({ field }) => (
								<Select
									value={field.value !== undefined ? field.value.toString() : ""}
									onValueChange={(value) => {
										setValue("employeeId", Number(value));
										trigger("employeeId")
									}}>
									<SelectTrigger className="w-1/2">
										<SelectValue placeholder={t("employee")} />
									</SelectTrigger>

									<SelectContent>
										<ScrollArea className="h-auto max-h-72 rounded-md">
											{filteredFreeEmployees.map((employee) => (
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

						<Controller
							control={control}
							name="partOfTheDay"
							rules={{ required: true }}
							render={({ field }) => (
								<Select
									value={field.value !== undefined ? field.value.toString() : ""}
									onValueChange={(value) => {
										setValue("partOfTheDay", Number(value));
										trigger("partOfTheDay")
									}}
								>
									<SelectTrigger className="w-1/2">
										<SelectValue placeholder={t("typeOfShift")} />
									</SelectTrigger>

									<SelectContent>
										<SelectItem value="0">{t("morningShift")}</SelectItem>
										<SelectItem value="1">{t("afternoonShift")}</SelectItem>
										<SelectItem value="2">{t("dayShift")}</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
					</div>

					<Input
						className="w--full"
						type="text"
						placeholder={t("note")}
						{...register("note")}
					/>

					<DialogFooter>
						<DialogClose asChild>
							<Button type="submit" disabled={!isValid}>
								{t("create")}
							</Button>
						</DialogClose>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}