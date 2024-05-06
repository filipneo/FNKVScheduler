import { Ambulance } from "@/api/ambulance/model";
import { Shift } from "@/api/shift/model";

import ShiftDetailDialog from "./shift-detail-dialog";

import { addDays, format } from "date-fns";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function AmbulaceSchedule(
	{
		ambulances,
		departmentId,
		mondayDate,
		shifts
	}: {
		ambulances: Ambulance[],
		departmentId: Number,
		mondayDate: Date,
		shifts: Shift[]
	}) {

	const cellClassNames = "border-r grid grid-cols-2 gap-1 p-1";

	return (
		<section className="w-full flex flex-col border-t divide-y">
			{ambulances?.filter((ambulance) => ambulance.departmentId === departmentId)
				.map((ambulance) => (
					<div key={ambulance.ambulanceId} className="w-full grid grid-cols-8 grid-rows-1">
						<div className="flex flex-col py-2 items-center justify-center border-r space-y-2">
							<Label className="font-semibold text-md">{ambulance.name}</Label>
							<div className="flex flex-row items-center space-x-2 print:hidden">
								<Label className="text-muted-foreground">Opt: {ambulance.optCap}</Label>
								<Separator orientation="vertical" />
								<Label className="text-muted-foreground">Max: {ambulance.maxCap}</Label>
							</div>
						</div>

						<div id="mon" className={cellClassNames}>
							{shifts
								.filter((shift) => shift.ambulanceId === ambulance.ambulanceId)
								.filter((shift) => shift.date === format(mondayDate, "yyyy-MM-dd'T'00:00:00"))
								.sort((a, b) => a.partOfTheDay - b.partOfTheDay)
								.map((shift) => (
									<ShiftDetailDialog shift={shift} key={shift.shiftId} />
								))}
						</div>

						<div id="tue" className={cellClassNames}>
							{shifts
								?.filter((shift) => shift.ambulanceId === ambulance.ambulanceId)
								.filter((shift) => shift.date === format(addDays(mondayDate, 1), "yyyy-MM-dd'T'00:00:00"))
								.map((shift) => (
									<ShiftDetailDialog shift={shift} key={shift.shiftId} />
								))}
						</div>

						<div id="wed" className={cellClassNames}>
							{shifts
								?.filter((shift) => shift.ambulanceId === ambulance.ambulanceId)
								.filter((shift) => shift.date === format(addDays(mondayDate, 2), "yyyy-MM-dd'T'00:00:00"))
								.map((shift) => (
									<ShiftDetailDialog shift={shift} key={shift.shiftId} />
								))}
						</div>

						<div id="thu" className={cellClassNames}>
							{shifts
								?.filter((shift) => shift.ambulanceId === ambulance.ambulanceId)
								.filter((shift) => shift.date === format(addDays(mondayDate, 3), "yyyy-MM-dd'T'00:00:00"))
								.map((shift) => (
									<ShiftDetailDialog shift={shift} key={shift.shiftId} />
								))}
						</div>

						<div id="fri" className={cellClassNames}>
							{shifts
								?.filter((shift) => shift.ambulanceId === ambulance.ambulanceId)
								.filter((shift) => shift.date === format(addDays(mondayDate, 4), "yyyy-MM-dd'T'00:00:00"))
								.map((shift) => (
									<ShiftDetailDialog shift={shift} key={shift.shiftId} />
								))}
						</div>

						<div id="sat" className={cellClassNames}>
							{shifts
								?.filter((shift) => shift.ambulanceId === ambulance.ambulanceId)
								.filter((shift) => shift.date === format(addDays(mondayDate, 5), "yyyy-MM-dd'T'00:00:00"))
								.map((shift) => (
									<ShiftDetailDialog shift={shift} key={shift.shiftId} />
								))}
						</div>

						<div id="sun" className={cellClassNames + " border-none"}>
							{shifts
								?.filter((shift) => shift.ambulanceId === ambulance.ambulanceId)
								.filter((shift) => shift.date === format(addDays(mondayDate, 6), "yyyy-MM-dd'T'00:00:00"))
								.map((shift) => (
									<ShiftDetailDialog shift={shift} key={shift.shiftId} />
								))}
						</div>
					</div>
				))}
		</section>
	)
}