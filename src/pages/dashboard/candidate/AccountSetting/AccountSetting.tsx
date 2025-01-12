import {
  Form,
  Input,
  Select,
  Button,
  Checkbox,
  Space,
  Switch,
  notification,
  message,
} from "antd";
import {
  PhoneOutlined,
  EnvironmentOutlined,
  MailOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useCities } from "../../../../hooks/useCities";
import { useDistricts } from "../../../../hooks/useDistricts";
import { useWards } from "../../../../hooks/useWards";
import { USER_API } from "../../../../services/modules/userServices";
import { useDispatch } from "react-redux";
import { updateUser } from "../../../../redux/slices/userSlices";
import { useNavigate } from "react-router-dom";
import * as userServices from "../../../../services/modules/userServices";
const ContactForm = () => {
  const userDetail = useSelector((state) => state.user);
  const [city, setCity] = useState(userDetail?.city_id?._id || "");
  const dispatch = useDispatch();
  const [district, setDistrict] = useState(userDetail?.district_id?._id || "");
  const [ward, setWard] = useState(userDetail?.ward_id?._id || "");
  const { cities, loading: citiesLoading } = useCities();
  const { districts, loading: districtLoading } = useDistricts(city);
  const { wards, loading: wardsLoading } = useWards(district);
  const navigate = useNavigate();
  const handleCityChange = (value) => {
    setCity(value);
  };
  const handleDistrictChange = (value) => {
    setDistrict(value);
  };

  const handleWardChange = (value) => {
    setWard(value);
  };
  const handleSaveChanges = async (values: any) => {
    console.log("values", values);
    const params = {
      phone: values.phone,
      id: userDetail?._id,
      district_id: district,
      city_id: city,
      ward_id: ward,
      address: values.address,
    };
    try {
      const res = await USER_API.updateUser(params, userDetail?.access_token);
      if (res.data) {
        message.success("Cập nhật thành công");
        dispatch(updateUser({ ...res.data }));
      }
    } catch (error) {
      console.error("error", error);
      notification.error({
        message: "Thông báo",
        description: error.response.message.data,
      });
    }
    // Handle save logic here
  };
  const [form] = Form.useForm();
  const [formPassword] = Form.useForm();
  const handleSavePassword = async (values: any) => {
    // const values = form.getFieldsValue();
    console.log("values", values);
    try {
      const params = {
        user_id: userDetail?._id,
        ...values,
      };
      const res = await USER_API.resetPassword(params, userDetail?._id);
    } catch (error) {
      console.error(error);
    }
  };
  const updateUserApi = async (params: any) => {
    try {
      const res = await userServices.updateUser(params);
      if (res.data) {
        dispatch(
          updateUser({ ...res.data, access_token: userDetail.access_token })
        );
        notification.success({
          message: "Thông báo",
          description: "Cập nhật thành công",
        });
      }
    } catch (error) {
      notification.error({
        message: "Thông báo",
        description: error.message,
      });
    }
  };
  const onChangeSwitch = async (checked: boolean, type: string) => {
    switch (type) {
      case "is_suggestion_job":
        // eslint-disable-next-line no-case-declarations
        const param = {
          id: userDetail?._id,
          is_suggestion_job: checked,
        };
        await updateUserApi(param);

        break;
      case "isSearchJobStatus":
        // eslint-disable-next-line no-case-declarations
        const params = {
          id: userDetail?._id,
          is_search_jobs_status: checked,
        };
        await updateUserApi(params);
        break;
      case "is_profile_privacy":
        // eslint-disable-next-line no-case-declarations
        const paramsPrivacyProfile = {
          id: userDetail?._id,
          is_profile_privacy: checked,
        };
        await updateUserApi(paramsPrivacyProfile);
        break;
      case "is_resume_privacy":
        // eslint-disable-next-line no-case-declarations
        const paramsResume = {
          id: userDetail?._id,
          is_resume_privacy: checked,
        };
        await updateUserApi(paramsResume);
        break;
      case "notification_when_employer_save_profile":
        // eslint-disable-next-line no-case-declarations
        const params2 = {
          id: userDetail?._id,
          notification_when_employer_save_profile: checked,
        };
        await updateUserApi(params2);
        break;
      case "notification_when_employer_reject_cv":
        // eslint-disable-next-line no-case-declarations
        const params3 = {
          id: userDetail?._id,
          notification_when_employer_reject_cv: checked,
        };
        await updateUserApi(params3);
        break;
      default:
        break;
    }
  };
  return (
    <>
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSaveChanges}
        initialValues={{
          email: userDetail?.email,
          phone: userDetail?.phone,
          role: userDetail?.role?.role_name,
          city: userDetail?.city_id?.name,
          district: userDetail?.district_id?.name,
          ward: userDetail?.ward_id?.name,
          address: userDetail?.address,
          location:
            userDetail?.city_id?.name +
            " , " +
            userDetail?.district_id?.name +
            " , " +
            userDetail?.ward_id?.name,

          // location:
        }}
      >
        {/* Thông tin liên hệ */}
        <div className="space-y-8">
          <div>
            <h2 className="text-[16px] font-semibold mb-4">
              Thông tin liên hệ
            </h2>
            <div className="space-y-4">
              <Form.Item
                label={<div className="text-[12px]">Email</div>}
                name="email"
                rules={[{ required: true, message: "Vui lòng nhập email" }]}
              >
                <Input
                  disabled
                  prefix={<MailOutlined />}
                  placeholder="Địa chỉ email"
                  className="text-[12px]"
                />
              </Form.Item>
              <Form.Item
                label={<div className="text-[12px]">Số điện thoại</div>}
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                ]}
              >
                <Input
                  placeholder="Số điện thoại"
                  prefix={<PhoneOutlined />}
                  className="text-[12px] md:w-[49%]"
                />
              </Form.Item>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  label={<div className="text-[12px]">Thành phố / tỉnh</div>}
                  name="city"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập thành phố / tỉnh",
                    },
                  ]}
                >
                  <Select
                    placeholder="Select City"
                    value={city}
                    onChange={handleCityChange}
                    loading={citiesLoading}
                  >
                    {/* Render city options dynamically from the hook */}
                    {cities.map((cityItem) => (
                      <Select.Option key={cityItem._id} value={cityItem._id}>
                        {cityItem.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                {/* District Field */}
                <Form.Item
                  label={<div className="text-[12px]">Quận / huyện</div>}
                  name="district"
                  rules={[
                    { required: true, message: "Vui lòng nhập quận / huyện" },
                  ]}
                >
                  <Select
                    placeholder="Select District"
                    value={district}
                    onChange={handleDistrictChange}
                    loading={districtLoading}
                  >
                    {/* Render city options dynamically from the hook */}
                    {districts.map((district) => (
                      <Select.Option key={district._id} value={district._id}>
                        {district.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Ward Field */}
                <Form.Item
                  label={<div className="text-[12px]">Xã / phường</div>}
                  name="ward"
                  rules={[
                    { required: true, message: "Vui lòng nhập xã / phường" },
                  ]}
                >
                  <Select
                    placeholder="Select Ward"
                    value={ward}
                    onChange={handleWardChange}
                    loading={wardsLoading}
                  >
                    {wards.map((ward) => (
                      <Select.Option key={ward._id} value={ward._id}>
                        {ward.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                {/* Address Field */}
                <Form.Item
                  label={<div className="text-[12px]">Địa chỉ</div>}
                  name="address"
                  rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
                >
                  <Input
                    placeholder="Enter full address"
                    className="text-[12px]"
                  />
                </Form.Item>
              </div>
            </div>
          </div>
          <Form.Item>
            <Button
              htmlType="submit"
              className="px-4 !bg-primaryColor !text-white !border-none !hover:text-white !text-[12px]"
            >
              Lưu
            </Button>
          </Form.Item>
          {/* Notifications */}
          <div>
            <h2 className="text-[16px] font-semibold mb-4">Thông báo</h2>
            <div className="space-y-2">
              <Form.Item
                name="notifyShortlisted"
                valuePropName="checked"
                noStyle
              >
                <Checkbox className="!text-[12px]">
                  Thông báo cho tôi khi nhà tuyển dụng đưa tôi vào danh sách rút
                  gọn
                </Checkbox>
              </Form.Item>
              <Form.Item
                name="notifyJobExpired"
                valuePropName="checked"
                noStyle
              >
                <Checkbox className="!text-[12px]">
                  Thông báo cho tôi khi công việc tôi ứng tuyển hết hạn
                </Checkbox>
              </Form.Item>
              <Form.Item name="notifyJobAlert" valuePropName="checked" noStyle>
                <Checkbox className="!text-[12px]">
                  Thông báo cho tôi khi tôi có tối đa 5 thông báo việc làm
                </Checkbox>
              </Form.Item>
              <Form.Item
                name="notifyProfileSaved"
                valuePropName="checked"
                noStyle
              >
                <Checkbox
                  className="!text-[12px]"
                  defaultChecked={
                    userDetail?.notification_when_employer_save_profile
                  }
                  value={userDetail?.notification_when_employer_save_profile}
                  onChange={(e) =>
                    onChangeSwitch(
                      e.target.checked,
                      "notification_when_employer_save_profile"
                    )
                  }
                >
                  Thông báo cho tôi khi nhà tuyển dụng lưu hồ sơ của tôi
                </Checkbox>
              </Form.Item>
              <Form.Item name="notifyRejected" valuePropName="checked" noStyle>
                <Checkbox
                  className="!text-[12px]"
                  defaultChecked={
                    userDetail?.notification_when_employer_reject_cv
                  }
                  value={userDetail?.notification_when_employer_reject_cv}
                  onChange={(e) =>
                    onChangeSwitch(
                      e.target.checked,
                      "notification_when_employer_reject_cv"
                    )
                  }
                >
                  Thông báo cho tôi khi nhà tuyển dụng từ chối tôi
                </Checkbox>
              </Form.Item>
            </div>
          </div>
          
          {/* Quyền riêng tư hồ sơ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-[16px] font-semibold mb-4">
                Quyền riêng tư hồ sơ
              </h2>
              <Form.Item name="profilePrivacy" valuePropName="checked" noStyle>
                <Space>
                  <Switch
                    size="small"
                    value={userDetail?.is_profile_privacy}
                    onChange={(checked) =>
                      onChangeSwitch(checked, "is_profile_privacy")
                    }
                    className="custom-switch"
                  />
                  <span className="text-[12px]">
                    Hồ sơ của bạn bây giờ đã được công khai
                  </span>
                </Space>
              </Form.Item>
            </div>
            <div>
              <h2 className="text-[16px] font-semibold mb-4">Resume Privacy</h2>
              <Form.Item name="resumePrivacy" valuePropName="checked" noStyle>
                <Space>
                  <Switch
                    size="small"
                    value={userDetail?.is_resume_privacy}
                    onChange={(checked) =>
                      onChangeSwitch(checked, "is_resume_privacy")
                    }
                    className="custom-switch"
                  />
                  <span className="text-[12px]">
                    Sơ yếu lý lịch của bạn hiện đang ở chế độ riêng tư
                  </span>
                </Space>
              </Form.Item>
            </div>
            <div>
              <h2 className="text-[16px] font-semibold mb-4">Gợi ý việc làm</h2>
              <Form.Item name="resumePrivacy" valuePropName="checked" noStyle>
                <Space>
                  <Switch
                    className="custom-switch "
                    onChange={(checked) =>
                      onChangeSwitch(checked, "is_suggestion_job")
                    }
                    size="small"
                    value={userDetail?.is_suggestion_job}
                  />
                  <div className="!text-[12px]">
                    {!userDetail?.is_suggestion_job
                      ? "Bật gợi ý việc làm hệ thống sẽ tìm các công việc phù hợp với bạn"
                      : "Đang bật gợi ý việc làm"}
                  </div>
                </Space>
              </Form.Item>
            </div>
            <div>
              <h2 className="text-[16px] font-semibold mb-4">Đang tìm việc</h2>
              <Form.Item name="resumePrivacy" valuePropName="checked" noStyle>
                <Space>
                  <Switch
                    className="custom-switch"
                    onChange={(checked) =>
                      onChangeSwitch(checked, "isSearchJobStatus")
                    }
                    size="small"
                    value={userDetail?.is_search_jobs_status}
                  />
                  <div className="text-[12px]">
                    {" "}
                    {!userDetail?.is_search_jobs_status
                      ? "Bật đang tìm việc để nhà tuyển dụng có thể xem hồ sơ của bạn"
                      : "Đang bật tìm việc"}
                  </div>
                </Space>
              </Form.Item>
            </div>
          </div>
        </div>
      </Form>
      {/* Thay đổi mật khẩu */}
      <div className="mt-5">
        <h2 className="text-[16px] font-semibold mb-4">Thay đổi mật khẩu</h2>
        <Form
          form={formPassword}
          onFinish={handleSavePassword}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Form.Item
            label={<div className="text-[12px]">Mật khẩu hiện tại</div>}
            name="current_password"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu hiện tại",
              },
            ]}
          >
            <Input.Password placeholder="Mật khẩu hiện tại" className="text-[12px]" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="new_password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới" },
            ]}
          >
            <Input.Password placeholder="Mật khẩu mới"  className="text-[12px]" />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirm_password"
            dependencies={["new_password"]} // Thêm dependency để xác nhận mật khẩu
            rules={[
              {
                required: true,
                message: "Vui lòng xác nhận lại mật khẩu mới",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("new_password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "Hai mật khẩu không giống nhau!"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Xác nhận mật khẩu" className="text-[12px]" />
          </Form.Item>

          <Form.Item>
            <Button className="!text-[12px]" htmlType="submit">Lưu mật khẩu</Button>
          </Form.Item>
        </Form>
      </div>
      {/* Xóa Account */}
      <div>
        <h2 className="text-[16px] font-semibold mb-4">
          Xóa tài khoản của bạn
        </h2>
        <p className="text-gray-600 mb-4 text-[12px]">
          Nếu bạn xóa tài khoản HireDev của mình, bạn sẽ không thể nhận được
          thông tin về các công việc phù hợp, theo dõi nhà tuyển dụng, thông báo
          việc làm, công việc lọt vào danh sách rút gọn và các hoạt động khác.
          Tài khoản của bạn sẽ bị vô hiệu hóa khỏi tất cả các dịch vụ của
          HireDev.com
        </p>
        <Button className="!text-[12px]" danger htmlType="button">
          Close Account
        </Button>
      </div>
    </>
  );
};

export default ContactForm;
