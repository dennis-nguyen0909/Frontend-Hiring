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
import {
  Camera,
  Download,
  Pencil,
  Share2,
} from "lucide-react";
import { useRef, useState } from "react";
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
const ProfileComponentSetting = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const fileInputAvtRef = useRef(null);
  const userDetail = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [visibleInAvatar, setVisibleInAvatar] = useState(false);
  const [coverImage, setCoverImage] = useState(userDetail?.background || null);
  const uploadFileToMedia = async (file: File) => {
    try {
      const res = await MediaApi.postMedia(file, userDetail.access_token);
      return res;
    } catch (error) {
      notification.error({
        message: "Notification",
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
            id: userDetail._id,
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
            id: userDetail._id,
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
      case "allowProfilesToSearch":
        break;
      case "isSearchJobStatus":
        // eslint-disable-next-line no-case-declarations
        const params = {
          id: userDetail._id,
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
  console.log()
  const {
    data: caculateProfile,
    isLoading,
    error,
    refetch
  } = useCalculateUserProfile(userDetail?._id, userDetail?.access_token);
  return (
    <div className="">
      <Col span={24} className="max-w-3xl mx-auto p-4 space-y-6 rounded-xl">
    
        <div className="pt-16 space-y-4">

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
                <p className="text-3xl font-bold">0</p>
                <p className="text-sm text-gray-500">Lượt xem trong tuần</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-3xl font-bold">0</p>
                <p className="text-sm text-gray-500">Lượt xem trong tháng</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-3xl font-bold">0</p>
                <p className="text-sm text-gray-500">Lượt xem trong năm</p>
              </div>
            </div>
          </Card>

          <ExperienceNumberCandidate refetch={refetch} />
          {/* Education Section */}
          <EducationComponent refetch={refetch} />
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
        </div>
      </Col>
    </div>
  );
};

export default ProfileComponentSetting;
