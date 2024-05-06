import { useTranslations } from "next-intl";
import Cookies from "js-cookie";

import { deleteEmployee } from "@/api/employee/actions";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function DeleteEmployeeAlert({ employeeId, onDelete }: { employeeId: number, onDelete: (deletedEmployeeId: number) => void }) {

	const t = useTranslations("pages.employees");
	const token = Cookies.get("authToken");

	const handleDeleteEmployee = async () => {
		try {
			await deleteEmployee(employeeId, token);
			onDelete(employeeId)
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
					<AlertDialogCancel className="font-semibold">
						{t("cancel")}
					</AlertDialogCancel>
					<AlertDialogAction onClick={handleDeleteEmployee}
						className="hover:bg-destructive hover:text-destructive-foreground font-semibold">
						{t("delete")}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}