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
  const userDetail = useSelector((state) => state.user);
  const [visible, setVisible] = useState(false);
  const [visibleInAvatar, setVisibleInAvatar] = useState(false);
  const [coverImage, setCoverImage] = useState(userDetail?.background || null);




  const {
    data: caculateProfile  } = useCalculateUserProfile(userDetail?._id, userDetail?.access_token);
  return (
      <Col span={24} className="mx-auto p-4 space-y-6 rounded-xl">
    
        <div className="space-y-4">

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

          <ExperienceNumberCandidate  />
          {/* Education Section */}
          <EducationComponent  />
          {/* Experience Section */}
          <ExperienceComponent   />
          {/* Skill Section */}
          <SkillComponent  />
          {/* Certificate */}
          <CertificateComponent  />
          {/* Prize */}
          <PrizeView />
          {/* Course */}
          <CourseView />
          {/* Project */}
          <ProjectComponent />
        </div>
      </Col>
  );
};

export default ProfileComponentSetting;
