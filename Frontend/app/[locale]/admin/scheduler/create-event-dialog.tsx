"use client"

import { useTranslations } from "next-intl"
import Cookies from "js-cookie";

import { CalEvent } from "@/api/calevent/model"
import { createCalEvent } from "@/api/calevent/actions"

import { Controller, useForm } from "react-hook-form"

import ColorPicker from "@/components/color-picker"

import cs from "date-fns/locale/cs"
import format from "date-fns/format"
import { CalendarIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogHeader, DialogContent, DialogFooter, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { formatDateForAPI } from "@/lib/utils"

export default function CreateEventDialog() {

	const t = useTranslations("pages.scheduler.createCalEventDialog")
	const authToken = Cookies.get("authToken");

	const {
		control,
		handleSubmit,
		register,
		setValue,
		trigger,
		reset,
		formState: { isValid }
	} = useForm<CalEvent>();

	const onSubmit = async (newCalEvent: CalEvent) => {
		if (newCalEvent.color == undefined) newCalEvent.color = defaultColor;
		if (newCalEvent.to == undefined) {
			newCalEvent.from = formatDateForAPI(newCalEvent.from as Date);
			newCalEvent.to = newCalEvent.from
		}
		else {
			newCalEvent.from = formatDateForAPI(newCalEvent.from as Date);
			newCalEvent.to = formatDateForAPI(newCalEvent.to as Date);
		}

		const response = await createCalEvent(newCalEvent, authToken);
		// TODO callback
		//reset();
		window.location.reload();
	}

	const handleColorChange = (color: string) => {
		setValue("color", color);
	};

	const today = new Date();
	const defaultColor = "#820878";

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size={"sm"} variant={'outline'}>
					{t("trigger")}
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{t("title")}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-2">
					<div className="flex flex-row justify-between items-center space-x-2">
						<Input type="text" placeholder={t("name")} className="w-1/2"
							{...register("name", { required: true })} />

						<div className="flex flex-row justify-between items-center w-1/2">
							<Controller
								control={control}
								name="from"
								rules={{ required: true }}
								render={({ field }) => (
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant={"outline"}
												className="gap-x-2"
											>
												<CalendarIcon size={18} />
												<span>{(field.value) ? format(new Date(field.value), "d. M.") : t("from")}</span>
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="end">
											<Calendar
												mode={"single"}
												locale={cs}
												defaultMonth={today}
												onSelect={(date) => { setValue("from", date ? date : ""); trigger("from") }}
											/>
										</PopoverContent>
									</Popover>
								)}
							/>

							<span className="mx-2">-</span>

							<Controller
								control={control}
								name="to"
								render={({ field }) => (
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant={"outline"}
												className="gap-x-2"
											>
												<CalendarIcon size={18} />
												<span>{(field.value) ? format(new Date(field.value), "d. M.") : t("to")}</span>
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode={"single"}
												locale={cs}
												defaultMonth={today}
												onSelect={(date) => setValue("to", date ? date : "")}
											/>
										</PopoverContent>
									</Popover>
								)}
							/>
						</div>
					</div>

					<div className="flex flex-row justify-between items-center space-x-2">
						<Input type="text" placeholder={t("note")} className="w-1/2"
							{...register("note")} />
						<div className="w-1/2">
							<ColorPicker value={defaultColor} onColorChange={handleColorChange} />
						</div>
					</div>

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
	)
}