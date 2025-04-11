// src/services/educationService.ts
import { notification } from "antd";
import { FAVORITE_JOB } from "../api/route.api"; // Đảm bảo FAVORITE_JOB chứa đúng URL của endpoint
import { axiosInstance } from "../config/axiosInterceptor"; // Cấu hình axios

// Định nghĩa EducationApi và hàm postEducation
export const API_FAVORITE_JOB = {
  createFavoriteJobs: async (data: any, accessToken: string) => {
    try {
      const res = await axiosInstance.post(`${FAVORITE_JOB}`, data, {
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
        description: error.response.data.message,
      });
    }
  },
  getFavoriteJobDetailByUserId: async (params: any, accessToken: string) => {
    const res = await axiosInstance.get(
      `${FAVORITE_JOB}/get-detail?user_id=${params.user_id}&job_id=${params.job_id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );
    if (res.data) return res.data;
    return null;
  },
  getAllJobFavorite: async (params: any, accessToken: string) => {
    const resData = await axiosInstance.get(`${FAVORITE_JOB}`, {
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
  countFavoriteJobOfCandidate: async (userId: string, accessToken: string) => {
    const resData = await axiosInstance.get(
      `${FAVORITE_JOB}/candidate/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );
    if (resData.data) return resData.data;
    return null;
  },
};
