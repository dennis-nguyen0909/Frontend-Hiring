import { useEffect, useState, useCallback } from "react";
import { Layout, Menu, Button } from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  SaveOutlined,
  SettingOutlined,
  DollarOutlined,
  SettingFilled,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

import OverviewEmployer from "./Overview";
import PostJob from "./PostJob";
import MyJobEmployer from "./MyJob";
import SettingEmployer from "./Setting";
import SavedCandidate from "./SavedCandidate";
import SkillEmployer from "../../employer/Skill/Skill";
import * as userServices from "../../../services/modules/userServices";
import { updateUser } from "../../../redux/slices/userSlices";
import { TAB_SKILL } from "../../../utils/role.utils";

const { Sider, Content } = Layout;

interface UserState {
  _id: string;
  access_token: string;
  toggle_dashboard?: boolean;
}

interface RootState {
  user: UserState;
}

const MOBILE_BREAKPOINT = 768;

export default function DashBoardEmployer() {
  const [searchParams] = useSearchParams();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [currentTab, setCurrentTab] = useState(
    searchParams.get("activeTab") || "overview"
  );

  const userDetail = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
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
      icon: <SettingFilled />,
      children: [{ key: TAB_SKILL, label: t("manage_skill") }],
    },
  ];

  const handleCollapse = useCallback(
    async (collapsed: boolean) => {
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
    },
    [userDetail?._id, userDetail?.access_token, dispatch]
  );

  const handleMenuClick = useCallback(
    (e: { key: string }) => {
      setCurrentTab(e.key);
      if (mobileView) {
        setCollapsed(true);
      }
      const currentParams = new URLSearchParams(searchParams);
      currentParams.set("activeTab", e.key);
      navigate(`/dashboard/employer?${currentParams.toString()}`);
    },
    [mobileView, navigate, searchParams]
  );

  const handleResize = useCallback(() => {
    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    setMobileView(isMobile);
    setCollapsed(isMobile);
  }, []);

  useEffect(() => {
    const tab = searchParams.get("activeTab");
    if (tab) {
      setCurrentTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  useEffect(() => {
    if (userDetail?.toggle_dashboard !== undefined) {
      setCollapsed(userDetail.toggle_dashboard);
    }
  }, [userDetail?.toggle_dashboard]);

  const renderContent = () => {
    const contentMap = {
      overview: <OverviewEmployer />,
      "post-job": <PostJob />,
      "my-jobs": <MyJobEmployer />,
      settings: <SettingEmployer />,
      "saved-candidates": <SavedCandidate />,
      [TAB_SKILL]: <SkillEmployer />,
    } as const;
    return contentMap[currentTab as keyof typeof contentMap] || null;
  };

  return (
    <Layout className="min-h-screen flex">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={handleCollapse}
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
        <div className="absolute bottom-0 w-full p-4 border-t" />
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
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
}
