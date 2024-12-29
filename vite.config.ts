import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Cấu hình alias '@' trỏ tới thư mục 'src'
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://nestjs-hiring-1.onrender.com', // URL của backend đã deploy trên Render
        changeOrigin: true, // Đảm bảo proxy đổi origin header để tránh CORS
        secure: true,      // Vì backend dùng HTTPS
        // Không cần rewrite nếu backend đã có sẵn '/api' trong đường dẫn
      },
    },
  },
});
