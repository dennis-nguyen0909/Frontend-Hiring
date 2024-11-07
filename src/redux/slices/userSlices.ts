// src/redux/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: string | null;
  name: string | null;
  email: string | null;
  full_name:string | null;
  phone:string | null;
  avatar:string | null;
  address:string | null;
  gender:string | null;
  role:string | null;
  access_token:string;
  refresh_token:string;
  account_type:string | null;
  is_active:string | null;
  is_search_jobs_status:string | null;
  auth_providers:string | null;
  save_job_ids:string | null;
  cvs:string | null;
  background:string | null;
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
