import { axiosInstance } from "../config/axiosInterceptor";
import { LoginData, RegisterData, VerifyCode } from "../types";

export const login = async (data: LoginData) => {
  try {
    const response = await axiosInstance.post("/auth/login", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    if (
      error.response &&
      error.response.status === 403 &&
      error.response.data.message === "User not active"
    ) {
      // Bắt lỗi từ UserNotActiveException
      throw new Error(`User not active: ID ${error.response.data.userId}`);
    }

    // Các lỗi khác
    throw new Error(error.response?.data?.message || "Đăng nhập thất bại");
  }
};

export const register = async (data: RegisterData) => {
  try {
    const response = await axiosInstance.post("/auth/register", data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Đăng ký thất bại");
  }
};

export const verifyCode = async (data: VerifyCode) => {
  try {
    const response = await axiosInstance.post("/auth/verify", data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};

export const retryActive = async (email: string) => {
  try {
    const response = await axiosInstance.post("/auth/retry-active", { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Đăng ký thất bại");
  }
};

export const logout = async (token: string) => {
  try {
    const response = await axiosInstance.post(
      "/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Đăng xuất thất bại");
  }
};

export const refreshToken = async (token: string) => {
  try {
    const response = await axiosInstance.post(
      "/auth/refresh-token",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Đăng xuất thất bại");
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await axiosInstance.post(
      "/auth/forgot-password",
      { email },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("errror", error);
    throw new Error(error.response?.data?.message);
  }
};

export const verifyOtp = async (email: string, otp: string) => {
  try {
    const response = await axiosInstance.post(
      "/auth/verify-otp",
      { email, otp },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const resetNewPassword = async (email: string, new_password: string) => {
  try {
    const response = await axiosInstance.post(
      "/auth/reset-new-password",
      { email, new_password },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};
