"use client"

import { useState } from "react";

import { useTranslations } from "next-intl";
import Cookies from 'js-cookie';

import { Employee } from "@/api/employee/model"
import { Vacation } from "@/api/vacation/model";
import { createVacation } from "@/api/vacation/actions";

import { cs } from "date-fns/locale"
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { formatDateForAPI } from "@/lib/utils"
import { Controller, useForm } from "react-hook-form";

import { CalendarIcon, PlusCircle } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogHeader, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function AddVacationDialog({ employees }: { employees: Employee[] | null }) {

	const t = useTranslations("pages.vacations");
	const authToken = Cookies.get("authToken");


	const [date, setDate] = useState<DateRange | undefined>({
		from: undefined,
		to: undefined
	})

	const {
		control,
		register,
		setValue,
		handleSubmit,
		trigger,
		reset,
		formState: { isValid },
	} = useForm<Vacation>();

	const onSubmit = async (newVacation: Vacation) => {
		if (date?.from && date?.to) {
			newVacation.from = formatDateForAPI(date.from);
			newVacation.to = formatDateForAPI(date.to);
		}

		console.log(newVacation);
		await createVacation(newVacation, authToken);
		reset();
		window.location.reload(); // TODO more elegant way
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="default" className="px-3">
					<PlusCircle size={28} />
				</Button>
			</DialogTrigger>

			<DialogContent>

				<DialogHeader>
					<DialogTitle>
						{t("newVacation")}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className='space-y-4 mt-4'>

					<div className="flex flew-row justify-between gap-x-2">
						<Popover>
							<PopoverTrigger asChild>
								<Button
									id="date"
									variant={"outline"}
									className="w-3/5 justify-start text-left font-normal"
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{date?.from ? (
										date.to ? (
											<>
												{format(date.from, "dd. MM. y")} - {" "}
												{format(date.to, "dd. MM. y")}
											</>
										) : (
											format(date.from, "dd. MM. y")
										)
									) : (
										<span>{t("chooseVacationPeriod")}</span>
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

						<Controller
							control={control}
							name="vacationState"
							rules={{ required: true }}
							render={({ field }) => (
								<Select
									value={field.value !== undefined ? field.value.toString() : ""}
									onValueChange={(value) => {
										setValue("vacationState", Number(value));
										trigger("vacationState");
									}}>
									<SelectTrigger className="w-2/5">
										<SelectValue placeholder={t("state")} />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="0">{t("approved")}</SelectItem>
										<SelectItem value="1">{t("denied")}</SelectItem>
										<SelectItem value="2">{t("waiting")}</SelectItem>
										<SelectItem value="3">{t("changed")}</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
					</div>

					<div className="flex flex-row justify-between gap-x-2">
						<Controller
							control={control}
							name="employeeId"
							rules={{ required: true }}
							render={({ field }) => (
								<Select
									value={field.value !== undefined ? field.value.toString() : ""}
									onValueChange={(value) => {
										setValue("employeeId", Number(value));
										trigger("employeeId");
									}}>
									<SelectTrigger className="w-2/5">
										<SelectValue placeholder={t("employee")} />
									</SelectTrigger>
									<SelectContent className="h-auto max-h-72">
											{
												employees?.map((employee) => (
													<SelectItem
														key={employee.employeeId} value={employee.employeeId.toString()}>
														{employee.firstName} {employee.lastName}
													</SelectItem>
												))
											}
									</SelectContent>
								</Select>
							)}
						/>

						<Input className="w-3/5" type='text' placeholder={t("note")}
							{...register('note')}
						/>
					</div>

					<DialogFooter>
						<Button type="submit" disabled={(!date || !date.from || !date.to || !isValid)}>
							{t("create")}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}