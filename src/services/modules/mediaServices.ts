import { axiosInstance } from "../config/axiosInterceptor"; // Cấu hình axios

// Định nghĩa MediaApi và hàm postMedia
export const MediaApi = {
  postMedia: async (file: File,accessToken:string) => {
    const formData = new FormData();
    formData.append('file', file); // Thêm file vào form data

    const res = await axiosInstance.post('media/upload-file', formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data', // Đảm bảo rằng Content-Type là multipart/form-data
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
};
