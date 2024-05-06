import { useTranslations } from "next-intl";
import Cookies from "js-cookie";

import { deleteDepartment } from "@/api/department/actions";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

export default function DeleteDepartmentAlert({ departmentId, onDelete }: { departmentId: number, onDelete: (deleteDepartmentID: number) => void }) {

	const t = useTranslations("pages.departments")
	const authToken = Cookies.get("authToken");

	const handleDelete = async () => {
		try {
			await deleteDepartment(departmentId, authToken);
			onDelete(departmentId)
		} catch (error) { }
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger className="w-full text-left">
				{t("delete")}
			</AlertDialogTrigger>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{t("areYouSure")}</AlertDialogTitle>
					<AlertDialogDescription>
						{t("deleteDepartmentAlertDescription")}
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
					<AlertDialogAction onClick={handleDelete}
						className="hover:bg-destructive hover:text-destructive-foreground font-semibold">
						{t("delete")}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}