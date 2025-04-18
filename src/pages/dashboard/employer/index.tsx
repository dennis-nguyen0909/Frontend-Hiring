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
import { useTranslation } from "react-i18next";

const { Sider, Content } = Layout;

export default function DashBoardEmployer() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [currentTab, setCurrentTab] = useState("overview"); // Initialize state for the current tab
  const userDetail = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const menuItems = [
    {
      key: "overview",
      icon: <UserOutlined />,
      label: t("total_overview"),
      className: "bg-blue-50",
    },
    { key: "post-job", icon: <FileTextOutlined />, label: t("post_job") },
    { key: "my-jobs", icon: <FileTextOutlined />, label: t("my_job") },
    {
      key: "saved-candidates",
      icon: <SaveOutlined />,
      label: t("saved_candidate"),
    },
    { key: "payment", icon: <DollarOutlined />, label: t("package_payment") },
    { key: "settings", icon: <SettingOutlined />, label: t("setting") },
    {
      key: "management",
      label: t("manage_post"),
      icon: <SettingOutlined />,
      children: [{ key: TAB_SKILL, label: t("manage_skill") }],
    },
  ];

  const handleCollapse = async (collapsed: boolean) => {
    setCollapsed(collapsed);
    try {
      const res = await userServices.updateUser({
        id: userDetail?._id,
        toggle_dashboard: collapsed,
      });
      dispatch(
        updateUser({ ...res.data, access_token: userDetail.access_token })
      );
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleMenuClick = (e: any) => {
    setCurrentTab(e.key);
    if (mobileView) {
      setCollapsed(true);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setCollapsed(false);
      } else {
        setCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (userDetail?.toggle_dashboard !== undefined) {
      setCollapsed(userDetail.toggle_dashboard);
    }
  }, [userDetail?.toggle_dashboard]);

  return (
    <Layout className="min-h-screen flex">
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
          {!collapsed && t("employer")}
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={["overview"]}
          selectedKeys={[currentTab]}
          onClick={handleMenuClick}
          items={menuItems}
          className="border-r-0"
        />
        <div className="absolute bottom-0 w-full p-4 border-t">
          {/* <Menu mode="inline" className="border-r-0">
            <Menu.Item key="logout" icon={<LogoutOutlined />}>
              {t("logout")}
            </Menu.Item>
          </Menu> */}
        </div>
      </Sider>

      <Layout>
        {mobileView && (
          <Button
            className="m-2"
            onClick={() => setCollapsed(!collapsed)}
            type="primary"
          >
            {collapsed ? t("open_menu") : t("close_menu")}
          </Button>
        )}
        <Content className="lg:px-6 lg:py-2 bg-gray-50 flex-1">
          {currentTab === "overview" && <OverviewEmployer />}
          {currentTab === "post-job" && <PostJob />}
          {currentTab === "my-jobs" && <MyJobEmployer />}
          {currentTab === "settings" && <SettingEmployer />}
          {currentTab === "saved-candidates" && <SavedCandidate />}
          {currentTab === TAB_SKILL && <SkillEmployer />}
        </Content>
      </Layout>
    </Layout>
  );
}
