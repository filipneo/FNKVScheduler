"use client"

import { useState } from "react";

import { Employee } from "@/api/employee/model"
import { Vacation } from "@/api/vacation/model";
import { requestVacation } from "@/api/vacation/actions";

import { Controller, useForm } from "react-hook-form";
import { DateRange } from "react-day-picker";

import { cs } from "date-fns/locale"
import { format } from "date-fns";
import { CalendarIcon, PlusCircle } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogHeader, DialogContent, DialogFooter, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { formatDateForAPI } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function RequestVacationDialog({ employees }: { employees: Employee[] | null }) {

	const t = useTranslations("components.requestVacationDialog");

	const [date, setDate] = useState<DateRange | undefined>({
		from: undefined,
		to: undefined
	})

	const {
		control,
		register,
		setValue,
		trigger,
		handleSubmit,
		reset,
		formState: { isValid },
	} = useForm<Vacation>();

	const onSubmit = async (newVacation: Vacation) => {
		if (date?.from !== undefined && date?.to !== undefined) {
			newVacation.from = formatDateForAPI(date.from);
			newVacation.to = formatDateForAPI(date.to);
		}

		console.log(newVacation);
		await requestVacation(newVacation);
		reset()
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="font-semibold">
					<PlusCircle className="mr-2" />
					{t("trigger")}
				</Button>
			</DialogTrigger>

			<DialogContent>

				<DialogHeader>
					<DialogTitle>
						{t("title")}
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
										<span>{t("dateInput")}</span>
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
							name="employeeId"
							rules={{ required: true }}
							render={({ field }) => (
								<Select
									value={field.value !== undefined ? field.value.toString() : ""}
									onValueChange={(value) => {
										setValue("employeeId", Number(value));
										trigger("employeeId")
									}}>

									<SelectTrigger className="w-2/5">
										<SelectValue placeholder={t("employeeSelect")} />
									</SelectTrigger>

									<SelectContent className="h-auto max-h-72">
										{
											employees?.map((employee) => (
												<SelectItem key={String(employee.employeeId)} value={String(employee.employeeId)}>{employee.firstName} {employee.lastName}</SelectItem>
											))
										}
									</SelectContent>
								</Select>
							)}
						/>
					</div>

					<Input className="w-full" type='text' placeholder={t("noteInput")}
						{...register('note')}
					/>

					<DialogFooter>
						<DialogClose>
							<Button type="submit" disabled={(!date || !date.from || !date.to || !isValid)}>
								{t("submitButton")}
							</Button>
						</DialogClose>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}