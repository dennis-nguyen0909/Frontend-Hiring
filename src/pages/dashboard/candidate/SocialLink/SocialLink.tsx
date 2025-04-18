import { CloseOutlined, LinkOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, notification, Select, Form } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { SOCIAL_LINK_API } from "../../../../services/modules/SocialLinkService";
import LoadingComponentSkeleton from "../../../../components/Loading/LoadingComponentSkeleton";
import { isValidUrl } from "../../../../helper";

const SocialLinkCandidate = () => {
  const { t } = useTranslation();
  const userDetail = useSelector((state) => state.user);
  const [loading, setLoading] = useState<boolean>(true);
  const [socialLinks, setSocialLinks] = useState([
    { type: "Facebook", url: "", error: "" },
    { type: "Twitter", url: "", error: "" },
    { type: "Instagram", url: "", error: "" },
    { type: "Youtube", url: "", error: "" },
  ]);

  const handleSocialLinkChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index][field] = value;
    updatedLinks[index].hasChanged = true;

    if (field === "url") {
      if (value.trim() === "") {
        updatedLinks[index].error = "";
      } else if (!isValidUrl(value)) {
        updatedLinks[index].error = t("invalid_url");
      } else {
        updatedLinks[index].error = "";
      }
    }

    setSocialLinks(updatedLinks);
  };

  const addNewSocialLink = () => {
    setSocialLinks([...socialLinks, { type: "", url: "", error: "" }]);
  };

  const handleGetSocialLinks = async () => {
    try {
      setLoading(true);
      const params = {
        current: 1,
        pageSize: 10,
        query: { user_id: userDetail?._id },
      };
      const res = await SOCIAL_LINK_API.getAll(
        params,
        userDetail?.access_token
      );
      if (res.data) {
        const existingLinks = res.data.items.map((link) => ({
          ...link,
          isExisting: true,
          hasChanged: false,
          error: "",
        }));
        setSocialLinks(existingLinks);
      }
    } catch (error) {
      console.error("Fetch social links failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetSocialLinks();
  }, []);

  const handleSaveChanges = async () => {
    const hasInvalid = socialLinks.some((link) => !isValidUrl(link.url));
    if (hasInvalid) {
      notification.error({
        message: t("notification"),
        description: t("please_enter_valid_urls"),
      });
      return;
    }

    if (socialLinks.length <= 0) {
      notification.error({
        message: t("notification"),
        description: t("please_select_link"),
      });
      return;
    }

    try {
      const requests = socialLinks
        .filter((link) => link.hasChanged)
        .map((link) => {
          const params = {
            user_id: userDetail?._id,
            type: link?.type,
            url: link?.url,
          };
          return SOCIAL_LINK_API.create(params, userDetail?.access_token);
        });

      if (requests.length > 0) {
        const results = await Promise.all(requests);
        if (results.every((res) => res.data)) {
          notification.success({
            message: t("notification"),
            description: t("create_success"),
          });
        }
        handleGetSocialLinks();
      } else {
        notification.info({
          message: t("notification"),
          description: t("no_changes_to_save"),
        });
      }
    } catch (error) {
      notification.error({
        message: t("error"),
        description: t("error_message"),
      });
    }
  };

  const onDeleted = async (id: string) => {
    try {
      const res = await SOCIAL_LINK_API.deleteMany(
        [id],
        userDetail?.access_token
      );
      if (+res.statusCode === 200) {
        notification.success({
          message: t("notification"),
          description: t("delete_success"),
        });
        handleGetSocialLinks();
      }
    } catch (error) {
      notification.error({
        message: t("error"),
        description: t("error_message"),
      });
    }
  };

  return (
    <LoadingComponentSkeleton isLoading={loading}>
      <h2 className="text-xl font-semibold mb-4">{t("social_link")}</h2>
      {socialLinks.map((link, index) => (
        <div key={index} className="mb-4">
          <label className="block text-[12px] font-medium text-gray-700 mb-1">
            {t("link")} {index + 1}
          </label>
          <div className="flex flex-col md:flex-row lg:items-start space-x-2">
            <Select
              className="text-[12px]"
              style={{ width: "150px" }}
              value={link.type}
              onChange={(value) => handleSocialLinkChange(index, "type", value)}
            >
              {["Facebook", "Twitter", "Instagram", "Youtube", "LinkedIn"].map(
                (platform) => (
                  <Select.Option key={platform} value={platform}>
                    <span className="text-[12px]">{platform}</span>
                  </Select.Option>
                )
              )}
            </Select>
            <div className="flex flex-col w-full mt-2 md:mt-0">
              <Form.Item
                validateStatus={link.error ? "error" : ""}
                help={link.error}
                style={{ flex: 1, marginBottom: 0 }}
                className="!mb-0"
              >
                <Input
                  prefix={<LinkOutlined className="text-gray-400" />}
                  placeholder={t("profile_link_url")}
                  className="text-[12px]"
                  value={link.url}
                  onChange={(e) =>
                    handleSocialLinkChange(index, "url", e.target.value)
                  }
                />
              </Form.Item>
              {link?._id && (
                <Button
                  type="text"
                  className="!text-[12px] absolute right-0 top-0"
                  icon={<CloseOutlined />}
                  onClick={() => onDeleted(link._id)}
                />
              )}
            </div>
          </div>
        </div>
      ))}

      <Button
        type="dashed"
        onClick={addNewSocialLink}
        className="w-full mt-4 !text-[12px]"
        icon={<PlusOutlined />}
      >
        {t("add_social_link")}
      </Button>

      <Button
        onClick={handleSaveChanges}
        className="px-4 !bg-primaryColor !text-white !border-none mt-5"
      >
        {t("save_changes")}
      </Button>
    </LoadingComponentSkeleton>
  );
};

export default SocialLinkCandidate;
