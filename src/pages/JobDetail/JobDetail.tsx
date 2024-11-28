import { Button, Card, Tabs, Tag, Typography, Image, notification } from "antd";
import { ShareAltOutlined } from "@ant-design/icons";
import { Book, Heart, Share } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { USER_API } from "../../services/modules/userServices";
import { useSelector } from "react-redux";
import { JobApi } from "../../services/modules/jobServices";
import { useEffect, useState } from "react";
import moment from "moment";
import './styles.css'
import { API_APPLICATION } from "../../services/modules/ApplicationServices";
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
interface JobDetail {
  _id: string;
  address: string;
  apply_email: string;
  apply_linkedin: string;
  apply_website: string;
  benefit: string[];
  candidate_ids: string[];
  city_id: string;
  count_apply: number;
  createdAt: string;
  degree: string;
  description: string;
  district_id: string;
  expire_date: string;
  is_active: boolean;
  is_expired: boolean;
  is_negotiable: boolean;
  job_type: string;
  level: string;
  posted_date: string;
  require_experience: string[];
  salary_range: Record<string, unknown>; // You can replace `Record<string, unknown>` with a more specific type if needed
  salary_type: string;
  skills: string[];
  title: string;
  type_money: string;
  updatedAt: string;
  user_id: string | null;
  ward_id: string;
  __v: number;
}

