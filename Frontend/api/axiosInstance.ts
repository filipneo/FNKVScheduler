import axios from 'axios';

export const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
});

export const setAuthToken = (token: string | undefined) => {
    if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Basic ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common['Authorization'];
    }
};