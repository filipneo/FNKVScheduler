"use client"

import { useEffect, useState } from "react";

import Cookies from 'js-cookie'

import Absences from "@/components/todays-absences";
import WeeksCalEvents from "@/components/weeks-cal-events";
import VacationsToResolve from "./vacations-to-resolve";

import { CalEvent } from "@/api/calevent/model";
import { Vacation } from "@/api/vacation/model";
import { EmpCategory } from "@/api/empCategory/model";

import { getVacationsByFilter } from "@/api/vacation/actions";
import { getAllEmpCategories } from "@/api/empCategory/actions";
import { getCalEventsForWeek } from "@/api/calevent/actions";

import { formatDateForAPI, getMonday } from "@/lib/utils";

export default function DashboardPage() {

	const authToken = Cookies.get("authToken");

	const today = new Date();
	const monday = getMonday(new Date());

	const [vacationRequests, setVacationRequests] = useState<Vacation[]>([])
	const [absences, setAbsences] = useState<Vacation[]>([])
	const [categories, setCategories] = useState<EmpCategory[]>([])
	const [events, setEvents] = useState<CalEvent[]>([])

	const fetchData = async () => {
		const vacationsToResolve = await getVacationsByFilter([2], [], "", "");
		setVacationRequests(vacationsToResolve);

		const todaysAbsences = await getVacationsByFilter(
			[0], [], formatDateForAPI(today), formatDateForAPI(today));
		setAbsences(todaysAbsences);

		const empCategories = await getAllEmpCategories();
		setCategories(empCategories);

		const calEvents = await getCalEventsForWeek(formatDateForAPI(monday));
		setEvents(calEvents);
	}

	const handleVacationRequestResolution = (resolvedVacationId: number) => {
		const updatedVacationRequests = vacationRequests.filter(
			(request) => request.vacationId !== resolvedVacationId
		);
		setVacationRequests(updatedVacationRequests);
	}

	useEffect(() => { fetchData() }, [])

	return (
		<main className="flex flex-col space-y-4 lg:w-4/5 mx-auto my-auto h-fit pt-2 justify-between">
			{
				vacationRequests.length > 0 &&

				<VacationsToResolve
					vacationsToResolve={vacationRequests}
					onVacationResolution={handleVacationRequestResolution}
				/>
			}

			{
				events.length > 0 &&

				<WeeksCalEvents
					monday={monday}
					calEvents={events}
				/>
			}

			<Absences
				empCategories={categories}
				absences={absences}
			/>
		</main>
	)
}