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
  const handleSavePassword = async () => {
    const values = form.getFieldsValue();
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
      default:
        break;
    }
  };
  return (
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
          <h2 className="text-xl font-semibold mb-4">Thông tin liên hệ</h2>
          <div className="space-y-4">
            {/* <Form.Item
                    label="Map Location"
                    name="location"
                    rules={[{ required: true, message: 'Please input your location!' }]}
                >
                    <Input prefix={<EnvironmentOutlined />} placeholder="Enter your location" />
                </Form.Item> */}
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input
                disabled
                prefix={<MailOutlined />}
                placeholder="Địa chỉ email"
              />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              // rules={[{ required: true, message: 'Please input your phone number!' }]}
            >
              <Input
                style={{ width: "80%" }}
                placeholder="Số điện thoại"
                prefix={<PhoneOutlined />}
              />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: "Please select a city" }]}
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
                label="District"
                name="district"
                rules={[
                  { required: true, message: "Please select a district" },
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
                label="Ward"
                name="ward"
                rules={[{ required: true, message: "Please select a ward" }]}
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
              <Form.Item label="Address" name="address">
                <Input placeholder="Enter full address" />
              </Form.Item>
            </div>
          </div>
        </div>
        <Form.Item>
          <Button
            htmlType="submit"
            className="px-4 !bg-[#201527] !text-primaryColor !border-none !hover:text-white"
          >
            Save
          </Button>
        </Form.Item>
        {/* Notifications */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Thông báo</h2>
          <div className="space-y-2">
            <Form.Item name="notifyShortlisted" valuePropName="checked" noStyle>
              <Checkbox>
                Thông báo cho tôi khi nhà tuyển dụng đưa tôi vào danh sách rút
                gọn
              </Checkbox>
            </Form.Item>
            <Form.Item name="notifyJobExpired" valuePropName="checked" noStyle>
              <Checkbox>
                Thông báo cho tôi khi công việc tôi ứng tuyển hết hạn
              </Checkbox>
            </Form.Item>
            <Form.Item name="notifyJobAlert" valuePropName="checked" noStyle>
              <Checkbox>
                Thông báo cho tôi khi tôi có tối đa 5 thông báo việc làm
              </Checkbox>
            </Form.Item>
            <Form.Item
              name="notifyProfileSaved"
              valuePropName="checked"
              noStyle
            >
              <Checkbox>
                Thông báo cho tôi khi nhà tuyển dụng lưu hồ sơ của tôi
              </Checkbox>
            </Form.Item>
            <Form.Item name="notifyRejected" valuePropName="checked" noStyle>
              <Checkbox>
                Thông báo cho tôi khi nhà tuyển dụng từ chối tôi
              </Checkbox>
            </Form.Item>
          </div>
        </div>

        {/* Job Alerts */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Job Alerts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* <Form.Item
                    label="Role"
                    name="role"
                    rules={[{ required: true, message: 'Please input your job role!' }]}
                >
                    <Input prefix={<FileTextOutlined />} placeholder="Your job roles" />
                </Form.Item> */}
            <Form.Item
              label="Location"
              name="location"
              // rules={[{ required: true, message: 'Please input the location!' }]}
            >
              <Input
                disabled
                prefix={<EnvironmentOutlined />}
                placeholder="City, state, country name"
              />
            </Form.Item>
          </div>
        </div>

        {/* Quyền riêng tư hồ sơ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-4">Quyền riêng tư hồ sơ</h2>
            <Form.Item name="profilePrivacy" valuePropName="checked" noStyle>
              <Space>
                <Switch defaultChecked />
                <span>Hồ sơ của bạn bây giờ đã được công khai</span>
              </Space>
            </Form.Item>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Resume Privacy</h2>
            <Form.Item name="resumePrivacy" valuePropName="checked" noStyle>
              <Space>
                <Switch className="custom-switch" />
                <span>Sơ yếu lý lịch của bạn hiện đang ở chế độ riêng tư</span>
              </Space>
            </Form.Item>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Gợi ý việc làm</h2>
            <Form.Item name="resumePrivacy" valuePropName="checked" noStyle>
              <Space>
                <Switch
                  className="custom-switch"
                  onChange={(checked) =>
                    onChangeSwitch(checked, "is_suggestion_job")
                  }
                  size="default"
                  value={userDetail?.is_suggestion_job}
                />
                {!userDetail?.is_suggestion_job ? 'Bật gợi ý việc làm hệ thống sẽ tìm các công việc phù hợp với bạn':'Đang bật gợi ý việc làm'}
              </Space>
            </Form.Item>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Đang tìm việc</h2>
            <Form.Item name="resumePrivacy" valuePropName="checked" noStyle>
              <Space>
                <Switch
                  className="custom-switch"
                  onChange={(checked) =>
                    onChangeSwitch(checked, "isSearchJobStatus")
                  }
                  size="default"
                  value={userDetail?.is_search_jobs_status}
                />
                {!userDetail?.is_search_jobs_status ? 'Bật đang tìm việc để nhà tuyển dụng có thể xem hồ sơ của bạn' :'Đang bật tìm việc'}
              </Space>
            </Form.Item>
          </div>
        </div>

        {/* Thay đổi mật khẩu */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Thay đổi mật khẩu</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item
              label="Mật khẩu hiện tại"
              name="current_password"
              // rules={[{ required: true, message: 'Please input your current password!' }]}
            >
              <Input.Password placeholder="Mật khẩu hiện tại" />
            </Form.Item>
            <Form.Item
              label="Mật khẩu mới"
              name="new_password"
              // rules={[{ required: true, message: 'Please input your new password!' }]}
            >
              <Input.Password placeholder="Mật khẩu mới" />
            </Form.Item>
            <Form.Item
              label="Xác nhận mật khẩu"
              name="confirm_password"
              // rules={[{ required: true, message: 'Please confirm your new password!' }]}
            >
              <Input.Password placeholder="Xác nhận mật khẩu" />
            </Form.Item>
          </div>
          <Button onClick={handleSavePassword}>Lưu mật khẩu</Button>
        </div>

        {/* Xóa Account */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Xóa tài khoản của bạn</h2>
          <p className="text-gray-600 mb-4">
            Nếu bạn xóa tài khoản HireDev của mình, bạn sẽ không thể nhận được
            thông tin về các công việc phù hợp, theo dõi nhà tuyển dụng, thông
            báo việc làm, công việc lọt vào danh sách rút gọn và các hoạt động
            khác. Tài khoản của bạn sẽ bị vô hiệu hóa khỏi tất cả các dịch vụ
            của HireDev.com
          </p>
          <Button danger htmlType="button">
            Close Account
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default ContactForm;
