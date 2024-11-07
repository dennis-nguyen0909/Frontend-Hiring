import { axiosInstance } from "../config/axiosInterceptor";

// src/services/authService.ts
export const postMedia = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file); // Thêm file vào form data
  
    try {
      const resData = await axiosInstance.post('media/upload-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Đảm bảo rằng Content-Type là multipart/form-data
        },
      });
  
      if (resData) return resData.data;
      return null;
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };