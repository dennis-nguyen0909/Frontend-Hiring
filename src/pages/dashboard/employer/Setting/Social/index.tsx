import { CloseOutlined, LinkOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, notification, Select } from "antd";
import { useEffect, useState } from "react";
import { SOCIAL_LINK_API } from "../../../../../services/modules/SocialLinkService";
import { useSelector } from "react-redux";
import LoadingComponentSkeleton from "../../../../../components/Loading/LoadingComponentSkeleton";
import { useTranslation } from "react-i18next";

const SocialEmployer = () => {
  const { t } = useTranslation();
  const userDetail = useSelector((state) => state.user);
  const [loading, setLoading] = useState<boolean>(true);
  const [socialLinks, setSocialLinks] = useState([]);

  const isValidUrl = (url) => {
    try {
      const parsed = new URL(url);
      return ["http:", "https:"].includes(parsed.protocol);
    } catch {
      return false;
    }
  };

  const handleSocialLinkChange = (index, field, value) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index][field] = value;

    if (field === "url") {
      if (!value) {
        updatedLinks[index].error = t("please_enter_a_valid_url");
      } else if (!isValidUrl(value)) {
        updatedLinks[index].error = t("invalid_url");
      } else {
        updatedLinks[index].error = "";
      }
    }

    if (updatedLinks[index].isExisting) {
      updatedLinks[index].hasChanged = true;
    } else {
      updatedLinks[index].hasChanged = true;
      updatedLinks[index].isExisting = false;
    }

    setSocialLinks(updatedLinks);
  };

  const addNewSocialLink = () => {
    setSocialLinks([...socialLinks, { type: "", url: "", error: "" }]);
  };

  const handleGetSocialLinks = async (current = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const params = {
        current,
        pageSize,
        query: {
          user_id: userDetail?._id,
        },
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
        setSocialLinks([...existingLinks]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetSocialLinks();
  }, []);

  const handleSaveChanges = async () => {
    const hasInvalid = socialLinks.some((link) => link.error);
    if (hasInvalid) {
      notification.error({
        message: t("notification"),
        description: t("please_fix_errors"),
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
        .filter((social) => social.hasChanged || !social.isExisting)
        .map((social) => {
          const params = {
            user_id: userDetail?._id,
            type: social?.type,
            url: social?.url,
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

  const onDeleted = async (id) => {
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
  };

  return (
    <LoadingComponentSkeleton isLoading={loading}>
      <h2 className="text-xl font-semibold mb-4">{t("social_link")}</h2>
      {socialLinks.map((link, index) => (
        <div key={index} className="mb-4">
          <label className="block text-[12px] font-medium text-gray-700 mb-1">
            {t("link")} {index + 1}
          </label>
          <div className="flex lg:items-center items-start space-x-2 flex-col md:flex-row">
            <Select
              className="ml-2 text-[12px]"
              style={{ width: "150px" }}
              value={link.type}
              onChange={(value) => handleSocialLinkChange(index, "type", value)}
            >
              <Select.Option value="Facebook">Facebook</Select.Option>
              <Select.Option value="Twitter">Twitter</Select.Option>
              <Select.Option value="Instagram">Instagram</Select.Option>
              <Select.Option value="Youtube">Youtube</Select.Option>
              <Select.Option value="LinkedIn">LinkedIn</Select.Option>
            </Select>
            <div className="md:flex-row flex w-full justify-start flex-row mt-2 md:mt-0">
              <Input
                prefix={<LinkOutlined className="text-gray-500" />}
                placeholder={t("profile_link_url")}
                className={`text-[12px] ${link.error ? "border-red-500" : ""}`}
                value={link.url}
                onChange={(e) =>
                  handleSocialLinkChange(index, "url", e.target.value)
                }
                style={{ flex: 1 }}
              />
              <Button
                type="text"
                className="!text-[12px]"
                icon={<CloseOutlined />}
                onClick={() => onDeleted(link?._id)}
              />
            </div>
          </div>
          {link.error && (
            <p className="text-red-500 text-[12px] mt-1">{link.error}</p>
          )}
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
        htmlType="submit"
        onClick={handleSaveChanges}
        className="px-4 !bg-primaryColor !text-white !border-none !hover:text-white mt-5"
      >
        {t("save_changes")}
      </Button>
    </LoadingComponentSkeleton>
  );
};

export default SocialEmployer;
