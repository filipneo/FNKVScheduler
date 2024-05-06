"use client"

import { useState } from "react";

import { Link } from "@/navigation";

import { useTranslations } from "next-intl";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import { User } from "@/api/user/model"
import { checkUserExistence } from "@/api/user/actions";

import { useForm } from "react-hook-form";

import { ChevronLeft } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

export default function AuthPage() {

	const t = useTranslations("pages.auth");

	const router = useRouter();
	const [invalidLogin, setInvalidLogin] = useState("");

	const {
		handleSubmit,
		register,
		formState: { isValid }
	} = useForm<User>();

	const onSubmit = async (loginData: User) => {
		const token = btoa(`${loginData.username}:${loginData.password}`);
		const response = await checkUserExistence(token);
		if (response !== null) {
			Cookies.set("authToken", token, { expires: 0.2 }); // 4 Hours
			router.push("/admin");
		} else {
			setInvalidLogin(t("invalidLogin"))
		}
	}

	const handleEnterKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter" && isValid) {
			handleSubmit(onSubmit)();
		}
	};

	return (
		<section>
			<Link href={"/"}>
				<Button variant={"ghost"} size={"icon"} onClick={() => router.back()} className="mt-4 ml-4">
					<ChevronLeft size={"32"} />
				</Button>
			</Link>

			<div className="h-screen -mt-16 flex flex-col justify-center items-center">
				<Card className="w-96 p-6">
					<CardHeader>
						<CardTitle>
							{t("title")}
						</CardTitle>
					</CardHeader>

					<form onSubmit={handleSubmit(onSubmit)}>
						<CardContent className="flex flex-col space-y-2">
							<Input
								type="text"
								placeholder={t("usernameInput")}
								{...register("username", { required: true })}
							/>

							<Input
								type="password"
								placeholder={t("passwordInput")}
								{...register("password", { required: true })}
								onKeyDown={handleEnterKeyPress}
							/>

							{invalidLogin && <Label className="text-red-500">{invalidLogin}</Label>}

							{/*
							<div className="flex flex-row items-center space-x-2 ">
								<CardDescription>
									{t("forgotPassword.label")}
								</CardDescription>

								<Button variant={"link"} size={"sm"} className="p-0 h-4">
									{t("forgotPassword.link")}
								</Button>
							</div>
							*/}
						</CardContent>

						<CardFooter>
							<Button type="submit" disabled={!isValid}>
								{t("submitButton")}
							</Button>
						</CardFooter>
					</form>
				</Card>
			</div>
		</section>
	)
}