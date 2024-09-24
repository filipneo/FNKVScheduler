"use client"

import { useTranslations } from "next-intl";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";

import { LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogAction,
	AlertDialogCancel
} from "./ui/alert-dialog"


export default function LogoutButton() {

	const t = useTranslations("components.logOutAlert")

	const router = useRouter();

	const handleLogout = () => {
		Cookies.remove("authToken");
		Cookies.remove("currentUser");
		router.push("/");
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="outline" size="icon">
					<LogOut className="p-0.5" />
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{t("areYouSure")}</AlertDialogTitle>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel className="font-semibold">
						{t("cancel")}
					</AlertDialogCancel>
					<AlertDialogAction onClick={handleLogout} className="font-semibold">
						{t("logOut")}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}