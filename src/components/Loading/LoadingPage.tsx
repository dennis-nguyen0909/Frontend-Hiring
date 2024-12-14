// src/components/LoadingPage.tsx
import React from "react";
import logo from "../../assets/logo/LogoH.png"; // Đường dẫn tới logo của bạn

const LoadingPage = () => {
  return (
    <div style={styles.spinnerContainer}>
      <img src={logo} alt="Logo" style={styles.logo} />
    </div>
  );
};

const styles = {
  spinnerContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh", // Chiều cao 100% màn hình
    backgroundColor: "#f3f3f3", // Màu nền tùy chọn
  },
  logo: {
    width: "100px", // Đặt kích thước logo (có thể thay đổi theo ý bạn)
    height: "100px",
    animation: "spin 2s linear infinite", // Hiệu ứng xoay tròn
  },
};

// CSS animation keyframes để xoay tròn logo
const stylesWithAnimation = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;

// Tạo style tag và thêm vào head của document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = stylesWithAnimation;
document.head.appendChild(styleSheet);

export default LoadingPage;
