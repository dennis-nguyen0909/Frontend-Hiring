import {
  Button,
  Card,
  Tabs,
  Tag,
  Typography,
  Image,
  notification,
  Modal,
  Select,
  Form,
  message,
} from "antd";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { Share } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { JobApi } from "../../services/modules/jobServices";
import { useEffect, useState } from "react";
import moment from "moment";
import "./styles.css";
import { API_APPLICATION } from "../../services/modules/ApplicationServices";
import { API_FAVORITE_JOB } from "../../services/modules/FavoriteJobServices";
import TextArea from "antd/es/input/TextArea";
import { CV_API } from "../../services/modules/CvServices";
import { useForm } from "antd/es/form/Form";
import parse from 'html-react-parser';
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
  job_contract_type: string;
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
  const [cvUser, setCvUser] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [like, setLike] = useState<any>();
  const [selectedCV,setSelectedCV]=useState<string>('')
  const url = useParams();
  const { id } = useParams();
  const [coverLetter, setCoverLetter] = useState<string>("");
  const [form]=useForm()
  const handleGetDetail = async () => {
    try {
      const res = await JobApi.getJobById(id + "", userDetail?.access_token);
      if (res.data) {
        setJobDetail(res.data);
      }
    } catch (error) {}
  };
  const handleCvChange = (value)=>{
    setSelectedCV(value)
  }
  const handleGetCV = async () => {
    try {
      const params = {
        current: 1,
        pageSize: 30,
        query: {
          user_id: userDetail?.id,
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
  useEffect(() => {
    handleGetCV();
    handleGetDetail();
    getFavoriteJobDetailByUserId();
  }, []);

  const handleOpenModel = async () => {
    if(!userDetail?.access_token){
        navigate('/login')
        return;
    }
    setIsModalOpen(true);
  };

  const onAppliedJob = async () => {
    if(selectedCV.trim() === ""){
      message.error("Vui lòng chọn cv!")
      return;
    }
    if(coverLetter.trim() === ""){
      message.error("Vui lòng nhập thư ứng tuyển!")
      return;
    }

    if (userDetail?.access_token) {
      const params = {
        user_id: userDetail?.id,
        employer_id: jobDetail?.user_id?._id,
        job_id: jobDetail?._id,
        cover_letter: coverLetter,
        cv_id:selectedCV
      };

      const res = await API_APPLICATION.createApplication(
        params,
        userDetail?.access_token
      );
      if (res.data) {
        notification.success({
          message: "Thông báo",
          description: "Ứng tuyển thành công",
        });
        handleGetDetail();
        setIsModalOpen(false)
      }
    } else {
      navigate("/login");
    }
  };
  const handleCreateCV = () => {
    if(!userDetail?.access_token){
      navigate('/login')
      return;
  }
    navigate("/profile-cv");
  };
  const getFavoriteJobDetailByUserId = async () => {
    try {
      const params = {
        user_id: userDetail?.id,
        job_id: url?.id,
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
  const onLike = async () => {
    try {
      const params = {
        user_id: userDetail?.id,
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
                {`${jobDetail?.address ? `${jobDetail?.address}, ` : ""}${
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
        <div className="flex  flex-col gap-4">
          <div className="flex space-x-4 justify-end">
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
            <div className="hover:scale-110 transform transition-transform duration-200 cursor-pointer">
              <Share />
            </div>
          </div>

          {new Date(jobDetail?.expire_date) < new Date() ? (
            <Button disabled className="py-5 px-6 rounded-full">
              Đã hết hạn
            </Button>
          ) : jobDetail?.candidate_ids.includes(userDetail?.id) ? (
            <Button disabled className="py-5 px-6 rounded-full">
              Đã ứng tuyển
            </Button>
          ) : (
            <Button
              className="!bg-primaryColorH text-white font-semibold py-5 px-6 rounded-full shadow-md hover:bg-primaryColorDark transition-all duration-300"
              onClick={handleOpenModel}
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
                    {parse(jobDetail?.user_id?.description || '') }
                  </Paragraph>
                  {jobDetail?.user_id?.organization?.company_vision &&  <Paragraph>
                    {parse(jobDetail?.user_id?.organization?.company_vision || '') }
                  </Paragraph>}
                  <div>Năm thành lập: {jobDetail?.user_id?.organization?.year_of_establishment}</div>
                <div>Loại ngành nghề: {jobDetail?.user_id?.organization?.industry_type}</div>
                <div>Số lượng nhân sự: {jobDetail?.user_id?.organization?.team_size}</div>
                  <div>
                    <div>Liên kết của công ty</div>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                    {jobDetail?.user_id?.social_links?.map((link, idx) => (
                      <li key={idx}>
                        <a  target="_blank" href={`${link.url}`}>{link.type}</a>
                      </li>
                    ))}
                </ul>
                  </div>
                  {/* <div className="grid grid-cols-3 gap-4">
                    <Image
                      src={`${jobDetail?.user_id?.avatar_company}`}
                      alt="Company image 1"
                      width={200}
                      height={200}
                      className="rounded"
                    />
                    <Image
                      src={`${jobDetail?.user_id?.avatar_company}`}
                      alt="Company image 2"
                      width={200}
                      height={200}
                      className="rounded"
                    />
                    <Image
                      src={`${jobDetail?.user_id?.avatar_company}`}
                      alt="Company image 3"
                      width={200}
                      height={200}
                      className="rounded"
                    />
                  </div> */}
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
                {!jobDetail?.min_experience ? (
                  <Text strong>Không yêu cầu</Text>
                ) : (
                  <Text strong>Từ {jobDetail?.min_experience} năm</Text>
                )}
              </div>
              <div>
                <Text className="text-gray-500 block">Cấp bậc</Text>
                {!jobDetail?.level ? (
                  <Text strong>Không yêu cầu</Text>
                ) : (
                  <Text strong>
                    {jobDetail?.level?.name.toLocaleUpperCase()}
                  </Text>
                )}
              </div>
              <div>
                <Text className="text-gray-500 block">Loại hình</Text>
                {!jobDetail?.type_of_work ? (
                  <Text strong>Không yêu cầu</Text>
                ) : (
                  <Text strong>
                    {/* {jobDetail?.type_of_work?.name.toLocaleUpperCase()} */}
                  </Text>
                )}
              </div>
              <div>
                <Text className="text-gray-500 block">Loại hợp đồng</Text>
                {!jobDetail?.job_contract_type ? (
                  <Text strong>Không yêu cầu</Text>
                ) : (
                  <Text strong>
                    {jobDetail?.job_contract_type?.name.toLocaleUpperCase()}
                  </Text>
                )}
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
            {!jobDetail?.interview_process.length > 0 && (
              <Text strong>Không yêu cầu</Text>
            )}
          </Card>
        </div>
      </div>
      <Modal
        title={`Apply Job: ${jobDetail?.title}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={false}
      >
         <Form form={form}layout="vertical">
      <div className="space-y-4 py-4">
        {/* CV Selection */}
        <div>
          <Form.Item
            label={'Chọn cv'}
            name="cv"
            rules={[{ required: true, message: 'Vui lòng chọn một CV!' }]}
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
            label={'Thư giới thiệu'}
            name="coverLetter"
            rules={[{ required: true, message: 'Vui lòng nhập thư giới thiệu!' }]}
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

      <Button
        type="primary"
        onClick={onAppliedJob}
      >
        Apply Now
      </Button>
    </Form>
      </Modal>
    </div>
  );
}
