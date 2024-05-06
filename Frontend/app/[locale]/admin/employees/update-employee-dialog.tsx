"use client"

import { useState } from "react";

import { useTranslations } from "next-intl";
import Cookies from "js-cookie";

import { updateEmployee } from "@/api/employee/actions";

import { Employee } from "@/api/employee/model"
import { Ambulance } from "@/api/ambulance/model";
import { EmpCategory } from "@/api/empCategory/model";

import { useForm, Controller } from "react-hook-form";

import { cs } from "date-fns/locale";
import { format, parseISO } from "date-fns";

import { DateRange } from "react-day-picker";
import { CalendarIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { formatDateForAPI } from "@/lib/utils";

export default function UpdateEmployeeDialog({
	employee,
	empCategories,
	ambulances
}: {
	employee: Employee,
	empCategories: EmpCategory[] | null,
	ambulances: Ambulance[] | null
}) {

	const t = useTranslations("pages.employees");
	const token = Cookies.get("authToken");

	const {
		control,
		register,
		handleSubmit,
		setValue,
		trigger,
		formState: { isValid },
	} = useForm<Employee>({ defaultValues: employee });

	const [date, setDate] = useState<DateRange | undefined>({
		from: employee.fromLimit ? parseISO(employee.fromLimit as string) : undefined,
		to: employee.toLimit ? parseISO(employee.toLimit as string) : undefined,
	});

	const ambulance_options: Option[] = (ambulances ?? []).map((ambulance) => ({
		label: ambulance.name,
		value: ambulance.ambulanceId.toString(),
	}));

	const day_options: Option[] = [
		{ label: t("monday"), value: "monday" },
		{ label: t("tuesday"), value: "tuesday" },
		{ label: t("wednesday"), value: "wednesday" },
		{ label: t("thursday"), value: "thursday" },
		{ label: t("friday"), value: "friday" },
		{ label: t("saturday"), value: "saturday" },
		{ label: t("sunday"), value: "sunday" },
	];

	const [preferredAmbulances, setPreferredAmbulances]
		= useState<Option[]>(ambulance_options.filter(ambulance => employee.preferredAmbIds.includes(Number(ambulance.value))));

	const [fixedAmbulances, setFixedAmbulances]
		= useState<Option[]>(ambulance_options.filter(ambulance => employee.fixedAmbIds.includes(Number(ambulance.value))));

	const [fixedDays, setFixedDays]
		= useState<Option[]>(day_options.filter(day => employee.fixedDays?.split(",").includes(day.value)));

	const dialogClose = () => {
		document.getElementById("closeDialog")?.click();
	};

	const onSubmit = async (updatedEmployee: Employee) => {

		updatedEmployee.preferredAmbIds = preferredAmbulances.map((option) => Number(option.value));
		updatedEmployee.fixedAmbIds = fixedAmbulances.map((option) => Number(option.value));

		if (fixedDays.length > 0) {
			updatedEmployee.fixedDays = fixedDays.map((option) => option.value).join()
		} else {
			updatedEmployee.fixedDays = null;
		}

		if (date && date.from && date.to) {
			updatedEmployee.fromLimit = formatDateForAPI(date.from);
			updatedEmployee.toLimit = formatDateForAPI(date.to);
		} else {
			updatedEmployee.fromLimit = null;
			updatedEmployee.toLimit = null;
		}

		await updateEmployee(updatedEmployee, token);
		// dialogClose(); // TODO Callbacks
		window.location.reload()
	}

	return (
		<Dialog>
			<DialogTrigger className="w-full text-left font-normal text-sm pl-2 py-1.5 rounded-sm hover:bg-secondary">
				{t("edit")}
			</DialogTrigger>

			<DialogContent>

				<DialogHeader>
					<DialogTitle>{t("editEmployee")}</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
					<div className="flex flew-row justify-between gap-x-2">
						<Input type="text" placeholder={t("firstName")}
							{...register("firstName", { required: true })}
						/>

						<Input type="text" placeholder={t("lastName")}
							{...register("lastName", { required: true })}
						/>
					</div>

					<div className="flex flew-row justify-between gap-x-2">
						<Input type="email" placeholder={t("email")}
							{...register("email", { required: true })}
						/>

						<Input type="text" placeholder={t("phone")}
							{...register("phone", { required: true })}
						/>
					</div>

					<div className="flex flew-row justify-between gap-x-2">
						<Input type="text" placeholder={t("nameCode")}
							{...register("nameCode", { required: true })}
						/>

						<Controller
							control={control}
							name="empCategoryId"
							rules={{ required: true }}
							render={({ field }) => (
								<Select
									value={field.value !== undefined ? field.value.toString() : ""}
									onValueChange={(value) => {
										setValue("empCategoryId", Number(value));
										trigger("empCategoryId");
									}}
								>
									<SelectTrigger>
										<SelectValue placeholder={t("workRole")} />
									</SelectTrigger>

									<SelectContent>
										{empCategories?.map(category => (
											<SelectItem
												key={category.empCategoryId}
												value={String(category.empCategoryId)}
											>
												{category.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
					</div>

					<div className="flex w-full">
						<MultipleSelector className="-mb-2"
							value={preferredAmbulances}
							onChange={setPreferredAmbulances}
							defaultOptions={ambulance_options}
							placeholder={t("preferredAmbulances")}
						/>
					</div>

					<div className="flex w-full">
						<MultipleSelector className="-mb-2"
							value={fixedAmbulances}
							onChange={setFixedAmbulances}
							defaultOptions={ambulance_options}
							placeholder={t("fixedAmbulances")}
						/>
					</div>

					<div className="flex w-full">
						<MultipleSelector className="-mb-2"
							value={fixedDays}
							onChange={setFixedDays}
							defaultOptions={day_options}
							placeholder={t("fixedDays")}
						/>
					</div>

					<div className="flex flex-row justify-between gap-x-2">
						<Popover>
							<PopoverTrigger asChild>
								<Button
									id="date"
									variant={"outline"}
									className="w-1/2 justify-start text-left font-normal text-muted-foreground"
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{date?.from ? (
										date.to ? (
											<>
												{format(date.from, "dd. MM. ")} - {" "}
												{format(date.to, "dd. MM. y")}
											</>
										) : (
											format(date.from, "dd. MM. y")
										)
									) : (
										<span>{t("range")}</span>
									)}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="start">
								<Calendar
									initialFocus
									mode="range"
									locale={cs}
									defaultMonth={date?.from}
									selected={date}
									onSelect={setDate}
									numberOfMonths={2}
								/>
							</PopoverContent>
						</Popover>
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