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

const ProfileCV = () => {
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
        message: "Thông báo",
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
        message: "Thông báo",
        description: "Cập nhật thành công",
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
              <p>Tài khoản đã xác thực</p>
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
            Đang Tắt tìm việc
          </span>
          <div className="mt-2 text-[10px] text-grayPrimary">
            Bật tìm việc giúp hồ sơ của bạn nổi bật hơn và được chú ý nhiều hơn
            trong danh sách tìm kiếm của NTD.
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
            Bật gợi ý việc làm
          </span>
          <div className="mt-2 text-[10px] text-grayPrimary">
            Khi có cơ hội việc làm phù hợp, NTD sẽ liên hệ và trao đổi với bạn
            qua:
          </div>
          <div className="mt-2">
            <div>
              <CheckCircleOutlined />
              <span className="ml-2 font-light text-grayPrimary text-[10px]">
                Nhắn tin qua Top Connect trên HireDev
              </span>
            </div>
            <div>
              <CheckCircleOutlined />
              <span className="ml-2 font-light text-grayPrimary text-[10px]">
                Email và Số điện thoại của bạn
              </span>
            </div>
          </div>
        </div>
        <Divider />
        <div>
          <div className="mt-2 text-[10px] text-grayPrimary">
            <InfoCircleOutlined /> Bạn cần hoàn thiện trên 70% TopCV Profile để
            bắt đầu tiếp cận với nhà tuyển dụng
          </div>
          <div className="mt-2">
            <Button
              onClick={() => navigate(`/profile/${userDetail?._id}`)}
              className="!border-primaryColor !text-primaryColor !hover:text-primaryColor !hover:border-primaryColor !text-[10px]"
            >
              Cập nhật Profile
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
