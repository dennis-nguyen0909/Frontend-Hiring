// src/redux/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: string | null;
  name: string | null;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  avatar: string | null;
  background: string | null;
  address: string | null;
  gender: string | null;
  role: string | null; // Lưu trữ id của role hoặc tên role
  access_token: string;
  refresh_token: string;
  account_type: string | null;
  is_active: boolean;
  is_search_jobs_status: boolean;
  auth_providers: string[] | null; // Danh sách id của các provider
  save_job_ids: string[] | null; // Danh sách id công việc đã lưu
  cvs: string[] | null; // Danh sách id của CVs
  education_ids: string[] | null; // Danh sách id của các Education
  work_experience_ids: string[] | null; // Danh sách id của Work Experience
  total_experience: string | null; // Tổng số kinh nghiệm dưới dạng chuỗi
  no_experience: boolean;
  total_experience_months: number;
  total_experience_years: number;
  
  // Thuộc tính dành cho Employer
  company_name: string | null;
  website: string | null;
  location: string | null;
  jobs_ids: string[] | null; // Danh sách id của các công việc đã đăng
  description: string | null;
  avatar_company: string | null;
  banner_company: string | null;

  organization: string | null; // Id của Organization
}


const initialState: UserState = {
  id: "",
  name: "",
  email: "",
  full_name: "",
  phone: "",
  avatar: "",
  address: "",
  gender: null,
  role: null,
  account_type: null,
  is_active: null,
  is_search_jobs_status: null,
  auth_providers: null,
  save_job_ids: null,
  cvs: null,
  background: "",
  access_token: "",
  refresh_token: "",
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser(state, action: PayloadAction<UserState>) {
      return { ...state, ...action.payload };
    },
    resetUser() {
      return initialState;
    },
  },
});

export const { updateUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
