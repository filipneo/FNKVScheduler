export type CalEvent = {
	calEventId: number,
	name: string,
	note?: string,
	from: Date | string,
	to: Date | string,
	color: string
}