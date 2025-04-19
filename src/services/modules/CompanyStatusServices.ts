import { axiosInstance } from "../config/axiosConfig";

export const COMPANY_STATUS_API = {
  getCompanyStatuses: async (companyId: string, token: string) => {
    try {
      const response = await axiosInstance.get(
        `company-statuses/${companyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching company statuses:", error);
      throw error;
    }
  },

  getCompanyStatus: async (id: string, token: string) => {
    try {
      const response = await axiosInstance.get(`company-statuses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching company status:", error);
      throw error;
    }
  },

  createCompanyStatus: async (
    data: Record<string, unknown>,
    companyId: string,
    token: string
  ) => {
    try {
      const response = await axiosInstance.post(
        `company-statuses/${companyId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating company status:", error);
      throw error;
    }
  },

  updateCompanyStatus: async (
    id: string,
    data: Record<string, unknown>,
    token: string
  ) => {
    try {
      const response = await axiosInstance.patch(
        `company-statuses/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating company status:", error);
      throw error;
    }
  },

  deleteCompanyStatus: async (id: string, token: string) => {
    try {
      const response = await axiosInstance.delete(`company-statuses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting company status:", error);
      throw error;
    }
  },
};
