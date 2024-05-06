"use client"

import { useEffect, useRef, useState } from "react";

import { useTranslations } from "next-intl";
import Cookies from "js-cookie";

import { Department } from "@/api/department/model";
import { Ambulance } from "@/api/ambulance/model";
import { Employee } from "@/api/employee/model";
import { Shift } from "@/api/shift/model";
import { EmpCategory } from "@/api/empCategory/model";

import { getAllDepartments } from "@/api/department/actions";
import { getAllAmbulances } from "@/api/ambulance/actions";
import { getAllEmpCategories } from "@/api/empCategory/actions";
import { getFreeEmployeesForDate } from "@/api/employee/actions";
import { createShift, deleteShift, getShiftsForWeek, updateShift } from "@/api/shift/actions";

import AddEventDialog from "./create-event-dialog";
import CalEventDialog from "@/components/calevent-dialog";
import AmbulaceScheduler from "./ambulance-scheduler";
import GenerateShiftsDialog from "./generate-shifts-dialog";

import cs from "date-fns/locale/cs";
import ReactToPrint from "react-to-print";
import { addDays, format } from "date-fns";
import { formatDateForAPI, getEventDayIndexes, getMonday } from "@/lib/utils";

import { CalendarIcon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalEvent } from "@/api/calevent/model";
import { deleteCalEvent, getCalEventsForWeek, updateCalEvent } from "@/api/calevent/actions";
import { Vacation } from "@/api/vacation/model";
import { getVacationsByFilter } from "@/api/vacation/actions";
import Absences from "@/components/absences";

