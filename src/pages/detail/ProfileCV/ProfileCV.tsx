import { Form, Button, Avatar, Divider, Switch, notification } from "antd";
import avtDefault from "../../../assets/avatars/avatar-default.jpg";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import * as userServices from "../../../services/modules/userServices";
import { updateUser } from "../../../redux/slices/userSlices";
import ListCV from "./ListCv";
import ProfileCard from "./ProfileCard";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const ProfileCV = () => {
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

  const handleUpdateUser = async (values) => {
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

  const onFinish = async (values) => {
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

  const updateUserApi = async (params) => {
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

  const onChangeSwitch = async (checked, type) => {
    const param = {
      id: userDetail?._id,
      [type]: checked,
    };
    await updateUserApi(param);
  };

  return (
    <div className="px-2 sm:px-4 lg:px-8 bg-[#f0f0f0] flex flex-wrap lg:flex-nowrap h-auto py-2">
      {/* Mobile-first: Hiển thị phần này lên đầu ở chế độ mobile */}
      <div className="w-full lg:w-1/3 bg-white h-auto rounded-2xl px-6 py-4 mt-10 lg:mt-0 order-1 lg:order-2">
        <div className="flex flex-col sm:flex-row justify-around items-center gap-5">
          <div>
            <Avatar src={userDetail?.avatar || avtDefault} size={100} />
          </div>
          <div>
            <div className="flex flex-wrap gap-0">
              <p className="text-[12px]">Chào bạn trở lại,</p>
              <b className="text-[12px]">{userDetail.full_name}</b>
            </div>
            <div className="bg-[#7b8381] px-1 py-1 rounded-sm text-white text-[12px] w-fit">
              <p>{t("account_has_been_verified")}</p>
            </div>
          </div>
        </div>
        <Divider />
        <div>
          <Switch
            className="custom-switch"
            onChange={(checked) => onChangeSwitch(checked, "isSearchJobStatus")}
            size="default"
            checked={userDetail?.is_search_jobs_status}
          />
          <span className="ml-2 font-semibold text-[12px] text-grayPrimary">
            {t("is_search_jobs_status")}
          </span>
          <div className="mt-2 text-[10px] text-grayPrimary">
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
            checked={userDetail?.is_suggestion_job}
          />
          <span className="ml-2 font-semibold text-[12px] text-grayPrimary">
            {t("enable_job_suggestion")}
          </span>
          <div className="mt-2 text-[10px] text-grayPrimary">
            {t(
              "when_there_is_a_suitable_job_opportunity_employers_will_contact_and_discuss_with_you_via"
            )}
          </div>
          <div className="mt-2">
            <div>
              <CheckCircleOutlined />
              <span className="ml-2 font-light text-grayPrimary text-[10px]">
                {t("send_messages_through_top_connect_on_hiredev")}
              </span>
            </div>
            <div>
              <CheckCircleOutlined />
              <span className="ml-2 font-light text-grayPrimary text-[10px]">
                {t("your_email_and_phone_number")}
              </span>
            </div>
          </div>
        </div>
        <Divider />
        <div>
          <div className="mt-2 text-[10px] text-grayPrimary">
            <InfoCircleOutlined />{" "}
            {t(
              "you_need_to_complete_over_70_topcv_profile_to_start_contacting_with_employers"
            )}
          </div>
          <div className="mt-2">
            <Button
              onClick={() => navigate(`/profile/${userDetail?._id}`)}
              className="!border-primaryColor !text-primaryColor !hover:text-primaryColor !hover:border-primaryColor !text-[10px]"
            >
              {t("update_profile")}
            </Button>
          </div>
        </div>
      </div>

      {/* Phần này sẽ xuất hiện phía sau ở chế độ mobile */}
      <div className="w-full lg:w-2/3 bg-white h-fit p-6 shadow-md mr-0 lg:mr-[50px] rounded-2xl mt-10 lg:mt-0 order-2 lg:order-1">
        <div className="space-y-8">
          {userDetail?.access_token && (
            <>
              <ListCV />
              <ProfileCard userDetail={userDetail} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCV;
