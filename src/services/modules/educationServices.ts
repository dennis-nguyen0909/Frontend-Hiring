// src/services/educationService.ts
import { POST_EDUCATION } from "../api/route.api"; // Đảm bảo POST_EDUCATION chứa đúng URL của endpoint
import { axiosInstance } from "../config/axiosInterceptor"; // Cấu hình axios

// Định nghĩa EducationApi và hàm postEducation
export const EducationApi = {
  postEducation: async (data: any, accessToken: string) => {
    try {
      const res = await axiosInstance.post(`${POST_EDUCATION}`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });
      return res.data;
    } catch (error: any) {
      if (error.response) {
        // Trả về lỗi từ phía server, ví dụ validation error
        return {
          success: false,
          status: error.response.status,
          message: error.response.data.message || "Có lỗi xảy ra",
          errors: error.response.data,
        };
      } else {
        // Lỗi không xác định (VD: network, timeout)
        return {
          success: false,
          message: "Lỗi kết nối đến server",
          errors: error.message,
        };
      }
    }
  },
  getEducationById: async (id: string, accessToken: string) => {
    const res = await axiosInstance.get(`${POST_EDUCATION}/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  deleteEducation: async (id: string, accessToken: string) => {
    const res = await axiosInstance.delete(`${POST_EDUCATION}/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  updateEducation: async (id: string, data: any, accessToken: string) => {
    try {
      const res = await axiosInstance.patch(`${POST_EDUCATION}/${id}`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      // Kiểm tra nếu có dữ liệu trả về từ server
      if (res.data) return res.data;

      // Nếu không có dữ liệu trả về
      return null;
    } catch (error: any) {
      // Kiểm tra lỗi từ response (lỗi từ server như validation, lỗi backend)
      if (error.response) {
        return {
          success: false,
          status: error.response.status,
          message:
            error.response.data.message ||
            "Có lỗi xảy ra khi cập nhật thông tin",
          errors: error.response.data.errors || error.response.data,
        };
      } else {
        // Lỗi không xác định (network, timeout, ... )
        return {
          success: false,
          message: "Lỗi kết nối đến server khi cập nhật thông tin",
          errors: error.message,
        };
      }
    }
  },
  getEducationByUserId: async (accessToken: string) => {
    const res = await axiosInstance.get(`${POST_EDUCATION}/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
};
