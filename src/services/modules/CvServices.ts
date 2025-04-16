// src/services/educationService.ts
import { CV } from "../api/route.api";
import { axiosInstance } from "../config/axiosInterceptor";

// Định nghĩa EducationApi và hàm postEducation
export const CV_API = {
  create: async (data: any, accessToken: string) => {
    const res = await axiosInstance.post(`${CV}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  getAll: async (params: any, accessToken: string) => {
    const resData = await axiosInstance.get(`${CV}`, {
      params: {
        ...params,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (resData.data) return resData.data;
    return null;
  },
  findById: async (id: string, accessToken: string) => {
    const res = await axiosInstance.get(`${CV}/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  update: async (id: string, body: any, accessToken: string) => {
    const res = await axiosInstance.patch(`${CV}/${id}`, body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  deleteManyCVByUser: async (ids: Array<string>, accessToken: string) => {
    const res = await axiosInstance({
      method: "delete",
      url: `${CV}`,
      data: { ids },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });

    if (res.data) return res.data;
    return null;
  },
};
