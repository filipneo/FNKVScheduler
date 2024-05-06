import { useTranslations } from "next-intl";
import Cookies from 'js-cookie';

import { deleteVacation } from "@/api/vacation/actions";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

export default function DeleteVacationAlert({ vacationId, onDelete }: { vacationId: number, onDelete: (deletedVacationId: number) => void }) {

	const t = useTranslations("pages.vacations");
	const authToken = Cookies.get("authToken");

	const handleDeleteVacation = async () => {
		try {
			await deleteVacation(vacationId, authToken);
			onDelete(vacationId)
		} catch (error) {
		}
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger className="w-full text-left text-red-600">
				{t("delete")}
			</AlertDialogTrigger>

			<AlertDialogContent>

				<AlertDialogHeader>
					<AlertDialogTitle>{t("areYouSure")}</AlertDialogTitle>
					<AlertDialogDescription>
						{t("deleteAlertDescription")}
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel className="font-semibold">{t("cancel")}</AlertDialogCancel>
					<AlertDialogAction onClick={handleDeleteVacation}
						className="hover:bg-destructive hover:text-destructive-foreground font-semibold">
						{t("delete")}
					</AlertDialogAction>
				</AlertDialogFooter>

			</AlertDialogContent>
		</AlertDialog>
	)
}