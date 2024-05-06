import { Ambulance } from "./model";
import { axiosInstance, setAuthToken } from "../axiosInstance";

// [AllowAnonymous]
export const getAllAmbulances = async (): Promise<Ambulance[]> => {
	try {
		const response = await axiosInstance.get("/ambulance/all");
		return response.data;
	} catch (error) {
		console.error("Error fetching ambulances: ", error);
		throw error;
	}
};

export const createAmbulance = async (newAmbulance: Ambulance, token: string | undefined) => {
	try {
		setAuthToken(token)
		const response = await axiosInstance.post("/ambulance/create", newAmbulance);
		return response.data;
	} catch (error) {
		console.error("Error creating ambulance: ", error);
		throw error;
	}
};

export const updateAmbulance = async (updatedAmbulance: Ambulance, token: string | undefined) => {
	try {
		setAuthToken(token)
		const response = await axiosInstance.put(`/ambulance/update/${updatedAmbulance.ambulanceId}`, updatedAmbulance)
		return response.data;
	} catch (error) {
		console.error("Error updating ambulance: ", error)
		throw error;
	}
}

export const deleteAmbulance = async (id: number, token: string | undefined) => {
	try {
		setAuthToken(token)
		const response = await axiosInstance.delete(`/ambulance/delete/${id}`);
		return response.status;
	} catch (error) {
		console.error("Error deleting ambulance: ", error);
		throw error;
	}
};