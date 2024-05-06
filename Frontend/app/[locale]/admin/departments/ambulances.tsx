"use client"

import { useState } from "react"

import { Ambulance } from "@/api/ambulance/model"

import UpdateAmbulanceDialog from "./update-ambulance-dialog"
import DeleteAmbulanceAlert from "./delete-ambulance-alert"

import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Ambulances({ departmentId, ambulances }: { departmentId: number, ambulances: Ambulance[] | null }) {

	const [ambulanceList, setAmbulanceList] = useState<Ambulance[] | null>(ambulances);

	const handlePutAmbulance = (updatedAmbulance: Ambulance) => {
		const updatedAmbulances = ambulanceList ? [...ambulanceList] : [];
		const index = updatedAmbulances.findIndex(
			(ambulance) => ambulance.ambulanceId === updatedAmbulance.ambulanceId
		);
		if (index !== -1)
			updatedAmbulances[index] = updatedAmbulance;
		setAmbulanceList(updatedAmbulances)
	}

	const handleDeleteAmbulance = (deletedAmbulanceId: number) => {
		const updatedAmbulanceList = ambulanceList?.filter(ambulance => ambulance.ambulanceId !== deletedAmbulanceId);
		if (updatedAmbulanceList !== undefined)
			setAmbulanceList(updatedAmbulanceList);
	}

	return (
		<section className="flex flex-row mt-4 gap-x-2 w-full container">
			{ambulanceList
				?.filter((ambulance) => ambulance.departmentId === departmentId)
				.map((ambulance) => (
					<Card key={ambulance.ambulanceId}>
						<CardHeader>
							<CardTitle className="text-base">{ambulance.name}</CardTitle>
						</CardHeader>

						<CardContent className="flex flex-row gap-x-2 items-center">
							<Label>Min: {ambulance.minCap}</Label>
							<Label className="border-x px-2">Opt: {ambulance.optCap}</Label>
							<Label>Max: {ambulance.maxCap}</Label>
						</CardContent>

						<CardFooter className="w-full justify-between">
							<UpdateAmbulanceDialog ambulance={ambulance} onPut={handlePutAmbulance} />
							<DeleteAmbulanceAlert ambulanceId={ambulance.ambulanceId} onDelete={handleDeleteAmbulance} />
						</CardFooter>
					</Card>
				))}
		</section>
	)
}