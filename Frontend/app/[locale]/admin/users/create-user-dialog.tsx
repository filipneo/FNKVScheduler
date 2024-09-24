import { createUser } from '@/api/user/actions'
import { User } from '@/api/user/model'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { UserPlus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Cookies from "js-cookie";

import React from 'react'
import { useForm } from 'react-hook-form'

export default function CreateUserDialog() {

	const t = useTranslations("pages.users");

	const token = Cookies.get("authToken");

	const {
		handleSubmit,
		register,
		reset,
		formState: { isValid }
	} = useForm<User>();

	const onSubmit = async (newUser: User) => {

		await createUser(newUser, token);
		// reset();
		// window.location.reload(); // TODO more elegant way
	}


	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="default">
					<UserPlus />
				</Button>
			</DialogTrigger>

			<DialogContent>

				<DialogHeader>
					<DialogTitle>
						{t("newUser")}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
					<div className="flex flex-col justify-between space-y-2">
						<Input
							type="text"
							placeholder={t("username")}
							{...register("username", { required: true })}
						/>

						<Input
							type="password"
							placeholder={t("password")}
							{...register("password", { required: true })}
						/>
					</div>

					<DialogFooter>
						<Button type="submit" disabled={!isValid}>
							{t("create")}
						</Button>
					</DialogFooter>
				</form>

			</DialogContent>
		</Dialog>
	)
}
