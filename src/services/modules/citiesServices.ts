import { axiosInstance } from "../config/axiosInterceptor"; // Cấu hình axios

// Định nghĩa MediaApi và hàm postMedia
export const CitiesAPI = {
  getCitiesByCode: async (code: any, accessToken: string) => {
    const res = await axiosInstance.get(`cities/find-by-code/${code}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  getCities: async (accessToken: string,depth=1) => {
    const res = await axiosInstance.get(`cities?depth=${depth}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  getDistrictsByCityId: async (id: any, accessToken: string) => {
    const res = await axiosInstance.get(`cities/${id}/districts`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;

  },
  getWardsByDistrictId: async (id: any, accessToken: string) => {
    const res = await axiosInstance.get(`districts/${id}/wards`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  getAllByDepth:async(depth:string,accessToken:string)=>{
    const res = await axiosInstance.get(`cities?depth=${depth}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  }
};
