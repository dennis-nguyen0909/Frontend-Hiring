// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../../redux/slices/userSlices'; // Import reducer từ userSlice

const store = configureStore({
  reducer: {
    user: userReducer, // Thêm reducer vào store
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
