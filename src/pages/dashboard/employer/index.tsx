import { useEffect, useState } from "react";
import { Layout, Menu, Button } from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  SaveOutlined,
  SettingOutlined,
  LogoutOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import OverviewEmployer from "./Overview";
import PostJob from "./PostJob";
import MyJobEmployer from "./MyJob";
import SettingEmployer from "./Setting";
import SavedCandidate from "./SavedCandidate";
import * as userServices from "../../../services/modules/userServices";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../../../redux/slices/userSlices";
import { TAB_SKILL } from "../../../utils/role.utils";
import SkillEmployer from "../../employer/Skill/Skill";

const { Sider, Content } = Layout;

export default function DashBoardEmployer() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [currentTab, setCurrentTab] = useState("1"); // Initialize state for the current tab
  const userDetail = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const menuItems = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: "Tổng quan",
      className: "bg-blue-50",
    },
    { key: "3", icon: <FileTextOutlined />, label: "Đăng việc làm" },
    { key: "4", icon: <FileTextOutlined />, label: "Việc làm của tôi" },
    { key: "5", icon: <SaveOutlined />, label: "Lưu ứng viên" },
    { key: "6", icon: <DollarOutlined />, label: "Gói & Thanh toán" },
    { key: "8", icon: <SettingOutlined />, label: "Cài đặt" },
    {
      key: "sub4",
      label: "Quản lý bài viết",
      icon: <SettingOutlined />,
      children: [{ key: TAB_SKILL, label: "Quản lý kỹ năng" }],
    },
  ];

  const handleCollapse = async (collapsed: boolean) => {
    setCollapsed(collapsed);  // Cập nhật trạng thái collapsed ngay lập tức
    try {
      const res = await userServices.updateUser({
        id: userDetail?._id,
        toggle_dashboard: collapsed,
      });
      dispatch(updateUser({ ...res.data, access_token: userDetail.access_token }));
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };
  

  const handleMenuClick = (e: any) => {
    setCurrentTab(e.key);
    if (mobileView) {
      setCollapsed(true); // Automatically collapse sidebar in mobile view after selecting a tab
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setCollapsed(false);  // Đảm bảo sidebar luôn mở khi ở màn hình lớn
      }else{
        setCollapsed(true)
      }
    };
  
    handleResize();  // Kiểm tra kích thước khi component mount
    window.addEventListener("resize", handleResize);
  
    return () => {
      window.removeEventListener("resize", handleResize);  // Dọn dẹp khi component unmount
    };
  }, []);
  

  return (
    <Layout className="min-h-screen flex">
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(collapsed) => handleCollapse(collapsed)}
        className={`bg-white transition-all duration-300 ease-in-out ${
          mobileView
            ? collapsed
              ? "hidden"
              : "absolute z-10 w-[250px] left-0 h-full"
            : "relative"
        }`}
      >
        <div className="p-4 text-xl font-bold text-center border-b">
          {!collapsed && "Nhà Tuyển Dụng"}
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          selectedKeys={[currentTab]} // Use currentTab for active tab
          onClick={handleMenuClick} // Update currentTab on click and collapse in mobile view
          items={menuItems}
          className="border-r-0"
        />
        <div className="absolute bottom-0 w-full p-4 border-t">
          <Menu mode="inline" className="border-r-0">
            <Menu.Item key="logout" icon={<LogoutOutlined />}>
              Log-out
            </Menu.Item>
          </Menu>
        </div>
      </Sider>

      {/* Main Content */}
      <Layout>
        {mobileView && (
          <Button
            className="m-2"
            onClick={() => setCollapsed(!collapsed)}
            type="primary"
          >
            {collapsed ? "Mở Menu" : "Đóng Menu"}
          </Button>
        )}
        <Content className="lg:p-6 bg-gray-50 flex-1">
          {currentTab === "1" && <OverviewEmployer />}
          {currentTab === "3" && <PostJob />}
          {currentTab === "4" && <MyJobEmployer />}
          {currentTab === "8" && <SettingEmployer />}
          {currentTab === "5" && <SavedCandidate />}
          {currentTab === TAB_SKILL && <SkillEmployer />}
        </Content>
      </Layout>
    </Layout>
  );
}
