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
};
