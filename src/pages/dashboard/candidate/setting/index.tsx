import {
  GlobalOutlined,
  LockOutlined,
  ProfileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import Personal from "../Personal/Personal";
import ProfileComponentSetting from "../../../detail/Profile/ProfileComponentSetting";
import AccountSetting from "../AccountSetting/AccountSetting";
import "./style.css";
import SocialLinkCandidate from "../SocialLink/SocialLink";
import { useTranslation } from "react-i18next";
import { useSearchParams, useNavigate } from "react-router-dom";

const SettingCandidate = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    const tab = searchParams.get("tabChild");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    navigate(`?tab=${key}`);
  };

  return (
    <div className="setting-candidate">
      <h1 className="text-[20px] font-semibold mb-6">{t("settings")}</h1>

      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane
          tab={
            <span
              className={`!text-black flex items-center text-[12px] ${
                activeTab === "personal" ? "text-blue-500" : ""
              }`}
            >
              <UserOutlined className="mr-2" />
              {t("personal")}
            </span>
          }
          key="personal"
        >
          <Personal />
        </TabPane>
        <TabPane
          tab={
            <span
              className={`!text-black flex items-center text-[12px] ${
                activeTab === "profile" ? "text-blue-500" : ""
              }`}
            >
              <ProfileOutlined className="mr-2" />
              {t("profile")}
            </span>
          }
          key="profile"
        >
          <ProfileComponentSetting />
        </TabPane>
        <TabPane
          tab={
            <span
              className={`!text-black flex items-center text-[12px] ${
                activeTab === "social" ? "text-blue-500" : ""
              }`}
            >
              <GlobalOutlined className="mr-2" />
              {t("social_link")}
            </span>
          }
          key="social"
        >
          <SocialLinkCandidate />
        </TabPane>
        <TabPane
          tab={
            <span
              className={`!text-black flex items-center text-[12px] ${
                activeTab === "account" ? "text-blue-500" : ""
              }`}
            >
              <LockOutlined className="mr-2" />
              {t("account_setting")}
            </span>
          }
          key="account"
        >
          <AccountSetting />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default SettingCandidate;
