import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, message, Select } from "antd";
import { useState } from "react";

const SocialEmployer = () => {
    const [socialLinks, setSocialLinks] = useState([
        { platform: "Facebook", url: "" },
        { platform: "Twitter", url: "" },
        { platform: "Instagram", url: "" },
        { platform: "Youtube", url: "" },
      ]);
      const [biography, setBiography] = useState('')
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
    
    return(
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
            <Input              placeholder="Profile link/url..."
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
    )
}

  export default SocialEmployer