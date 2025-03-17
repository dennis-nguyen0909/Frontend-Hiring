import { Check } from "lucide-react";
import { Avatar, Button, Card, Form, Modal, Select, Spin, Tag } from "antd";
import { useEffect, useState } from "react";
import { Job } from "../../types";
import { JobApi } from "../../services/modules/jobServices";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { useNavigate, useParams } from "react-router-dom";
import { getRandomColor } from "../../utils/color.utils";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import { API_APPLICATION } from "../../services/modules/ApplicationServices";
import { toast } from "react-toastify";
import { CV_API } from "../../services/modules/CvServices";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { API_FAVORITE_JOB } from "../../services/modules/FavoriteJobServices";
import useMomentFn from "../../hooks/useMomentFn";
import { useTranslation } from "react-i18next";
import CustomAvatar from "../../components/CustomAvatar/CustomAvatar";
import { formatCurrency, formatCurrencyWithSymbol } from "../../untils";

export default function JobPosting() {
  const { t } = useTranslation();
  const { formatDate } = useMomentFn();
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleGetDetail = async () => {
    try {
      setIsLoading(true);
      const res = await JobApi.getJobById(id + "", userDetail?.access_token);
      if (res.data) {
        setJobDetail(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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
      toast.error(t("please_select_cv"));
      return;
    }
    if (coverLetter.trim() === "") {
      toast.error(t("please_enter_cover_letter"));
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
        toast.success(t("apply_successfully"));
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
        jobTitle: jobDetail?.title,
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
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-white rounded-lg p-6 flex flex-col md:flex-row items-center justify-between mb-8">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <CustomAvatar src={jobDetail?.user_id?.avatar_company} />
              <div>
                <h1 className="text-xl md:text-2xl font-bold">
                  {jobDetail?.title}
                </h1>
                <p className="text-gray-600 text-sm md:text-base">
                  {jobDetail?.user_id?.company_name} •{" "}
                  {jobDetail?.district_id?.name}, {jobDetail?.city_id?.name} •{" "}
                  {t(jobDetail?.job_contract_type?.key)}
                </p>
                <p className="text-gray-600 text-sm md:text-base">
                  {t("salary")}:{" "}
                  {jobDetail?.is_negotiable
                    ? t("negotiable")
                    : jobDetail?.salary_range_min !== undefined &&
                      jobDetail?.type_money?.symbol
                    ? formatCurrencyWithSymbol(
                        jobDetail.salary_range_min,
                        jobDetail.type_money.code
                      )
                    : t("negotiable")}
                  {!jobDetail?.is_negotiable &&
                    jobDetail?.salary_range_min !== undefined &&
                    jobDetail?.salary_range_max !== undefined &&
                    " - "}
                  {!jobDetail?.is_negotiable &&
                  jobDetail?.salary_range_max !== undefined &&
                  jobDetail?.type_money?.symbol
                    ? formatCurrencyWithSymbol(
                        jobDetail.salary_range_max,
                        jobDetail.type_money.code
                      )
                    : ""}
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
                  <HeartOutlined
                    onClick={onLike}
                    style={{ fontSize: "24px" }}
                  />
                )}
              </div>
              {new Date(jobDetail?.expire_date) < new Date() ? (
                <Button
                  disabled
                  className="py-2 px-4 md:py-5 md:px-6 rounded-full ![cursor:pointer] hover:[cursor:pointer] disabled:[cursor:pointer]"
                >
                  {t("expired")}
                </Button>
              ) : jobDetail?.candidate_ids.includes(userDetail?._id) ? (
                <Button
                  disabled
                  className="bg-violet-600 hover:bg-violet-700 ![cursor:pointer] hover:[cursor:pointer] disabled:[cursor:pointer] py-2 px-4 md:py-5 md:px-6"
                >
                  {t("applied")}
                </Button>
              ) : (
                <Button
                  className="bg-violet-600 hover:bg-violet-700 cursor-pointer py-2 px-4 md:py-5 md:px-6"
                  onClick={() => setIsModalOpen(true)}
                >
                  {t("apply_now")}
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
                <h2 className="text-xl font-bold mb-4">{t("description")}</h2>
                <p
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{ __html: jobDetail?.description }}
                ></p>
              </Card>

              {jobDetail?.professional_skills?.length > 0 && (
                <Card className="p-6 bg-white border border-gray-300">
                  <h2 className="text-xl font-bold mb-4 text-black">
                    {t("professional_skills")}
                  </h2>
                  <ul className="space-y-3">
                    {jobDetail?.professional_skills?.map(
                      (requirement, index) => (
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
                      )
                    )}
                  </ul>
                </Card>
              )}

              {/* Responsibilities */}
              {jobDetail?.job_responsibilities?.length > 0 && (
                <Card className="p-6 bg-gray-100">
                  <h2 className="text-xl font-bold mb-4">
                    {t("responsibilities")}
                  </h2>
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
                  <h2 className="text-xl font-bold mb-4">
                    {t("better_if_have")}
                  </h2>
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
                    {t("benefits")}
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
                <h2 className="text-xl font-bold mb-4">
                  {t("about_this_position")}
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">
                        {t("number_of_hiring")}
                      </span>
                      <span className="text-gray-700">
                        {jobDetail?.count_apply}
                      </span>
                    </div>
                  </div>
                  <InfoRow
                    label={t("application_deadline")}
                    value={formatDate(jobDetail?.expire_date)}
                  />
                  <InfoRow
                    label={t("posted_date")}
                    value={formatDate(jobDetail?.createdAt)}
                  />
                  <InfoRow
                    label={t("job_type")}
                    value={t(jobDetail?.job_contract_type?.key)}
                  />
                  {jobDetail?.salary_range_min &&
                  jobDetail?.salary_range_max &&
                  jobDetail?.is_negotiable ? (
                    <InfoRow
                      label={t("salary")}
                      value={`${jobDetail?.salary_range_min} - ${jobDetail?.salary_range_max}`}
                    />
                  ) : (
                    <InfoRow label={t("salary")} value={t("negotiable")} />
                  )}
                  <InfoRow label={t("level")} value={jobDetail?.level?.name} />
                  <InfoRow
                    label={t("job_type")}
                    value={t(jobDetail?.job_type?.key)}
                  />
                  <InfoRow
                    label={t("minimum_experience")}
                    value={jobDetail?.min_experience + " " + t("year")}
                  />
                  <InfoRow
                    label={t("degree")}
                    value={jobDetail?.degree?.name}
                  />
                </div>
              </Card>

              {jobDetail?.skills?.length > 0 && (
                <Card className="p-6 bg-gray-100">
                  <h2 className="text-xl font-bold mb-4">{t("skills")}</h2>
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
                  <h2 className="text-xl font-bold mb-4">
                    {t("interview_process")}
                  </h2>
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
      )}
      <Modal
        title={`${t("apply")}: ${jobDetail?.title}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={false}
      >
        <Form form={form} layout="vertical">
          <div className="space-y-4 py-4">
            {/* CV Selection */}
            <div>
              <Form.Item
                label={t("choose_cv")}
                name="cv"
                rules={[{ required: true, message: t("please_select_cv") }]}
              >
                <Select
                  className="w-full"
                  placeholder={t("select")}
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
                label={t("cover_letter")}
                name="coverLetter"
                rules={[
                  { required: true, message: t("please_enter_cover_letter") },
                ]}
              >
                <TextArea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={4}
                  placeholder={t("write_down_your_biography")}
                  className="w-full"
                />
              </Form.Item>
            </div>
          </div>

          <Button type="primary" onClick={onAppliedJob}>
            {t("apply_now")}
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
