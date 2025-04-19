// src/services/educationService.ts
import { SAVE_CANDIDATE } from "../api/route.api"; // Đảm bảo SAVE_CANDIDATE chứa đúng URL của endpoint
import { axiosInstance } from "../config/axiosInterceptor"; // Cấu hình axios

// Định nghĩa EducationApi và hàm postEducation
export const SAVE_CANDIDATE_API = {
  getSaveCandidateByEmployerId: async (
    employerId: string,
    params: any,
    accessToken: string
  ) => {
    const resData = await axiosInstance.get(
      `${SAVE_CANDIDATE}/employer/${employerId}`,
      {
        params: {
          ...params,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );
    if (resData.data) return resData.data;
    return null;
  },
  updateSaveCandidate: async (
    candidateId: string,
    isActive: boolean,
    accessToken: string
  ) => {
    const resData = await axiosInstance.patch(
      `${SAVE_CANDIDATE}/${candidateId}`,
      {
        isActive,
      },
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
  toggleSaveCandidate: async (
    candidateId: string,
    employerId: string,
    accessToken: string
  ) => {
    const resData = await axiosInstance.post(
      `${SAVE_CANDIDATE}/toggle/${employerId}/${candidateId}`,
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
  isSaveCandidate: async (
    candidateId: string,
    employerId: string,
    accessToken: string
  ) => {
    const resData = await axiosInstance.get(
      `${SAVE_CANDIDATE}/check/${employerId}/${candidateId}`,
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
  employerSavedCandidate: async (employerId: string, accessToken: string) => {
    const resData = await axiosInstance.get(
      `${SAVE_CANDIDATE}/employer-saved/${employerId}`,
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
  updateCandidateStatus: async (
    candidateId: string,
    status: "pending" | "reviewed" | "shortlisted" | "interviewed" | "rejected",
    token: string
  ) => {
    return await axiosInstance.patch(
      `/save-candidates/${candidateId}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
};
