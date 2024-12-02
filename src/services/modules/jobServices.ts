import { message, notification } from "antd";
import { axiosInstance } from "../config/axiosInterceptor";

// Định nghĩa một đối tượng JobApi
export const JobApi = {
  // Phương thức GET để lấy tất cả công việc
  getAllJobs: async (params:any,accessToken: string) => {
    const resData = await axiosInstance.get(`${'/jobs'}`, {
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
  getAllJobRecent: async (params:any,accessToken: string) => {
    const resData = await axiosInstance.get(`${'/jobs/recent'}`, {
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


  // Phương thức POST để thêm một công việc mới
  postJob: async (data: unknown, accessToken: string) => {
    try {
      const res = await axiosInstance.post('/jobs', data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      if (res.data) return res.data;
      return null;
    } catch (error) {
      // notification.error({
      //   message:"Thông báo",
      //   description: error?.response?.data?.message
      // })
      message.error(error?.response?.data?.message)
      return null;
    }
  },

  // Phương thức GET để lấy công việc theo ID
  getJobById: async (id: string, accessToken: string) => {
    try {
      const res = await axiosInstance.get(`/jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      if (res.data) return res.data;
      return null;
    } catch (error) {
      console.error("Error fetching job by ID:", error);
      return null;
    }
  },
  countActiveJobsByUser: async (userId:string,accessToken: string) => {
    try {
      const res = await axiosInstance.get(`/jobs/active/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      if (res.data) return res.data;
      return null;
    } catch (error) {
      console.error("Error fetching job by ID:", error);
      return null;
    }
  },

  // Phương thức DELETE để xóa nhiều công việc
  deleteManyJobs: async (ids: Array<string>, accessToken: string) => {
    try {
      const res = await axiosInstance({
        method: 'delete',
        url: '/jobs',
        data: { ids },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      if (res.data) return res.data;
      return null;
    } catch (error) {
      console.error("Error deleting jobs:", error);
      return null;
    }
  },

  // Phương thức PATCH để cập nhật công việc
  updateJob: async (id: string, data: any, accessToken: string) => {
    try {
      const res = await axiosInstance.patch(`/jobs/${id}`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      if (res.data) return res.data;
      return null;
    } catch (error) {
      console.error("Error updating job:", error);
      message.error(error?.response?.data?.message)

      // error?.response?.data?.message.map((item)=>{
      //   notification.error({
      //     message:'Thông báo',
      //     description:item
  
      //   })
      // })
      return null;
    }
  },
  getJobByEmployerID: async ( params:any,accessToken: string) => {
    try {
      const resData = await axiosInstance.get('/jobs', {
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
    } catch (error) {
      console.error("Error updating job:", error);
      return null;
    }
  },
  getAllJobsQuery: async (params:any,accessToken: string) => {
    const resData = await axiosInstance.get(`${'/jobs'}`, {
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
  findJobsByCompanyName: async (params:any,accessToken: string) => {
    const resData = await axiosInstance.get(`${'/jobs/getJobSearchName'}`, {
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
  toggleLikeJob: async (params: any,accessToken:string)=>{
    try {
      const res = await axiosInstance.post('/jobs/toggle-like', params, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      if (res.data) return res.data;
      return null;
    } catch (error) {
      console.error("Error posting job:", error);
      return null;
    }
  }
};