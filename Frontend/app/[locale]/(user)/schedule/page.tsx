"use client"

import { useEffect, useRef, useState } from "react";

import { useTranslations } from "next-intl";
import Cookies from 'js-cookie';


import { getAllDepartments } from "@/api/department/actions";
import { getAllAmbulances } from "@/api/ambulance/actions";
import { getShiftsForWeek } from "@/api/shift/actions";
import { getAllEmpCategories } from "@/api/empCategory/actions";
import { getCalEventsForWeek } from "@/api/calevent/actions";
import { getVacationsByFilter } from "@/api/vacation/actions";

import { Shift } from "@/api/shift/model";
import { CalEvent } from "@/api/calevent/model";
import { Vacation } from "@/api/vacation/model";
import { Ambulance } from "@/api/ambulance/model";
import { Department } from "@/api/department/model";
import { EmpCategory } from "@/api/empCategory/model";

import ReactToPrint from 'react-to-print';
import { formatDateForAPI, getEventDayIndexes, getMonday } from "@/lib/utils";

import CalEventDialog from "@/components/calevent-dialog";
import AmbulaceSchedule from "./ambulance-schedule";

import { CalendarIcon } from "lucide-react";

import cs from "date-fns/locale/cs";
import { addDays, format } from "date-fns";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Absences from "@/components/absences";

