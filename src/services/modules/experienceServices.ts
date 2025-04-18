import { POST_EXPERIENCE } from "../api/route.api";
import { axiosInstance } from "../config/axiosInterceptor";

export const ExperienceApi = {
  postExperience: async (data: any, accessToken: string) => {
    try {
      const res = await axiosInstance.post(`${POST_EXPERIENCE}`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });
      return res.data;
    } catch (error: any) {
      // Kiểm tra lỗi response từ server
      if (error.response) {
        return {
          success: false,
          status: error.response.status,
          message:
            error.response.data.message ||
            "Có lỗi xảy ra khi thêm kinh nghiệm.",
          errors: error.response.data.errors || error.response.data,
        };
      } else {
        // Nếu lỗi không phải từ server, ví dụ lỗi mạng, timeout, v.v.
        return {
          success: false,
          message: "Lỗi kết nối đến server. Vui lòng thử lại sau.",
          errors: error.message,
        };
      }
    }
  },

  getExperienceById: async (id: string, accessToken: string) => {
    try {
      const res = await axiosInstance.get(`${POST_EXPERIENCE}/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });
      if (res.data) return res.data;
      return null;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Không thể lấy thông tin kinh nghiệm.",
      };
    }
  },

  deleteManyExperience: async (ids: Array<string>, accessToken: string) => {
    try {
      const res = await axiosInstance({
        method: "delete",
        url: `${POST_EXPERIENCE}`,
        data: { ids },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });
      if (res.data) return res.data;
      return null;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Không thể xóa các kinh nghiệm.",
      };
    }
  },

  updateExperience: async (id: string, data: any, accessToken: string) => {
    try {
      const res = await axiosInstance.patch(`${POST_EXPERIENCE}/${id}`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });
      if (res.data) return res.data;
      return null;
    } catch (error: any) {
      if (error.response) {
        return {
          success: false,
          status: error.response.status,
          message:
            error.response.data.message ||
            "Có lỗi xảy ra khi thêm kinh nghiệm.",
          errors: error.response.data.errors || error.response.data,
        };
      } else {
        // Nếu lỗi không phải từ server, ví dụ lỗi mạng, timeout, v.v.
        return {
          success: false,
          message: "Lỗi kết nối đến server. Vui lòng thử lại sau.",
          errors: error.message,
        };
      }
    }
  },

  getExperienceByUserId: async (accessToken: string) => {
    try {
      const res = await axiosInstance.get(`${POST_EXPERIENCE}/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });
      if (res.data) return res.data;
      return null;
    } catch (error: any) {
      return {
        success: false,
        message:
          error.message ||
          "Không thể lấy thông tin kinh nghiệm của người dùng.",
      };
    }
  },
};
