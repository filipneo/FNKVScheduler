import { Department } from "./model";
import { axiosInstance, setAuthToken } from "../axiosInstance";

// [AllowAnonymous]
export const getAllDepartments = async (): Promise<Department[]> => {
	try {
		const response = await axiosInstance.get("/department/all");
		return response.data;
	} catch (error) {
		console.error("Error fetching departments: ", error);
		throw error;
	}
};

export const createDepartment = async (newDepartment: Department, token: string | undefined): Promise<Department> => {
	try {
		setAuthToken(token)
		const response = await axiosInstance.post("/department/create", newDepartment);
		return response.data;
	} catch (error) {
		console.error("Error creating employee: ", error);
		throw error;
	}
};

export const updateDepartment = async (updatedDepartment: Department, token: string | undefined): Promise<Department> => {
	try {
		setAuthToken(token)
		const response = await axiosInstance.put(`/department/update/${updatedDepartment.departmentId}`, updatedDepartment)
		return response.data;
	} catch (error) {
		console.error("ERROR updating department: ", error)
		throw error;
	}
}

export const deleteDepartment = async (departmentId: number, token: string | undefined) => {
	try {
		setAuthToken(token)
		const response = await axiosInstance.delete(`/department/delete/${departmentId}`);
		return response.status;
	} catch (error) {
		console.error("ERROR deleting department: ", error);
		throw error;
	}
}