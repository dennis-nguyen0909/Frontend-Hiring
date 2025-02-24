import { CloseCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Input, notification, Select } from "antd";
import { useState } from "react";
import { SOCIAL_LINK_API } from "../../../services/modules/SocialLinkService";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const SocialLinks = ({ handleTabChange }) => {
  const { t } = useTranslation();
  const [socialLinks, setSocialLinks] = useState([
    // initialize with empty social links if needed
  ]);
  const userDetail = useSelector((state) => state.user);

  const handleRemoveLink = (id: number) => {
    setSocialLinks(socialLinks.filter((link) => link.id !== id));
  };

  const handleAddLink = () => {
    const newId = socialLinks.length + 1;
    setSocialLinks([...socialLinks, { id: newId, type: "", url: "" }]);
  };

  const onUpdate = async () => {
    if (socialLinks.length <= 0) {
      notification.error({
        message: t("notification"),
        description: t("please_select_link"),
      });
      return;
    }

    try {
      const requests = socialLinks.map((social) => {
        const params = {
          user_id: userDetail?._id,
          type: social?.type,
          url: social?.url,
        };
        return SOCIAL_LINK_API.create(params, userDetail?.access_token);
      });

      // Sử dụng Promise.all để chờ tất cả các API hoàn thành
      const results = await Promise.all(requests);

      // Kiểm tra kết quả của tất cả các lần gọi API
      if (results.every((res) => res.data)) {
        notification.success({
          message: t("notification"),
          description: t("success"),
        });
        handleTabChange("contact");
      }
    } catch (error) {
      notification.error({
        message: t("error"),
        description: t("error_message"),
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {socialLinks.map((link, index) => (
        <div key={link.id} className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("link")} {index + 1}
          </label>
          <div className="flex gap-4">
            <Select
              value={link?.type}
              className="w-40"
              onChange={(value) => {
                const newLinks = [...socialLinks];
                newLinks[index].type = value; // Update type
                setSocialLinks(newLinks);
              }}
              options={[
                { value: "Facebook", label: "Facebook" },
                { value: "Twitter", label: "Twitter" },
                { value: "Instagram", label: "Instagram" },
                { value: "Youtube", label: "Youtube" },
                { value: "LinkedIn", label: "LinkedIn" },
              ]}
            />
            <div className="flex-1 relative">
              <Input
                placeholder="Profile link/url..."
                value={link.url}
                onChange={(e) => {
                  const newLinks = [...socialLinks];
                  newLinks[index].url = e.target.value;
                  setSocialLinks(newLinks);
                }}
              />
              <Button
                type="text"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => handleRemoveLink(link.id)}
                icon={<CloseCircleOutlined />}
              />
            </div>
          </div>
        </div>
      ))}

      <Button
        type="default"
        block
        className="bg-gray-50 hover:bg-gray-100 mb-8"
        onClick={handleAddLink}
      >
        <PlusCircleOutlined />
        {t("add_social_link")}
      </Button>

      <div className="flex justify-between">
        <Button
          htmlType="submit"
          onClick={onUpdate}
          className="px-4 !bg-[#201527] !text-primaryColor !border-none !hover:text-white"
        >
          {t("save_and_continue")}
        </Button>
      </div>
    </div>
  );
};

export default SocialLinks;
