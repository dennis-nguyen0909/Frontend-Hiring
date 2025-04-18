import {
  CloseCircleOutlined,
  PlusCircleOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, notification, Select } from "antd";
import { useState } from "react";
import { SOCIAL_LINK_API } from "../../../services/modules/SocialLinkService";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const SocialLinks = ({ handleTabChange }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [socialLinks, setSocialLinks] = useState([
    { id: 1, type: "", url: "" },
  ]);
  const userDetail = useSelector((state) => state.user);

  const handleRemoveLink = (id: number) => {
    const newLinks = socialLinks.filter((link) => link.id !== id);
    setSocialLinks(newLinks);
    form.setFieldsValue({ socialLinks: newLinks });
  };

  const handleAddLink = () => {
    const newId =
      socialLinks.length > 0 ? socialLinks[socialLinks.length - 1].id + 1 : 1;
    const newLink = { id: newId, type: "", url: "" };
    const updatedLinks = [...socialLinks, newLink];
    setSocialLinks(updatedLinks);
    form.setFieldsValue({ socialLinks: updatedLinks });
  };

  const onUpdate = async (values: any) => {
    const socialLinks = values.socialLinks || [];

    if (socialLinks.length === 0) {
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

      const results = await Promise.all(requests);

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
      <Form
        form={form}
        layout="vertical"
        onFinish={onUpdate}
        initialValues={{ socialLinks }}
      >
        {socialLinks.map((link, index) => (
          <div key={link.id} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("link")} {index + 1}
            </label>
            <div className="flex gap-4">
              <Form.Item
                name={["socialLinks", index, "type"]}
                className="mb-0 w-40"
                rules={[{ required: true, message: t("please_select_type") }]}
              >
                <Select
                  options={[
                    { value: "Facebook", label: "Facebook" },
                    { value: "Twitter", label: "Twitter" },
                    { value: "Instagram", label: "Instagram" },
                    { value: "Youtube", label: "Youtube" },
                    { value: "LinkedIn", label: "LinkedIn" },
                  ]}
                  placeholder={t("select_type")}
                />
              </Form.Item>

              <div className="flex-1 relative">
                <Form.Item
                  name={["socialLinks", index, "url"]}
                  rules={[
                    { required: true, message: t("please_enter_url") },
                    {
                      type: "url",
                      message: t("invalid_url"),
                    },
                  ]}
                  className="mb-0 w-full"
                >
                  <Input
                    prefix={<LinkOutlined className="text-gray-400" />}
                    placeholder={t("profile_link_url")}
                  />
                </Form.Item>

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
            className="px-4 !bg-[#201527] !text-primaryColor !border-none !hover:text-white"
          >
            {t("save_and_continue")}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SocialLinks;
