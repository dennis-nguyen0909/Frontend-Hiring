import { Button, notification } from "antd";
import {
  ArrowUpCircle,
  Bell,
  Gift,
  Key,
  Lock,
  LogOut,
  Mail,
  Settings,
  User,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Thêm useNavigate để điều hướng
import * as authServices from '../../services/modules/authServices';
import { resetUser } from "../../redux/slices/userSlices";

const Setting = () => {
    const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng
    const user = useSelector(state => state.user)
    const dispatch = useDispatch();

    const handleLogout = async () => {
      // Gọi API đăng xuất ở đây
      try {
        // Giả sử có một hàm API để đăng xuất
        const res = await authServices.logout(user.access_token);
        if(res.data === true){
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          dispatch(resetUser())
          navigate("/");
          notification.success({
            message: "Notification",
            description: "Đăng xuất thành công",
          })
        }
      } catch (error) {
        notification.error({
          message: "Notification",
          description: error.message,
        })
        console.error("Đăng xuất thất bại:", error);
      }
    };
    const settingsItems = [
      { icon: <User className="w-5 h-5 text-primaryColor" />, text: "Cài đặt thông tin cá nhân", action: (navigate) => navigate(`/profile/${user._id}`) },
      { icon: <ArrowUpCircle className="w-5 h-5 text-primaryColor" />, text: "Nâng cấp tài khoản VIP", action: (navigate) => console.log("Nâng cấp tài khoản VIP") },
      { icon: <Gift className="w-5 h-5 text-primaryColor" />, text: "Kích hoạt quà tặng", action: (navigate) => console.log("Kích hoạt quà tặng") },
      { icon: <User className="w-5 h-5 text-primaryColor" />, text: "Nhà tuyển dụng xem hồ sơ", action: (navigate) => console.log("Nhà tuyển dụng xem hồ sơ") },
      { icon: <Settings className="w-5 h-5 text-primaryColor" />, text: "Cài đặt gợi ý việc làm", action: (navigate) => console.log("Cài đặt gợi ý việc làm") },
      { icon: <Bell className="w-5 h-5 text-primaryColor" />, text: "Cài đặt thông báo việc làm", action: (navigate) => console.log("Cài đặt thông báo việc làm") },
      { icon: <Mail className="w-5 h-5 text-primaryColor" />, text: "Cài đặt nhận email", action: (navigate) => console.log("Cài đặt nhận email") },
      { icon: <Lock className="w-5 h-5 text-primaryColor" />, text: "Cài đặt bảo mật", action: (navigate) => console.log("Cài đặt bảo mật") },
      { icon: <Key className="w-5 h-5 text-primaryColor" />, text: "Đổi mật khẩu", action: (navigate) => console.log("Đổi mật khẩu") },
      { icon: <LogOut className="w-5 h-5 text-primaryColor" />, text: "Đăng xuất", action: handleLogout }, 
    ];

  return (
    <div className="flex flex-col gap-3 z-30">
      {settingsItems.map((item, idx) => {
        return (
          <Button 
            key={idx} 
            className="w-full py-2 px-2 flex items-center justify-start"
            onClick={() => item.action(navigate)} // Gọi hàm action
          >
            <span className="mr-2">{item.icon}</span>
            {item.text}
          </Button>
        );
      })}
    </div>
  );
};

export default Setting;

// Hàm giả định cho API đăng xuất
const apiLogout = async () => {
  // Thực hiện gọi API để đăng xuất
  return new Promise((resolve) => setTimeout(resolve, 1000)); // Giả lập một cuộc gọi API
};
