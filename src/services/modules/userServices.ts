import { notification } from "antd";
import { axiosInstance } from "../config/axiosInterceptor";
type AvatarType = "avatar_company" | "banner_company";
// src/services/authService.ts
export const getDetailUser = async (id: string, access_token: string) => {
  const resData = await axiosInstance.get(`/users/${id}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    withCredentials: true,
  });

  if (resData) return resData.data;
  return null;
};
export const updateUser = async (updateUserDto: any) => {
  try {
    const response = await axiosInstance.patch("users", updateUserDto); // URL này sẽ phải đúng với API của bạn
    if (response.data) {
      return response.data; // Dữ liệu trả về sau khi cập nhật thành công
    }
    return null; // Trường hợp không có dữ liệu trả về
  } catch (error) {
    console.error("Error updating user:", error);
    notification.error({
      message: "Thông báo",
      description: error.response.data.message,
    });
    return null;
  }
};
interface ResetPasswordData {
  user_id: string;
  current_password: string;
  new_password: string;
}

export const USER_API = {
  resetPassword: async (data: ResetPasswordData, accessToken: string) => {
    try {
      const res = await axiosInstance.post(`users/reset-password`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Using data.accessToken directly
        },
        withCredentials: true,
      });

      if (res.data) {
        return res.data; // Return the response data if it's available
      }

      return null; // Return null if no data is returned
    } catch (error) {
      notification.error({
        message: "Thông báo",
        description: error.response.data.message,
      });
      return error; // Return null if any error occurs
    }
  },
  calculateProfileCompletion: async (userId: string, accessToken: string) => {
    const resData = await axiosInstance.get(
      `users/${userId}/profile-completion`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );

    if (resData) return resData.data;
    return null;
  },
  updateUser: async (updateUserDto: any, access_token?: string) => {
    try {
      const response = await axiosInstance.patch("users", updateUserDto, {
        headers: {
          Authorization: access_token ? `Bearer ${access_token}` : "", // Thêm Authorization header nếu có access_token
        },
      });

      if (response.data) {
        return response.data; // Dữ liệu trả về sau khi cập nhật thành công
      }
      return null; // Trường hợp không có dữ liệu trả về
    } catch (error) {
      notification.error({
        message: "Thông báo",
        description: error.response?.data?.message || "Đã có lỗi xảy ra",
      });
      return error;
    }
  },
  getDetailUser: async (id: string, access_token?: string) => {
    const resData = await axiosInstance.get(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      withCredentials: true,
    });

    if (resData) return resData.data;
    return null;
  },
  getAllCompany: async (params: any, access_token?: string) => {
    const resData = await axiosInstance.get(`/users/company`, {
      params: {
        ...params,
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      withCredentials: true,
    });

    if (resData) return resData.data;
    return null;
  },
  employerSendMailtoCandidate: async (params: any, accessToken: string) => {
    try {
      const res = await axiosInstance.post(
        `users/send-application-email`,
        params,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

      if (res.data) {
        return res.data;
      }

      return null;
    } catch (error) {
      notification.error({
        message: "Thông báo",
        description: error.response.data.message,
      });
      return error; // Return null if any error occurs
    }
  },
  checkUpdateCompany: async (userId: string, accessToken: string) => {
    try {
      const res = await axiosInstance.get(
        `users/check-update-company/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

      if (res.data) {
        return res.data;
      }
      return null;
    } catch (error) {
      return error; // Return null if any error occurs
    }
  },
  deleteAvatarEmployer: async (
    userId: string,
    type: AvatarType,
    accessToken: string
  ) => {
    try {
      const res = await axiosInstance.delete(`users/delete-avatar`, {
        data: {
          // Sử dụng 'data' để truyền dữ liệu vào body
          user_id: userId,
          type: type,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      if (res.data) {
        return res.data;
      }
      return null;
    } catch (error) {
      return error;
    }
  },
  viewProfileCandidate: async (id: string, access_token: string) => {
    const resData = await axiosInstance.get(`/users/profile/${id}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      withCredentials: true,
    });

    if (resData) return resData.data;
    return null;
  },
  getViewedJobs: async (userId: string, params: any, access_token: string) => {
    const resData = await axiosInstance.get(
      `${`/users/get-viewed-jobs/${userId}`}`,
      {
        params: {
          ...params,
        },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        withCredentials: true,
      }
    );
    if (resData.data) return resData.data;
    return null;
  },
  countViewedJobsOfCandidate: async (userId: string, accessToken: string) => {
    const resData = await axiosInstance.get(
      `users/count-viewed-jobs/${userId}`,
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
