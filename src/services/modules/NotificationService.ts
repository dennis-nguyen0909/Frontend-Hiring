import { NOTIFICATIONS } from "../api/route.api";
import axiosInstance from "../config/axiosInterceptor";

export const NOTIFICATION_API = {
  // Hàm lấy danh sách thông báo của candidate
  getNotificationsForCandidate: async (id: string, accessToken: string) => {
    const res = await axiosInstance.get(`${NOTIFICATIONS}/candidate/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  
  // Hàm cập nhật thông báo
  update: async (id: string, data: any, accessToken: string) => {
    try {
      const res = await axiosInstance.patch(`${NOTIFICATIONS}/${id}`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });
      if (res.data) return res.data;
      return null;
    } catch (error) {
      console.error('Error updating notification:', error);
      return null;
    }
  },

  // Hàm lấy tất cả thông báo với phân trang
  getAll: async (params: any, accessToken: string) => {
    const res = await axiosInstance.get(`${NOTIFICATIONS}`, {
      params: {
        ...params,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  markAsRead: async (notificationIds: string[], accessToken: string) => {
    try {
      const res = await axiosInstance.patch(
        `${NOTIFICATIONS}/mark-as-read`,
        { notification_ids:notificationIds },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      if (res.data) return res.data;
      return null;
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      return null;
    }
  },
};
