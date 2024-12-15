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

// Định nghĩa giá trị khởi tạo cho state
const initialState: UserState = {
  id: null,
  name: null,
  email: null,
  full_name: null,
  phone: null,
  avatar: null,
  background: null,
  address: null,
  gender: null,
  role: null,
  account_type: null,
  is_active: false,
  is_search_jobs_status: false,
  auth_providers: null,
  save_job_ids: null,
  cvs: null,
  access_token: '',
  refresh_token: '',
  total_experience: null,
  no_experience: false,
  total_experience_months: 0,
  total_experience_years: 0,
  company_name: null,
  website: null,
  location: null,
  jobs_ids: null,
  description: null,
  avatar_company: null,
  banner_company: null,
  organization: null,
};

// Slice Redux cho User
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Cập nhật thông tin người dùng
    updateUser(state, action: PayloadAction<UserState>) {
      return { ...state, ...action.payload };
    },
    // Reset lại thông tin người dùng
    resetUser() {
      return initialState;
    },
    // Update một phần thông tin người dùng nếu cần
    updatePartialUser(state, action: PayloadAction<Partial<UserState>>) {
      state = { ...state, ...action.payload };
    },
  },
});

export const { updateUser, resetUser, updatePartialUser } = userSlice.actions;
export default userSlice.reducer;
