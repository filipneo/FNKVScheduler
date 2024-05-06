"use client"

import { useState } from "react";

import { useTranslations } from "next-intl";
import Cookies from "js-cookie";

import { Vacation } from "@/api/vacation/model";
import { updateVacation } from "@/api/vacation/actions";

import { cs } from 'date-fns/locale';
import { format, parseISO } from "date-fns"
import { formatDateForAPI } from "@/lib/utils";

import { DateRange } from "react-day-picker";
import { Controller, useForm } from "react-hook-form";

import { CalendarIcon } from "lucide-react";

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogHeader, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


export default function UpdateVacationDialog({ vacation, triggerText, triggerClasses }: { vacation: Vacation, triggerText?: string, triggerClasses?: string }) {

	const t = useTranslations("pages.vacations");
	const authToken = Cookies.get("authToken");

	const [date, setDate] = useState<DateRange | undefined>({
		from: parseISO(vacation.from as string),
		to: parseISO(vacation.to as string)
	})

	const {
		control,
		register,
		setValue,
		handleSubmit,
		trigger,
		reset,
		formState: { isValid },
	} = useForm<Vacation>({ defaultValues: vacation });

	const dialogClose = () => {
		document.getElementById('closeDialog')?.click();
	};

	const onSubmit = async (updatedVacation: Vacation) => {
		if (date?.from && date?.to) {
			updatedVacation.from = formatDateForAPI(date.from);
			updatedVacation.to = formatDateForAPI(date.to);
		}
		await updateVacation(vacation.vacationId, updatedVacation, authToken);
		window.location.reload(); // TODO more elegant way
	}

	return (
		<Dialog>
			{
				triggerText &&

				<DialogTrigger className="text-left font-normal" asChild>
					<Button variant={'ghost'} className={`-m-1 ${triggerClasses}`}>
						{t(triggerText)}
					</Button>
				</DialogTrigger>

				||

				<DialogTrigger className="w-full text-left font-normal text-sm pl-2 py-1.5 rounded-sm hover:bg-secondary">
					{t("edit")}
				</DialogTrigger>
			}

			<DialogContent>

				<DialogHeader>
					<DialogTitle>
						{t("editVacation")}
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
											format(date.from, "LLL dd, y")
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
										<SelectValue />
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

					<Input type='text' placeholder={t("note")} className="w"
						{...register('note')}
					/>

					<DialogFooter>
						<Button type={"submit"} disabled={(!date || !date.from || !date.to || !isValid)}>
							{t("save")}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}