export default function SchedulePage() {

	const t = useTranslations("pages.scheduler")

	const authToken = Cookies.get("authToken");


	async function fetchData() {

		if (!departments && !ambulances && !empCategories) {
			try {
				const departmentsResponse = await getAllDepartments();
				setDepartments(departmentsResponse);
			} catch (error) {
				console.error("ERROR while fetching departments!", error);
			}

			try {
				const ambulancesResponse = await getAllAmbulances();
				setAmbulances(ambulancesResponse);
			} catch (error) {
				console.error("ERROR while fetching ambulances!", error);
			}

			try {
				const empCategoryResponse = await getAllEmpCategories();
				setEmpCategories(empCategoryResponse);
			} catch (error) {
				console.error("ERROR while fetching empCategories!", error);
			}
		}

		try {
			const shiftsResponse = await getShiftsForWeek(format(monday, "yyyy-MM-dd"));
			setShifts(shiftsResponse);
		} catch (error) {
			console.error("ERROR while fetching shifts!", error);
		}

		try {
			const calEventsResponse = await getCalEventsForWeek(format(monday, "yyyy-MM-dd"));
			const sortedEvents = calEventsResponse.slice().sort((a, b) => {
				const dateA = new Date(a.from);
				const dateB = new Date(b.from);
				return dateA.getTime() - dateB.getTime();
			});
			setCalEvents(sortedEvents);
		} catch (error) {
			console.error("ERROR while fetching calendar events!", error);
		}

		try {
			const responseVacations = await getVacationsByFilter(
				[0], [], formatDateForAPI(monday), formatDateForAPI(addDays(monday, 6)))

			setAbsences(responseVacations);
		} catch (error) {
			console.error("ERROR while fetching vacations!", error);
		}
	}

	const today = new Date();

	const mainRef = useRef(null);

	const [monday, setMonday] = useState<Date>(getMonday(new Date()));

	const [departments, setDepartments] = useState<Department[]>();
	const [ambulances, setAmbulances] = useState<Ambulance[]>();
	const [shifts, setShifts] = useState<Shift[]>();
	const [empCategories, setEmpCategories] = useState<EmpCategory[]>();
	const [calEvents, setCalEvents] = useState<CalEvent[]>([]);
	const [absences, setAbsences] = useState<Vacation[]>([]);

	useEffect(() => {
		fetchData();
	}, [monday]);

	const changeWeek = (newDate: Date) => {
		const newMonday = getMonday(newDate);
		setMonday(newMonday);
	}

	return (
		<main ref={mainRef} className="flex flex-col space-y-2 w-full">
			<Card className="sticky top-16 print:-top-16 backdrop-blur-md bg-transparent">
				<CardHeader className="flex flex-row justify-between p-2 items-center border-b space-y-0 print:hidden">
					<div className="flex flex-row gap-x-4 items-center">
						<Button variant={'outline'} size={'sm'} className="px-4"
							onClick={() => setMonday(addDays(monday, -7))}>
							{t("previous")}
						</Button>

						<Button variant={'outline'} size={'sm'} className="px-4"
							onClick={() => setMonday(addDays(monday, 7))}>
							{t("next")}
						</Button>

						<Popover>
							<PopoverTrigger asChild>
								<Button
									size={"sm"}
									variant={"outline"}
									className="px-2"
								>
									<CalendarIcon className="p-0.5" />
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="start">
								<Calendar
									mode={"single"}
									locale={cs}
									defaultMonth={today}
									onSelect={(date) => { date && changeWeek(date) }}
								/>
							</PopoverContent>
						</Popover>

						<Button variant={'outline'} size={'sm'} className="px-4"
							onClick={() => { changeWeek(today) }}>
							{t("current")}
						</Button>

						<ReactToPrint
							trigger={() =>
								<Button variant={'outline'} size={'sm'} className="px-4">
									{t("export")}
								</Button>}
							content={() => mainRef.current}
						/>
					</div>

					<div className="flex flex-row gap-x-3">
						{empCategories?.map((empCategory) =>
							<span key={empCategory.empCategoryId.toString()} className="flex flex-row gap-x-1 items-center">
								<span style={{ backgroundColor: empCategory.color }} className="rounded-full w-3 h-3" />
								<Label>{empCategory.name}</Label>
							</span>
						)}
					</div>

					<Label className="mr-3">
						{t("todaysDate")}: {format(today, "d. M. yyyy")}
					</Label>
				</CardHeader>

				<CardContent className="grid grid-cols-8 grid-row-1 py-2 px-0 items-center">
					<div className="flex flex-col justify-center items-center space-y-1">
						<Label className="font-semibold text-lg">{t("week")}</Label>
						<Label className="text-center font-semibold">
							{format(monday, "d. M.")} - {format(addDays(monday, 6), "d. M. yyyy")}
						</Label>
					</div>

					<div className="text-center">
						<Label className="font-semibold text-lg">{t("monday")}</Label> <br />
						<Label>{format(monday, "d. M. yyyy")}</Label>
					</div>

					<div className="text-center">
						<Label className="font-semibold text-lg">{t("tuesday")}</Label> <br />
						<Label>{format(addDays(monday, 1), "d. M. yyyy")}</Label>
					</div>

					<div className="text-center">
						<Label className="font-semibold text-lg">{t("wednesday")}</Label> <br />
						<Label>{format(addDays(monday, 2), "d. M. yyyy")}</Label>
					</div>

					<div className="text-center">
						<Label className="font-semibold text-lg">{t("thursday")}</Label> <br />
						<Label>{format(addDays(monday, 3), "d. M. yyyy")}</Label>
					</div>

					<div className="text-center">
						<Label className="font-semibold text-lg">{t("friday")}</Label> <br />
						<Label>{format(addDays(monday, 4), "d. M. yyyy")}</Label>
					</div>

					<div className="text-center">
						<Label className="font-semibold text-lg">{t("saturday")}</Label> <br />
						<Label>{format(addDays(monday, 5), "d. M. yyyy")}</Label>
					</div>

					<div className="text-center">
						<Label className="font-semibold text-lg">{t("sunday")}</Label> <br />
						<Label>{format(addDays(monday, 6), "d. M. yyyy")}</Label>
					</div>
				</CardContent>

				<div className="p-0.5 grid grid-cols-8">
					{calEvents.map((event) => {
						const { start, end } = getEventDayIndexes(event);
						const colSpan = end - start + 1;
						return (
							<div
								key={event.calEventId.toString()}
								className={`col-start-${start + 2} col-span-${colSpan}`}
							>
								<CalEventDialog event={event} readOnly={true} />
							</div>
						);
					})}
				</div>
			</Card>

			{
				(departments && ambulances && shifts)

				&&
				<>
					{departments.map((department) => (
						<Card className="w-full" key={department.departmentId}>
							<CardHeader className="justify-center items-center pt-2 pb-0">
								<CardTitle className="text-lg">
									{department.name}
								</CardTitle>
							</CardHeader>

							<CardContent className="pt-2 pb-0 px-0">
								<AmbulaceSchedule
									mondayDate={monday}
									departmentId={department.departmentId}
									ambulances={ambulances}
									shifts={shifts}
								/>
							</CardContent>
						</Card>
					))}

					<div className="flex flex-row gap-x-3 p-2 invisible print:visible">
						{empCategories?.map((empCategory) =>
							<span key={empCategory.empCategoryId.toString()} className="flex flex-row gap-x-1 items-center">
								<span style={{ backgroundColor: empCategory.color }} className="rounded-full w-3 h-3" />
								<Label>{empCategory.name}</Label>
							</span>
						)}
					</div>

					<Absences
						empCategories={empCategories}
						absences={absences}
						mondayDate={monday}
					/>
				</>

				||

				<div className="w-full flex flex-col space-y-2">
					<Skeleton className="w-full h-44 rounded-md" />
					<Skeleton className="w-full h-32 rounded-md" />
					<Skeleton className="w-full h-36 rounded-md" />
					<Skeleton className="w-full h-28 rounded-md" />
				</div>
			}
		</main >
	)
}