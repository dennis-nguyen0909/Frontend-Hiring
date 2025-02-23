// src/services/educationService.ts
import { notification } from "antd";
import { SYSTEM_ACTIVITIES } from "../api/route.api"; // Đảm bảo APPLICATIONS chứa đúng URL của endpoint
import { axiosInstance } from "../config/axiosInterceptor"; // Cấu hình axios

// Định nghĩa EducationApi và hàm postEducation
export const API_LOG_ACTIVITY = {
  getActivity: async (current: number, pageSize: number, query: any) => {
    try {
      const res = await axiosInstance.get(
        `${SYSTEM_ACTIVITIES}?current=${current}&pageSize=${pageSize}`,
        {
          params: query,
        }
      );
      if (res.data) return res.data;
      return null;
    } catch (error) {
      notification.error({
        message: "Thông báo",
        description: error.response.data.message,
      });
    }
  },
};
