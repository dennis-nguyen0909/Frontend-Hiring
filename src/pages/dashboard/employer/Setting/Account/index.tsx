import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Modal,
  message,
  notification,
} from "antd";
import {
  UserOutlined,
  GlobalOutlined,
  WifiOutlined,
  SettingOutlined,
  MailOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import * as userServices from "../../../../../services/modules/userServices";
import { useDispatch } from "react-redux";
import { updateUser } from "../../../../../redux/slices/userSlices";
import { Chrome, Facebook, Github, House } from "lucide-react";
import { useTranslation } from "react-i18next";

interface OAuthProvider {
  name: string;
  icon: React.ReactNode;
  enabled: boolean;
}
export default function AccountSettingEmployer() {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [passwordForm] = Form.useForm();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dispatch = useDispatch();
  const userDetail = useSelector((state) => state.user);

  const handleSaveContact = () => {
    form.validateFields().then(async (values) => {
      const params = {
        ...values,
        id: userDetail?._id,
      };
      try {
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
      } catch (error) {
        notification.error({
          message: t("notification"),
          description: error.message,
        });
      }
    });
  };

  const handleChangePassword = () => {
    passwordForm.validateFields().then(async (values) => {
      message.success(t("password_changed_successfully"));
      try {
        const res = await userServices.USER_API.resetPassword(
          {
            ...values,
            user_id: userDetail?._id,
          },
          userDetail.access_token
        );
        if (res.data) {
          notification.success({
            message: t("notification"),
            description: t("update_success"),
          });
          dispatch(
            updateUser({ ...res.data, access_token: userDetail.access_token })
          );
        } else {
          notification.error({
            message: t("notification"),
            description: res.response.data.message,
          });
        }
      } catch (error) {}
      // passwordForm.resetFields()
    });
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    message.success(t("account_closed"));
  };

  useEffect(() => {
    form.setFieldsValue({
      name: userDetail.name,
      email: userDetail.email,
      phone: userDetail.phone,
    });
  }, [userDetail]);

  return (
    <div className=" min-h-screen">
      <div className="mx-auto">
        <div>
          <div className="mb-8">
            <h2 className="text-[20px] font-semibold mb-4">
              {t("contact_info")}
            </h2>
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                phone: "",
                email: "",
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Form.Item
                  label={<div className="text-[12px]">{t("phone")}</div>}
                  name="phone"
                  rules={[{ required: true, message: t("please_enter_phone") }]}
                >
                  <Input className="!text-[12px]" placeholder={t("phone")} />
                </Form.Item>

                <Form.Item
                  label={<div className="text-[12px]">{t("email")}</div>}
                  name="email"
                >
                  <Input
                    className="!text-[12px]"
                    disabled
                    prefix={<MailOutlined className="text-gray-400" />}
                    placeholder={t("email")}
                  />
                </Form.Item>
              </div>

              <Button
                htmlType="submit"
                onClick={handleSaveContact}
                className="px-4 !bg-primaryColor !text-white !border-none !hover:text-white !text-[12px]"
              >
                {t("save")}
              </Button>
            </Form>
          </div>

          <div className="mb-4">
            <div className="space-y-6">
              <div className="bg-muted/50 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">
                  {t("oauth_provider")}
                </h2>
                <div className="space-y-4">
                  {userDetail?.auth_providers?.map(
                    (provider: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row items-center justify-between bg-background bg-[#ccc] p-4 rounded-lg"
                      >
                        <div className="flex items-center gap-3 mb-3 sm:mb-0">
                          {provider?.provider_id === "google" && (
                            <Chrome className="h-5 w-5" size={12} />
                          )}
                          {provider?.provider_id === "facebook" && (
                            <Facebook className="h-5 w-5" size={12} />
                          )}
                          {provider?.provider_id === "github" && (
                            <Github className="h-5 w-5" size={12} />
                          )}
                          {provider?.provider_id === "local" && (
                            <House className="h-5 w-5" size={12} />
                          )}
                          <span className="text-[12px] font-medium">
                            {provider?.provider_id?.charAt(0).toUpperCase() +
                              provider?.provider_id?.slice(1)}
                          </span>
                          <span className="text-emerald-500 ml-4 text-[12px]">
                            {t("enabled")}
                          </span>
                        </div>
                        <Button
                          onClick={() =>
                            notification.info({
                              message: "Thông báo",
                              description: "Tính năng chưa phát triển",
                            })
                          }
                          variant="link"
                          className="text-blue-500 hover:text-blue-600 w-full sm:w-auto text-[12px]"
                        >
                          {t("manage_permission")}
                        </Button>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-[20px] font-semibold mb-4">
              {t("change_password")}
            </h2>
            <Form form={passwordForm} layout="vertical">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Form.Item
                  label={
                    <div className="text-[12px]">{t("current_password")}</div>
                  }
                  name="current_password"
                  rules={[
                    {
                      required: true,
                      message: t("please_enter_current_password"),
                    },
                  ]}
                >
                  <Input.Password
                    className="text-[12px]"
                    placeholder={t("current_password")}
                    iconRender={(visible) =>
                      visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                    }
                  />
                </Form.Item>

                <Form.Item
                  label={<div className="text-[12px]">{t("new_password")}</div>}
                  name="new_password"
                  rules={[
                    { required: true, message: t("please_enter_new_password") },
                  ]}
                >
                  <Input.Password
                    className="text-[12px]"
                    placeholder={t("new_password")}
                    iconRender={(visible) =>
                      visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                    }
                  />
                </Form.Item>
              </div>

              <Button
                onClick={handleChangePassword}
                className="px-4 !bg-primaryColor !text-white !border-none !hover:text-white text-[12px]"
              >
                {t("save")}
              </Button>
            </Form>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold mb-4">
              {t("delete_company")}
            </h2>
            <p className="text-gray-500 mb-4 text-[12px]">
              {t("delete_company_description")}
            </p>
            <Button
              className="!text-[12px]"
              danger
              icon={<DeleteOutlined />}
              onClick={() => setShowDeleteModal(true)}
            >
              {t("delete_company_button")}
            </Button>
          </div>
        </div>
      </div>

      <Modal
        title={t("delete_company_confirm_title")}
        open={showDeleteModal}
        onOk={handleDeleteAccount}
        onCancel={() => setShowDeleteModal(false)}
        okText={t("delete_company_confirm_button")}
        cancelText={t("cancel")}
        okButtonProps={{ danger: true }}
      >
        <p>{t("delete_company_confirm")}</p>
      </Modal>
    </div>
  );
}
