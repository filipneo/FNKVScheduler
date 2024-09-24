"use client"

import { useState, useEffect, useMemo } from "react";

import { useTranslations } from "next-intl";
import Cookies from "js-cookie";
import { getAllUsers } from "@/api/user/actions";
import { User } from "@/api/user/model";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import CreateUserDialog from "./create-user-dialog";

export default function UserPage() {

	const t = useTranslations("pages.users");
	const authToken = Cookies.get("authToken");
	const currentUser = Cookies.get("currentUser");

	const [users, setUsers] = useState<User[]>([])

	async function fetchData() {
		try {
			const response = await getAllUsers(authToken);
			setUsers(response);
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<main className="flex flex-col lg:w-2/5 mx-auto my-auto justify-between !mb-4">
			<Card>
				<CardHeader className="flex flex-row justify-between items-center border-b px-4 py-3">
					<CardTitle>
						{t("users")}
					</CardTitle>
					<CreateUserDialog />
				</CardHeader>

				<CardContent className="flex flex-col mt-4 gap-y-2 w-full">
					{users.map(users => (
						<div key={users.userId} className="flex flex-row items-center justify-between">
							<Label className="text-lg">
								{users.username}
							</Label>

							<div className="flex space-x-2">
								<Button variant={"secondary"}>
									{t("edit")}
								</Button>

								<Button variant={"destructive"} disabled={users.username == currentUser}>
									{t("delete")}
								</Button>
							</div>
						</div>
					))}
				</CardContent>
			</Card>
		</main>
	)
}
