import { Share2, Check } from "lucide-react";
import { Avatar, Button, Card, Form, Modal, Select, Tag } from "antd";
import { useEffect, useState } from "react";
import { Job } from "../../types";
import { JobApi } from "../../services/modules/jobServices";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { getRandomColor } from "../../utils/color.utils";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import { API_APPLICATION } from "../../services/modules/ApplicationServices";
import { toast } from "react-toastify";
import { CV_API } from "../../services/modules/CvServices";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { API_FAVORITE_JOB } from "../../services/modules/FavoriteJobServices";

export default function JobPosting() {
  const [jobDetail, setJobDetail] = useState<Job>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [form] = useForm();
  const navigate = useNavigate();
  const [cvUser, setCvUser] = useState([]);
  const [selectedCV, setSelectedCV] = useState<string>("");
  const [like, setLike] = useState<any>();
  const [coverLetter, setCoverLetter] = useState<string>("");
  const { id } = useParams();
  const userDetail = useSelector((state: RootState) => state.user);
  const handleGetDetail = async () => {
    try {
      const res = await JobApi.getJobById(id + "", userDetail?.access_token);
      if (res.data) {
        setJobDetail(res.data);
      }
    } catch (error) {}
  };
  useEffect(() => {
    getFavoriteJobDetailByUserId();
    handleGetDetail();
  }, []);
  const handleCvChange = (value) => {
    setSelectedCV(value);
  };

  useEffect(() => {
    const handleGetCV = async () => {
      if (!isModalOpen) return;
      try {
        const params = {
          current: 1,
          pageSize: 30,
          query: {
            user_id: userDetail?._id,
          },
        };
        const res = await CV_API.getAll(params, userDetail?.access_token);
        if (res.data) {
          setCvUser(res.data.items);
        }
      } catch (error) {
        console.error(error);
      }
    };

    handleGetCV();
  }, [isModalOpen, userDetail]);
  const onAppliedJob = async () => {
    if (selectedCV.trim() === "") {
      toast.error("Vui lòng chọn cv!");
      return;
    }
    if (coverLetter.trim() === "") {
      toast.error("Vui lòng nhập thư ứng tuyển!");
      return;
    }

    if (userDetail?.access_token) {
      const params = {
        user_id: userDetail?._id,
        employer_id: jobDetail?.user_id?._id,
        job_id: jobDetail?._id,
        cover_letter: coverLetter,
        cv_id: selectedCV,
      };

      const res = await API_APPLICATION.createApplication(
        params,
        userDetail?.access_token
      );
      if (res.data) {
        toast.success("Ứng tuyển thành công");
        handleGetDetail();
        setIsModalOpen(false);
      }
    } else {
      navigate("/login");
    }
  };
  const getFavoriteJobDetailByUserId = async () => {
    try {
      const params = {
        user_id: userDetail?._id,
        job_id: id,
      };
      const res = await API_FAVORITE_JOB.getFavoriteJobDetailByUserId(
        params,
        userDetail?.access_token
      );
      if (res.data) {
        setLike(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  console.log("jobDetail", jobDetail);
  const onLike = async () => {
    try {
      const params = {
        user_id: userDetail?._id,
        job_id: jobDetail?._id,
      };
      const res = await API_FAVORITE_JOB.createFavoriteJobs(
        params,
        userDetail?.access_token
      );
      if (+res.statusCode === 201) {
        // Update the local state after successful like operation
        setLike((prevLike) => ({
          ...prevLike,
          _id: prevLike?._id ? null : res?.data?._id, // Toggle the like status
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <Avatar
              src={jobDetail?.user_id?.avatar_company}
              size={65}
              shape="square"
            />
            <div>
              <h1 className="text-xl md:text-2xl font-bold">
                {jobDetail?.title}
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                {jobDetail?.user_id?.company_name} •{" "}
                {jobDetail?.district_id?.name}, {jobDetail?.city_id?.name} •{" "}
                {jobDetail?.job_contract_type?.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hover:scale-110 transform transition-transform duration-200 cursor-pointer">
              {like?._id ? (
                <HeartFilled
                  onClick={onLike}
                  style={{ color: "red", fontSize: "24px" }}
                />
              ) : (
                <HeartOutlined onClick={onLike} style={{ fontSize: "24px" }} />
              )}
            </div>
            {new Date(jobDetail?.expire_date) < new Date() ? (
              <Button
                disabled
                className="py-2 px-4 md:py-5 md:px-6 rounded-full ![cursor:pointer] hover:[cursor:pointer] disabled:[cursor:pointer]"
              >
                Đã hết hạn
              </Button>
            ) : jobDetail?.candidate_ids.includes(userDetail?._id) ? (
              <Button
                disabled
                className="bg-violet-600 hover:bg-violet-700 ![cursor:pointer] hover:[cursor:pointer] disabled:[cursor:pointer] py-2 px-4 md:py-5 md:px-6"
              >
                Đã ứng tuyển
              </Button>
            ) : (
              <Button
                className="bg-violet-600 hover:bg-violet-700 cursor-pointer py-2 px-4 md:py-5 md:px-6"
                onClick={() => setIsModalOpen(true)}
              >
                Ứng tuyển ngay
              </Button>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card className="p-6 bg-gray-100">
              <h2 className="text-xl font-bold mb-4">Mô tả</h2>
              <p
                className="text-gray-700"
                dangerouslySetInnerHTML={{ __html: jobDetail?.description }}
              ></p>
            </Card>

            {jobDetail?.professional_skills?.length > 0 && (
              <Card className="p-6 bg-white border border-gray-300">
                <h2 className="text-xl font-bold mb-4 text-black">
                  Kỹ năng chuyên môn
                </h2>
                <ul className="space-y-3">
                  {jobDetail?.professional_skills?.map((requirement, index) => (
                    <div key={index}>
                      <b className="text-black">{requirement.title}</b>
                      <ul className="list-disc pl-5 space-y-2">
                        {requirement.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-gray-800">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </ul>
              </Card>
            )}

            {/* Responsibilities */}
            {jobDetail?.job_responsibilities?.length > 0 && (
              <Card className="p-6 bg-gray-100">
                <h2 className="text-xl font-bold mb-4">Trách nhiệm</h2>
                <ul className="space-y-3">
                  {jobDetail?.job_responsibilities?.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-black mt-1 flex-shrink-0" />

                      <span>{item?.responsibility}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {jobDetail?.general_requirements?.length > 0 && (
              <Card className="p-6 bg-gray-100">
                <h2 className="text-xl font-bold mb-4">Tốt hơn nếu có</h2>
                <ul className="space-y-3">
                  {jobDetail?.general_requirements?.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 ">
                      <Check className="h-5 w-5 text-black mt-1 flex-shrink-0" />
                      <span>{item?.requirement}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Perks & Benefits */}
            {jobDetail?.benefit?.length > 0 && (
              <Card className="p-6 bg-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-black">
                  Quyền lợi
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobDetail?.benefit?.map((item, idx) => {
                    return (
                      <div
                        key={idx}
                        className="p-4 bg-white rounded-lg shadow-md border border-gray-200"
                      >
                        <div className="text-gray-700">{item}</div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <Card className="p-6 bg-gray-100">
              <h2 className="text-xl font-bold mb-4">Về vị trí này</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Số lượng tuyển</span>
                    <span className="text-gray-700">
                      {jobDetail?.count_apply}
                    </span>
                  </div>
                </div>
                <InfoRow
                  label="Hạn nộp hồ sơ"
                  value={moment(jobDetail?.expire_date).format("DD/MM/YYYY")}
                />
                <InfoRow
                  label="Ngày đăng"
                  value={moment(jobDetail?.createdAt).format("DD/MM/YYYY")}
                />
                <InfoRow
                  label="Loại công việc"
                  value={jobDetail?.job_contract_type?.name}
                />
                {jobDetail?.salary_range?.min &&
                jobDetail?.salary_range?.max &&
                jobDetail?.is_negotiable ? (
                  <InfoRow
                    label="Mức lương"
                    value={`${jobDetail?.salary_range?.min} - ${jobDetail?.salary_range?.max}`}
                  />
                ) : (
                  <InfoRow label="Mức lương" value={"Thỏa thuận"} />
                )}
                <InfoRow label="Cấp bậc" value={jobDetail?.level?.name} />
                <InfoRow label="Hình thức" value={jobDetail?.job_type?.name} />
                <InfoRow
                  label="Kinh nghiệm tối thiểu"
                  value={jobDetail?.min_experience + " năm"}
                />
                <InfoRow label="Bằng cấp" value={jobDetail?.degree?.name} />
              </div>
            </Card>

            {jobDetail?.skills?.length > 0 && (
              <Card className="p-6 bg-gray-100">
                <h2 className="text-xl font-bold mb-4">Kỹ năng</h2>
                <div className="flex gap-2 flex-wrap">
                  {jobDetail?.skills?.map((skill, idx) => {
                    return (
                      <Tag color={getRandomColor()} key={idx}>
                        {skill?.name}
                      </Tag>
                    );
                  })}
                </div>
              </Card>
            )}

            {jobDetail?.interview_process?.length > 0 && (
              <Card className="p-6 bg-gray-100">
                <h2 className="text-xl font-bold mb-4">Quá trình phỏng vấn</h2>
                <div className="flex flex-wrap gap-2 flex-col">
                  {jobDetail?.interview_process?.map((item, i) => (
                    <Tag
                      key={i}
                      color="black"
                      className="bg-gray-200 text-black w-fit"
                    >
                      {item?.process}
                    </Tag>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
      <Modal
        title={`Ứng tuyển: ${jobDetail?.title}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={false}
      >
        <Form form={form} layout="vertical">
          <div className="space-y-4 py-4">
            {/* CV Selection */}
            <div>
              <Form.Item
                label={"Chọn cv"}
                name="cv"
                rules={[{ required: true, message: "Vui lòng chọn một CV!" }]}
              >
                <Select
                  className="w-full"
                  placeholder="Select..."
                  onChange={handleCvChange}
                  value={selectedCV}
                >
                  {cvUser.map((cv) => (
                    <Select.Option key={cv?._id} value={cv?._id}>
                      {cv?.cv_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            {/* Cover Letter */}
            <div>
              <Form.Item
                label={"Thư giới thiệu"}
                name="coverLetter"
                rules={[
                  { required: true, message: "Vui lòng nhập thư giới thiệu!" },
                ]}
              >
                <TextArea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={4}
                  placeholder="Write down your biography here. Let the employers know who you are..."
                  className="w-full"
                />
              </Form.Item>
            </div>
          </div>

          <Button type="primary" onClick={onAppliedJob}>
            Ứng tuyển ngay
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-gray-700">{label}</span>
      <span className="font-medium text-black">{value}</span>
    </div>
  );
}
