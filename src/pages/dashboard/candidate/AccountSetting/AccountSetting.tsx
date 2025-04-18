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
import { PhoneOutlined, MailOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useCities } from "../../../../hooks/useCities";
import { useDistricts } from "../../../../hooks/useDistricts";
import { useWards } from "../../../../hooks/useWards";
import { USER_API } from "../../../../services/modules/userServices";
import { useDispatch } from "react-redux";
import { updateUser } from "../../../../redux/slices/userSlices";
import { useNavigate } from "react-router-dom";
import * as userServices from "../../../../services/modules/userServices";
import DateFormatSelect from "../../../../components/DateFormatSelect/DateFormatSelect";
import { t } from "i18next";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
const ContactForm = () => {
  const { t } = useTranslation();
  const userDetail = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [city, setCity] = useState(userDetail?.city_id?._id || "");
  const [district, setDistrict] = useState(userDetail?.district_id?._id || "");
  const [ward, setWard] = useState(userDetail?.ward_id?._id || "");
  const [nameCity, setNameCity] = useState<string>("");
  const [nameDistrict, setNameDistrict] = useState<string>("");
  const [nameWard, setNameWard] = useState<string>("");
  const { cities, loading: citiesLoading } = useCities();
  const { districts, loading: districtLoading } = useDistricts(city);
  const { wards, loading: wardsLoading } = useWards(district);
  const navigate = useNavigate();
  const [selectedFormat, setSelectedFormat] = useState(
    userDetail?.dateFormat || "DD/MM/YYYY"
  );

  const handleChange = (value: string) => {
    setSelectedFormat(value);
  };

  const handleCityChange = (value: string) => {
    const selectedCity = cities.find((city) => city._id === value);
    setCity(value);
    setNameCity(selectedCity?.name);
  };
  const handleDistrictChange = (value: string) => {
    const selectedDistrict = districts.find((dist) => dist._id === value);
    setDistrict(value);
    setNameDistrict(selectedDistrict?.name);
  };

  const handleWardChange = (value: string) => {
    const selectedWard = wards.find((ward) => ward._id === value);
    setWard(value);
    setNameWard(selectedWard?.name);
  };
  const handleSaveChanges = async (values: any) => {
    const params = {
      phone: values.phone,
      id: userDetail?._id,
      district_id: district,
      city_id: city,
      ward_id: ward,
      address: values.address,
      dateFormat: selectedFormat,
      name_city: nameCity,
      name_district: nameDistrict,
      name_ward: nameWard,
    };
    try {
      const res = await USER_API.updateUser(params, userDetail?.access_token);
      if (res.data) {
        message.success(t("update_success"));
        dispatch(updateUser({ ...res.data }));
      }
    } catch (error) {
      console.error("error", error);
      notification.error({
        message: t("notification"),
        description: error.response.message.data,
      });
    }
    // Handle save logic here
  };
  const [form] = Form.useForm();
  const [formPassword] = Form.useForm();
  const handleSavePassword = async (values: any) => {
    try {
      const params = {
        user_id: userDetail?._id,
        ...values,
      };
      const res = await USER_API.resetPassword(params, userDetail?._id);
      if (res?.statusCode === 201) {
        toast.success(t("update_success"));
        formPassword.resetFields();
      }
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
          message: t("notification"),
          description: t("update_success"),
        });
      }
    } catch (error) {
      notification.error({
        message: t("notification"),
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
        }}
      >
        <div className="space-y-8">
          <div>
            <h2 className="text-[20px] font-semibold mb-4">
              {t("contact_information")}
            </h2>
            <div className="space-y-4">
              <Form.Item
                label={<div className="text-[12px]">{t("email")}</div>}
                name="email"
                rules={[{ required: true, message: t("please_enter_email") }]}
              >
                <Input
                  disabled
                  prefix={<MailOutlined />}
                  placeholder={t("email")}
                  className="text-[12px]"
                />
              </Form.Item>
              <Form.Item
                label={<div className="text-[12px]">{t("phone")}</div>}
                name="phone"
                rules={[{ required: true, message: t("please_enter_phone") }]}
              >
                <Input
                  placeholder={t("phone")}
                  prefix={<PhoneOutlined />}
                  className="text-[12px] md:w-[49%]"
                />
              </Form.Item>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  label={<div className="text-[12px]">{t("city")}</div>}
                  name="city"
                  rules={[
                    {
                      required: true,
                      message: t("please_enter_city"),
                    },
                  ]}
                >
                  <Select
                    placeholder={t("choose_city")}
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
                  label={<div className="text-[12px]">{t("district")}</div>}
                  name="district"
                  rules={[
                    { required: true, message: t("please_enter_district") },
                  ]}
                >
                  <Select
                    placeholder={t("choose_district")}
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
                  label={<div className="text-[12px]">{t("ward")}</div>}
                  name="ward"
                  rules={[{ required: true, message: t("please_enter_ward") }]}
                >
                  <Select
                    placeholder={t("choose_ward")}
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
                  label={<div className="text-[12px]">{t("address")}</div>}
                  name="address"
                  rules={[
                    { required: true, message: t("please_enter_address") },
                  ]}
                >
                  <Input
                    placeholder={t("enter_your_address")}
                    className="text-[12px]"
                  />
                </Form.Item>
              </div>
            </div>
            <DateFormatSelect
              selectedFormat={selectedFormat}
              setSelectedFormat={setSelectedFormat}
              handleChange={handleChange}
            />
          </div>
          <Form.Item>
            <Button
              htmlType="submit"
              className="px-4 !bg-primaryColor !text-white !border-none !hover:text-white !text-[12px]"
            >
              {t("save_changes")}
            </Button>
          </Form.Item>
          {/* Notifications */}
          <div>
            <h2 className="text-[20px] font-semibold mb-4">
              {t("notifications")}
            </h2>
            <div className="space-y-2">
              <Form.Item
                name="notifyShortlisted"
                valuePropName="checked"
                noStyle
              >
                <Checkbox className="!text-[12px]">
                  {t("notify_shortlisted")}
                </Checkbox>
              </Form.Item>
              <Form.Item
                name="notifyJobExpired"
                valuePropName="checked"
                noStyle
              >
                <Checkbox className="!text-[12px]">
                  {t("notify_job_expired")}
                </Checkbox>
              </Form.Item>
              <Form.Item name="notifyJobAlert" valuePropName="checked" noStyle>
                <Checkbox className="!text-[12px]">
                  {t("notify_job_alert")}
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
                  {t("notify_profile_saved")}
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
                  {t("notify_rejected")}
                </Checkbox>
              </Form.Item>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-[20px] font-semibold mb-4">
                {t("profile_privacy")}
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
                    {t("profile_privacy_description")}
                  </span>
                </Space>
              </Form.Item>
            </div>
            <div>
              <h2 className="text-[20px] font-semibold mb-4">
                {t("resume_privacy")}
              </h2>
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
                    {t("resume_privacy_description")}
                  </span>
                </Space>
              </Form.Item>
            </div>
            <div>
              <h2 className="text-[20px] font-semibold mb-4">
                {t("job_suggestion")}
              </h2>
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
                      ? t("turn_off_job_suggestion")
                      : t("turn_on_job_suggestion")}
                  </div>
                </Space>
              </Form.Item>
            </div>
            <div>
              <h2 className="text-[20px] font-semibold mb-4">
                {t("job_search_status")}
              </h2>
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
                      ? t("turn_off_job_search_status")
                      : t("turn_on_job_search_status")}
                  </div>
                </Space>
              </Form.Item>
            </div>
          </div>
        </div>
      </Form>
      {/* Thay đổi mật khẩu */}
      <div className="mt-5">
        <h2 className="text-[20px] font-semibold mb-4">
          {t("change_password")}
        </h2>
        <Form
          form={formPassword}
          onFinish={handleSavePassword}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Form.Item
            label={<div className="text-[12px]">{t("current_password")}</div>}
            name="current_password"
            rules={[
              {
                required: true,
                message: t("please_enter_current_password"),
              },
            ]}
          >
            <Input.Password
              placeholder={t("current_password")}
              className="text-[12px]"
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
              placeholder={t("new_password")}
              className="text-[12px]"
            />
          </Form.Item>

          <Form.Item
            label={<div className="text-[12px]">{t("confirm_password")}</div>}
            name="confirm_password"
            dependencies={["new_password"]} // Thêm dependency để xác nhận mật khẩu
            rules={[
              {
                required: true,
                message: t("please_confirm_password"),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("new_password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t("password_not_match")));
                },
              }),
            ]}
          >
            <Input.Password
              placeholder={t("confirm_password")}
              className="text-[12px]"
            />
          </Form.Item>

          <Form.Item>
            <Button className="!text-[12px]" htmlType="submit">
              {t("save_password")}
            </Button>
          </Form.Item>
        </Form>
      </div>
      {/* Xóa Account */}
      <div>
        <h2 className="text-[20px] font-semibold mb-4">
          {t("delete_account")}
        </h2>
        <p className="text-gray-600 mb-4 text-[12px]">
          {t("delete_account_des")}
        </p>
        <Button className="!text-[12px]" danger htmlType="button">
          {t("close_account")}
        </Button>
      </div>
    </>
  );
};

export default ContactForm;
