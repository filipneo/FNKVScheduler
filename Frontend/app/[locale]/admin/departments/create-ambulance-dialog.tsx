import { useTranslations } from "next-intl";
import Cookies from "js-cookie";

import { createAmbulance } from "@/api/ambulance/actions";

import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { Ambulance } from "@/api/ambulance/model";
import { Dialog, DialogHeader, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function AddAmbulanceDialog({ departmentId, onPost }: { departmentId: number, onPost: (newAmbulance: Ambulance) => void }) {

	const t = useTranslations("pages.departments");
	const authToken = Cookies.get("authToken");

	const {
		register,
		handleSubmit,
		formState: { isValid }
	} = useForm<Ambulance>();

	const dialogClose = () => {
		document.getElementById('closeDialog')?.click();
	  };

	const onSubmit = async (newAmbulance: Ambulance) => {
		newAmbulance.departmentId = departmentId
		var responseAmbulance = await createAmbulance(newAmbulance, authToken);
		onPost(responseAmbulance)
		dialogClose();
	}

	return (
		<Dialog>
			<DialogTrigger className="w-full text-left">
				{t("addAmbulance")}
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{t("newAmbulance")}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className='space-y-4 mt-4'>
					<Input type='text' placeholder={t("name")} className="w-1/2"
						{...register('name', { required: true })}
					/>

					<div className="flex flew-row justify-between gap-x-2">
						<Input type='number' placeholder="Min"
							{...register('minCap', { required: true })}
						/>

						<Input type='number' placeholder="Opt"
							{...register('optCap', { required: true })}
						/>

						<Input type='number' placeholder="Max"
							{...register('maxCap', { required: true })}
						/>
					</div>

					<DialogFooter>
						<Button type="submit" disabled={!isValid}
							onClick={handleSubmit(onSubmit)}>
							{t("create")}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}