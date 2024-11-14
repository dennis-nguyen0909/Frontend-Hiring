import {
  CloseOutlined,
  EllipsisOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  GlobalOutlined,
  LinkOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
  ProfileOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, DatePicker, Input, Select, Space, Switch, Tabs, Upload } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import { useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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

  const renderPersonalTab = () => (
    <div>
      <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profile Picture
          </label>
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            onChange={handleFileUpload}
          >
            <div className="text-center">
              <UploadOutlined className="text-2xl mb-1" />
              <div className="text-xs text-gray-500">
                Browse photo or drop here
              </div>
              <div className="text-xs text-gray-400">
                A photo larger than 400 pixels work best. Max photo size 5 MB.
              </div>
            </div>
          </Upload>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full name
          </label>
          <Input placeholder="Enter your full name" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title/headline
          </label>
          <Input placeholder="Enter your title or headline" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Experience
          </label>
          <Select style={{ width: "100%" }} placeholder="Select...">
            <Select.Option value="0-1">0-1 years</Select.Option>
            <Select.Option value="1-3">1-3 years</Select.Option>
            <Select.Option value="3-5">3-5 years</Select.Option>
            <Select.Option value="5+">5+ years</Select.Option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Education
          </label>
          <Select style={{ width: "100%" }} placeholder="Select...">
            <Select.Option value="high-school">High School</Select.Option>
            <Select.Option value="bachelors">Bachelor's Degree</Select.Option>
            <Select.Option value="masters">Master's Degree</Select.Option>
            <Select.Option value="phd">Ph.D.</Select.Option>
          </Select>
        </div>
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Personal Website
          </label>
          <Input
            prefix={<LinkOutlined className="site-form-item-icon" />}
            placeholder="Website url..."
          />
        </div>
      </div>
      <Button
        type="primary"
        className="mt-4 bg-blue-500 hover:bg-blue-600"
        onClick={handleSaveChanges}
      >
        Save Changes
      </Button>

      <h2 className="text-xl font-semibold mt-8 mb-4">Your CV/Resume</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["Professional Resume", "Product Designer", "Visual Designer"].map(
          (resume, index) => (
            <div
              key={index}
              className="bg-gray-100 p-4 rounded-lg flex items-center justify-between"
            >
              <div className="flex items-center">
                <FileTextOutlined className="text-2xl mr-2" />
                <div>
                  <div className="font-medium">{resume}</div>
                  <div className="text-sm text-gray-500">
                    {(index + 3.5).toFixed(1)} MB
                  </div>
                </div>
              </div>
              <EllipsisOutlined className="text-xl" />
            </div>
          )
        )}
        <div className="bg-white border-2 border-dashed border-gray-300 p-4 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
          <PlusOutlined className="text-2xl mr-2" />
          <div>
            <div className="font-medium">Add CV/Resume</div>
            <div className="text-sm text-gray-500">
              Browse file or drop here, only pdf
            </div>
          </div>
        </div>
      </div>
    </div>
  );
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
  const renderAccountSettingTab = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Contact Info</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Map Location</label>
            <Input prefix={<EnvironmentOutlined />} placeholder="Enter your location" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <Input.Group compact>
              <Select defaultValue="+880" style={{ width: '20%' }}>
                <Select.Option value="+880">+880</Select.Option>
                <Select.Option value="+1">+1</Select.Option>
                <Select.Option value="+44">+44</Select.Option>
              </Select>
              <Input style={{ width: '80%' }} placeholder="Phone number" prefix={<PhoneOutlined />} />
            </Input.Group>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <Input prefix={<MailOutlined />} placeholder="Email address" />
          </div>
        </div>
        <Button type="primary" className="mt-4 bg-blue-500 hover:bg-blue-600" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Notification</h2>
        <div className="space-y-2">
          <Checkbox>Notify me when employers shortlisted me</Checkbox>
          <Checkbox>Notify me when my applied jobs are expire</Checkbox>
          <Checkbox>Notify me when I have up to 5 job alerts</Checkbox>
          <Checkbox>Notify me when employers saved my profile</Checkbox>
          <Checkbox>Notify me when employers rejected me</Checkbox>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Job Alerts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <Input prefix={<FileTextOutlined />} placeholder="Your job roles" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <Input prefix={<EnvironmentOutlined />} placeholder="City, state, country name" />
          </div>
        </div>
        <Button type="primary" className="mt-4 bg-blue-500 hover:bg-blue-600" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-4">Profile Privacy</h2>
          <Space>
            <Switch defaultChecked />
            <span>Your profile is public now</span>
          </Space>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Resume Privacy</h2>
          <Space>
            <Switch />
            <span>Your resume is private now</span>
          </Space>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <Input.Password placeholder="Current Password" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <Input.Password placeholder="New Password" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <Input.Password placeholder="Confirm Password" />
          </div>
        </div>
        <Button type="primary" className="mt-4 bg-blue-500 hover:bg-blue-600" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Delete Your Account</h2>
        <p className="text-gray-600 mb-4">
          If you delete your Jobpilot account, you will no longer be able to get information about the matched jobs, following employers, and job alert, shortlisted jobs and other activities. Your account will be deactivated from all the services of Jobpilot.com
        </p>
        <Button danger>Close Account</Button>
      </div>
    </div>
  )

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
          <Select style={{ width: '100%' }} placeholder="Select...">
            <Select.Option value="usa">United States</Select.Option>
            <Select.Option value="uk">United Kingdom</Select.Option>
            <Select.Option value="canada">Canada</Select.Option>
            <Select.Option value="australia">Australia</Select.Option>
            {/* Add more countries as needed */}
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="dd/mm/yyyy" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <Select style={{ width: '100%' }} placeholder="Select...">
            <Select.Option value="male">Male</Select.Option>
            <Select.Option value="female">Female</Select.Option>
            <Select.Option value="other">Other</Select.Option>
            <Select.Option value="prefer-not-to-say">Prefer not to say</Select.Option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
          <Select style={{ width: '100%' }} placeholder="Select...">
            <Select.Option value="single">Single</Select.Option>
            <Select.Option value="married">Married</Select.Option>
            <Select.Option value="divorced">Divorced</Select.Option>
            <Select.Option value="widowed">Widowed</Select.Option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
          <Select style={{ width: '100%' }} placeholder="Select...">
            <Select.Option value="high-school">High School</Select.Option>
            <Select.Option value="bachelors">Bachelor's Degree</Select.Option>
            <Select.Option value="masters">Master's Degree</Select.Option>
            <Select.Option value="phd">Ph.D.</Select.Option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
          <Select style={{ width: '100%' }} placeholder="Select...">
            <Select.Option value="0-1">0-1 years</Select.Option>
            <Select.Option value="1-3">1-3 years</Select.Option>
            <Select.Option value="3-5">3-5 years</Select.Option>
            <Select.Option value="5+">5+ years</Select.Option>
          </Select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Biography</label>
        <ReactQuill
          theme="snow"
          value={biography}
          onChange={setBiography}
          placeholder="Write down your biography here. Let the employers know who you are..."
        />
      </div>
      <Button type="primary" className="bg-blue-500 hover:bg-blue-600" onClick={handleSaveChanges}>
        Save Changes
      </Button>
    </div>
  )


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
          {renderPersonalTab()}
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
          {renderProfileTab()}
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
          {renderAccountSettingTab()}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default SettingCandidate;