export default function SchedulerPage() {

	const t = useTranslations("pages.scheduler");
	const authToken = Cookies.get("authToken");

	const fetchData = async () => {

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
			const shiftsResponse = await getShiftsForWeek(formatDateForAPI(monday));
			setShifts(shiftsResponse);
		} catch (error) {
			console.error("ERROR while fetching shifts!", error);
		}

		try { // Fetch free employees and vacations for each day of the week
			var freeEmployees: Employee[][] = [];

			for (let i = 0; i < 7; i++) {
				const day = addDays(monday, i);
				var dateString = formatDateForAPI(day);

				const employeesResponse = await getFreeEmployeesForDate(dateString, authToken);
				freeEmployees.push(employeesResponse);
			}
			setFreeEmployees(freeEmployees);
			setBusyEmployees([])

		} catch (error) {
			console.error("ERROR while fetching employees!", error);
		}

		try {
			const responseVacations = await getVacationsByFilter(
				[0], [], formatDateForAPI(monday), formatDateForAPI(addDays(monday, 6)))

			setAbsences(responseVacations);
		} catch (error) {
			console.error("ERROR while fetching vacations!", error);
		}

		try {
			const calEventsResponse = await getCalEventsForWeek(formatDateForAPI(monday));
			const sortedEvents = calEventsResponse.slice().sort((a, b) => {
				const dateA = new Date(a.from);
				const dateB = new Date(b.from);
				return dateA.getTime() - dateB.getTime();
			});
			setCalEvents(sortedEvents);
		} catch (error) {
			console.error("ERROR while fetching calendar events!", error);
		}
	}

	const today = new Date();

	const mainRef = useRef(null);

	const [monday, setMonday] = useState<Date>(getMonday(new Date()));

	const [departments, setDepartments] = useState<Department[]>();
	const [ambulances, setAmbulances] = useState<Ambulance[]>();
	const [shifts, setShifts] = useState<Shift[]>();
	const [empCategories, setEmpCategories] = useState<EmpCategory[]>();
	const [freeEmployees, setFreeEmployees] = useState<Employee[][]>([]);
	const [busyEmployees, setBusyEmployees] = useState<Employee[][]>([]);
	const [calEvents, setCalEvents] = useState<CalEvent[]>([])
	const [absences, setAbsences] = useState<Vacation[]>([])

	useEffect(() => {
		fetchData();
	}, [monday]);

	const changeWeek = (newDate: Date) => {
		const newMonday = getMonday(newDate);
		setMonday(newMonday);
	}

	const handleCreateShift = async (newShift: Shift) => {
		try {
			const responseShift = await createShift(newShift, authToken);

			setShifts((weekShifs) => {
				if (weekShifs == null) {
					return [responseShift];
				} else {
					return [...weekShifs, responseShift];
				}
			});

			const dayOfWeek = new Date(responseShift.date).getDay() - 1;

			// Remove the employee from the free employee list for that day
			setFreeEmployees((prevFreeEmployees) => {
				if (!prevFreeEmployees) {
					return prevFreeEmployees;
				}

				const updatedFreeEmployees = prevFreeEmployees.map((dayEmployees, index) => {
					if (index === dayOfWeek) {
						return dayEmployees.filter((employee) => employee.employeeId !== responseShift.employeeId);
					}
					return dayEmployees;
				});

				return updatedFreeEmployees;
			});

			// Add the employee to the busy employees list for that day
			setBusyEmployees((prevBusyEmployees) => {
				if (!responseShift.employee) {
					fetchData();
					return prevBusyEmployees
				}

				const updatedBusyEmployees = [...prevBusyEmployees];
				if (!updatedBusyEmployees[dayOfWeek]) {
					updatedBusyEmployees[dayOfWeek] = [responseShift.employee];
				} else {
					updatedBusyEmployees[dayOfWeek].push(responseShift.employee);
				}

				return updatedBusyEmployees;
			});

		} catch (error) {
			console.error(error);
		}
	};

	const handleUpdateShift = async (shiftId: number, updatedShift: Shift, previousEmployeeId?: number) => {
		try {
			const responseShift = await updateShift(shiftId, updatedShift, authToken);

			if (responseShift) {

				setShifts((shifts) =>
					shifts?.map((shift) =>
						shift.shiftId === shiftId ? { ...shift, ...responseShift } : shift
					)
				);

				// TODO Data handling on client (responseShift does not include employee only employeeId)
				fetchData();
			}

		} catch (error) {
			console.error(error);
		}
	};

	const handleDeleteShift = async (deletedShift: Shift) => {
		try {
			// Delete the shift
			const response = await deleteShift(deletedShift.shiftId, authToken);

			// Remove the deleted shift from the shifts list
			setShifts((shifts) =>
				shifts?.filter((shift) => shift.shiftId !== deletedShift?.shiftId)
			);

			// Get the day of the week for the deleted shift
			const dayOfWeek = new Date(deletedShift.date).getDay() - 1;

			// Add the employee of the deleted shift back to the free employees list for that day
			setFreeEmployees((prevFreeEmployees) => {
				if (!deletedShift.employee) {
					fetchData();
					return prevFreeEmployees
				}

				const updatedFreeEmployees = [...prevFreeEmployees];
				if (!updatedFreeEmployees[dayOfWeek]) {
					updatedFreeEmployees[dayOfWeek] = [deletedShift.employee];
				} else {
					updatedFreeEmployees[dayOfWeek].push(deletedShift.employee); // dev mode -> StrictMode (that's why there two of the same employee)
					updatedFreeEmployees[dayOfWeek].sort((a, b) => a.firstName.localeCompare(b.firstName));
				}
				console.log(updatedFreeEmployees)
				return updatedFreeEmployees;
			});

			// Remove the employee of the deleted shift from the busy employees list for that day
			setBusyEmployees((prevBusyEmployees) => {
				const updatedBusyEmployees = [...prevBusyEmployees];
				if (updatedBusyEmployees[dayOfWeek]) {
					updatedBusyEmployees[dayOfWeek] = updatedBusyEmployees[dayOfWeek].filter(
						(employee) => employee.employeeId !== deletedShift.employeeId
					);
				}
				return updatedBusyEmployees;
			});

		} catch (error) {
			console.error(error);
		}
	};

	const handleCalEventUpdate = async (eventId: number, updatedEvent: CalEvent) => {
		try {
			const responseCalEvent = updateCalEvent(eventId, updatedEvent, authToken);
			fetchData();
		} catch (error) {
			console.log(error)
		}
	}

	const handleCalEventDelete = async (event: CalEvent) => {
		try {
			deleteCalEvent(event.calEventId, authToken);
			setCalEvents((calEvents) =>
				calEvents?.filter((calEvent) => calEvent.calEventId !== event.calEventId)
			);
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<main ref={mainRef} className="flex flex-col space-y-2 w-full">
			<Card className="sticky top-16 print:-top-16 backdrop-blur-md bg-transparent">
				<CardHeader className="flex flex-row justify-between print:hidden p-2 items-center border-b space-y-0">
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

						<GenerateShiftsDialog isEmptyWeek={!shifts?.length} monday={monday} refresh={fetchData} />

						<ReactToPrint
							trigger={() =>
								<Button variant={'outline'} size={'sm'} className="px-4" >
									{t("export")}
								</Button>
							}
							content={() => mainRef.current}
						/>
					</div>

					<div className="flex flex-row gap-x-3">
						{empCategories?.map((empCategory) =>
							<span key={empCategory.empCategoryId.toString()} className="flex flex-row gap-x-1 items-center">
								<div style={{ backgroundColor: empCategory.color }} className="rounded-full w-3 h-3" />
								<Label>{empCategory.name}</Label>
							</span>
						)}
					</div>

					<div className="flex flex-row gap-x-4 items-center">
						<Label>
							{t("todaysDate")}: {format(today, "d. M. yyyy")}
						</Label>

						<AddEventDialog />
					</div>
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
								className={`col-span-${colSpan} col-start-${start + 2}`}
							>
								<CalEventDialog
									event={event} readOnly={false}
									onCalEventUpdate={(eventId, updatedEvent) => handleCalEventUpdate(eventId, updatedEvent)}
									onCalEventDelete={(deletedEvent: CalEvent) => handleCalEventDelete(deletedEvent)} />
							</div>
						);
					})}
				</div>
			</Card>

			{
				(departments && ambulances && shifts && freeEmployees) &&

				<>
					{departments.map((department) => (
						<Card className="w-full" key={department.departmentId}>
							<CardHeader className="justify-center items-center pt-2 pb-0">
								<CardTitle className="text-lg">
									{department.name}
								</CardTitle>
							</CardHeader>

							<CardContent className="pt-2 pb-0 px-0">
								<AmbulaceScheduler
									ambulances={ambulances}
									departmentId={department.departmentId}
									mondayDate={monday}
									shifts={shifts}
									freeEmployees={freeEmployees}
									onCreateShift={(newShift) => handleCreateShift(newShift)}
									onUpdateShift={(shiftId, updatedShift, previousEmployeeId) => handleUpdateShift(shiftId, updatedShift, previousEmployeeId)}
									onDeleteShift={(deletedShift) => handleDeleteShift(deletedShift)}
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

					<Absences empCategories={empCategories} absences={absences} mondayDate={monday}/>
				</>

				||

				<div className="w-full flex flex-col space-y-2">
					<Skeleton className="w-full h-44 rounded-md" />
					<Skeleton className="w-full h-32 rounded-md" />
					<Skeleton className="w-full h-36 rounded-md" />
					<Skeleton className="w-full h-28 rounded-md" />
				</div>
			}
		</main>
	)
}