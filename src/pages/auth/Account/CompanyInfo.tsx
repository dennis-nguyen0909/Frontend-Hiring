import { UploadOutlined } from "@ant-design/icons";
import { Avatar, Button, Form, Input, message, notification } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { Editor } from "@tinymce/tinymce-react";
import { useForm } from "antd/es/form/Form";
import { useState } from "react";
import { MediaApi } from "../../../services/modules/mediaServices";
import { useSelector } from "react-redux";
import { USER_API } from "../../../services/modules/userServices";
import LoadingComponent from "../../../components/Loading/LoadingComponent";
import { useDispatch } from "react-redux";
import { updateUser } from "../../../redux/slices/userSlices";
import { useTranslation } from "react-i18next";

const CompanyInfo = ({ handleTabChange }) => {
  const { t } = useTranslation();
  const [form] = useForm();
  const userDetail = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingBanner, setIsLoadingBanner] = useState<boolean>(false);

  const onFinish = async (values: any) => {
    if (!userDetail?.avatar_company && !values.logo) {
      message.error(t("please_upload_a_logo_before_proceeding"));
      return;
    }

    if (!userDetail?.banner_company && !values.banner) {
      message.error(t("please_upload_a_banner_before_proceeding"));
      return;
    }
    const params = {
      id: userDetail?._id,
      company_name: values.company_name,
      description: values?.description?.level?.content,
    };
    const update = await USER_API.updateUser(params, userDetail?.access_token);
    if (update.data) {
      form.setFieldsValue({
        company_name: update?.data?.company_name,
        description: update?.data?.description,
      });
      handleTabChange("founding");
      dispatch(updateUser({ ...update.data }));
    }
  };

  const uploadFiled = async (file: File) => {
    try {
      const res = await MediaApi.postMedia(
        file,
        userDetail?._id,
        userDetail?.access_token
      );
      return res;
    } catch (error: any) {
      notification.error({
        message: t("notification"),
        description: error,
      });
    }
  };
  const handleFileChange = async (info: any, type: string) => {
    if (info.file) {
      if (type === "logo") {
        setIsLoading(true);
        const res = await uploadFiled(info?.file);
        if (res.data.url) {
          const params = {
            id: userDetail?._id,
            avatar_company: res?.data?.url,
          };
          const update = await USER_API.updateUser(
            params,
            userDetail?.access_token
          );
          if (update.data) {
            notification.success({
              message: t("notification"),
              description: t("update_success"),
            });
            dispatch(updateUser({ ...update.data }));
          }
          setIsLoading(false);
        }
      } else if (type === "banner") {
        setIsLoadingBanner(true);
        const res = await uploadFiled(info?.file);
        if (res.data.url) {
          const params = {
            id: userDetail?._id,
            banner_company: res?.data?.url,
          };
          const update = await USER_API.updateUser(
            params,
            userDetail?.access_token
          );
          if (update.data) {
            notification.success({
              message: t("notification"),
              description: t("update_success"),
            });
            dispatch(updateUser({ ...update.data }));
          }
          setIsLoadingBanner(false);
        }
      }
    } else if (info.file.status === "error") {
      console.error(t("file_upload_failed"), info.file);
    }
  };

  return (
    <div className="">
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("logo_image")}
          </label>
          {userDetail?.avatar_company ? (
            <Avatar
              shape="square"
              size={140}
              src={userDetail?.avatar_company}
            />
          ) : (
            <LoadingComponent isLoading={isLoading}>
              <Dragger
                name="logo"
                multiple={false}
                className="bg-gray-50 border-dashed"
                showUploadList={false}
                beforeUpload={() => false}
                onChange={(info) => handleFileChange(info, "logo")}
              >
                <p className="text-gray-500">
                  <UploadOutlined className="text-2xl mb-2" />
                  <br />
                  {t("browse_photo_or_drop_here")}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {t("a_photo_larger_than_400_pixels_work_best")}
                </p>
              </Dragger>
            </LoadingComponent>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("banner_image")}
          </label>
          {userDetail?.banner_company ? (
            <Avatar
              shape="square"
              size={140}
              src={userDetail?.banner_company}
            />
          ) : (
            <LoadingComponent isLoading={isLoadingBanner}>
              <Dragger
                name="banner"
                multiple={false}
                className="bg-gray-50 border-dashed"
                showUploadList={false}
                beforeUpload={() => false}
                onChange={(info) => handleFileChange(info, "banner")}
              >
                <p className="text-gray-500">
                  <UploadOutlined className="text-2xl mb-2" />
                  <br />
                  {t("browse_photo_or_drop_here")}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {t(
                    "banner_images_optimal_dimension_1520_400jpeg_png_max_photo_size_5_mb"
                  )}
                </p>
              </Dragger>
            </LoadingComponent>
          )}
        </div>
      </div>
      <Form
        onFinish={onFinish}
        form={form}
        layout="vertical"
        className="space-y-6"
        initialValues={{
          company_name: userDetail?.company_name,
          description: userDetail?.description,
        }}
      >
        <div>
          <Form.Item
            label={t("company_name")}
            name="company_name"
            rules={[
              { required: true, message: t("please_enter_company_name") },
            ]}
          >
            <Input placeholder={t("company_name")} className="max-w-xl" />
          </Form.Item>
        </div>

        <div>
          <Form.Item
            label={t("about_us")}
            name="description"
            // rules={[{ required: true, message: "Please input description!" }]}
          >
            <Editor
              apiKey="px41kgaxf4w89e8p41q6zuhpup6ve0myw5lzxzlf0gc06zh3"
              // onEditorChange={(content) => form.setFieldsValue({ description: content })}
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
        <Button
          htmlType="submit"
          className="px-4 !bg-[#201527] !text-primaryColor !border-none !hover:text-white"
        >
          {t("save_and_continue")}
        </Button>
      </Form>
    </div>
  );
};

export default CompanyInfo;
