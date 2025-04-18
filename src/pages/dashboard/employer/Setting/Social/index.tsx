import { CloseOutlined, LinkOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, notification, Select } from "antd";
import { useState } from "react";
import { SOCIAL_LINK_API } from "../../../../../services/modules/SocialLinkService";
import { useSelector } from "react-redux";
import LoadingComponentSkeleton from "../../../../../components/Loading/LoadingComponentSkeleton";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface SocialLink {
  _id?: string;
  type: string;
  url: string;
  error?: string;
  isExisting?: boolean;
  hasChanged?: boolean;
}

const SocialEmployer = () => {
  const { t } = useTranslation();
  const userDetail = useSelector((state: any) => state.user);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const queryClient = useQueryClient();

  const { isLoading, data } = useQuery({
    queryKey: ["socialLinks", userDetail?._id],
    queryFn: async () => {
      const params = {
        current: 1,
        pageSize: 10,
        query: {
          user_id: userDetail?._id,
        },
      };
      const res = await SOCIAL_LINK_API.getAll(
        params,
        userDetail?.access_token
      );
      return res.data;
    },
    enabled: !!userDetail?._id,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  // Update socialLinks when data changes
  useState(() => {
    if (data?.items) {
      const existingLinks = data.items.map((link: any) => ({
        ...link,
        isExisting: true,
        hasChanged: false,
        error: "",
      }));
      setSocialLinks(existingLinks);
    }
  }, [data]);

  const createMutation = useMutation({
    mutationFn: async (params: any) => {
      return SOCIAL_LINK_API.create(params, userDetail?.access_token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socialLinks"] });
      notification.success({
        message: t("notification"),
        description: t("create_success"),
      });
    },
    onError: () => {
      notification.error({
        message: t("error"),
        description: t("error_message"),
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return SOCIAL_LINK_API.deleteMany([id], userDetail?.access_token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socialLinks"] });
      notification.success({
        message: t("notification"),
        description: t("delete_success"),
      });
    },
  });

  const isValidUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return ["http:", "https:"].includes(parsed.protocol);
    } catch {
      return false;
    }
  };

  const handleSocialLinkChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };

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

    const linksToSave = socialLinks.filter(
      (social) => social.hasChanged || !social.isExisting
    );

    if (linksToSave.length > 0) {
      linksToSave.forEach((social) => {
        const params = {
          user_id: userDetail?._id,
          type: social.type,
          url: social.url,
        };
        createMutation.mutate(params);
      });
    } else {
      notification.info({
        message: t("notification"),
        description: t("no_changes_to_save"),
      });
    }
  };

  const onDeleted = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <LoadingComponentSkeleton isLoading={isLoading}>
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
                onClick={() => onDeleted(link?._id || "")}
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
