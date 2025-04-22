import { Check } from "lucide-react";
import {
  Button,
  Card,
  Form,
  Modal,
  notification,
  Select,
  Spin,
  Tag,
} from "antd";
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
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import { API_FAVORITE_JOB } from "../../services/modules/FavoriteJobServices";
import useMomentFn from "../../hooks/useMomentFn";
import { useTranslation } from "react-i18next";
import CustomAvatar from "../../components/CustomAvatar/CustomAvatar";
import { formatCurrencyWithSymbol } from "../../untils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface CV {
  _id: string;
  cv_name: string;
  cv_link: string;
}

export default function JobPosting() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { formatDate } = useMomentFn();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [form] = useForm();
  const navigate = useNavigate();
  const [selectedCV, setSelectedCV] = useState<CV | null>(null);
  const [like, setLike] = useState<any>();
  const [coverLetter, setCoverLetter] = useState<string>("");
  const { id } = useParams();
  const userDetail = useSelector((state: RootState) => state.user);

  // Fetch job details
  const { data: jobData, isLoading: isJobLoading } = useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      const res = await JobApi.getJobById(
        id + "",
        userDetail?.access_token,
        userDetail?._id
      );
      return res.data;
    },
    enabled: !!id && !!userDetail?.access_token,
  });

  // Fetch CVs
  const { data: cvData, isLoading: isCVLoading } = useQuery({
    queryKey: ["cvs", userDetail?._id],
    queryFn: async () => {
      const params = {
        current: 1,
        pageSize: 30,
        query: {
          user_id: userDetail?._id,
        },
      };
      const res = await CV_API.getAll(params, userDetail?.access_token);
      return res.data.items;
    },
    enabled: !!userDetail?._id && !!userDetail?.access_token,
  });

  const { data: favoriteJobDetail, isLoading: isFavoriteJobDetailLoading } =
    useQuery({
      queryKey: ["favoriteJobDetail", id],
      queryFn: async () => {
        const res = await API_FAVORITE_JOB.getFavoriteJobDetailByUserId(
          {
            user_id: userDetail?._id,
            job_id: id,
          },
          userDetail?.access_token
        );
        if (res.data) {
          setLike(res.data);
        } else {
          setLike(null);
        }
      },
      enabled: !!userDetail?._id && !!userDetail?.access_token,
    });

  // Apply for job mutation
  const applyJobMutation = useMutation({
    mutationFn: async (params: any) => {
      return await API_APPLICATION.createApplication(
        params,
        userDetail?.access_token
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job", id] });
      toast.success(t("apply_successfully"));
      setIsModalOpen(false);
    },
  });

  // Like job mutation
  const likeJobMutation = useMutation({
    mutationFn: async (params: any) => {
      return await API_FAVORITE_JOB.createFavoriteJobs(
        params,
        userDetail?.access_token
      );
    },
    onSuccess: (res) => {
      if (+res.statusCode === 201) {
        setLike((prevLike) => ({
          ...prevLike,
          _id: prevLike?._id ? null : res?.data?._id,
        }));
        if (res?.data?.length === 0) {
          notification.success({
            message: t("notification"),
            description: t("you_removing_one_job"),
          });
        }
        if (res?.data?._id) {
          notification.success({
            message: t("notification"),
            description: (
              <span>
                {t("you_have_successfully_saved_your_job")}{" "}
                <a
                  onClick={() =>
                    navigate("/dashboard/candidate?activeTab=favoriteJobs")
                  }
                  className="text-blue-500 hover:text-blue-600 cursor-pointer"
                >
                  {t("view_job_saved")}
                </a>
              </span>
            ),
          });
        }
      }
    },
  });

  const handleCvChange = (value: string) => {
    const selected = cvData?.find((cv) => cv._id === value);
    setSelectedCV(selected || null);
  };

  const onAppliedJob = async () => {
    if (!selectedCV) {
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
        employer_id: jobData?.user_id?._id,
        job_id: jobData?._id,
        cover_letter: coverLetter,
        cv_id: selectedCV._id,
        cv_link: selectedCV.cv_link,
        cv_name: selectedCV.cv_name,
      };

      applyJobMutation.mutate(params);
    } else {
      navigate("/login");
    }
  };

  const onLike = async () => {
    if (!jobData) return;

    const params = {
      user_id: userDetail?._id,
      job_id: jobData._id,
      jobTitle: jobData.title,
    };

    likeJobMutation.mutate(params);
  };

  if (isJobLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <CustomAvatar src={jobData?.user_id?.avatar_company} />
            <div>
              <h1 className="text-xl md:text-2xl font-bold">
                {jobData?.title}
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                {jobData?.user_id?.company_name} • {jobData?.district_id?.name},{" "}
                {jobData?.city_id?.name} • {t(jobData?.job_contract_type?.key)}
              </p>
              <p className="text-gray-600 text-sm md:text-base">
                {t("salary")}:{" "}
                {jobData?.is_negotiable
                  ? t("negotiable")
                  : jobData?.salary_range_min !== undefined &&
                    jobData?.type_money?.symbol
                  ? formatCurrencyWithSymbol(
                      jobData.salary_range_min,
                      jobData.type_money.code
                    )
                  : t("negotiable")}
                {!jobData?.is_negotiable &&
                  jobData?.salary_range_min !== undefined &&
                  jobData?.salary_range_max !== undefined &&
                  " - "}
                {!jobData?.is_negotiable &&
                jobData?.salary_range_max !== undefined &&
                jobData?.type_money?.symbol
                  ? formatCurrencyWithSymbol(
                      jobData.salary_range_max,
                      jobData.type_money.code
                    )
                  : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hover:scale-110 transform transition-transform duration-200 cursor-pointer">
              {like?._id ? (
                <FaBookmark
                  onClick={onLike}
                  size={20}
                  className="text-primaryColor"
                />
              ) : (
                <FaRegBookmark onClick={onLike} size={20} />
              )}
            </div>
            {new Date(jobData?.expire_date) < new Date() ? (
              <Button
                disabled
                className="py-2 px-4 md:py-5 md:px-6 rounded-full ![cursor:pointer] hover:[cursor:pointer] disabled:[cursor:pointer]"
              >
                {t("expired")}
              </Button>
            ) : jobData?.candidate_ids.includes(userDetail?._id) ? (
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
            {jobData?.description && (
              <Card className="p-6 bg-gray-100">
                <h2 className="text-xl font-bold mb-4">{t("description")}</h2>
                <p
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{ __html: jobData?.description }}
                ></p>
              </Card>
            )}

            {jobData?.professional_skills?.length > 0 && (
              <Card className="p-6 bg-white border border-gray-300">
                <h2 className="text-xl font-bold mb-4 text-black">
                  {t("professional_skills")}
                </h2>
                <ul className="space-y-3">
                  {jobData?.professional_skills?.map((requirement, index) => (
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
            {jobData?.job_responsibilities?.length > 0 && (
              <Card className="p-6 bg-gray-100">
                <h2 className="text-xl font-bold mb-4">
                  {t("responsibilities")}
                </h2>
                <ul className="space-y-3">
                  {jobData?.job_responsibilities?.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-black mt-1 flex-shrink-0" />

                      <span>{item?.responsibility}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {jobData?.general_requirements?.length > 0 && (
              <Card className="p-6 bg-gray-100">
                <h2 className="text-xl font-bold mb-4">
                  {t("better_if_have")}
                </h2>
                <ul className="space-y-3">
                  {jobData?.general_requirements?.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 ">
                      <Check className="h-5 w-5 text-black mt-1 flex-shrink-0" />
                      <span>{item?.requirement}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Perks & Benefits */}
            {jobData?.benefit?.length > 0 && (
              <Card className="p-6 bg-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-black">
                  {t("benefits")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobData?.benefit?.map((item, idx) => {
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
                      {jobData?.count_apply}
                    </span>
                  </div>
                </div>
                <InfoRow
                  label={t("application_deadline")}
                  value={formatDate(jobData?.expire_date)}
                />
                <InfoRow
                  label={t("posted_date")}
                  value={formatDate(jobData?.createdAt)}
                />
                <InfoRow
                  label={t("job_type")}
                  value={t(jobData?.job_contract_type?.key)}
                />
                {jobData?.salary_range_min &&
                jobData?.salary_range_max &&
                jobData?.is_negotiable ? (
                  <InfoRow
                    label={t("salary")}
                    value={`${jobData?.salary_range_min} - ${jobData?.salary_range_max}`}
                  />
                ) : (
                  <InfoRow label={t("salary")} value={t("negotiable")} />
                )}
                <InfoRow label={t("level")} value={jobData?.level?.name} />
                <InfoRow
                  label={t("job_type")}
                  value={t(jobData?.job_type?.key)}
                />
                <InfoRow
                  label={t("minimum_experience")}
                  value={jobData?.min_experience + " " + t("year")}
                />
                <InfoRow label={t("degree")} value={jobData?.degree?.name} />
              </div>
            </Card>

            {jobData?.skills?.length > 0 && (
              <Card className="p-6 bg-gray-100">
                <h2 className="text-xl font-bold mb-4">{t("skills")}</h2>
                <div className="flex gap-2 flex-wrap">
                  {jobData?.skills?.map((skill, idx) => {
                    return (
                      <Tag color={getRandomColor()} key={idx}>
                        {skill?.name}
                      </Tag>
                    );
                  })}
                </div>
              </Card>
            )}

            {jobData?.interview_process?.length > 0 && (
              <Card className="p-6 bg-gray-100">
                <h2 className="text-xl font-bold mb-4">
                  {t("interview_process")}
                </h2>
                <div className="flex flex-wrap gap-2 flex-col">
                  {jobData?.interview_process?.map((item, i) => (
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
        title={`${t("apply")}: ${jobData?.title}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={false}
      >
        <Form form={form} layout="vertical">
          <div className="space-y-4 py-4">
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
                  value={selectedCV?._id || undefined}
                  loading={isCVLoading}
                >
                  {cvData?.map((cv) => (
                    <Select.Option key={cv?._id} value={cv?._id}>
                      {cv?.cv_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

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

          <Button
            type="primary"
            onClick={onAppliedJob}
            loading={applyJobMutation.isPending}
          >
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
