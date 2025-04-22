import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { Editor } from "@tinymce/tinymce-react";
import {
  Button,
  Form,
  Image,
  Input,
  notification,
  Upload,
  UploadProps,
} from "antd";
import { useRef } from "react";
import * as userServices from "../../../../../services/modules/userServices";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateUser } from "../../../../../redux/slices/userSlices";
import { MediaApi } from "../../../../../services/modules/mediaServices";
import LoadingComponent from "../../../../../components/Loading/LoadingComponent";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface CompanyFormValues {
  company_name: string;
  description: {
    level: {
      content: string;
    };
  };
}

interface UpdateUserParams {
  id: string;
  company_name?: string;
  description?: string;
  avatar_company?: string;
  banner_company?: string;
}

interface RootState {
  user: {
    _id: string;
    access_token: string;
  };
}

const CompanyInfo = () => {
  const { t } = useTranslation();
  const uploadRef = useRef(null);
  const [form] = Form.useForm();
  const userDetail = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ["userDetail", userDetail?._id],
    queryFn: async () => {
      const res = await userServices.USER_API.getDetailUser(
        userDetail?._id,
        userDetail?.access_token
      );
      return res.data;
    },
    enabled: !!userDetail?._id && !!userDetail?.access_token,
  });

  const updateUserMutation = useMutation({
    mutationFn: async (params: UpdateUserParams) => {
      const res = await userServices.updateUser(params);
      return res.data;
    },
    onSuccess: (data) => {
      notification.success({
        message: t("notification"),
        description: t("update_success"),
      });
      dispatch(updateUser({ ...data, access_token: userDetail.access_token }));
      queryClient.invalidateQueries({ queryKey: ["userDetail"] });
    },
  });

  const deleteAvatarMutation = useMutation({
    mutationFn: async ({
      type,
    }: {
      type: "avatar_company" | "banner_company";
    }) => {
      const res = await userServices.USER_API.deleteAvatarEmployer(
        userDetail?._id,
        type,
        userDetail?.access_token
      );
      return res;
    },
    onSuccess: (res) => {
      if (+res.statusCode === 200) {
        notification.success({
          message: t("notification"),
          description: t("delete_success"),
        });
        queryClient.invalidateQueries({ queryKey: ["userDetail"] });
      }
    },
  });

  const uploadMediaMutation = useMutation({
    mutationFn: async ({
      file,
      type,
    }: {
      file: File;
      type: "logo" | "banner";
    }) => {
      const res = await MediaApi.postMedia(
        file,
        userDetail?._id,
        userDetail.access_token
      );
      return { res, type };
    },
    onSuccess: (data) => {
      if (data.res?.data?.url) {
        const params: UpdateUserParams = {
          id: userDetail?._id,
          [data.type === "banner" ? "banner_company" : "avatar_company"]:
            data.res.data.url,
        };
        updateUserMutation.mutate(params);
      }
    },
  });

  const handleLogoChange: UploadProps["onChange"] = (info) => {
    if (info.fileList?.[0]?.originFileObj) {
      uploadMediaMutation.mutate({
        file: info.fileList[0].originFileObj,
        type: "logo",
      });
    }
  };

  const handleBannerChange: UploadProps["onChange"] = (info) => {
    if (info.fileList?.[0]?.originFileObj) {
      uploadMediaMutation.mutate({
        file: info.fileList[0].originFileObj,
        type: "banner",
      });
    }
  };

  const handleSave = async (values: CompanyFormValues) => {
    const { company_name, description } = values;
    const params: UpdateUserParams = {
      company_name,
      description: description?.level?.content,
      id: userDetail?._id,
    };
    updateUserMutation.mutate(params);
  };

  const handleDeleteAvatar = (type: "avatar_company" | "banner_company") => {
    deleteAvatarMutation.mutate({ type });
  };

  const isLoading =
    isLoadingUser ||
    updateUserMutation.isPending ||
    deleteAvatarMutation.isPending ||
    uploadMediaMutation.isPending;

  return (
    <LoadingComponent isLoading={isLoading}>
      <Form form={form} layout="vertical" onFinish={handleSave}>
        <div className="mb-8">
          <h2 className="text-[20px] font-semibold mb-4">
            {t("logo_and_banner")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="mb-2 text-[12px]">{t("upload_logo")}</p>
              {userData?.items?.avatar_company ? (
                <Image
                  className="px-2 py-2"
                  src={userData?.items?.avatar_company}
                  alt="Logo"
                  width={200}
                  height={200}
                  preview={false}
                />
              ) : (
                <Form.Item name="logo">
                  <Upload
                    ref={uploadRef}
                    listType="picture-card"
                    className="w-full"
                    showUploadList={false}
                    onChange={handleLogoChange}
                    beforeUpload={() => false}
                  >
                    <div className="flex flex-col items-center">
                      <UploadOutlined className="text-2xl" />
                      <div className="mt-2 text-[12px]">{t("upload")}</div>
                    </div>
                  </Upload>
                </Form.Item>
              )}
              {userData?.items?.avatar_company && (
                <div className="flex items-center mt-2 gap-4">
                  <span className="text-gray-500 !text-[12px]">3.5 MB</span>
                  <div className="flex gap-2">
                    <Button
                      className="!text-[12px]"
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteAvatar("avatar_company")}
                    >
                      {t("remove")}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <p className="mb-2 text-[12px]">{t("banner")}</p>
              {userData?.items?.banner_company ? (
                <div className="relative w-full h-64">
                  <Image
                    className="w-full h-full object-cover"
                    src={userData?.items?.banner_company}
                    alt="Banner"
                    preview={false}
                    width={"100%"}
                    height={"100%"}
                  />
                </div>
              ) : (
                <Form.Item name="banner">
                  <Upload
                    listType="picture-card"
                    className="w-full"
                    showUploadList={false}
                    onChange={handleBannerChange}
                    beforeUpload={() => false}
                  >
                    <div className="flex flex-col items-center">
                      <UploadOutlined className="text-2xl" />
                      <div className="mt-2 text-[12px]">{t("upload")}</div>
                    </div>
                  </Upload>
                </Form.Item>
              )}
              {userData?.items?.banner_company && (
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="text-sm text-gray-500">4.3 MB</span>
                  <div className="flex gap-2">
                    <Button
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteAvatar("banner_company")}
                    >
                      {t("remove")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <Form.Item
              label={<div className="text-[12px]">{t("company_name")}</div>}
              name="company_name"
              initialValue={userData?.items?.company_name}
              rules={[
                { required: true, message: t("please_enter_company_name") },
              ]}
            >
              <Input
                placeholder={t("enter_company_name")}
                className="max-w-md text-[12px]"
              />
            </Form.Item>
          </div>

          <div>
            <Form.Item
              label={<div className="text-[12px]">{t("about_us")}</div>}
              name="description"
              initialValue={userData?.items?.description}
              rules={[{ required: true, message: t("please_write_about_us") }]}
            >
              <Editor
                apiKey="px41kgaxf4w89e8p41q6zuhpup6ve0myw5lzxzlf0gc06zh3"
                value={userData?.items?.description}
                onEditorChange={(content) =>
                  form.setFieldsValue({ description: content })
                }
                init={{
                  height: 200,
                  menubar: false,
                  plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste code help wordcount",
                  ],
                  toolbar:
                    "bold italic underline strikethrough | link | alignleft aligncenter alignright alignjustify | bullist numlist | removeformat",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
              />
            </Form.Item>
          </div>

          <Form.Item>
            <Button
              htmlType="submit"
              className="px-4 !bg-primaryColor !text-white !border-none !hover:text-white !text-[12px]"
            >
              {t("save")}
            </Button>
          </Form.Item>
        </div>
      </Form>
    </LoadingComponent>
  );
};

export default CompanyInfo;
