import { CalEvent } from "@/api/calevent/model";

import { formatDate, formatDateForAPI } from "@/lib/utils";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ColorPicker from "@/components/color-picker";
import { Controller, useForm } from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import cs from "date-fns/locale/cs";
import format from "date-fns/format";
import { useTranslations } from "next-intl";

function DetailContent(event: CalEvent, t: any) {
	return (
		<div className="space-y-2 px-4">
			<div className="flex flex-row w-full">
				<div className="w-1/2">
					<DialogDescription>{t("title")}</DialogDescription>
					<Label className="text-lg">{event.name}</Label>
				</div>

				{event.note &&
					<div className="w-1/2">
						<DialogDescription>{t("note")}</DialogDescription>
						<Label className="text-lg">{event.note}</Label>
					</div>
				}
			</div>

			{(event.from !== event.to) &&
				<div className="flex flex-row gap-x-2 w-full">
					<div className="w-1/2">
						<DialogDescription>{t("from")}</DialogDescription>
						<Label className="text-lg">{formatDate(event.from as string)}</Label>
					</div>
					<div className="w-1/2">
						<DialogDescription>{t("to")}</DialogDescription>
						<Label className="text-lg">{formatDate(event.to as string)}</Label>
					</div>
				</div>

				||

				<div className="w-1/2">
					<DialogDescription>{t("date")}</DialogDescription>
					<Label className="text-lg">{formatDate(event.from as string)}</Label>
				</div>
			}
		</div>
	)
}

type CalEventDialogProps = {
	event: CalEvent,
	readOnly: true,
} | {
	event: CalEvent,
	readOnly: false,
	onCalEventUpdate: (eventId: number, updatedEvent: CalEvent) => void,
	onCalEventDelete: (deletedEvent: CalEvent) => void
};

export default function CalEventDialog(props: CalEventDialogProps) {
	const { event, readOnly, onCalEventUpdate, onCalEventDelete } = props as {
		event: CalEvent,
		readOnly: false,
		onCalEventUpdate: (eventId: number, updatedEvent: CalEvent) => void,
		onCalEventDelete: (deletedEvent: CalEvent) => void
	};

	const t = useTranslations("components.calEventDialog")

	const {
		control,
		handleSubmit,
		register,
		setValue,
		reset,
		formState: { isValid }
	} = useForm<CalEvent>({ defaultValues: event });

	const handleColorChange = (color: string) => {
		setValue("color", color);
	};

	const today = new Date();

	const onSubmit = (updatedEvent: CalEvent) => {

		if (updatedEvent.from instanceof Date) {
			updatedEvent.from = formatDateForAPI(updatedEvent.from);
		}
	
		if (updatedEvent.to instanceof Date) {
			updatedEvent.to = formatDateForAPI(updatedEvent.to);
		}

		onCalEventUpdate(event.calEventId, updatedEvent)
	}

	return (
		<Dialog>
			<DialogTrigger style={{ backgroundColor: event.color }}
				className="w-full text-md rounded-md p-0.5 font-semibold hover:bg-opacity-50 text-black">
				{event.name}
			</DialogTrigger>

			{readOnly &&

				<DialogContent>
					{DetailContent(event, t)}
				</DialogContent>

				||

				<DialogContent>
					<Tabs defaultValue="detail" className="border-0">
						<TabsContent value="detail" className="mt-4">
							{DetailContent(event, t)}
						</TabsContent>

						<TabsContent value="update" className="mt-6">
							<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
								<div className="flex flex-row space-x-2">
									<Input type="text" className="w-1/2"
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
															<span>{(field.value) && format(new Date(field.value), "d. M.")}</span>
														</Button>
													</PopoverTrigger>
													<PopoverContent className="w-auto p-0" align="end">
														<Calendar
															mode={"single"}
															locale={cs}
															defaultMonth={today}
															selected={field.value as Date}
															onSelect={(date) => setValue("from", date ? date : "")}
														/>
													</PopoverContent>
												</Popover>
											)}
										/>

										<span className="mx-1 font-bold">-</span>

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
															<span>{(field.value) && format(new Date(field.value), "d. M.")}</span>
														</Button>
													</PopoverTrigger>
													<PopoverContent className="w-auto p-0" align="start">
														<Calendar
															mode={"single"}
															locale={cs}
															defaultMonth={today}
															selected={field.value as Date}
															onSelect={(date) => setValue("to", date ? date : "")}
														/>
													</PopoverContent>
												</Popover>
											)}
										/>
									</div>
								</div>

								<div className="flex flex-row space-x-2">
									<Input type="text" placeholder={t("note")} {...register("note")} className="w-1/2" />
									<div className="flex w-1/2 gap-x-2">
										<ColorPicker value={event.color} onColorChange={handleColorChange} />
										<DialogClose>
											<Button disabled={!isValid} type="submit">{t("saveButton")}</Button>
										</DialogClose>
									</div>
								</div>
							</form>
						</TabsContent>

						<TabsContent value="delete" className="mt-6">
							<Label className="text-lg font-semibold">
								{t("deleteTab.title")}
							</Label>

							<DialogDescription className="mt-2">
								{t("deleteTab.description")}
							</DialogDescription>

							<DialogFooter>
								<Button onClick={() => onCalEventDelete(event)}
									className="hover:bg-destructive hover:text-destructive-foreground font-semibold">
									{t("deleteTab.deleteButton")}
								</Button>
							</DialogFooter>
						</TabsContent>

						<DialogFooter>
							<TabsList className="grid w-full grid-cols-3 mt-6">
								<TabsTrigger value="detail">{t("detail")}</TabsTrigger>
								<TabsTrigger value="update">{t("update")}</TabsTrigger>
								<TabsTrigger value="delete">{t("delete")}</TabsTrigger>
							</TabsList>
						</DialogFooter>
					</Tabs>
				</DialogContent>
			}
		</Dialog>
	)
}