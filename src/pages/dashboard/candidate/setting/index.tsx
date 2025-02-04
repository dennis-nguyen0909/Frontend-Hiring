import {
  CloseOutlined,
  GlobalOutlined,
  LockOutlined,
  PlusOutlined,
  ProfileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Input, message, Select, Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import { useState } from "react";
import "react-quill/dist/quill.snow.css";
import Personal from "../Personal/Personal";
import ProfileComponentSetting from "../../../detail/Profile/ProfileComponentSetting";
import AccountSetting from "../AccountSetting/AccountSetting";
import "./style.css";
import { SOCIAL_LINK_API } from "../../../../services/modules/SocialLinkService";
import { useSelector } from "react-redux";
import SocialLinkCandidate from "../SocialLink/SocialLink";
const SettingCandidate = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const handleTabChange = (key) => {
    setActiveTab(key);
  };
  return (
    <div className="setting-candidate">
      <h1 className="text-[16px] font-semibold mb-6">Cài đặt</h1>

      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane
          tab={
            <span
              className={`!text-black flex items-center text-[12px] ${
                activeTab === "personal" ? "text-blue-500" : ""
              }`}
            >
              <UserOutlined className="mr-2" />
              Cá nhân
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
              Hồ sơ
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
              Liên kết xã hội
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
              Cài đặt tài khoản
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
