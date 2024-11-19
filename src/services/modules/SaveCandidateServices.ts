// src/services/educationService.ts
import { SAVE_CANDIDATE } from "../api/education"; // Đảm bảo SAVE_CANDIDATE chứa đúng URL của endpoint
import { axiosInstance } from "../config/axiosInterceptor"; // Cấu hình axios

// Định nghĩa EducationApi và hàm postEducation
export const SAVE_CANDIDATE_API = {
    getSaveCandidateByEmployerId: async (employerId:string,params:any,accessToken: string) => {
        const resData = await axiosInstance.get(`${SAVE_CANDIDATE}/employer/${employerId}`, {
          params: {
            ...params
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        });
        if (resData.data) return resData.data;
        return null;
      },
}