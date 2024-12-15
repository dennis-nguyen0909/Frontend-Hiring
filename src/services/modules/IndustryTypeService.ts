import { INDUSTRY_TYPE } from "../api/route.api";
import { axiosInstance } from "../config/axiosInterceptor";

export const INDUSTRY_TYPE_API = {
  create: async (data: any, accessToken: string) => {
    const res = await axiosInstance.post(`${INDUSTRY_TYPE}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  getById: async (id: string, accessToken: string) => {
    const res = await axiosInstance.get(`${INDUSTRY_TYPE}/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  deleteIds: async (id: string, accessToken: string) => {
    const res = await axiosInstance.delete(`${INDUSTRY_TYPE}/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  update: async (id: string, data: any, accessToken: string) => {
    const res = await axiosInstance.patch(`${INDUSTRY_TYPE}/${id}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  getByUserId: async (accessToken: string) => {
    const res = await axiosInstance.get(`${INDUSTRY_TYPE}/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  getAll: async (params: any, accessToken: string) => {
    const res = await axiosInstance.get(`${INDUSTRY_TYPE}`, {
      params: {
        ...params,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
};
