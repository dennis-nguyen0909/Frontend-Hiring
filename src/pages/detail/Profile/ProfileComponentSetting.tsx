import {
  Card,
  Col,
  Progress,
} from "antd";
import { useSelector } from "react-redux";
import {
  Pencil,
} from "lucide-react";
import { useEffect } from "react";
import EducationComponent from "../Education/Education";
import ExperienceComponent from "../Experience/Experience";
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
const ProfileComponentSetting = () => {
  const userDetail = useSelector((state) => state.user);
  const {
    data: caculateProfile,refetch  } = useCalculateUserProfile(userDetail?._id, userDetail?.access_token);
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
