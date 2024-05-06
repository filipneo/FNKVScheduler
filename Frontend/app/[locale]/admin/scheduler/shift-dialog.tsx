import { Employee } from "@/api/employee/model";
import { Shift } from "@/api/shift/model";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogTrigger, DialogDescription, DialogClose } from "@/components/ui/dialog";

import { useForm, Controller } from "react-hook-form";
import { filterEmployeesByFixedAmbulanceId, formatDate, formatDateForAPI, partOfTheDayClass, partOfTheDayText } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function ShiftDialog({
	shift,
	freeEmployees,
	onUpdateShift,
	onDeleteShift
}: {
	shift: Shift,
	freeEmployees: Employee[],
	onUpdateShift: (
		shiftId: number,
		updatedShift: Shift,
		previousEmployeeId?: number
	) => void,
	onDeleteShift: (deletedShift: Shift) => void
}) {

	const t = useTranslations("pages.scheduler.shiftDialog");

	const {
		control,
		handleSubmit,
		register,
		setValue
	} = useForm<Shift>({ defaultValues: shift });

	const filteredFreeEmployees = filterEmployeesByFixedAmbulanceId(freeEmployees, shift.ambulanceId);

	const onSubmit = async (updatedShift: Shift) => {
		updatedShift.date = formatDateForAPI(new Date(shift.date));
		updatedShift.ambulanceId = shift.ambulanceId;
		console.log(updatedShift);
		if (updatedShift.employeeId === shift.employeeId) {
			onUpdateShift(shift.shiftId, updatedShift);
		} else {
			onUpdateShift(shift.shiftId, updatedShift, updatedShift.employeeId);
		}
	};

	return (
		<Dialog>
			<DialogTrigger asChild
				className={partOfTheDayClass[shift.partOfTheDay]}
				onClick={(event) => event.stopPropagation()}>
				{
					shift.employee?.empCategory &&

					<span style={{ backgroundColor: shift.employee.empCategory.color }}
						className="rounded-full px-2.5 py-0.5 text-sm font-semibold cursor-pointer hover:bg-opacity-80 text-black">
						{shift.employee.nameCode}
					</span>

					||

					<span className="rounded-full px-2.5 py-0.5 text-sm font-semibold cursor-pointer bg-primary hover:bg-primary/80 text-primary-foreground">
						{shift.employee?.nameCode}
					</span>
				}
			</DialogTrigger>

			<DialogContent onClick={(event) => event.stopPropagation()}>
				<Tabs defaultValue="detail">
					<TabsContent value="detail" className="mt-4">
						<div className="space-y-2 px-4">
							<div className="flex flex-row gap-x-2 w-full">
								<div className="w-1/2">
									<DialogDescription>{t("name")}</DialogDescription>
									<Label className="text-lg -mt-4">{shift.employee?.firstName} {shift.employee?.lastName}</Label>
								</div>
								<div className="w-1/2">
									<DialogDescription>{t("typeOfShift")}</DialogDescription>
									<Label className="text-lg -mt-4">{t(partOfTheDayText[shift.partOfTheDay])}</Label>
								</div>
							</div>

							<div className="flex flex-row gap-x-2 w-full">
								<div className="w-1/2">
									<DialogDescription>{t("date")}</DialogDescription>
									<Label className="text-lg -mt-4">{formatDate(shift.date as string)}</Label>
								</div>

								{shift.note &&
									<div className="w-1/2">
										<DialogDescription>{t("note")}</DialogDescription>
										<Label className="text-lg -mt-4">{shift.note}</Label>
									</div>
								}
							</div>
						</div>
					</TabsContent>

					<TabsContent value="update" className="mt-6">
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
							<div className="flex flew-row justify-between gap-x-2">
								<Controller
									control={control}
									name="employeeId"
									render={({ field }) => (
										<Select
											value={field.value.toString()}
											onValueChange={(value) => setValue("employeeId", Number(value))}
										>
											<SelectTrigger className="w-1/2">
												<SelectValue />
											</SelectTrigger>

											<SelectContent>
												<ScrollArea className="max-h-72 rounded-md">
													<SelectItem key={shift.employeeId} value={shift.employeeId.toString()}>
														<div className="flex flex-row items-center gap-x-2">
															<div style={{ backgroundColor: shift.employee?.empCategory.color }} className="rounded-full w-3 h-3" />
															<p>{shift.employee?.firstName} {shift.employee?.lastName}</p>
														</div>
													</SelectItem>

													{filteredFreeEmployees.map((employee) => (
														<SelectItem
															key={String(employee.employeeId)}
															value={String(employee.employeeId)}
														>
															<div className="flex flex-row items-center gap-x-2">
																<div style={{ backgroundColor: employee.empCategory.color }} className="rounded-full w-3 h-3" />
																<p>{employee.firstName} {employee.lastName}</p>
															</div>
														</SelectItem>
													))}
												</ScrollArea>
											</SelectContent>
										</Select>
									)}
								/>

								<Controller
									control={control}
									name="partOfTheDay"
									render={({ field }) => (
										<Select
											value={field.value.toString()}
											onValueChange={(value) => setValue("partOfTheDay", Number(value))}
										>
											<SelectTrigger className="w-1/2">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="0">{t("morningShift")}</SelectItem>
												<SelectItem value="1">{t("afternoonShift")}</SelectItem>
												<SelectItem value="2">{t("dayShift")}</SelectItem>
											</SelectContent>
										</Select>
									)}
								/>
							</div>

							<div className="flex flew-row justify-between gap-x-2">
								<Input
									className="w-full"
									type="text"
									placeholder={t("note")}
									{...register("note")}
								/>

								<DialogClose asChild>
									<Button type="submit" className="font-semibold">
										{t("save")}
									</Button>
								</DialogClose>
							</div>
						</form>
					</TabsContent>

					<TabsContent value="delete" className="mt-6">
						<Label className="text-lg font-semibold">
							{t("areYouSure")}
						</Label>

						<DialogDescription className="mt-2">
							{t("deleteAlertDescription")}
						</DialogDescription>

						<DialogFooter>
							<Button onClick={() => onDeleteShift(shift)}
								className="hover:bg-destructive hover:text-destructive-foreground font-semibold">
								{t("delete")}
							</Button>
						</DialogFooter>
					</TabsContent>

					<DialogFooter>
						<TabsList className="grid w-full grid-cols-3 mt-6">
							<TabsTrigger value="detail">{t("detail")}</TabsTrigger>
							<TabsTrigger value="update">{t("edit")}</TabsTrigger>
							<TabsTrigger value="delete">{t("delete")}</TabsTrigger>
						</TabsList>
					</DialogFooter>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}