import { notification } from "antd";
import { ORGANIZATION } from "../api/route.api";
import { axiosInstance } from "../config/axiosInterceptor";

export const ORGANIZATION_API = {
  createOrganization: async (data: any, accessToken: string) => {
    try {
      const res = await axiosInstance.post(`${ORGANIZATION}`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });
      if (res.data) return res.data;
      return null;
    } catch (error) {
      notification.error({
        message: "Thông báo",
        description: error.message,
      });
    }
  },
  updateOrganization: async (id: string, data: any, accessToken: string) => {
    const res = await axiosInstance.patch(`${ORGANIZATION}/${id}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  getAll: async (params: any, accessToken: string) => {
    const res = await axiosInstance.get(`${ORGANIZATION}`, {
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
