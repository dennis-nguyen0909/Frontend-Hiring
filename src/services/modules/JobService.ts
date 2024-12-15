// src/services/educationService.ts
import { SKILLS } from "../api/route.api"; // Đảm bảo SKILLS chứa đúng URL của endpoint
import { axiosInstance } from "../config/axiosInterceptor"; // Cấu hình axios

// Định nghĩa EducationApi và hàm postEducation
export const SkillApi = {
  postSkill: async (data: any, accessToken: string) => {
    const res = await axiosInstance.post(`${SKILLS}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  getSkillById: async (id: string, accessToken: string) => {
    const res = await axiosInstance.get(`${SKILLS}/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  deleteManySkill: async (ids: Array<string>, accessToken: string) => {
    const res = await axiosInstance({
      method: 'delete',
      url: `${SKILLS}`,
      data: { ids },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
  
    if (res.data) return res.data;
    return null;
  },
  updateSkill: async (id: string, data: any, accessToken: string) => {
    const res = await axiosInstance.patch(`${SKILLS}/${id}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  getSkillByUserId: async (accessToken: string) => {
    const res = await axiosInstance.get(`${SKILLS}/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
};
