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
import 'react-quill/dist/quill.snow.css';
import Personal from "../Personal/Personal";
import ProfileComponentSetting from "../../../detail/Profile/ProfileComponentSetting";
import AccountSetting from "../AccountSetting/AccountSetting";

const SettingCandidate = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [socialLinks, setSocialLinks] = useState([
    { platform: "Facebook", url: "" },
    { platform: "Twitter", url: "" },
    { platform: "Instagram", url: "" },
    { platform: "Youtube", url: "" },
  ]);
  const [biography, setBiography] = useState('')
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

  const handleFileUpload = (info) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };
  const renderSocialLinksTab = () => (
    <div>
      <h2 className="text-xl font-semibold mb-4">Social Links</h2>
      {socialLinks.map((link, index) => (
        <div key={index} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Social Link {index + 1}
          </label>
          <div className="flex items-center space-x-2">
            <Select
              style={{ width: "150px" }}
              value={link.platform}
              onChange={(value) =>
                handleSocialLinkChange(index, "platform", value)
              }
            >
              <Select.Option value="Facebook">Facebook</Select.Option>
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
              icon={<CloseOutlined />}
              onClick={() => removeSocialLink(index)}
            />
          </div>
        </div>
      ))}
      <Button
        type="dashed"
        onClick={addNewSocialLink}
        className="w-full mt-4"
        icon={<PlusOutlined />}
      >
        Add New Social Link
      </Button>
      <Button
        type="primary"
        className="mt-4 bg-blue-500 hover:bg-blue-600"
        onClick={handleSaveChanges}
      >
        Save Changes
      </Button>
    </div>
  );
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Setting</h1>

      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane
          tab={
            <span
              className={`flex items-center ${
                activeTab === "personal" ? "text-blue-500" : ""
              }`}
            >
              <UserOutlined className="mr-2" />
              Personal
            </span>
          }
          key="personal"
        >
          <Personal />
        </TabPane>
        <TabPane
          tab={
            <span
              className={`flex items-center ${
                activeTab === "profile" ? "text-blue-500" : ""
              }`}
            >
              <ProfileOutlined className="mr-2" />
              Profile
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
              className={`flex items-center ${
                activeTab === "social" ? "text-blue-500" : ""
              }`}
            >
              <GlobalOutlined className="mr-2" />
              Social Links
            </span>
          }
          key="social"
        >
          {renderSocialLinksTab()}
        </TabPane>
        <TabPane
          tab={
            <span
              className={`flex items-center ${
                activeTab === "account" ? "text-blue-500" : ""
              }`}
            >
              <LockOutlined className="mr-2" />
              Account Setting
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
