import { CalEvent } from "@/api/calevent/model";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { addDays, format } from "date-fns";
import { useTranslations } from "next-intl";



export default function WeeksCalEvents({ calEvents, monday }: { calEvents: CalEvent[], monday: Date }) {

	const t = useTranslations("components.weeksCalEvents")

	return (
		<Card className="w-full">
			<CardHeader className="flex flex-row items-center justify-between border-b h-16">
				<CardTitle>
					{t("title")}
				</CardTitle>


				<CardDescription>
					{format(monday, "d. M.")} - {format(addDays(monday, 6), "d. M. yyyy")}
				</CardDescription>
			</CardHeader>

			<CardContent className="flex flex-row py-4 space-x-2 w-full container">
				{calEvents.map((event) => (
					<Card key={event.calEventId} className="w-52">
						<CardHeader className="border-b py-2">
							<CardTitle className="text-lg">{event.name}</CardTitle>
						</CardHeader>

						<CardContent className="flex flex-col py-3">
							{
								event.from == event.to ? (
									<Label className="mb-2">{t("on")} {format(new Date(event.from), "d. M.")}</Label>
								) : (
									<Label className="mb-2">{format(new Date(event.from), "d. M.")} - {format(new Date(event.to), "d. M.")}</Label>
								)
							}

							<CardDescription>{event.note}</CardDescription>
						</CardContent>
					</Card>
				))}
			</CardContent>
		</Card>
	)
}
