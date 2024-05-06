import { Ambulance } from "@/api/ambulance/model";
import { Employee } from "@/api/employee/model";
import { Shift } from "@/api/shift/model";

import ShiftDialog from "./shift-dialog";
import AddShiftDialog from "./create-shift-dialog";

import { Label } from "@/components/ui/label";

import { addDays, format } from "date-fns";
import { Separator } from "@/components/ui/separator";

export default function AmbulaceScheduler(
	{
		ambulances,
		departmentId,
		mondayDate,
		shifts,
		freeEmployees,
		onCreateShift,
		onUpdateShift,
		onDeleteShift
	}: {
		ambulances: Ambulance[],
		departmentId: Number,
		mondayDate: Date,
		shifts: Shift[],
		freeEmployees: Employee[][],
		onCreateShift: (newShift: Shift) => void,
		onUpdateShift: (shiftId: number, updatedShift: Shift, previousEmployeeId?: number) => void,
		onDeleteShift: (deletedShift: Shift) => void
	}) {

	const cellClassNames = "border-r";

	return (
		<section className="w-full flex flex-col border-t divide-y">
			{ambulances?.filter((ambulance) => ambulance.departmentId === departmentId)
				.map((ambulance) => (
					<div key={ambulance.ambulanceId} className="w-full grid grid-cols-8 grid-rows-1">
						<div className="flex flex-col h-14 min-h-full items-center justify-center border-r space-y-2">
							<Label className="font-semibold text-md">{ambulance.name}</Label>
							<div className="flex flex-row items-center space-x-2 print:hidden">
								<Label className="text-muted-foreground">Opt: {ambulance.optCap}</Label>
								<Separator orientation="vertical" />
								<Label className="text-muted-foreground">Max: {ambulance.maxCap}</Label>
							</div>
						</div>

						<div id="monday" className={cellClassNames}>
							<AddShiftDialog
								date={mondayDate}
								ambulanceId={ambulance.ambulanceId}
								freeEmployees={freeEmployees[0]}
								onCreateShift={(newShift) => (onCreateShift(newShift))}>
								{
									shifts
										.filter((shift) => shift.ambulanceId === ambulance.ambulanceId)
										.filter((shift) => shift.date === format(mondayDate, "yyyy-MM-dd'T'00:00:00"))
										.sort((a, b) => a.partOfTheDay - b.partOfTheDay)
										.map((shift) => (
											<ShiftDialog key={shift.shiftId} shift={shift} freeEmployees={freeEmployees[0]}
												onUpdateShift={(shiftId, updatedShift, previousEmployeeId) => onUpdateShift(shiftId, updatedShift, previousEmployeeId)}
												onDeleteShift={(deletedShift) => onDeleteShift(deletedShift)} />
										))
								}
							</AddShiftDialog>
						</div>

						<div id="tuesday" className={cellClassNames}>
							<AddShiftDialog
								date={addDays(mondayDate, 1)}
								ambulanceId={ambulance.ambulanceId}
								freeEmployees={freeEmployees[1]}
								onCreateShift={(newShift) => (onCreateShift(newShift))}>
								{
									shifts
										.filter((shift) => shift.ambulanceId === ambulance.ambulanceId)
										.filter((shift) => shift.date === format(addDays(mondayDate, 1), "yyyy-MM-dd'T'00:00:00"))
										.sort((a, b) => a.partOfTheDay - b.partOfTheDay)
										.map((shift) => (
											<ShiftDialog key={shift.shiftId} shift={shift} freeEmployees={freeEmployees[1]}
												onUpdateShift={(shiftId, updatedShift, previousEmployeeId) => onUpdateShift(shiftId, updatedShift, previousEmployeeId)}
												onDeleteShift={(deletedShift) => onDeleteShift(deletedShift)} />
										))
								}
							</AddShiftDialog>
						</div>

						<div id="wednesday" className={cellClassNames}>
							<AddShiftDialog
								date={addDays(mondayDate, 2)}
								ambulanceId={ambulance.ambulanceId}
								freeEmployees={freeEmployees[2]}
								onCreateShift={(newShift) => (onCreateShift(newShift))}>
								{
									shifts
										.filter((shift) => shift.ambulanceId === ambulance.ambulanceId)
										.filter((shift) => shift.date === format(addDays(mondayDate, 2), "yyyy-MM-dd'T'00:00:00"))
										.sort((a, b) => a.partOfTheDay - b.partOfTheDay)
										.map((shift) => (
											<ShiftDialog key={shift.shiftId} shift={shift} freeEmployees={freeEmployees[2]}
												onUpdateShift={(shiftId, updatedShift, previousEmployeeId) => onUpdateShift(shiftId, updatedShift, previousEmployeeId)}
												onDeleteShift={(deletedShift) => onDeleteShift(deletedShift)} />
										))
								}
							</AddShiftDialog>
						</div>

						<div id="thursday" className={cellClassNames}>
							<AddShiftDialog
								date={addDays(mondayDate, 3)}
								ambulanceId={ambulance.ambulanceId}
								freeEmployees={freeEmployees[3]}
								onCreateShift={(newShift) => (onCreateShift(newShift))}>
								{
									shifts
										.filter((shift) => shift.ambulanceId === ambulance.ambulanceId)
										.filter((shift) => shift.date === format(addDays(mondayDate, 3), "yyyy-MM-dd'T'00:00:00"))
										.sort((a, b) => a.partOfTheDay - b.partOfTheDay)
										.map((shift) => (
											<ShiftDialog key={shift.shiftId} shift={shift} freeEmployees={freeEmployees[3]}
												onUpdateShift={(shiftId, updatedShift, previousEmployeeId) => onUpdateShift(shiftId, updatedShift, previousEmployeeId)}
												onDeleteShift={(deletedShift) => onDeleteShift(deletedShift)} />
										))
								}
							</AddShiftDialog>
						</div>

						<div id="friday" className={cellClassNames}>
							<AddShiftDialog
								date={addDays(mondayDate, 4)}
								ambulanceId={ambulance.ambulanceId}
								freeEmployees={freeEmployees[4]}
								onCreateShift={(newShift) => (onCreateShift(newShift))}>
								{
									shifts
										.filter((shift) => shift.ambulanceId === ambulance.ambulanceId)
										.filter((shift) => shift.date === format(addDays(mondayDate, 4), "yyyy-MM-dd'T'00:00:00"))
										.sort((a, b) => a.partOfTheDay - b.partOfTheDay)
										.map((shift) => (
											<ShiftDialog key={shift.shiftId} shift={shift} freeEmployees={freeEmployees[4]}
												onUpdateShift={(shiftId, updatedShift, previousEmployeeId) => onUpdateShift(shiftId, updatedShift, previousEmployeeId)}
												onDeleteShift={(deletedShift) => onDeleteShift(deletedShift)} />
										))
								}
							</AddShiftDialog>
						</div>

						<div id="saturday" className={cellClassNames}>
							<AddShiftDialog
								date={addDays(mondayDate, 5)}
								ambulanceId={ambulance.ambulanceId}
								freeEmployees={freeEmployees[5]}
								onCreateShift={(newShift) => (onCreateShift(newShift))}>
								{
									shifts
										.filter((shift) => shift.ambulanceId === ambulance.ambulanceId)
										.filter((shift) => shift.date === format(addDays(mondayDate, 5), "yyyy-MM-dd'T'00:00:00"))
										.sort((a, b) => a.partOfTheDay - b.partOfTheDay)
										.map((shift) => (
											<ShiftDialog key={shift.shiftId} shift={shift} freeEmployees={freeEmployees[5]}
												onUpdateShift={(shiftId, updatedShift, previousEmployeeId) => onUpdateShift(shiftId, updatedShift, previousEmployeeId)}
												onDeleteShift={(deletedShift) => onDeleteShift(deletedShift)} />
										))
								}
							</AddShiftDialog>
						</div>

						<div id="sunday">
							<AddShiftDialog
								date={addDays(mondayDate, 6)}
								ambulanceId={ambulance.ambulanceId}
								freeEmployees={freeEmployees[6]}
								onCreateShift={(newShift) => (onCreateShift(newShift))}>
								{
									shifts
										.filter((shift) => shift.ambulanceId === ambulance.ambulanceId)
										.filter((shift) => shift.date === format(addDays(mondayDate, 6), "yyyy-MM-dd'T'00:00:00"))
										.sort((a, b) => a.partOfTheDay - b.partOfTheDay)
										.map((shift) => (
											<ShiftDialog key={shift.shiftId} shift={shift} freeEmployees={freeEmployees[6]}
												onUpdateShift={(shiftId, updatedShift, previousEmployeeId) => onUpdateShift(shiftId, updatedShift, previousEmployeeId)}
												onDeleteShift={(deletedShift) => onDeleteShift(deletedShift)} />
										))
								}
							</AddShiftDialog>
						</div>
					</div>
				))}
		</section>
	)
}