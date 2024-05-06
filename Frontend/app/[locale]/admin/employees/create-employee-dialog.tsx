"use client"

import { useState } from "react";

import { useTranslations } from "next-intl";
import Cookies from "js-cookie";

import { Employee } from "@/api/employee/model";
import { EmpCategory } from "@/api/empCategory/model";
import { Ambulance } from "@/api/ambulance/model";
import { createEmployee } from "@/api/employee/actions"

import { useForm, Controller } from "react-hook-form";
import { DateRange } from "react-day-picker";

import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { formatDateForAPI } from "@/lib/utils";

import { CalendarIcon, ChevronDown, UserPlus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogHeader, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";

export default function CreateEmployeeDialog({ empCategories, ambulances }: { empCategories: EmpCategory[] | null, ambulances: Ambulance[] | null }) {

	const t = useTranslations("pages.employees");
	const token = Cookies.get("authToken");

	const d = useTranslations("pages.scheduler")

	const {
		control,
		handleSubmit,
		register,
		setValue,
		trigger,
		reset,
		formState: { isValid }
	} = useForm<Employee>();

	const [date, setDate] = useState<DateRange | undefined>({
		from: undefined,
		to: undefined,
	})

	const [preferredAmbulances, setPreferredAmbulances] = useState<Option[]>([]);
	const [fixedAmbulances, setFixedAmbulances] = useState<Option[]>([]);
	const [fixedDays, setFixedDays] = useState<Option[]>([]);

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

	const onSubmit = async (newEmployee: Employee) => {
		if (date?.from && date?.to) {
			newEmployee.fromLimit = formatDateForAPI(date.from)
			newEmployee.toLimit = formatDateForAPI(date.to)
		}

		newEmployee.preferredAmbIds = preferredAmbulances.map((option) => Number(option.value));
		newEmployee.fixedAmbIds = fixedAmbulances.map((option) => Number(option.value));

		if (fixedDays.length > 0) {
			newEmployee.fixedDays = fixedDays.map((option) => option.value).join()
		} else {
			newEmployee.fixedDays = null;
		}

		await createEmployee(newEmployee, token);
		//reset();
		window.location.reload(); // TODO more elegant way
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="default">
					<UserPlus />
				</Button>
			</DialogTrigger>

			<DialogContent>

				<DialogHeader>
					<DialogTitle>
						{t("newEmployee")}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
					<div className="flex flex-row justify-between gap-x-2">
						<Input
							type="text"
							placeholder={t("firstName")}
							{...register("firstName", { required: true })}
						/>

						<Input
							type="text"
							placeholder={t("lastName")}
							{...register("lastName", { required: true })}
						/>
					</div>

					<div className="flex flex-row justify-between gap-x-2">
						<Input
							type="email"
							placeholder={t("email")}
							{...register("email", { required: true })}
						/>

						<Input
							type="text"
							placeholder={t("phone")}
							{...register("phone", { required: true })}
						/>
					</div>

					<div className="flex flex-row justify-between gap-x-2">
						<Input
							type="text"
							placeholder={t("nameCode")}
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
							<PopoverTrigger asChild >
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
									defaultMonth={new Date()}
									selected={date}
									onSelect={setDate}
									numberOfMonths={2}
								/>
							</PopoverContent>
						</Popover>
					</div>

					<DialogFooter>
						<Button type="submit" disabled={!isValid}>
							{t("create")}
						</Button>
					</DialogFooter>
				</form>

			</DialogContent>
		</Dialog>
	);
}