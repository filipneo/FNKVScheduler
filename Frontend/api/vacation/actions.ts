import { Vacation } from './model';
import { axiosInstance, setAuthToken } from '../axiosInstance';

export const getAllVacations = async (token: string | undefined): Promise<Vacation[]> => {
	try {
		setAuthToken(token);
		const response = await axiosInstance.get('/vacation/all');
		return response.data;
	} catch (error) {
		console.error('Error fetching vacations:', error);
		throw error;
	}
};

export const getVacationDetail = async (vacationId: number, token: string | undefined): Promise<Vacation> => {
	try {
		setAuthToken(token);
		const response = await axiosInstance.get(`/vacation/detail/${vacationId}`);
		return response.data;
	} catch (error) {
		console.error('Error fetching vacation', error);
		throw error;
	}
};

export const getVacationsByFilter = async (
	state: number[],
	category: number[],
	from: string = '',
	to: string = ''
): Promise<Vacation[]> => {
	try {
		// To match [FromQuery] in Web API
		const stateParams = state.map(state => `state=${state}`).join('&');
		const categoryParams = category.map(category => `&category=${category}`).join('&');

		const response = await axiosInstance.get(`/vacation/byFilter?${stateParams}${categoryParams}&from=${from}&to=${to}`);

		return response.data;
	} catch (error) {
		console.error('Error fetching vacations by filter:', error);
		throw error;
	}
};


export const createVacation = async (newVacation: Vacation, token: string | undefined): Promise<Vacation> => {
	try {
		setAuthToken(token);
		const response = await axiosInstance.post('/vacation/create', newVacation);
		return response.data;
	} catch (error) {
		console.error('Error creating vacation:', error);
		throw error;
	}
};

export const updateVacation = async (vacationId: number, updatedVacation: Vacation, token: string | undefined): Promise<Vacation> => {
	try {
		setAuthToken(token);
		const response = await axiosInstance.put(`/vacation/update/${vacationId}`, updatedVacation);
		return response.data;
	} catch (error) {
		console.error(`Error updating vacation with ID ${vacationId}:`, error);
		throw error;
	}
};

export const deleteVacation = async (vacationId: number, token: string | undefined): Promise<number> => {
	try {
		setAuthToken(token);
		const response = await axiosInstance.delete(`/vacation/delete/${vacationId}`);
		return response.status;
	} catch (error) {
		console.error('Error deleting vacation:', error);
		throw error;
	}
};

// [AllowAnonymous]
export const requestVacation = async (newVacation: any): Promise<Vacation> => {
	try {
		const response = await axiosInstance.post('/vacation/request', newVacation);
		return response.data;
	} catch (error) {
		console.error('Error requesting vacation:', error);
		throw error;
	}
};
