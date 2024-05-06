import { useTranslations } from "next-intl";
import Cookies from "js-cookie";

import { copyPrevWeek, genFromPref } from "@/api/shift/actions";

import { formatDateForAPI, getMonday } from "@/lib/utils";

import { cs } from "date-fns/locale";
import { addDays } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function GenerateShiftsDialog({
	isEmptyWeek,
	monday,
	refresh,
}: {
	isEmptyWeek: boolean,
	monday: Date,
	refresh: () => void,
}) {

	const t = useTranslations("pages.scheduler.generateShiftDialog")
	const authToken = Cookies.get("authToken");

	const today = new Date()

	const dialogClose = () => {
		document.getElementById('closeDialog')?.click();
	};

	const generateByPreferences = async () => {
		const dateString = formatDateForAPI(monday);
		await genFromPref(dateString, authToken);
		refresh();
		dialogClose();
	}

	const copyPreviousWeek = async (fromMonday: Date) => {
		const fromDateString = formatDateForAPI(fromMonday);
		const toDateString = formatDateForAPI(monday);
		console.log(fromMonday)
		await copyPrevWeek(fromDateString, toDateString, authToken);
		refresh();
		dialogClose();
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button disabled={!isEmptyWeek} variant={"outline"} size={"sm"} className="ml-6">
					{t("trigger")}
				</Button>
			</DialogTrigger>

			<DialogContent className="w-36">
				<DialogHeader>
					<DialogTitle>
						{t("title")}
					</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col space-y-2 mt-2">
					<Button
						size={"sm"}
						variant={"outline"}
						onClick={() => generateByPreferences()}
					>
						{t("generateByPreferences")}
					</Button>

					<Button
						size={"sm"}
						variant={"outline"}
						onClick={() => copyPreviousWeek(addDays(monday, -7))}
					>
						{t("copyLastWeek")}
					</Button>

					<Popover>
						<PopoverTrigger asChild>
							<Button
								size={"sm"}
								variant={"outline"}
							>
								{t("selectWeek")}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="center">
							<Calendar
								mode={"single"}
								locale={cs}
								defaultMonth={today}
								onDayClick={(date) => {
									copyPreviousWeek(getMonday(date))
								}}
							/>
						</PopoverContent>
					</Popover>
				</div>
			</DialogContent>
		</Dialog>
	)
}