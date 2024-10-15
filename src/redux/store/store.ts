// src/store/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from '../../redux/slices/userSlices'; // Import reducer từ userSlice
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Sử dụng localStorage cho web

// Cấu hình persist
const persistConfig = {
  key: 'root',
  version: 1,
  storage, // Sử dụng localStorage để lưu trữ
};

// Kết hợp tất cả reducers
const rootReducer = combineReducers({
  user: userReducer, // Thêm userReducer vào rootReducer
});

// Tạo reducer đã được persist
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Cấu hình store
const store = configureStore({
  reducer: persistedReducer, // Sử dụng persistedReducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Xuất types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Xuất persistor để sử dụng trong entry point của app
export const persistor = persistStore(store);

// Xuất store
export default store;
