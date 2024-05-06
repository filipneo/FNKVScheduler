import { useTranslations } from "next-intl"
import Cookies from "js-cookie";

import { deleteAmbulance } from "@/api/ambulance/actions"

import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

export default function DeleteAmbulanceAlert({ ambulanceId, onDelete }: { ambulanceId: number, onDelete: (deletedAmbulanceId: number) => void }) {

	const t = useTranslations("pages.departments");
	const authToken = Cookies.get("authToken");

	const handleDelete = async () => {
		try {
			await deleteAmbulance(ambulanceId, authToken);
			onDelete(ambulanceId);
		} catch (error) { }
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button className='hover:bg-destructive px-2'
					variant={'ghost'}
					size={'sm'}>
					<Trash2 strokeWidth={1.5} />
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{t("areYouSure")}</AlertDialogTitle>
					<AlertDialogDescription>
						{t("deleteAmbulanceAlertDescription")}
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel className="font-semibold">{t("cancel")}</AlertDialogCancel>
					<AlertDialogAction onClick={handleDelete}
						className="hover:bg-destructive hover:text-destructive-foreground font-semibold">
						{t("delete")}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}