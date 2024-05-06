import { EmpCategory } from "./model";
import { axiosInstance, setAuthToken } from "../axiosInstance";

// [AllowAnonymous]
export const getAllEmpCategories = async (): Promise<EmpCategory[]> => {
	try {
		const response = await axiosInstance.get("/empcategory/all");
		return response.data;
	} catch (error) {
		console.error("Error fetching employee categories: ", error);
		throw error;
	}
};

export const createEmpCategory = async (empCategoryData: EmpCategory, token: string | undefined): Promise<EmpCategory> => {
	try {
		setAuthToken(token)
		const response = await axiosInstance.post("/empcategory/create", empCategoryData);
		return response.data;
	} catch (error) {
		console.error("Error creating employee category: ", error);
		throw error;
	}
};

export const updateEmpCategory = async (id: number, empCategoryData: EmpCategory, token: string | undefined): Promise<EmpCategory> => {
	try {
		setAuthToken(token)
		const response = await axiosInstance.put(`/empcategory/update/${id}`, empCategoryData);
		return response.data;
	} catch (error) {
		console.error("Error updating employee category: ", error);
		throw error;
	}
};

export const deleteEmpCategory = async (id: number, token: string | undefined) => {
	try {
		setAuthToken(token)
		await axiosInstance.delete(`/empcategory/delete/${id}`);
	} catch (error) {
		console.error("Error deleting employee category: ", error);
		throw error;
	}
};