import {
  Form,
  Input,
  Button,
  Avatar,
  Divider,
  Switch,
  notification,
} from "antd";
import avtDefault from "../../../assets/avatars/avatar-default.jpg";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
// import "./styles.css";
import { useNavigate } from "react-router-dom";
import * as userServices from "../../../services/modules/userServices";
import { updateUser } from "../../../redux/slices/userSlices";
import ListCV from "./ListCv";
import ProfileCard from "./ProfileCard";
import { useEffect } from "react";
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
const ProfileCV = () => {
  const [form] = Form.useForm();
  const userDetail = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(()=>{
    if(!userDetail?.access_token){
        navigate('/')
        return ;
    }
  },[userDetail?.access_token])
  const handleUpdateUser = async (values: updateUserDto) => {
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
        message: "Thông báo",
        description: "Cập nhật thành công",
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
    <div className="px-primaryx2 bg-[#f0f0f0] flex h-auto py-2">
      <div className="w-2/3 bg-white h-fit p-6 shadow-md mr-[50px] rounded-2xl mt-10">
      <div className="space-y-8">
    {userDetail?.access_token && <>
      <ListCV />
      <ProfileCard userDetail={userDetail} />
      </>
    }
    </div>
      </div>

      <div className="w-1/3 bg-white h-auto rounded-2xl px-8 py-4  mt-10">
        <div className="flex justify-around items-center gap-5">
          <div>
            <Avatar src={userDetail?.avatar || avtDefault} size={100} />
          </div>
          <div>
            <p>Chào bạn trở lại</p>
            <b>{userDetail.full_name}</b>
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
            value={userDetail?.is_search_jobs_status}
          />
          <span className="ml-2 font-semibold text-grayPrimary">
            Đang Tắt tìm việc
          </span>
          <div className=" mt-2 text-[12px] text-grayPrimary">
            Bật tìm việc giúp hồ sơ của bạn nổi bật hơn và được chú ý nhiều hơn
            trong danh sách tìm kiếm của NTD.
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
            Bật gợi ý việc làm
          </span>
          <div className=" mt-2 text-[12px] text-grayPrimary">
            Khi có cơ hội việc làm phù hợp, NTD sẽ liên hệ và trao đổi với bạn
            qua:
          </div>
          <div className="mt-2">
            <div>
              <CheckCircleOutlined />
              <span className="ml-2 font-light text-grayPrimary text-[14px]">
                Nhắn tin qua Top Connect trên HireDev
              </span>
            </div>
            <div>
              <CheckCircleOutlined />
              <span className="ml-2 font-light text-grayPrimary text-[14px]">
                Email và Số điện thoại của bạn
              </span>
            </div>
          </div>
        </div>
        <Divider />
        <div>
          <div className=" mt-2 text-[12px] text-grayPrimary">
            <InfoCircleOutlined /> Bạn cần hoàn thiện trên 70% TopCV Profile để
            bắt đầu tiếp cận với nhà tuyển dụng
          </div>
          <div className="mt-2">
            <Button
              onClick={() => navigate(`/profile/${userDetail?._id}`)}
              className="!border-primaryColor !text-primaryColor !hover:text-primaryColor !hover:border-primaryColor"
            >
              Cập nhật Profile
            </Button>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default ProfileCV;
