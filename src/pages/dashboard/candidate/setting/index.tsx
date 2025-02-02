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
const SettingCandidate = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [socialLinks, setSocialLinks] = useState([
    { platform: "Facebook", url: "" },
    { platform: "Twitter", url: "" },
    { platform: "Instagram", url: "" },
    { platform: "Youtube", url: "" },
  ]);
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleSocialLinkChange = (index, field, value) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index][field] = value;
    setSocialLinks(updatedLinks);
  };

  const addNewSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: "", url: "" }]);
  };

  const removeSocialLink = (index) => {
    const updatedLinks = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(updatedLinks);
  };

  const handleSaveChanges = () => {
    message.success("Changes saved successfully");
  };

  const renderSocialLinksTab = () => (
    <div>
      <h2 className="text-[12px]font-semibold mb-4">Liên kết xã hội</h2>
      {socialLinks?.map((link, index) => (
        <div key={index} className="mb-4">
          <label className="block text-[12px] font-medium text-gray-700 mb-1">
            Liên kết {index + 1}
          </label>
          <div className="flex items-center space-x-2">
            <Select
              style={{ width: "150px" }}
              value={link.platform}
              onChange={(value) =>
                handleSocialLinkChange(index, "platform", value)
              }
              dropdownStyle={{fontSize:'12px'}}
            >
              <Select.Option  value="Facebook">Facebook</Select.Option>
              <Select.Option value="Twitter">Twitter</Select.Option>
              <Select.Option value="Instagram">Instagram</Select.Option>
              <Select.Option value="Youtube">Youtube</Select.Option>
              <Select.Option value="LinkedIn">LinkedIn</Select.Option>
            </Select>
            <Input
              placeholder="Profile link/url..."
              value={link.url}
              onChange={(e) =>
                handleSocialLinkChange(index, "url", e.target.value)
              }
              style={{ flex: 1 }}
            />
            <Button
              type="text"
              size="small"
              icon={<CloseOutlined />}
              onClick={() => removeSocialLink(index)}
            />
          </div>
        </div>
      ))}
      <Button
        type="dashed"
        onClick={addNewSocialLink}
        className="w-full mt-4 !text-[12px]"
        icon={<PlusOutlined />}
      >
        Thêm liên kết xã hội mới
      </Button>
      <Button
        htmlType="submit"
        onClick={handleSaveChanges}
        className="px-4 !bg-primaryColor !text-white !border-none !hover:text-white !text-[12px] mt-2 w-full lg:w-auto"
      >
        Save & Next
      </Button>
    </div>
  );
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
          {/* {renderProfileTab()} */}
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
          {renderSocialLinksTab()}
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
