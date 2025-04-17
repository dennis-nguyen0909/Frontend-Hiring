import { UploadOutlined } from "@ant-design/icons";
import { Avatar, Button, Form, Input, message, Select, Upload } from "antd";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { USER_API } from "../../../../services/modules/userServices";
import { updateUser } from "../../../../redux/slices/userSlices";
import { MediaApi } from "../../../../services/modules/mediaServices";
import LoadingComponent from "../../../../components/Loading/LoadingComponent";
import "./style.css";
import { useTranslation } from "react-i18next";
import moment from "moment";
import avatarDefault from "../../../../assets/avatars/avatar-default.jpg";

const Personal = () => {
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [avatar, setAvatar] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const userDetail = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    setCity(userDetail?.city_id?._id || "");
    setDistrict(userDetail?.district_id?._id || "");
    setWard(userDetail?.ward_id?._id || "");
  }, [userDetail]);

  const handleSaveChanges = async (values: any) => {
    setLoading(true);
    const params = {
      ...values,
      id: userDetail?._id,
    };
    if (values.city) {
      params["city_id"] = city;
    }
    if (values.city) {
      params["district_id"] = district;
    }
    if (values.city) {
      params["ward_id"] = ward;
    }
    const res = await USER_API.updateUser(params, userDetail?.access_token);
    if (res.data) {
      dispatch(
        updateUser({
          ...res.data,
          access_token: userDetail?.access_token,
          refresh_token: userDetail?.refresh_token,
        })
      );
      message.success(t("update_success"));
    }
    setLoading(false);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      const res = await MediaApi.postMedia(
        file,
        userDetail?._id,
        userDetail?.access_token
      );
      if (res.data) {
        setAvatar(res.data.url);
        handleSaveChanges({ avatar: res.data.url });
      }
      setLoading(false);
    }
  };

  return (
    <LoadingComponent isLoading={loading}>
      <h2 className="text-[20px] font-semibold mb-4">
        {t("basic_information")}
      </h2>
      <Form
        layout="vertical"
        onFinish={handleSaveChanges}
        initialValues={{
          full_name: userDetail?.full_name,
          introduce: userDetail?.introduce,
          port_folio: userDetail?.port_folio,
          gender: userDetail?.gender,
          city: userDetail?.city_id?.name,
          district: userDetail?.district_id?.name,
          ward: userDetail?.ward_id?.name,
          address: userDetail?.address,
          birthday: userDetail?.birthday
            ? moment(userDetail?.birthday).format("YYYY-MM-DD")
            : "",
        }}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            {!userDetail?.avatar ? (
              <div className="relative inline-block group">
                <div className="relative w-[150px] h-[150px] rounded-full overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-all duration-300">
                  <Avatar
                    size={150}
                    shape="circle"
                    src={avatarDefault}
                    className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-50"
                  />
                  <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <UploadOutlined className="text-white text-2xl mb-2" />
                    <span className="text-white text-sm">{t("update")}</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <div className="relative w-[150px] h-[150px] rounded-full overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-all duration-300">
                  <Avatar
                    size={150}
                    shape="circle"
                    src={userDetail?.avatar}
                    className="w-full h-full object-cover"
                  />
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    showUploadList={false}
                    className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                    customRequest={async ({ file, onSuccess, onError }) => {
                      try {
                        setLoading(true);
                        const isImage = file.type.startsWith("image/");
                        if (!isImage) {
                          message.error(t("only_support_upload_image"));
                          return;
                        }

                        const isSmallEnough = file.size / 1024 / 1024 < 5;
                        if (!isSmallEnough) {
                          message.error(t("image_size_must_be_less_than_5mb"));
                          return;
                        }

                        const res = await MediaApi.postMedia(
                          file,
                          userDetail?._id,
                          userDetail?.access_token
                        );

                        if (res) {
                          setAvatar(res.data.url);
                          await handleSaveChanges({ avatar: res.data.url });
                          onSuccess && onSuccess(res);
                        }
                      } catch (error) {
                        onError && onError(error);
                        message.error(t("upload_failed"));
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50">
                      <UploadOutlined className="text-white text-2xl mb-2" />
                      <span className="text-white text-sm">{t("update")}</span>
                    </div>
                  </Upload>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[12px] text-gray-500">
                    {t("current_avatar")}
                  </span>
                  <span className="text-[12px] text-gray-400">
                    {t("one_image_larger_than_400px_is_best")}
                  </span>
                </div>
              </div>
            )}
          </div>

          <Form.Item
            className="md:w-[400px]"
            label={<span className="text-[12px]">{t("full_name")}</span>}
            name="full_name"
            rules={[
              { required: true, message: t("please_enter_your_full_name") },
            ]}
          >
            <Input placeholder="Enter your full name" className="text-[12px]" />
          </Form.Item>

          <Form.Item
            className="md:w-[400px]"
            label={<span className="text-[12px]">{t("gender")}</span>}
            name="gender"
            rules={[{ required: true, message: t("please_select_gender") }]}
          >
            <Select placeholder={t("select_gender")} className="text-[12px]">
              <Select.Option value={0}>{t("male")}</Select.Option>
              <Select.Option value={1}>{t("female")}</Select.Option>
              <Select.Option value={2}>{t("not_specified")}</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            className="md:w-[400px]"
            label={<span className="text-[12px]">{t("birthday")}</span>}
            name="birthday"
            rules={[
              { required: true, message: t("please_enter_your_birthday") },
            ]}
          >
            <Input type="date" className="text-[12px]" />
          </Form.Item>

          <Form.Item
            label={<span className="text-[12px]">{t("introduce")}</span>}
            name="introduce"
            rules={[
              { required: true, message: t("please_input_your_introduction") },
            ]}
          >
            <Input.TextArea
              placeholder="Enter your introduction"
              autoSize={{ minRows: 3, maxRows: 6 }}
              showCount
              maxLength={200}
              className="text-[12px]"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-[12px]">{t("port_folio")}</span>}
            name="port_folio"
            rules={[{ type: "url", message: t("please_enter_a_valid_url") }]}
          >
            <Input
              placeholder="Enter your portfolio URL"
              className="text-[12px]"
            />
          </Form.Item>

          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item
              label={<span className="text-[12px]">{t("city")}</span>}
              name="city"
            >
              <Select
                className="text-[12px]"
                value={city}
                onChange={handleCityChange}
                loading={citiesLoading}
                placeholder="Select City"
              >
                {cities.map((item) => (
                  <Select.Option key={item._id} value={item._id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={<span className="text-[12px]">{t("district")}</span>}
              name="district"
            >
              <Select
                className="text-[12px]"
                value={district}
                onChange={handleDistrictChange}
                loading={districtLoading}
                placeholder="Select District"
              >
                {districts.map((item) => (
                  <Select.Option key={item._id} value={item._id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={<span className="text-[12px]">Ward</span>}
              name="ward"
            >
              <Select
                className="text-[12px]"
                value={ward}
                onChange={handleWardChange}
                loading={wardsLoading}
                placeholder="Select Ward"
              >
                {wards.map((item) => (
                  <Select.Option key={item._id} value={item._id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            className="md:w-[400px]"
            label={<span className="text-[12px]">{t("address")}</span>}
            name="address"
            rules={[
              { required: true, message: t("please_enter_your_address") },
            ]}
          >
            <Input
              placeholder={t("enter_your_address")}
              className="text-[12px]"
            />
          </Form.Item> */}

          <div className="flex justify-end">
            <Button
              size="small"
              type="primary"
              htmlType="submit"
              className="py-2 px-8 !text-[12px]"
              style={{ backgroundColor: "#d64453", borderColor: "#d64453" }}
            >
              {t("save_changes")}
            </Button>
          </div>
        </div>
      </Form>
    </LoadingComponent>
  );
};

export default Personal;
