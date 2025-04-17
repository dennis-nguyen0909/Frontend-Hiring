import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { Editor } from "@tinymce/tinymce-react";
import {
  Button,
  Form,
  Image,
  Input,
  notification,
  Upload,
  UploadFile,
} from "antd";
import { useEffect, useRef, useState } from "react";
import * as userServices from "../../../../../services/modules/userServices";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateUser } from "../../../../../redux/slices/userSlices";
import { MediaApi } from "../../../../../services/modules/mediaServices";
import LoadingComponent from "../../../../../components/Loading/LoadingComponent";
import { useTranslation } from "react-i18next";
const CompanyInfo = () => {
  const { t } = useTranslation();
  const uploadRef = useRef(null);
  const [logoFile, setLogoFile] = useState<UploadFile | null>(null);
  const [form] = Form.useForm();
  const userDetail = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleUploadFile = async (file: File, type: string) => {
    setIsLoading(true);
    if (file) {
      try {
        const res = await MediaApi.postMedia(
          file,
          userDetail?._id,
          userDetail.access_token
        );
        if (res?.data?.url) {
          let params;
          if (type === "banner") {
            params = {
              id: userDetail?._id,
              banner_company: res?.data?.url,
            };
          } else {
            params = {
              id: userDetail?._id,
              avatar_company: res?.data?.url,
            };
          }
          const responseUpdate = await userServices.updateUser(params);
          if (responseUpdate.data) {
            notification.success({
              message: t("notification"),
              description: t("update_success"),
            });
            dispatch(
              updateUser({
                ...responseUpdate.data,
                access_token: userDetail.access_token,
              })
            );
          }
        }

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    }
  };
  const handleLogoChange = (info: any) => {
    handleUploadFile(info.file, "logo");
  };

  const handleBannerChange = (info: any) => {
    handleUploadFile(info.file, "banner");
  };

  const handleSave = async (values: any) => {
    setIsLoading(true);
    const { company_name, description } = values;
    const params = {
      company_name,
      description: description?.level?.content,
      id: userDetail?._id,
    };
    const res = await userServices.updateUser(params);
    if (res.data) {
      notification.success({
        message: t("notification"),
        description: t("update_success"),
      });
      dispatch(
        updateUser({ ...res.data, access_token: userDetail.access_token })
      );
    }
    setIsLoading(false);
  };
  const handleGetDetailUser = async () => {
    try {
      setIsLoading(true);
      const res = await userServices.USER_API.getDetailUser(
        userDetail?._id,
        userDetail?.access_token
      );
      if (res.data) {
        dispatch(updateUser({ ...res.data.items }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    handleGetDetailUser();
  }, []);
  const handleDeleteAvatar = async (type: string) => {
    try {
      setIsLoading(true);
      if (type === "avatar_company") {
        const res = await userServices.USER_API.deleteAvatarEmployer(
          userDetail?._id,
          "avatar_company",
          userDetail?.access_token
        );
        if (+res.statusCode === 200) {
          notification.success({
            message: t("notification"),
            description: t("delete_success"),
          });
        }
        await handleGetDetailUser();
        return;
      }
      if (type === "banner_company") {
        const res = await userServices.USER_API.deleteAvatarEmployer(
          userDetail?._id,
          "banner_company",
          userDetail?.access_token
        );
        if (+res.statusCode === 200) {
          notification.success({
            message: t("notification"),
            description: t("delete_success"),
          });
        }
        await handleGetDetailUser();
        return;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
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
              {userDetail?.avatar_company ? (
                <Image
                  className="px-2 py-2"
                  src={userDetail?.avatar_company}
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
                    {logoFile ? (
                      <img
                        src="/placeholder.svg?height=200&width=200"
                        alt="Logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center">
                        <UploadOutlined className="text-2xl" />
                        <div className="mt-2 text-[12px]">{t("upload")}</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>
              )}
              {userDetail?.avatar_company && (
                <div className="flex items-center mt-2 gap-4">
                  <span className=" text-gray-500 !text-[12px]">3.5 MB</span>
                  <div className="flex gap-2">
                    <Button
                      className="!text-[12px]"
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteAvatar("avatar_company")}
                    >
                      {t("remove")}
                    </Button>
                    <Input
                      type="file"
                      ref={uploadRef}
                      style={{ display: "none" }}
                      onChange={(e) => {
                        // Xử lý sự kiện khi người dùng chọn file
                        const file = e.target.files[0];
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <p className="mb-2 text-[12px]">{t("banner")}</p>
              {userDetail?.banner_company ? (
                <div className="relative w-full h-64">
                  {" "}
                  <Image
                    className="w-full h-full object-cover"
                    src={userDetail?.banner_company}
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
                    {userDetail?.banner_company ? (
                      <img
                        src="/placeholder.svg?height=200&width=400"
                        alt="Banner"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center">
                        <UploadOutlined className="text-2xl" />
                        <div className="mt-2 text-[12px]">{t("upload")}</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>
              )}
              {userDetail?.banner_company && (
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
              initialValue={userDetail?.company_name}
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
              initialValue={userDetail?.description}
              rules={[{ required: true, message: t("please_write_about_us") }]}
            >
              <Editor
                // apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
                apiKey="px41kgaxf4w89e8p41q6zuhpup6ve0myw5lzxzlf0gc06zh3"
                value={userDetail?.description}
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
