"use client"

import { useEffect, useState } from "react";

import Cookies from 'js-cookie';

import { getVacationsByFilter } from "@/api/vacation/actions";
import { getAllEmpCategories } from "@/api/empCategory/actions";
import { getAllEmployees } from "@/api/employee/actions";
import { getCalEventsForWeek } from "@/api/calevent/actions";

import { Vacation } from "@/api/vacation/model";
import { CalEvent } from "@/api/calevent/model";
import { Employee } from "@/api/employee/model";
import { EmpCategory } from "@/api/empCategory/model";

import { formatDateForAPI, getMonday } from "@/lib/utils";

import Absences from "@/components/todays-absences";
import WeeksCalEvents from "@/components/weeks-cal-events";
import RequestVacationDialog from "./request-vacation-dialog";

export default function DashboardPage() {
	
	const today = new Date();
	const monday = getMonday(new Date());

	const [employees, setEmployees] = useState<Employee[]>([])
	const [absences, setAbsences] = useState<Vacation[]>([])
	const [categories, setCategories] = useState<EmpCategory[]>([])
	const [events, setEvents] = useState<CalEvent[]>([])

	const fetchData = async () => {
		const allEmployees = await getAllEmployees();
		setEmployees(allEmployees);

		const todaysAbsences = await getVacationsByFilter(
			[0], [], formatDateForAPI(today), formatDateForAPI(today));
		setAbsences(todaysAbsences);

		const empCategories = await getAllEmpCategories();
		setCategories(empCategories);

		const calEvents = await getCalEventsForWeek(formatDateForAPI(monday));
		setEvents(calEvents);
	}

	useEffect(() => { fetchData() }, [])

	return (
		<main className="flex flex-col space-y-4 lg:w-4/5 mx-auto my-auto h-fit pt-2 justify-between">
			{
				events?.length > 0 &&

				<WeeksCalEvents calEvents={events} monday={monday} />
			}

			<Absences absences={absences} empCategories={categories} />

			<div className="w-full flex justify-end">
				<RequestVacationDialog employees={employees} />
			</div>
		</main>
	)
}