import { Avatar, Button, Image, Table, Spin } from "antd";
import { useEffect, useState } from "react";
import {
  Bookmark,
  BriefcaseBusiness,
  Check,
  Circle,
  CircleX,
  Eye,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useCalculateUserProfile from "../../../../hooks/useCaculateProfile";
import useMomentFn from "../../../../hooks/useMomentFn";
import { useTranslation } from "react-i18next";
import ViewAllLink from "../../../../components/ViewAll/ViewAll";
import { formatCurrency } from "../../../../untils";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { API_APPLICATION } from "../../../../services/modules/ApplicationServices";
import { API_FAVORITE_JOB } from "../../../../services/modules/FavoriteJobServices";
import { USER_API } from "../../../../services/modules/userServices";

interface UserDetail {
  _id: string;
  access_token: string;
  full_name: string;
  avatar: string;
}

interface OverViewCandidateProps {
  userDetail: UserDetail;
  onViewAppliedJob: () => void;
  handleViewFavoriteJob: () => void;
  handleViewedJob: () => void;
}

interface JobRecord {
  _id: string;
  job_id?: {
    _id: string;
    title: string;
    city_id?: { name: string };
    salary_range_min?: number;
    salary_range_max?: number;
    type_money?: { symbol: string };
    job_type?: { name: string };
    expire_date?: string;
    is_negotiable?: boolean;
  };
  employer_id?: { avatar_company: string };
  applied_date: string;
  status: string;
}

interface TableRecord {
  key: string;
  job: string;
  jobId?: string;
  location?: string;
  salary_range_min?: number;
  salary_range_max?: number;
  type_money?: string;
  job_type?: string;
  expire_date?: string;
  dateApplied: string;
  status: string;
  icon?: string;
  is_negotiable?: boolean;
}

interface AppliedCountResponse {
  data: string;
}

interface FavoriteCountResponse {
  data: number;
}

interface ViewedJobsCountResponse {
  data: number;
}

const OverViewCandidate = ({
  userDetail,
  onViewAppliedJob,
  handleViewFavoriteJob,
  handleViewedJob,
}: OverViewCandidateProps) => {
  const { formatDate, dateFormat } = useMomentFn();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: caculateProfile } = useCalculateUserProfile(
    userDetail?._id,
    userDetail?.access_token
  );

  const recentlyAppliedColumns = [
    {
      title: t("job"),
      dataIndex: "job",
      key: "job",
      render: (text: string, record: TableRecord) => (
        <div className="flex items-center gap-4">
          <Image
            width={60}
            height={60}
            className="shadow-md !object-contain rounded-lg  border-gray-200 hover:scale-105 transition-transform duration-300"
            src={record.icon}
            fallback="https://via.placeholder.com/60"
            preview={false}
          />
          <div className="flex flex-col gap-1">
            <div className="flex flex-row items-center justify-start gap-4">
              <h3 className="font-semibold text-[14px] text-gray-900">
                {text}
              </h3>
              {record.job_type && (
                <h3 className="px-3 py-1 rounded-full text-[10px] font-medium bg-blue-50 text-blue-600  border-blue-100 shadow-sm hover:bg-blue-100 transition-colors duration-200">
                  {t(record.job_type)}
                </h3>
              )}
              {record?.expire_date && (
                <h3
                  className={`px-3 py-1 rounded-full text-[10px] font-medium ${
                    new Date(record.expire_date) < new Date()
                      ? "bg-red-50 text-red-600 border-red-100"
                      : "bg-blue-50 text-blue-600 border-blue-100"
                  } shadow-sm hover:bg-blue-100 transition-colors duration-200`}
                >
                  {new Date(record.expire_date) < new Date()
                    ? t("expired")
                    : formatDate(record.expire_date)}
                </h3>
              )}
            </div>
            <div className="flex items-center gap-4">
              {record?.is_negotiable ? (
                <span className="text-[12px] text-gray-600">
                  {t("salary")}: {t("negotiable")}
                </span>
              ) : (
                <div>
                  {record.salary_range_min !== undefined &&
                    record.salary_range_max !== undefined && (
                      <span className="text-[12px] text-gray-600">
                        {t("salary")}: {formatCurrency(record.salary_range_min)}
                        {record.type_money} -{" "}
                        {formatCurrency(record.salary_range_max)}
                        {record.type_money}
                      </span>
                    )}
                </div>
              )}
              {record.location && (
                <div className="flex items-center gap-1">
                  <MapPin size={14} color="#6b7280" />
                  <span className="text-[12px] text-gray-600">
                    {record.location}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ),
      className: "min-w-[200px] text-[12px]",
    },
    {
      title: t("date_applied"),
      dataIndex: "dateApplied",
      key: "dateApplied",
      className: "min-w-[150px] text-[12px]",
      render: (dateApplied: string) => (
        <div className="text-[12px]">{formatDate(dateApplied)}</div>
      ),
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (text: string) => (
        <div className="flex items-center gap-2">
          <span>
            {text === "Pending" ? (
              <Circle size={14} className="text-yellow-500" />
            ) : text === "Rejected" ? (
              <CircleX className="text-red-500" size={14} />
            ) : (
              <Check size={16} color="#2ca547" absoluteStrokeWidth />
            )}
          </span>
          <span
            className={`${
              text === "Pending"
                ? "text-yellow-500"
                : text === "Rejected"
                ? "text-red-500"
                : "text-green-500"
            } text-[14px]`}
          >
            {text}
          </span>
        </div>
      ),
      className: "min-w-[120px] text-[12px]",
    },
    {
      title: t("action"),
      key: "action",
      render: (record: TableRecord) => (
        <Button
          onClick={() => navigate(`/job-information/${record.jobId}`)}
          size="small"
          type="primary"
          className="!bg-blue-500 hover:!bg-blue-600 text-[14px] font-medium transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg rounded-md px-2 py-1 flex items-center gap-1"
        >
          <Eye className="w-3 h-3" />
          {t("view_detail")}
        </Button>
      ),
      className: "min-w-[120px] text-[14px]",
    },
  ];

  const [countApplied, setCountApplied] = useState(0);
  const [endValue, setEndValue] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [endFavoriteValue, setEndFavoriteValue] = useState(0);
  const [viewedJobsCount, setViewedJobsCount] = useState(0);
  const [endViewedJobsValue, setEndViewedJobsValue] = useState(0);

  const appliedCountOptions: UseQueryOptions<AppliedCountResponse> = {
    queryKey: ["appliedCount", userDetail?._id],
    queryFn: () =>
      API_APPLICATION.getCountAppliedCandidate(
        userDetail?._id,
        userDetail?.access_token
      ),
    enabled: !!userDetail?._id,
  };

  const favoriteCountOptions: UseQueryOptions<FavoriteCountResponse> = {
    queryKey: ["favoriteCount", userDetail?._id],
    queryFn: () =>
      API_FAVORITE_JOB.countFavoriteJobOfCandidate(
        userDetail?._id,
        userDetail?.access_token
      ),
    enabled: !!userDetail?._id,
  };

  const viewedJobsCountOptions: UseQueryOptions<ViewedJobsCountResponse> = {
    queryKey: ["viewedJobsCount", userDetail?._id],
    queryFn: () =>
      USER_API.countViewedJobsOfCandidate(
        userDetail?._id,
        userDetail?.access_token
      ),
    enabled: !!userDetail?._id,
  };

  const { data: appliedCountData, isLoading: isCountLoading } =
    useQuery<AppliedCountResponse>(appliedCountOptions);

  const { data: favoriteCountData, isLoading: isFavoriteCountLoading } =
    useQuery<FavoriteCountResponse>(favoriteCountOptions);

  const { data: viewedJobsCountData, isLoading: isViewedJobsCountLoading } =
    useQuery<ViewedJobsCountResponse>(viewedJobsCountOptions);

  useEffect(() => {
    if (appliedCountData?.data) {
      setEndValue(+appliedCountData.data);
      setCountApplied(0);
    }
  }, [appliedCountData]);

  useEffect(() => {
    if (favoriteCountData?.data) {
      setEndFavoriteValue(favoriteCountData.data);
      setFavoriteCount(0);
    }
  }, [favoriteCountData]);

  useEffect(() => {
    if (viewedJobsCountData?.data) {
      setEndViewedJobsValue(viewedJobsCountData.data);
      setViewedJobsCount(endViewedJobsValue);
    }
  }, [viewedJobsCountData]);

  const { data: jobsApplied = [], isLoading: isJobsLoading } = useQuery({
    queryKey: ["recentAppliedJobs", userDetail?._id],
    queryFn: () =>
      API_APPLICATION.getTop5RecentApplied(
        userDetail?._id,
        userDetail?.access_token
      ),
    enabled: !!userDetail?._id,
    select: (res) => {
      if (!res?.data) return [];
      return res.data.map((item: JobRecord) => {
        if (!item?.job_id) {
          return {
            key: item?._id,
            job: t("job_not_exist"),
            location: "",
            dateApplied: new Date(item?.applied_date)?.toLocaleString(),
            status:
              item?.status?.charAt(0)?.toUpperCase() + item?.status?.slice(1),
            icon: item?.employer_id?.avatar_company,
            is_negotiable: false,
          };
        }
        return {
          key: item?._id,
          jobId: item?.job_id?._id,
          job: item?.job_id?.title,
          location: `${item?.job_id?.city_id?.name}`,
          salary_range_min: item?.job_id?.salary_range_min,
          salary_range_max: item?.job_id?.salary_range_max,
          type_money: item?.job_id?.type_money?.symbol,
          job_type: item?.job_id?.job_type?.key,
          expire_date: item?.job_id?.expire_date,
          dateApplied: new Date(item?.applied_date)?.toLocaleString(),
          status:
            item?.status?.charAt(0)?.toUpperCase() + item?.status?.slice(1),
          icon: item?.employer_id?.avatar_company,
          is_negotiable: item?.job_id?.is_negotiable,
        };
      });
    },
  });

  useEffect(() => {
    if (countApplied >= endValue || endValue === 0) return;
    const duration = 500;
    const intervalTime = duration / (endValue - countApplied);
    const interval = setInterval(() => {
      setCountApplied((prevCount) => {
        const newCount = prevCount + 1;
        if (newCount >= endValue) {
          clearInterval(interval);
          return endValue;
        }
        return newCount;
      });
    }, intervalTime);
    return () => clearInterval(interval);
  }, [countApplied, endValue]);

  useEffect(() => {
    if (favoriteCount >= endFavoriteValue || endFavoriteValue === 0) return;
    const duration = 500;
    const intervalTime = duration / (endFavoriteValue - favoriteCount);
    const interval = setInterval(() => {
      setFavoriteCount((prevCount) => {
        const newCount = prevCount + 1;
        if (newCount >= endFavoriteValue) {
          clearInterval(interval);
          return endFavoriteValue;
        }
        return newCount;
      });
    }, intervalTime);
    return () => clearInterval(interval);
  }, [favoriteCount, endFavoriteValue]);

  useEffect(() => {
    if (viewedJobsCount >= endViewedJobsValue || endViewedJobsValue === 0)
      return;
    const duration = 500;
    const intervalTime = duration / (endViewedJobsValue - viewedJobsCount);
    const interval = setInterval(() => {
      setViewedJobsCount((prevCount) => {
        const newCount = prevCount + 1;
        if (newCount >= endViewedJobsValue) {
          clearInterval(interval);
          return endViewedJobsValue;
        }
        return newCount;
      });
    }, intervalTime);
    return () => clearInterval(interval);
  }, [viewedJobsCount, endViewedJobsValue]);

  if (
    isCountLoading ||
    isJobsLoading ||
    isFavoriteCountLoading ||
    isViewedJobsCountLoading
  ) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip={t("loading")} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1">
        {t("hello")}, {userDetail?.full_name}
      </h1>
      <p className="text-gray-500 mb-6 text-[12px]">
        {t("this_is_the_daily_activity_and_job_notification_of_you")}
      </p>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div
          className="bg-blue-50 p-4 rounded-lg relative border border-blue-100 hover:bg-blue-100 hover:border-blue-200 hover:scale-105 transition-all duration-300 cursor-pointer group"
          onClick={onViewAppliedJob}
        >
          <div className="text-[18px] font-bold group-hover:text-blue-700">
            {countApplied || 0}
          </div>
          <div className="text-blue-600 text-[12px] group-hover:text-blue-700">
            {t("job_applied")}
          </div>
          <div className="absolute bottom-4 right-4 bg-white p-2 rounded-lg transform scale-110 shadow-lg group-hover:shadow-2xl group-hover:scale-125 transition-all duration-300 border border-blue-100 group-hover:border-blue-200">
            <BriefcaseBusiness color="#4584c8" absoluteStrokeWidth />
          </div>
        </div>
        <div
          className="bg-yellow-50 p-4 rounded-lg relative border border-yellow-100 hover:bg-yellow-100 hover:border-yellow-200 hover:scale-105 transition-all duration-300 cursor-pointer group"
          onClick={handleViewFavoriteJob}
        >
          <div className="text-[18px] font-bold group-hover:text-yellow-700">
            {favoriteCount || 0}
          </div>
          <div className="text-yellow-600 text-[12px] group-hover:text-yellow-700">
            {t("favorite_job")}
          </div>
          <div className="absolute bottom-4 right-4 bg-white p-2 rounded-lg transform scale-110 shadow-lg group-hover:shadow-2xl group-hover:scale-125 transition-all duration-300">
            <Bookmark color="#feb536" absoluteStrokeWidth />
          </div>
        </div>
        <div
          onClick={handleViewedJob}
          className="bg-green-50 p-4 rounded-lg relative border border-green-100 hover:bg-green-100 hover:border-green-200 hover:scale-105 transition-all duration-300 cursor-pointer group"
        >
          <div className="text-[18px] font-bold group-hover:text-green-700">
            {viewedJobsCount || 0}
          </div>
          <div className="text-green-600 text-[12px] group-hover:text-green-700">
            {t("job_seen")}
          </div>
          <div className="absolute bottom-4 right-4 bg-white p-2 rounded-lg transform scale-110 shadow-lg group-hover:shadow-2xl group-hover:scale-125 transition-all duration-300">
            <Eye color="#2ca547" absoluteStrokeWidth />
          </div>
        </div>
      </div>

      {+caculateProfile < 100 && (
        <div className="bg-[#e05051] p-4 rounded-lg flex flex-col sm:flex-row items-center mb-6">
          <Avatar size={50} src={userDetail?.avatar} />
          <div className="flex-1 ml-3">
            <h3 className="font-semibold text-white text-[12px] text-center lg:text-left">
              {t("your_profile_is_not_complete")}
            </h3>
            <p className="text-white text-[12px] text-center lg:text-left">
              {t("complete_your_profile_and_build_your_resume")}
            </p>
          </div>
          <Button
            onClick={() => navigate(`/profile/${userDetail?._id}`)}
            type="primary"
            className="mt-4 sm:mt-0 !bg-white !text-[#e05051] !border-red-500 !hover:bg-red-50 !text-[12px]"
          >
            {t("update_now")}
          </Button>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[16px] font-semibold">
          {t("recently_applied_job")}
        </h2>
        <div onClick={onViewAppliedJob}>
          <ViewAllLink />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <Table
            className="text-[12px] w-full"
            columns={recentlyAppliedColumns}
            dataSource={jobsApplied}
            pagination={false}
            scroll={{ x: "max-content" }}
            components={{
              header: {
                cell: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
                  <th {...props} style={{ backgroundColor: "#f0f2f4" }} />
                ),
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default OverViewCandidate;
