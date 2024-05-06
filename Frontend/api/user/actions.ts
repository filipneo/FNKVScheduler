import { AxiosResponse } from 'axios';
import { User } from './model';
import { axiosInstance, setAuthToken } from '../axiosInstance';

export const getAllUsers = async (token: string | undefined): Promise<User[]> => {
	try {
		setAuthToken(token);
		const response: AxiosResponse<User[]> = await axiosInstance.get('/user/all');
		return response.data;
	} catch (error) {
		console.error('Error fetching users:', error);
		throw error;
	}
};

export const getUserDetail = async (id: number, token: string | undefined): Promise<User> => {
	try {
		setAuthToken(token);
		const response: AxiosResponse<User> = await axiosInstance.get(`/user/detail/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Error fetching user details for ID ${id}:`, error);
		throw error;
	}
};

export const createUser = async (userData: User, token: string | undefined): Promise<User> => {
	try {
		setAuthToken(token);
		const response: AxiosResponse<User> = await axiosInstance.post('/user/create', userData);
		return response.data;
	} catch (error) {
		console.error('Error creating user:', error);
		throw error;
	}
};

export const updateUser = async (id: number, userData: User, token: string | undefined): Promise<User> => {
	try {
		setAuthToken(token);
		const response: AxiosResponse<User> = await axiosInstance.put(`/user/update/${id}`, userData);
		return response.data;
	} catch (error) {
		console.error(`Error updating user with ID ${id}:`, error);
		throw error;
	}
};

export const deleteUser = async (id: number, token: string | undefined): Promise<void> => {
	try {
		setAuthToken(token);
		await axiosInstance.delete(`/user/delete/${id}`);
	} catch (error) {
		console.error(`Error deleting user with ID ${id}:`, error);
		throw error;
	}
};

// [AllowAnonymous]
export const checkUserExistence = async (token: string): Promise<User | null> => {
	try {
		const response: AxiosResponse<User> = await axiosInstance.get(`/user/exist?token=${token}`);
		return response.data;
	} catch (error) {
		console.error('Error checking user existence:', error);
		return null
	}
};

// [AllowAnonymous]
export const checkConnection = async (): Promise<void> => {
	try {
		await axiosInstance.get('/user/checkConnection');
	} catch (error) {
		console.error('Error checking connection:', error);
		throw error;
	}
};