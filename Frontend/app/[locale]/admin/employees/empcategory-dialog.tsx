"use client"

import { useState } from 'react';

import { useTranslations } from 'next-intl';
import Cookies from "js-cookie";

import { createEmpCategory, deleteEmpCategory, updateEmpCategory } from '@/api/empCategory/actions';
import { EmpCategory } from '@/api/empCategory/model';

import { useForm } from 'react-hook-form';

import { Briefcase, MoreHorizontal } from "lucide-react";

import ColorPicker from '@/components/color-picker';

import { Label } from '@/components/ui/label';
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface EditCategoryFormProps {
	empCategory: EmpCategory;
	onSave: (data: EmpCategory) => void;
	onCancel: () => void;
	t: any
}

function EditEmpCategoryForm({ empCategory, onSave, onCancel , t}: EditCategoryFormProps) {
	const {
		handleSubmit,
		register,
		setValue
	} = useForm<EmpCategory>({ defaultValues: empCategory });

	const setUpdatedColor = (updatedColor: string) => {
		setValue("color", updatedColor);
	}

	const onSubmit = (updatedEmpCategory: EmpCategory) => {
		onSave(updatedEmpCategory);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-row space-x-1 items-center">
			<Input type="text" {...register("name", { required: true })} />
			<ColorPicker onColorChange={setUpdatedColor} value={empCategory.color} />
			<Button type="submit" size={"sm"}>{t("save")}</Button>
			<Button type="button" size={"sm"} variant={"secondary"} onClick={onCancel}>{t("cancel")}</Button>
		</form>
	);
}

export default function EmpCategoryDialog({ empCategories }: { empCategories: EmpCategory[] | null }) {

	const t = useTranslations("pages.employees")
	const authToken = Cookies.get("authToken");

	const [editCategoryId, setEditCategoryId] = useState<number | null>(null);
	const [newEmpCategoryMode, setNewCategoryMode] = useState<boolean>(false);

	const defaultColor = "#0e7d01";

	const {
		handleSubmit,
		register,
		setValue,
		reset,
		formState: { isValid }
	} = useForm<EmpCategory>();

	const setNewColor = (newColor: string) => {
		setValue("color", newColor);
	}

	const handleCreateEmpCategory = async (newEmpCategory: EmpCategory) => {
		if (newEmpCategory.color == undefined) newEmpCategory.color = defaultColor;
		const responseEmpCategory = await createEmpCategory(newEmpCategory, authToken);
		setNewCategoryMode(false);
		window.location.reload()
	}

	const handleCancelEdit = () => {
		reset();
		setEditCategoryId(null);
	};

	const handleUpdateEmpCategory = async (empCategoryId: number, updatedEmpCategory: EmpCategory) => {
		const responseEmpCategory = await updateEmpCategory(empCategoryId, updatedEmpCategory, authToken);
		setEditCategoryId(null);
		window.location.reload()
	};

	const handleDeleteEmpCategory = async (empCategory: EmpCategory) => {
		await deleteEmpCategory(empCategory.empCategoryId, authToken);
		window.location.reload()
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant={'outline'}>
					<Briefcase />
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle className='text-xl'>
						{t("workRole")}
					</DialogTitle>
				</DialogHeader>

				{empCategories?.map((category) => (
					<div key={category.empCategoryId}>
						{editCategoryId === category.empCategoryId ? (
							<EditEmpCategoryForm
								empCategory={category}
								onSave={(updatedEmpCategory) => handleUpdateEmpCategory(category.empCategoryId, updatedEmpCategory)}
								onCancel={handleCancelEdit}
								t={t}
							/>
						) : (
							<div className="flex flex-row justify-between items-center pl-3 rounded-md border">
								<div className="flex flex-row space-x-2 items-center">
									<div style={{ backgroundColor: category.color }} className="rounded-full w-3 h-3" />
									<Label className='text-md'>{category.name}</Label>
								</div>

								<DropdownMenu>

									<DropdownMenuTrigger asChild>
										<Button variant={'ghost'} size={'icon'}>
											<MoreHorizontal />
										</Button>
									</DropdownMenuTrigger>

									<DropdownMenuContent align="end">
										<DropdownMenuItem
											onClick={() => setEditCategoryId(category.empCategoryId)}>
											{t("edit")}
										</DropdownMenuItem>

										<DropdownMenuSeparator />

										<DropdownMenuItem onClick={(e) => e.preventDefault()}>
											<AlertDialog>
												<AlertDialogTrigger className="w-full text-left text-red-600">
													{t("delete")}
												</AlertDialogTrigger>

												<AlertDialogContent>

													<AlertDialogHeader>
														<AlertDialogTitle>{t("areYouSure")}</AlertDialogTitle>
														<AlertDialogDescription>
															{t("deleteEmpCategeoryAlertDescription")}
														</AlertDialogDescription>
													</AlertDialogHeader>

													<AlertDialogFooter>
														<AlertDialogCancel className="font-semibold">{t("cancel")}</AlertDialogCancel>
														<AlertDialogAction className="hover:bg-destructive hover:text-destructive-foreground font-semibold"
															onClick={() => handleDeleteEmpCategory(category)}>
															{t("delete")}
														</AlertDialogAction>
													</AlertDialogFooter>

												</AlertDialogContent>
											</AlertDialog>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						)}
					</div>
				))}

				<DialogFooter>
					{newEmpCategoryMode &&
						<form onSubmit={handleSubmit(handleCreateEmpCategory)} className="w-full flex flex-row space-x-1 items-center">
							<Input type="text" placeholder={t("name")} {...register("name", { required: true })} />

							<ColorPicker onColorChange={setNewColor} value={defaultColor} />

							<Button type="submit" size={"sm"} disabled={!isValid}>
								{t("create")}
							</Button>

							<Button type="button" size={"sm"} variant={"secondary"}
								onClick={() => { setNewCategoryMode(false); reset() }}>
								{t("cancel")}
							</Button>
						</form>

						||

						<Button onClick={() => setNewCategoryMode(true)}>
							{t("newWorkRole")}
						</Button>
					}
				</DialogFooter>

			</DialogContent>

		</Dialog>
	)
}