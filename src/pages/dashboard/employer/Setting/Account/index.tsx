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

interface OAuthProvider {
  name: string;
  icon: React.ReactNode;
  enabled: boolean;
}
export default function AccountSettingEmployer() {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dispatch = useDispatch();
  const userDetail = useSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

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
            message: "Thông báo",
            description: "Cập nhật thống tin",
          });
          dispatch(
            updateUser({ ...res.data, access_token: userDetail.access_token })
          );
        }
      } catch (error) {
        notification.error({
          message: "Thông báo",
          description: error.message,
        });
      }
    });
  };

  const handleChangePassword = () => {
    passwordForm.validateFields().then(async (values) => {
      message.success("Password changed successfully");
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
            message: "Thông báo",
            description: "Cập nhật thống tin",
          });
          dispatch(
            updateUser({ ...res.data, access_token: userDetail.access_token })
          );
        } else {
          notification.error({
            message: "Thông báo",
            description: res.response.data.message,
          });
        }
      } catch (error) {}
      // passwordForm.resetFields()
    });
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    message.success("Tài khoản đã được đóng");
  };

  useEffect(() => {
    form.setFieldsValue({
      name: userDetail.name,
      email: userDetail.email,
      phone: userDetail.phone,
    });
  }, [userDetail]);

  const items = [
    {
      key: "1",
      label: (
        <span className="flex items-center gap-2">
          <UserOutlined />
          Thông tin công ty
        </span>
      ),
    },
    {
      key: "2",
      label: (
        <span className="flex items-center gap-2">
          <GlobalOutlined />
          Thông tin thành lập
        </span>
      ),
    },
    {
      key: "3",
      label: (
        <span className="flex items-center gap-2">
          <WifiOutlined />
          Hồ sơ truyền thông xã hội
        </span>
      ),
    },
    {
      key: "4",
      label: (
        <span className="flex items-center gap-2 text-blue-500">
          <SettingOutlined />
          Cài đặt tài khoản
        </span>
      ),
    },
  ];

  return (
    <div className=" min-h-screen">
      <div className="mx-auto">
        <div>
          <div className="mb-8">
            <h2 className="text-[20px] font-semibold mb-4">
              Thông tin liên hệ
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
                  label={<div className="text-[12px]">Số điện thoại</div>}
                  name="phone"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                  ]}
                >
                  <Input
                    className="!text-[12px]"
                    // addonBefore={
                    //   <Select defaultValue="+880" style={{ width: 100 }}>
                    //     <Select.Option value="+880">+880</Select.Option>
                    //     <Select.Option value="+1">+1</Select.Option>
                    //     <Select.Option value="+44">+44</Select.Option>
                    //   </Select>
                    // }
                    placeholder="Số điện thoại..."
                  />
                </Form.Item>

                <Form.Item
                  label={<div className="text-[12px]">Email</div>}
                  name="email"
                >
                  <Input
                    className="!text-[12px]"
                    disabled
                    prefix={<MailOutlined className="text-gray-400" />}
                    placeholder="Địa chỉ email"
                  />
                </Form.Item>
              </div>

              <Button
                htmlType="submit"
                onClick={handleSaveContact}
                className="px-4 !bg-primaryColor !text-white !border-none !hover:text-white !text-[12px]"
              >
                Lưu thay đổi
              </Button>
            </Form>
          </div>

          <div className="mb-4">
            <div className="space-y-6">
              <div className="bg-muted/50 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">OAuth Provider</h2>
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
                            Đã bật
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
                          Quản lý quyền
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
              Thay đổi mật khẩu
            </h2>
            <Form form={passwordForm} layout="vertical">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Form.Item
                  label={<div className="text-[12px]">Mật khẩu hiện tại</div>}
                  name="current_password"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập mật khẩu hiện tại!",
                    },
                  ]}
                >
                  <Input.Password
                    className="text-[12px]"
                    placeholder="Mật khẩu hiện tại"
                    iconRender={(visible) =>
                      visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                    }
                  />
                </Form.Item>

                <Form.Item
                  label={<div className="text-[12px]">Mật khẩu mới</div>}
                  name="new_password"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                  ]}
                >
                  <Input.Password
                    className="text-[12px]"
                    placeholder="Mật khẩu mới"
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
                Lưu thay đổi
              </Button>
            </Form>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold mb-4">
              Xóa công ty của bạn
            </h2>
            <p className="text-gray-500 mb-4 text-[12px]">
              Nếu bạn xóa công ty của mình, bạn sẽ không thể quay trở lại. Xin
              hãy chắc chắn. Tất cả thông tin sẽ bị xóa khỏi nền tảng. Bạn sẽ bị
              loại khỏi tất cả các dịch vụ của jobplat.com
            </p>
            <Button
              className="!text-[12px]"
              danger
              icon={<DeleteOutlined />}
              onClick={() => setShowDeleteModal(true)}
            >
              Đóng tài khoản
            </Button>
          </div>
        </div>
      </div>

      <Modal
        title="Xác nhận xóa tài khoản"
        open={showDeleteModal}
        onOk={handleDeleteAccount}
        onCancel={() => setShowDeleteModal(false)}
        okText="Có, Xóa tài khoản"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>
          Bạn có chắc chắn muốn xóa tài khoản công ty của mình không? Không thể
          hoàn tác hành động này.
        </p>
      </Modal>
    </div>
  );
}