export default function JobDetail() {
  const userDetail = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [jobDetail, setJobDetail] = useState<JobDetail>();
  const { id } = useParams();
  const handleGetDetail = async () => {
    try {
      const res = await JobApi.getJobById(id + "", userDetail?.access_token);
      if (res.data) {
        setJobDetail(res.data);
      }
    } catch (error) {}
  };
  useEffect(() => {
    handleGetDetail();
  }, []);
  const handleApplied = async() => {
    if(userDetail?.access_token){
      const params={
        user_id:userDetail._id,
        employer_id:jobDetail?.user_id?._id,
        job_id:jobDetail?._id
      }
      const res = await API_APPLICATION.createApplication(params,userDetail?.access_token);
      console.log("res",res)
      console.log("res",jobDetail)
      if(res.data){
        notification.success({
          message:"Thông báo",
          description:'Ứng tuyển thành công'
        })
        handleGetDetail();
      }
    }else{
      navigate('/login')
    }
  };
  const handleCreateCV = () => {};
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-6">
          <div className="w-24 h-24">
            <Image
              src={jobDetail?.user_id?.avatar_company}
              alt="CA Advance"
              width={96}
              height={96}
              className="rounded"
            />
          </div>
          <div className="space-y-2">
            <Title level={1} className="!text-4xl !mb-1 !font-bold">
              {jobDetail?.title}
            </Title>
            <Title level={3} className="!text-xl !mb-1">
              {jobDetail?.user_id?.company_name}
            </Title>
            <div className="flex items-start gap-2">
              <div className="mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <Text className="text-gray-600 text-base leading-relaxed">
                {`${jobDetail?.address ? +`${jobDetail?.address},` : ""}${
                  jobDetail?.ward_id?.name
                } ,${jobDetail?.district_id?.name} ,${
                  jobDetail?.city_id?.name
                }`}
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <Text className="text-gray-500">
                Ngày đăng {moment(jobDetail?.posted_date).format("DD/MM/yyyy")}
              </Text>
            </div>

            {userDetail?.access_token ? (
              <></>
            ) : (
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 2H8.828a2 2 0 00-1.414.586L6.293 3.707A1 1 0 015.586 4H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
                <Text
                  onClick={() => navigate("/login")}
                  className="text-red-500 hover:underline cursor-pointer"
                >
                  Đăng nhập để xem mức lương
                </Text>
              </div>
            )}
          </div>
        </div>
        <div className="flex  gap-2 flex-col gap-4">
          <div className="flex space-x-4 justify-end">
            <div className="hover:scale-110 transform transition-transform duration-200 cursor-pointer">
              <Heart />
            </div>
            <div className="hover:scale-110 transform transition-transform duration-200 cursor-pointer">
              <Share />
            </div>
          </div>

          {jobDetail?.candidate_ids.includes(userDetail?._id) ? (
            <Button  disabled className="py-5 px-6 rounded-full">Đã ứng tuyển</Button>
          ):(
            <Button
    className="!bg-primaryColorH   text-white font-semibold py-5 px-6 rounded-full shadow-md hover:bg-primaryColorDark transition-all duration-300"
    onClick={handleApplied}
  >
    Ứng tuyển ngay
  </Button>
          )}
  <Button
    className="!bg-black  text-white font-semibold py-5 px-6 rounded-full shadow-md hover:bg-gray-300 transition-all duration-300"
    onClick={handleCreateCV}
  >
    Tạo CV để ứng tuyển
  </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <Tabs defaultActiveKey="1">
              <TabPane tab="Mô tả công việc" key="1">
                <div className="space-y-6">
                  <section>
                    <Title level={5}>Thông tin chung</Title>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        Làm việc tại: {jobDetail?.district_id.name},
                        {jobDetail?.city_id.name}
                      </li>
                      {jobDetail?.is_negotiable ? (
                        <li>Mức lương: Thỏa thuận</li>
                      ) : (
                        <li>
                          Mức lương: {jobDetail?.salary_range.min} ~{" "}
                          {jobDetail?.salary_range.max}
                        </li>
                      )}
                      {jobDetail?.age_range ? (
                        <li>
                          Độ tuổi: {jobDetail?.age_range?.min} ~{" "}
                          {jobDetail?.age_range?.max} tuổi
                        </li>
                      ) : (
                        <></>
                      )}
                    </ul>
                  </section>

                  <section>
                    <Title level={5}>Trách nhiệm công việc</Title>
                    <ul className="list-disc pl-5 space-y-2">
                      {jobDetail?.job_responsibilities.map((item, idx) => {
                        return <li key={idx}>{item.responsibility}</li>;
                      })}
                    </ul>
                  </section>

                  <section>
                    <Title level={5}>Kỹ năng & Chuyên môn</Title>
                    <div className="space-y-4">
                      {jobDetail?.professional_skills?.map(
                        (requirement, index) => (
                          <div key={index}>
                            <Text strong>{requirement.title}</Text>
                            <ul className="list-disc pl-5 space-y-2">
                              {requirement.items.map((item, itemIndex) => (
                                <li key={itemIndex}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )
                      )}
                    </div>
                  </section>
                  <section>
                    <Title level={5}>Phúc lợi dành cho bạn</Title>
                    <ul className="list-disc pl-5 space-y-2">
                      {jobDetail?.benefit.map((item, idx) => {
                        return <li key={idx}>{item}</li>;
                      })}
                    </ul>
                  </section>
                </div>
              </TabPane>
              <TabPane tab="Giới thiệu về công ty" key="2">
                <div className="space-y-4">
                  <Paragraph>
                    CA ADVANCE là một trong những công ty con của tập đoàn Cyber
                    Agent, hiện đang rất phát triển tại Nhật Bản. Năm 2014, CA
                    ADVANCE đã đặt chi nhánh nước ngoài đầu tiên tại Thành phố
                    Hồ Chí Minh – Việt Nam.
                  </Paragraph>
                  <div className="grid grid-cols-3 gap-4">
                    <Image
                      src="/placeholder.svg"
                      alt="Company image 1"
                      width={300}
                      height={200}
                      className="rounded"
                    />
                    <Image
                      src="/placeholder.svg"
                      alt="Company image 2"
                      width={300}
                      height={200}
                      className="rounded"
                    />
                    <Image
                      src="/placeholder.svg"
                      alt="Company image 3"
                      width={300}
                      height={200}
                      className="rounded"
                    />
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card title="Thông tin chung">
            <div className="space-y-4">
              <div>
                <Text className="text-gray-500 block">
                  Năm kinh nghiệm tối thiểu
                </Text>
                <Text strong>Từ {jobDetail?.min_experience} năm</Text>
              </div>
              <div>
                <Text className="text-gray-500 block">Cấp bậc</Text>
                <Text strong>{jobDetail?.level.toLocaleUpperCase()}</Text>
              </div>
              <div>
                <Text className="text-gray-500 block">Loại hình</Text>
                <Text strong>
                  {jobDetail?.type_of_work?.toLocaleUpperCase()}
                </Text>
              </div>
              <div>
                <Text className="text-gray-500 block">Loại hợp đồng</Text>
                <Text strong>{jobDetail?.job_type.toLocaleUpperCase()}</Text>
              </div>
            </div>
          </Card>

          <Card title="Các công nghệ sử dụng">
            <div className="flex flex-wrap gap-2">
              {jobDetail?.skills.map((skill, index) => (
                <Tag color="blue" key={index}>
                  {skill.name}
                </Tag>
              ))}
            </div>
          </Card>

          <Card title="Quy trình phỏng vấn">
            <ul className="list-disc pl-5 space-y-2">
              {jobDetail?.interview_process?.map((item, idx) => {
                return <li key={idx}>{item.process}</li>;
              })}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
