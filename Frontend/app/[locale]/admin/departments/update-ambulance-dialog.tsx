import { useTranslations } from "next-intl";
import Cookies from "js-cookie";

import { Ambulance } from "@/api/ambulance/model"
import { updateAmbulance } from "@/api/ambulance/actions";

import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { Dialog, DialogHeader, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function UpdateAmbulanceDialog({ ambulance, onPut }: { ambulance: Ambulance, onPut: (updatedAmbulance: Ambulance) => void }) {

	const t = useTranslations("pages.departments");
	const authToken = Cookies.get("authToken");

	const {
		register,
		handleSubmit,
		formState: { isValid },
	} = useForm<Ambulance>({ defaultValues: ambulance });

	const dialogClose = () => {
		document.getElementById('closeDialog')?.click();
	};

	const onSubmit = async (updatedAmbulance: Ambulance) => {
		console.log(updatedAmbulance);
		var responseAmbulance = await updateAmbulance(updatedAmbulance, authToken);
		onPut(responseAmbulance);
		dialogClose();
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					className="font-semibold"
					variant={'outline'}
					size={"sm"}>
					{t("edit")}
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{t("editAmbulance")}
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
						<Button type="submit" disabled={!isValid}>
							{t("save")}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}