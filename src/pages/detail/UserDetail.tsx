import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Avatar,
  Divider,
  Switch,
  notification,
} from "antd";
import avtDefault from "../../assets/avatars/avatar-default.jpg";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import * as userServices from "../../services/modules/userServices";
import { updateUser } from "../../redux/slices/userSlices";
import { useTranslation } from "react-i18next";
interface updateUserDto {
  full_name: string;
  address: string;
  phone: string;
  _id: string;
}
type InputValuesProps = {
  fullName: string;
  address: string;
  phoneNumber: string;
};
const UserDetail = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const userDetail = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userDetail?.access_token) {
      navigate("/");
      return;
    }
  }, [userDetail?.access_token]);

  const handleUpdateUser = async (values: updateUserDto) => {
    try {
      const res = await userServices.updateUser(values);
      return res.data;
    } catch (error) {
      notification.error({
        message: t("notification"),
        description: error.message,
      });
    }
  };

  const onFinish = async (values: InputValuesProps) => {
    const { phoneNumber, fullName, address } = values;
    const params = {
      phone: phoneNumber,
      full_name: fullName,
      address: address,
      id: userDetail?._id,
    };
    const res = await handleUpdateUser(params);
    if (res) {
      dispatch(
        updateUser({
          ...res,
          access_token: userDetail.access_token,
          refresh_token: userDetail.refresh_token,
        })
      );
      notification.success({
        message: t("notification"),
        description: t("update_success"),
      });
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
      default:
        break;
    }
  };
  return (
    <div className="px-primaryx2 bg-[#f0f0f0] flex h-screen py-2">
      <div className="w-2/3 bg-white h-fit p-6 shadow-md mr-[50px] rounded-2xl mt-10">
        <h1 className="text-lg font-bold mb-4">
          {t("setting_personal_information")}
        </h1>
        <div className="mb-2 text-sm">
          <span className="text-red-500">*</span> {t("required_information")}
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            fullName: userDetail?.full_name || "",
            phoneNumber: userDetail?.phone || "",
            address: userDetail?.address || "",
          }}
        >
          <Form.Item
            label="Họ tên"
            name="fullName"
            rules={[
              {
                required: true,
                message: t("please_enter_your_full_name"),
              },
            ]}
          >
            <Input placeholder={t("please_enter_your_full_name")} />
          </Form.Item>

          <Form.Item
            label={t("phone_number")}
            name="phoneNumber"
            rules={[
              {
                required: true,
                message: t("please_enter_your_phone_number"),
              },
              {
                pattern: /^[0-9]+$/,
                message: t("invalid_phone_number"),
              },
            ]}
          >
            <Input placeholder={t("please_enter_your_phone_number")} />
          </Form.Item>

          <Form.Item label={t("address")} name="address">
            <Input placeholder={t("please_enter_your_address")} />
          </Form.Item>

          <Form.Item>
            <Button
              className="!bg-primaryColor w-[100px]"
              type="primary"
              size="large"
              htmlType="submit"
            >
              {t("save")}
            </Button>
          </Form.Item>
        </Form>
      </div>

      <div className="w-1/3 bg-white h-auto rounded-2xl px-8 py-4  mt-10">
        <div className="flex justify-around items-center gap-5">
          <div>
            <Avatar src={userDetail?.avatar || avtDefault} size={100} />
          </div>
          <div>
            <p>{t("welcome_back")}</p>
            <b>{userDetail.full_name}</b>
            <div className="bg-[#7b8381] px-1 py-1 rounded-sm text-white text-[12px] w-fit">
              <p>{t("account_has_been_verified")}</p>
            </div>
          </div>
        </div>
        <Divider />
        <div>
          <Switch
            className="custom-switch"
            onChange={(checked) => onChangeSwitch(checked, "is_suggestion_job")}
            size="default"
            value={userDetail?.is_search_jobs_status}
          />
          <span className="ml-2 font-semibold text-grayPrimary">
            {t("is_search_jobs_status")}
          </span>
          <div className=" mt-2 text-[12px] text-grayPrimary">
            {t(
              "enable_job_search_to_highlight_your_profile_and_be_noticed_more_in_the_search_list_of_employers"
            )}
          </div>
        </div>
        <div className="mt-8">
          <Switch
            className="custom-switch"
            onChange={(checked) => onChangeSwitch(checked, "is_suggestion_job")}
            size="default"
            value={userDetail?.is_suggestion_job}
          />
          <span className="ml-2 font-semibold text-grayPrimary">
            {t("enable_job_suggestion")}
          </span>
          <div className=" mt-2 text-[12px] text-grayPrimary">
            {t(
              "when_there_is_a_suitable_job_opportunity_employers_will_contact_and_discuss_with_you_via"
            )}
          </div>
          <div className="mt-2">
            <div>
              <CheckCircleOutlined />
              <span className="ml-2 font-light text-grayPrimary text-[14px]">
                {t("send_messages_through_top_connect_on_hiredev")}
              </span>
            </div>
            <div>
              <CheckCircleOutlined />
              <span className="ml-2 font-light text-grayPrimary text-[14px]">
                {t("your_email_and_phone_number")}
              </span>
            </div>
          </div>
        </div>
        <Divider />
        <div>
          <div className=" mt-2 text-[12px] text-grayPrimary">
            <InfoCircleOutlined />{" "}
            {t(
              "you_need_to_complete_over_70_topcv_profile_to_start_contacting_with_employers"
            )}
          </div>
          <div className="mt-2">
            <Button
              onClick={() => navigate(`/profile/${userDetail?._id}`)}
              className="!border-primaryColor !text-primaryColor !hover:text-primaryColor !hover:border-primaryColor"
            >
              {t("update_profile")}
            </Button>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default UserDetail;
