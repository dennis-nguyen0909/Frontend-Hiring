// src/services/authService.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});
interface IJob{
    current ?:string;
    pageSize ?:string;
    filter ?:string;
    sort ?:string;
}
export const getAllJobs = async(data:IJob)=>{
    const resData = await axiosInstance.get('/jobs',{
        withCredentials:true
    });
    if(resData) return resData.data
    return null
} 