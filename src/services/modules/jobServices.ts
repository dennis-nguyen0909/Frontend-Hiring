import { axiosInstance } from "../config/axiosConfig";

// src/services/authService.ts
interface IJob{
    current ?:string;
    pageSize ?:string;
    filter ?:string;
    sort ?:string;
}
export const getAllJobs = async (data: { pageSize: number }) => {
    const resData = await axiosInstance.get('/jobs', {
      params: {
        pageSize: data.pageSize // Add limit as a query parameter
      },
      withCredentials: true,
    });
    
    if (resData) return resData.data;
    return null;
  }