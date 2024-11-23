import { ORGANIZATION } from "../api/education"; 
import { axiosInstance } from "../config/axiosInterceptor"; 

export const ORGANIZATION_API = {
  createOrganization: async (data: any, accessToken: string) => {
    const res = await axiosInstance.post(`${ORGANIZATION}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  updateOrganization: async (id: string, data:any,accessToken: string) => {
    const res = await axiosInstance.patch(`${ORGANIZATION}/${id}`,data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
};