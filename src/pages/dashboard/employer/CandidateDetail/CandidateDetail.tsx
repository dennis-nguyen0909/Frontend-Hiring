import React, { useEffect, useState } from "react";
import { Descriptions, Avatar, Badge, Tooltip, Card, Image } from "antd";
import * as userServices from "../../../../services/modules/userServices";
import { CheckCircle, XCircle } from "lucide-react";

const CandidateDetailView = ({ candidateId, userDetail }) => {
  const [candidateDetail, setCandidateDetail] = useState();

  const handleGetCandidateDetail = async () => {
    const res = await userServices.getDetailUser(
      candidateId,
      userDetail?.access_token
    );
    console.log("duydeptri", res);
    if (res?.data?.items) {
      setCandidateDetail(res?.data?.items);
    }
  };

  useEffect(() => {
    handleGetCandidateDetail();
  }, []);

  console.log("candidateDetail", candidateDetail);

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Thông Tin Ứng Viên</h2>

      <div className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center space-x-4">
          <Avatar size={64} src={candidateDetail?.avatar} />
          <div className="text-xl font-semibold">
            {candidateDetail?.full_name}
          </div>
        </div>

        {/* Email */}
        <div className="flex justify-between">
          <div className="font-medium">Email:</div>
          <div>{candidateDetail?.email}</div>
        </div>

        {/* Phone */}
        <div className="flex justify-between">
          <div className="font-medium">Số điện thoại:</div>
          <div>{candidateDetail?.phone || "Không có"}</div>
        </div>

        {/* Address */}
        <div className="flex justify-between">
          <div className="font-medium">Địa chỉ:</div>
          <div>{candidateDetail?.address || "Không có"}</div>
        </div>

        {/* Gender */}
        <div className="flex justify-between">
          <div className="font-medium">Giới tính:</div>
          <div>{candidateDetail?.gender || "Không xác định"}</div>
        </div>



        {/* Search Job Status */}
        <div className="flex justify-between">
          <div className="font-medium">Tìm kiếm công việc:</div>
          <div>
            {candidateDetail?.is_search_jobs_status
              ? "Đang tìm kiếm"
              : "Không tìm kiếm"}
          </div>
        </div>

        {/* No Experience */}
        <div className="flex justify-between">
          <div className="font-medium">Không có kinh nghiệm:</div>
          <div>{candidateDetail?.no_experience ? "Có" : "Không"}</div>
        </div>
        {/* Total Experience Years */}
        <div className="flex justify-between">
          <div className="font-medium">Tổng số năm kinh nghiệm:</div>
          <div>{candidateDetail?.total_experience_years}</div>
        </div>

        {/* Total Experience Months */}
        <div className="flex justify-between">
          <div className="font-medium">Tổng số tháng kinh nghiệm:</div>
          <div>{candidateDetail?.total_experience_months}</div>
        </div>


        {/* Work Experience */}
        <div className="space-y-2">
          <div className="font-medium bg-[#b2dbfe] rounded-md p-2">Kinh nghiệm làm việc:</div>
          {candidateDetail?.work_experience_ids?.length > 0 ? (
            candidateDetail?.work_experience_ids.map((work, index) => (
              <div key={index}>
                <div className="font-semibold">{work?.company}</div>
                <div>{work?.position}</div>
                <div>
                  {work?.start_date &&
                    new Date(work?.start_date).toLocaleDateString()}{" "}
                  -{" "}
                  {work?.currently_working
                    ? "Hiện tại"
                    : new Date(work?.end_date).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            <div>Chưa có kinh nghiệm làm việc</div>
          )}
        </div>

        {/* Skills */}
        <div className="space-y-4">
          <div className="font-medium bg-[#cccccc] rounded-md p-2">Kỹ năng:</div>
          {candidateDetail?.skills?.length > 0 ? (
            candidateDetail?.skills.map((skill, index) => (
              <div key={index}>
                <div className="font-semibold">{skill?.name}</div>
                <div>Đánh giá: {skill?.evalute}</div>
                <div>{skill?.description}</div>
              </div>
            ))
          ) : (
            <div>Chưa có kỹ năng</div>
          )}
        </div>


        {/* Education */}
        <div className="space-y-4">
          <div className="font-medium bg-[#a8a9bc] rounded-md p-2">Học vấn:</div>
          {candidateDetail?.education_ids?.length > 0 ? (
            candidateDetail?.education_ids.map((education, index) => (
              <div key={index}>
                <div className="font-semibold">{education?.school}</div>
                <div>{education?.major}</div>
                <div>
                  {new Date(education?.start_date).toLocaleDateString()} -{" "}
                  {education?.currently_studying ? "Đang học" : "Đã tốt nghiệp"}
                </div>
              </div>
            ))
          ) : (
            <div>Chưa có thông tin học vấn</div>
          )}
        </div>
        <div className="space-y-4">
        <div className="font-medium bg-[#cccccc] rounded-md p-2">Kỹ năng:</div>
        {candidateDetail?.certificates?.map((item: any, index: number) => (
              <Card
                key={index}
                title={item.certificate_name}
              
                className="shadow-lg rounded-lg mt-4"
              >
                <div className="space-y-3 flex items-center justify-between">
                  <div>
                  <div className="flex items-center">
                    <strong>Tổ chức cấp chứng chỉ: </strong>
                    <span className="ml-2">{item.organization_name}</span>
                  </div>
                  <div className="flex items-center">
                    <strong>Ngày bắt đầu: </strong>
                    <span className="ml-2">
                      {new Date(item.start_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <strong>Chứng chỉ còn hiệu lực: </strong>
                    <span
                      className={`ml-2 ${
                        item.is_not_expired ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {item.is_not_expired ? "Còn hiệu lực" : "Hết hiệu lực"}
                    </span>
                    {item.is_not_expired ? (
                      <CheckCircle className="ml-2 text-green-500" />
                    ) : (
                      <XCircle className="ml-2 text-red-500" />
                    )}
                  </div>
                  {item.link_certificate && <div className="flex items-center">
                    <strong>Liên kết</strong>
                    <a  target="_blank"  href={item.link_certificate} className="ml-2">{item?.link_certificate}</a>
                  </div>}
                  </div>
                    {item.img_certificate && <div>
                    <Image  preview={false} className="shadow-custom" style={{borderRadius:'20px',maxWidth:80,maxHeight:80}} src={item?.img_certificate} />
                </div>}
                </div>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailView;
