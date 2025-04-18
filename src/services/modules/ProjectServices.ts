import { PROJECT } from "../api/route.api";
import { axiosInstance } from "../config/axiosInterceptor";
import handleApiError from "../exception/handleApiError";

export const PROJECT_API = {
  create: async (data: any, accessToken: string) => {
    try {
      const res = await axiosInstance.post(`${PROJECT}`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });
      return res.data;
    } catch (error: any) {
      return handleApiError(error, "Không thể tạo dự án.");
    }
  },

  getAll: async (params: any, accessToken: string) => {
    try {
      const res = await axiosInstance.get(`${PROJECT}`, {
        params,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });
      return res.data;
    } catch (error: any) {
      return handleApiError(error, "Không thể tải danh sách dự án.");
    }
  },

  findById: async (id: string, accessToken: string) => {
    try {
      const res = await axiosInstance.get(`${PROJECT}/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });
      return res.data;
    } catch (error: any) {
      return handleApiError(error, "Không thể tìm thấy dự án.");
    }
  },

  update: async (id: string, body: any, accessToken: string) => {
    try {
      const res = await axiosInstance.patch(`${PROJECT}/${id}`, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });
      return res.data;
    } catch (error: any) {
      return handleApiError(error, "Không thể cập nhật dự án.");
    }
  },

  deleteByUser: async (id: string, accessToken: string) => {
    try {
      const res = await axiosInstance.delete(`${PROJECT}/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });
      return res.data;
    } catch (error: any) {
      return handleApiError(error, "Không thể xóa dự án.");
    }
  },
};
