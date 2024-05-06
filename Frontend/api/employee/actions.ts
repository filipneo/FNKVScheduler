import { AxiosResponse } from 'axios';
import { Employee } from './model';
import { axiosInstance, setAuthToken } from '../axiosInstance';

// [AllowAnonymous]
export const getAllEmployees = async (): Promise<Employee[]> => {
	try {
		const response = await axiosInstance.get('/employee/all');
		return response.data;
	} catch (error) {
		console.error('Error fetching employees:', error);
		throw error;
	}
};

export const getEmployee = async (employeeId: number, token: string | undefined): Promise<Employee> => {
	try {
		setAuthToken(token);
		const response = await axiosInstance.get(`/employee/detail/${employeeId}`);
		return response.data;
	} catch (error) {
		console.error('Error fetching employee', error);
		throw error;
	}
};

export const createEmployee = async (newEmployee: Employee, token: string | undefined) => {
	try {
		setAuthToken(token);
		const response = await axiosInstance.post('/employee/create', newEmployee);
		return response.data;
	} catch (error) {
		console.error('Error creating employee: ', error);
		throw error;
	}
};

export const updateEmployee = async (updatedEmployee: Employee, token: string | undefined) => {
	try {
		setAuthToken(token);
		const response = await axiosInstance.put(`/employee/update/${updatedEmployee.employeeId}`, updatedEmployee)
		return response.data;
	} catch (error) {
		console.error(`Error updating employee with ID ${updatedEmployee.employeeId}:`, error);
		throw error;
	}
}

export const getFreeEmployeesForDate = async (date: string, token: string | undefined): Promise<Employee[]> => {
	try {
		setAuthToken(token)
		const response: AxiosResponse<Employee[]> = await axiosInstance.get(`/employee/free?date=${date}`);
		return response.data;
	} catch (error) {
		console.error('Error fetching employees with no shifts:', error);
		throw error;
	}
};

export const getEmployeesByCategory = async (categories: number[], token: string | undefined): Promise<Employee[]> => {
	try {
		setAuthToken(token);
		const response: AxiosResponse<Employee[]> = await axiosInstance.get(`/employee/byCategory?category=${categories.join(',')}`);
		return response.data;
	} catch (error) {
		console.error('Error fetching employees by category:', error);
		throw error;
	}
};

export const deleteEmployee = async (employeeId: number, token: string | undefined) => {
	try {
		setAuthToken(token);
		const response = await axiosInstance.delete(`/employee/delete/${employeeId}`);
		return response.status
	} catch (error) {
		console.error('Error deleting employee: ', error);
		throw error;
	}
};