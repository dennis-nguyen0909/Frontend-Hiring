import { useEffect, useState } from "react";
import {
  Avatar,
  Card,
  Image,
  Space,
} from "antd";
import { CheckCircle, XCircle } from "lucide-react";
import moment from "moment";
import { StarFilled } from "@ant-design/icons";
import { USER_API } from "../../../../services/modules/userServices";

const CandidateDetailView = ({ candidateId, userDetail }:{candidateId:string,userDetail:any}) => {
  const [candidateDetail, setCandidateDetail] = useState();

  const handleGetCandidateDetail = async () => {
    const res = await USER_API.viewProfileCandidate(candidateId,userDetail?.access_token);
    if (res?.data?.items) {
      setCandidateDetail(res?.data?.items);
    }
  };

  useEffect(() => {
    handleGetCandidateDetail();
  }, []);

  // const downloadCV = async (userId: string) => {
  //   try {
  //     const response = await axiosInstance.get(`http://localhost:8082/api/v1/cvs/download/${userId}`, {
  //       responseType: 'blob',
  //     });

  //     const blob = response.data;
  //     const link = document.createElement('a');
  //     link.href = URL.createObjectURL(blob);
  //     link.download = 'CV.pdf';
  //     link.click();
  //   } catch (error) {
  //     console.error('Error downloading CV:', error);
  //   }
  // };

  // Gọi hàm downloadCV khi người dùng nhấn nút hoặc trigger sự kiện

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

        <div className="flex justify-start gap-2">
          <div className="font-medium">Giới thiệu:</div>
          <div>{candidateDetail?.introduce}</div>
        </div>

        {/* Email */}
        <div className="flex justify-between">
          <div className="font-medium">Email:</div>
          <div>{candidateDetail?.email}</div>
        </div>

        {/* Số điện thoại */}
        <div className="flex justify-between">
          <div className="font-medium">Số điện thoại:</div>
          <div>{candidateDetail?.phone || "Chưa cập nhật"}</div>
        </div>

        {/* Address */}
        <div className="flex justify-between">
          <div className="font-medium">Địa chỉ:</div>
          <div>{candidateDetail?.city_id?.name || "Chưa cập nhật"}</div>
        </div>

        {/* Gender */}
        <div className="flex justify-between">
          <div className="font-medium">Giới tính:</div>
          <div>
            {candidateDetail?.gender === 0
              ? "Nam"
              : candidateDetail?.gender === 1
              ? "Nữ"
              : "Không xác định"}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="font-medium">Ngày sinh:</div>
          <div>
            {moment(candidateDetail?.birthday).format("MM/DD/YYYY") ||
              "Chưa cập nhật"}
          </div>
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
          <div className="font-medium">Chưa cập nhật kinh nghiệm:</div>
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
        {candidateDetail?.work_experience_ids?.length > 0 && (
          <div className="space-y-2">
            <div className="font-medium bg-[#cccccc] rounded-md p-2">
              Kinh nghiệm làm việc:
            </div>
            {candidateDetail?.work_experience_ids?.length > 0 ? (
              candidateDetail?.work_experience_ids.map((work, index) => (
                <Card key={index}>
                  <div className="flex items-center justify-between">
                    <div>
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
                    <Image
                      width={100}
                      height={"100%"}
                      src={work?.image_url}
                      preview={false}
                    />
                  </div>
                </Card>
              ))
            ) : (
              <div>Chưa có kinh nghiệm làm việc</div>
            )}
          </div>
        )}

        {/* Skills */}
        {candidateDetail?.skills?.length > 0 && (
          <div className="space-y-2">
            <div className="font-medium bg-[#cccccc] rounded-md p-2">
              Kỹ năng:
            </div>
            {candidateDetail?.skills?.length > 0 ? (
              candidateDetail?.skills.map((skill, index) => (
                <Card key={index}>
                  <div className="font-semibold">{skill?.name}</div>
                  <div>
                    Mức độ : {skill?.evalute}{" "}
                    <StarFilled className="text-yellow-500" />
                  </div>
                  <div>{skill?.description}</div>
                </Card>
              ))
            ) : (
              <div>Chưa có kỹ năng</div>
            )}
          </div>
        )}

        {/* Education */}
        {candidateDetail?.education_ids?.length > 0 && (
          <div className="space-y-2">
            <div className="font-medium bg-[#cccccc] rounded-md p-2">
              Học vấn:
            </div>
            {candidateDetail?.education_ids?.length > 0 ? (
              candidateDetail?.education_ids.map((education, index) => (
                <Card key={index}>
                  <div className="font-semibold">{education?.school}</div>
                  <div>{education?.major}</div>
                  <div>
                    {new Date(education?.start_date).toLocaleDateString()} -{" "}
                    {education?.currently_studying
                      ? "Đang học"
                      : "Đã tốt nghiệp"}
                  </div>
                </Card>
              ))
            ) : (
              <div>Chưa có thông tin học vấn</div>
            )}
          </div>
        )}
        {candidateDetail?.certificates?.length > 0 && (
          <div className="space-y-2">
            <div className="font-medium bg-[#cccccc] rounded-md p-2">
              Chứng chỉ
            </div>
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
                          item.is_not_expired
                            ? "text-green-500"
                            : "text-red-500"
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
                    {item.link_certificate && (
                      <div className="flex items-center">
                        <strong>Liên kết</strong>
                        <a
                          target="_blank"
                          href={item.link_certificate}
                          className="ml-2"
                        >
                          {item?.link_certificate}
                        </a>
                      </div>
                    )}
                  </div>
                  {item.img_certificate && (
                    <div>
                      <Image
                        preview={false}
                        className="shadow-custom"
                        style={{
                          borderRadius: "20px",
                          maxWidth: 80,
                          maxHeight: 80,
                        }}
                        src={item?.img_certificate}
                      />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {candidateDetail?.prizes?.length > 0 && (
          <div className="space-y-2">
            <div className="font-medium bg-[#cccccc] rounded-md p-2">
              Giải thưởng
            </div>
            {candidateDetail?.prizes?.map((item: any, index: number) => (
              <Card key={index} className="shadow-lg">
                <Space className="flex items-center justify-between" size={16}>
                  <div>
                    <div className="text-xl font-semibold">
                      {item.prize_name}
                    </div>
                    <div className="text-gray-600">
                      {item.organization_name}
                    </div>
                    <div className="text-gray-400">
                      Ngày nhận:{" "}
                      {moment(item.date_of_receipt).format("DD/MM/YYYY")}
                    </div>
                    {item.prize_link && (
                      <a
                        href={item.prize_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 mt-4"
                      >
                        Liên kết
                      </a>
                    )}
                  </div>
                  {/* Hiển thị ảnh nếu có */}
                  {item.prize_image && (
                    <Image
                      preview={false}
                      className="shadow-custom"
                      style={{
                        borderRadius: "20px",
                        maxWidth: 80,
                        maxHeight: 80,
                      }}
                      src={item?.prize_image}
                    />
                  )}
                </Space>
              </Card>
            ))}
          </div>
        )}

        {candidateDetail?.projects?.length > 0 && (
          <div className="space-y-2">
            <div className="font-medium bg-[#cccccc] rounded-md p-2">Dự án</div>
            {candidateDetail?.projects?.map((item, index) => (
              <Card key={index} className="shadow-lg">
                <Space className="flex items-center justify-between" size={16}>
                  <div>
                    <div className="text-xl font-semibold">
                      {item.project_name}
                    </div>
                    <div className="text-gray-600">
                      Khách hàng: {item.customer_name}
                    </div>
                    <div className="text-gray-400">
                      Thời gian: {moment(item.start_date).format("DD/MM/YYYY")}{" "}
                      - {moment(item.end_date).format("DD/MM/YYYY")}
                    </div>
                    <div className="text-gray-400">
                      Công nghệ: {item.technology}
                    </div>
                    <div className="text-gray-400">
                      Team: {item.team_number}
                    </div>
                    <div className="text-gray-400">Vị trí: {item.location}</div>
                    <div className="text-gray-400">
                      Nhiệm vụ: {item.mission}
                    </div>
                    {item.project_link && (
                      <a
                        href={item.project_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 mt-4"
                      >
                        Liên kết dự án
                      </a>
                    )}
                  </div>
                  {/* Hiển thị ảnh nếu có */}
                  {item.project_image && (
                    <Image
                      preview={true}
                      src={item.project_image}
                      alt="Project"
                      className="w-full h-auto rounded-md mt-4 shadow-lg"
                    />
                  )}
                </Space>
              </Card>
            ))}
          </div>
        )}

        {candidateDetail?.courses?.length > 0 && (
          <div className="space-y-2">
            <div className="font-medium bg-[#cccccc] rounded-md p-2">
              Khóa học
            </div>
            {candidateDetail?.courses?.map((item, index) => (
              <Card key={index} className="p-4 shadow-lg">
                <Space className="flex items-center justify-between" size={16}>
                  <div>
                    <div className="text-xl font-semibold">
                      {item.course_name}
                    </div>
                    <div className="text-gray-600">
                      {item.organization_name}
                    </div>
                    <div className="text-gray-400">
                      Thời gian: {moment(item.start_date).format("DD/MM/YYYY")}{" "}
                      - {moment(item.end_date).format("DD/MM/YYYY")}
                    </div>
                    {item.course_link && (
                      <a
                        href={item.course_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 mt-4"
                      >
                        Liên kết khóa học
                      </a>
                    )}
                  </div>
                  {/* Hiển thị ảnh nếu có */}
                  {item.course_image && (
                    <Image
                      width={100}
                      height={100}
                      preview={true}
                      src={item.course_image}
                      alt="Course"
                      className="w-full h-auto rounded-md mt-4 shadow-lg"
                    />
                  )}
                </Space>
              </Card>
            ))}
            {/* <Button onClick={()=>downloadCV(candidateDetail?._id)}>Download cv</Button> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDetailView;
