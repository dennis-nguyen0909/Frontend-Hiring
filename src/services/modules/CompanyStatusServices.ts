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
};
