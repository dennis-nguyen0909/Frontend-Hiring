import { CheckCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  notification,
  Progress,
  Switch,
} from "antd";
import avtDefault from "../../../assets/avatars/avatar-default.jpg";
import { updateUser } from "../../../redux/slices/userSlices";
import { useDispatch, useSelector } from "react-redux";
import { Camera, Download, Pencil, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as userServices from "../../../services/modules/userServices";
import { useNavigate } from "react-router-dom";
import EducationComponent from "../Education/Education";
import ExperienceComponent from "../Experience/Experience";
import { MediaApi } from "../../../services/modules/mediaServices";
import SkillComponent from "../Skill/Skill";
import ExperienceNumberCandidate from "../../dashboard/candidate/ExperienceNumberCandidate/ExperienceNumberCandidate";
import CertificateComponent from "../Certificate/CertificateComponent";
import ProjectComponent from "../ProjectComponent/ProjectComponent";
import PrizeView from "../PrizeComponent/PrizeView";
import CourseView from "../CourseComponent/CourseComponent";
import useCalculateUserProfile from "../../../hooks/useCaculateProfile";
import { useViewerCandidateProfile } from "../../../hooks/useViewerCandidateProfile";
import { useViewerCandidateProfileMonth } from "../../../hooks/useViewerCandidateProfileMonth";
import { useViewerCandidateProfileYear } from "../../../hooks/useViewerCandidateProfileYear";
const Profile = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const fileInputAvtRef = useRef(null);
  const userDetail = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [visibleInAvatar, setVisibleInAvatar] = useState(false);
  const [coverImage, setCoverImage] = useState(userDetail?.background || null);

  useEffect(() => {
    if (!userDetail?.access_token) {
      navigate("/");
      return;
    }
  }, [userDetail?.access_token]);
  const uploadFileToMedia = async (file: File) => {
    try {
      const res = await MediaApi.postMedia(file, userDetail.access_token);
      return res;
    } catch (error) {
      notification.error({
        message: "Thông báo",
        description: error.message,
      });
    }
  };

  const handleOpenFile = () => {
    fileInputRef.current.click();
  };

  const handleOpenFileAvt = () => {
    fileInputAvtRef.current.click();
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

  const handleFileChangeBackground = async (e) => {
    // Chuyển sang async để chờ kết quả upload
    const file = e.target.files[0];
    if (file) {
      try {
        // Upload file lên server và lấy URL trả về
        const res = await uploadFileToMedia(file); // Thêm await vào đây để chờ kết quả từ API
        if (res?.data?.url) {
          // Cập nhật ảnh bìa trên giao diện người dùng
          setCoverImage(URL.createObjectURL(file)); // Sử dụng URL của file local

          // Cập nhật thông tin người dùng với ảnh bìa mới
          const updatedUserDetail = {
            id: userDetail?._id,
            background: res?.data?.url, // Cập nhật ảnh bìa mới từ server
          };

          await updateUserApi(updatedUserDetail);
        }
      } catch (error) {
        console.error("Error handling file change:", error);
      }
    }
  };
  const handleFileChangeAvatar = async (e) => {
    // Chuyển sang async để chờ kết quả upload
    const file = e.target.files[0];
    if (file) {
      try {
        const res = await uploadFileToMedia(file);
        if (res?.data?.url) {
          const updatedUserDetail = {
            id: userDetail?._id,
            avatar: res?.data?.url,
          };

          await updateUserApi(updatedUserDetail);
        }
      } catch (error) {
        console.error("Error handling file change:", error);
      }
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
  const handleNavigatePDF = () => {
    navigate("/upload-cv");
  };
  const {
    data: caculateProfile,
    isLoading,
    error,
    refetch,
  } = useCalculateUserProfile(userDetail?._id, userDetail?.access_token);
  const {meta:metaViewerWeek,refreshData:refreshWeek} =useViewerCandidateProfile(1,10);
  const {meta:metaViewerMonth,refreshData:refreshMonth}= useViewerCandidateProfileMonth(1,10);
  const {meta:metaViewerYear,refreshData:refreshYear}= useViewerCandidateProfileYear(1,10);
  useEffect(() => {
    refreshWeek();
    refetch()
    refreshMonth()
    refreshYear()
  }, []);
  return (
    <div className="px-primaryx2 bg-[#f0f0f0] flex h-auto mt-10 py-2 gap-5 ">
      <Col span={16} className="max-w-3xl mx-auto p-4 space-y-6 rounded-xl">
        <div
          className="relative "
          onMouseEnter={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
        >
          <div
            className={`h-[250px] rounded-t-lg ${
              coverImage
                ? "bg-cover bg-center"
                : "bg-gradient-to-r from-[#d3464f] to-[#e57373]"
            }`}
            style={coverImage ? { backgroundImage: `url(${coverImage})` } : {}}
          />
          {visible && (
            <Button
              onClick={handleOpenFile}
              size="small"
              icon={<Camera size={12} />}
              className="absolute top-4 left-4 text-[12px] bg-gray-200 bg-opacity-50 "
            >
              Cập nhật ảnh bìa
            </Button>
          )}
          <input
            className="hidden "
            type="file"
            ref={fileInputRef}
            onChange={handleFileChangeBackground}
          />
          <input
            className="hidden "
            type="file"
            ref={fileInputAvtRef}
            onChange={handleFileChangeAvatar}
          />
        </div>
        <div
          className="absolute top-[170px] left-[40px]  flex items-end space-x-4"
          onMouseEnter={() => setVisibleInAvatar(true)}
          onMouseLeave={() => setVisibleInAvatar(false)}
        >
          <Avatar
            src={userDetail?.avatar || avtDefault}
            className="w-32 h-32 border-4 border-white"
          />

          {visibleInAvatar && (
            <Button
              onClick={handleOpenFileAvt}
              size="small"
              icon={<Camera size={12} />}
              className="absolute bottom-0 right-0 bg-gray-200 bg-opacity-50 text-[12px]"
            >
              Upload
            </Button>
          )}
        </div>

        <div className="pt-16 space-y-4">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold">{userDetail?.full_name}</h1>
            <div className="flex gap-2">
              <Button
                onClick={handleNavigatePDF}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Tải lên PDF
              </Button>
              <Button className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Chia sẻ profile
              </Button>
            </div>
          </div>

          <Card className="p-6 space-y-4">
            <h2 className="font-semibold">Mức độ hoàn thành hồ sơ</h2>

            <div className="relative pt-6">
              <Progress
                className="h-2 rounded-full"
                percent={caculateProfile}
                strokeColor={{
                  "0%": "#d3464f",
                  "100%": "#52c41a",
                }}
              />
            </div>

            <div className="flex items-center gap-4 p-4 border rounded-lg mt-5">
              <div className="p-2 bg-red-100 rounded-full">
                <Pencil className="h-6 w-6 text-primaryColor" />
              </div>
              <div>
                <h3 className="font-medium">Cập nhật thông tin cá nhân</h3>
                <p className="text-sm text-gray-500">
                  Mức độ hoàn thành hồ sơ {caculateProfile}%
                </p>
              </div>
            </div>
          </Card>

          {/* Statistics */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4">
              Thống kê số lượt xem từ Nhà tuyển dụng
            </h2>
            <p className="text-sm text-red-500 mb-4">
              Phần này chỉ hiển thị với riêng bạn
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <p className="text-3xl font-bold">{metaViewerWeek.total || 0}</p>
                <p className="text-sm text-gray-500">Lượt xem trong tuần</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-3xl font-bold">{metaViewerMonth.total || 0}</p>
                <p className="text-sm text-gray-500">Lượt xem trong tháng</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-3xl font-bold">{metaViewerYear.total || 0}</p>
                <p className="text-sm text-gray-500">Lượt xem trong năm</p>
              </div>
            </div>
          </Card>

          {userDetail?.access_token && (
            <>
              <ExperienceNumberCandidate />
              {/* Education Section */}
              <EducationComponent />
              {/* Experience Section */}
              <ExperienceComponent />
              {/* Skill Section */}
              <SkillComponent />
              {/* Certificate */}
              <CertificateComponent />
              {/* Prize */}
              <PrizeView />
              {/* Course */}
              <CourseView />
              {/* Project */}
              <ProjectComponent />
            </>
          )}
        </div>
      </Col>
      <Col className="w-1/4 bg-white h-fit rounded-2xl px-8 py-4 ">
        <div className="flex justify-around items-center gap-5">
          <div>
            <Avatar size={70} src={userDetail?.avatar || avtDefault} />
          </div>
          <div className="text-[12px]">
            <p>Chào bạn trở lại</p>
            <b>{userDetail?.full_name}</b>
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
          <span className="ml-2 text-[12px] font-semibold text-grayPrimary">
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
            value={userDetail?.is_suggestion_job}
            size="default"
          />
          <span className="ml-2 text-[12px] font-semibold text-grayPrimary">
            Bật gợi ý việc làm
          </span>
          <div className=" mt-2 text-[12px] text-grayPrimary">
            Khi có cơ hội việc làm phù hợp, NTD sẽ liên hệ và trao đổi với bạn
            qua:
          </div>
          <div className="mt-2">
            <div>
              <CheckCircleOutlined />
              <span className="ml-2 text-[12px] font-light text-grayPrimary ">
                Nhắn tin qua Top Connect trên HireDev
              </span>
            </div>
            <div>
              <CheckCircleOutlined />
              <span className="ml-2 text-[12px] font-light text-grayPrimary ">
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
      </Col>
    </div>
  );
};

export default Profile;
