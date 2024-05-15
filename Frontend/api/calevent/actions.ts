import { AxiosResponse } from "axios";
import { CalEvent } from "./model";
import { axiosInstance, setAuthToken } from "../axiosInstance";

export const getAllCalEvents = async (): Promise<CalEvent[]> => {
	try {
		const response: AxiosResponse<CalEvent[]> = await axiosInstance.get("/calevent/all");
		return response.data;
	} catch (error) {
		console.error("Error fetching calendar events: ", error);
		throw error;
	}
};

export const createCalEvent = async (calEvent: CalEvent, token: string | undefined): Promise<CalEvent> => {
	try {
		setAuthToken(token)
		const response: AxiosResponse<CalEvent> = await axiosInstance.post("/calevent/create", calEvent);
		return response.data;
	} catch (error) {
		console.error("Error creating calendar event: ", error);
		throw error;
	}
};

export const updateCalEvent = async (id: number, calEvent: CalEvent, token: string | undefined): Promise<CalEvent> => {
	try {
		setAuthToken(token)
		const response: AxiosResponse<CalEvent> = await axiosInstance.put(`/calevent/update/${id}`, calEvent);
		return response.data;
	} catch (error) {
		console.error("Error updating calendar event: ", error);
		throw error;
	}
};

export const deleteCalEvent = async (id: number, token: string | undefined): Promise<void> => {
	try {
		setAuthToken(token)
		await axiosInstance.delete(`/calevent/delete/${id}`);
	} catch (error) {
		console.error("Error deleting calendar event: ", error);
		throw error;
	}
};

// [AllowAnonymous]
export const getCalEventsForWeek = async (date: string): Promise<CalEvent[]> => {
	try {
		const response: AxiosResponse<CalEvent[]> = await axiosInstance.get(`/calevent/forWeek?date=${date}`);
		return response.data;
	} catch (error) {
		console.error("Error fetching calendar events for week: ", error);
		throw error;
	}
};
