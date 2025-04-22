// src/services/educationService.ts
import { notification } from "antd";
import { APPLICATIONS } from "../api/route.api"; // Đảm bảo APPLICATIONS chứa đúng URL của endpoint
import { axiosInstance } from "../config/axiosInterceptor"; // Cấu hình axios

// Định nghĩa EducationApi và hàm postEducation
export const API_APPLICATION = {
  createApplication: async (data: any, accessToken: string) => {
    try {
      const res = await axiosInstance.post(`${APPLICATIONS}`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });
      if (res.data) return res.data;
      return null;
    } catch (error) {
      notification.error({
        message: "Thông báo",
        description: error.response.data.message,
      });
    }
  },
  getAll: async (params: any, accessToken: string) => {
    const resData = await axiosInstance.get(`${APPLICATIONS}`, {
      params: {
        ...params,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (resData.data) return resData.data;
    return null;
  },
  getApplicationById: async (id: string, accessToken: string) => {
    const res = await axiosInstance.get(`${APPLICATIONS}/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  deleteManyApplication: async (ids: Array<string>, accessToken: string) => {
    const res = await axiosInstance({
      method: "delete",
      url: `${APPLICATIONS}`,
      data: { ids },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });

    if (res.data) return res.data;
    return null;
  },
  updateApplication: async (id: string, data: any, accessToken: string) => {
    const res = await axiosInstance.patch(`${APPLICATIONS}/${id}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  getApplicationByUserId: async (accessToken: string) => {
    const res = await axiosInstance.get(`${APPLICATIONS}/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  getApplicationByEmployerJobId: async (
    jobId: string,
    params: any,
    accessToken: string
  ) => {
    const resData = await axiosInstance.get(`${APPLICATIONS}/job_id/${jobId}`, {
      params: {
        ...params,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (resData.data) return resData.data;
    return null;
  },
  saveCandidate: async (
    applicationId: string,
    candidateId: string,
    accessToken: string
  ) => {
    const resData = await axiosInstance.put(
      `${APPLICATIONS}/${applicationId}/toggle-save/${candidateId}`,
      {},
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
  getCountAppliedCandidate: async (userId: string, accessToken: string) => {
    const resData = await axiosInstance.get(
      `${APPLICATIONS}/applied/${userId}`,
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
  getRecentlyAppliedCandidate: async (
    candidateId: string,
    limit: string,
    accessToken: string
  ) => {
    const resData = await axiosInstance.get(
      `${APPLICATIONS}/recently-applied/${candidateId}?limit=${limit}`,
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
  getAllRecentlyAppliedCandidate: async (params: any, accessToken: string) => {
    const resData = await axiosInstance.get(
      `${APPLICATIONS}/recently-applied-candidate`,
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
  getTop5RecentApplied: async (userId: string, accessToken: string) => {
    const resData = await axiosInstance.get(
      `${APPLICATIONS}/recently/${userId}`,
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
  getCandidatesByStatusIdAndJobId: async (
    statusId: string,
    jobId: string,
    accessToken: string,
    pageSize: number,
    current: number,
    sort: string
  ) => {
    const resData = await axiosInstance.get(
      `${APPLICATIONS}/recruitment/candidates?status_id=${statusId}&job_id=${jobId}&pageSize=${pageSize}&current=${current}`,
      {
        params: {
          query: {
            sort: sort,
          },
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
};
