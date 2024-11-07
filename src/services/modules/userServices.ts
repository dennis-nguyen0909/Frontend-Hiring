import { axiosInstance } from "../config/axiosInterceptor";

// src/services/authService.ts
export const getDetailUser = async (id: string, access_token: string) => {
    const resData = await axiosInstance.get(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${access_token}`
      },
      withCredentials: true
    });
  
    if (resData) return resData.data;
    return null;
  }
  export const updateUser = async (updateUserDto: any) => {
    try {
      const response = await axiosInstance.patch('users', updateUserDto);  // URL này sẽ phải đúng với API của bạn
      if (response.data) {
        return response.data;  // Dữ liệu trả về sau khi cập nhật thành công
      }
      return null;  // Trường hợp không có dữ liệu trả về
    } catch (error) {
      console.error("Error updating user:", error);
      return null;
    }
  };