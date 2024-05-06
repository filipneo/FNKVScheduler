import { AxiosResponse } from "axios";
import { Shift } from "./model";
import { axiosInstance, setAuthToken } from "../axiosInstance";

export const getAllShifts = async (token: string | undefined): Promise<Shift[]> => {
	try {
		setAuthToken(token)
		const response: AxiosResponse<Shift[]> = await axiosInstance.get("/shift/all");
		return response.data;
	} catch (error) {
		console.error("Error fetching shifts:", error);
		throw error;
	}
};

export const getShiftDetail = async (id: number, token: string | undefined): Promise<Shift> => {
	try {
		setAuthToken(token)
		const response: AxiosResponse<Shift> = await axiosInstance.get(`/shift/detail?id=${id}`);
		return response.data;
	} catch (error) {
		console.error("Error fetching shift details: ", error);
		throw error;
	}
};

export const createShift = async (shift: Shift, token: string | undefined): Promise<Shift> => {
	try {
		setAuthToken(token)
		const response: AxiosResponse<Shift> = await axiosInstance.post("/shift/create", shift);
		return response.data;
	} catch (error) {
		console.error("Error creating shift: ", error);
		throw error;
	}
};

export const updateShift = async (id: number, shift: Shift, token: string | undefined): Promise<Shift> => {
	try {
		setAuthToken(token)
		const response: AxiosResponse<Shift> = await axiosInstance.put(`/shift/update/${id}`, shift);
		return response.data;
	} catch (error) {
		console.error("Error updating shift: ", error);
		throw error;
	}
};

export const deleteShift = async (id: number, token: string | undefined): Promise<void> => {
	try {
		setAuthToken(token)
		await axiosInstance.delete(`/shift/delete/${id}`);
	} catch (error) {
		console.error("Error deleting shift: ", error);
		throw error;
	}
};

export const copyPrevWeek = async (dateFrom: string, dateTo: string, token: string | undefined): Promise<void> => {
	try {
		setAuthToken(token)
		await axiosInstance.get(`/shift/copyWeek?dateFrom=${dateFrom}&dateTo=${dateTo}`);
	} catch (error) {
		console.error("Error copying shifts from the previous week:", error);
		throw error;
	}
};

export const genFromPref = async (date: string, token: string | undefined): Promise<void> => {
	try {
		setAuthToken(token)
		await axiosInstance.get(`/shift/genFromPref?date=${date}`);
	} catch (error) {
		console.error("Error generating shifts from preferences:", error);
		throw error;
	}
};

export const getShiftsByDate = async (date: string, token: string | undefined): Promise<Shift[]> => {
	try {
		setAuthToken(token)
		const response: AxiosResponse<Shift[]> = await axiosInstance.get(`/shift/byDate?date=${date}`);
		return response.data;
	} catch (error) {
		console.error("Error fetching shifts for date: ", error);
		throw error;
	}
};

// [AllowAnonymous]
export const getShiftsForWeek = async (date: string): Promise<Shift[]> => {
	try {
		const response: AxiosResponse<Shift[]> = await axiosInstance.get(`/shift/forWeek?date=${date}`);
		return response.data;
	} catch (error) {
		console.error("Error fetching shifts for week: ", error);
		throw error;
	}
};