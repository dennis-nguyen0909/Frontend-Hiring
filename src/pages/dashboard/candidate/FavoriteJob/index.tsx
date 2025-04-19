import { Button, Table, Image, Spin } from "antd";
import { CheckCircle, CircleCheck, CircleX, Eye, MapPin } from "lucide-react";
import { API_FAVORITE_JOB } from "../../../../services/modules/FavoriteJobServices";
import { useSelector } from "react-redux";
import { useState } from "react";
import CustomPagination from "../../../../components/ui/CustomPanigation/CustomPanigation";
import { useNavigate } from "react-router-dom";
import { isExpired, formatCurrency } from "../../../../untils";
import avatarDefault from "../../../../assets/avatars/avatar-default.jpg";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useMomentFn from "../../../../hooks/useMomentFn";
import { FaBookmark } from "react-icons/fa6";

interface JobApplication {
  _id: string;
  user_id: string;
  job_id: {
    _id: string;
    title: string;
    salary_range_min: number;
    salary_range_max: number;
    type_money: { symbol: string };
    is_negotiable: boolean;
    expire_date: string;
    job_type: { name: string };
    city_id: { name: string };
    district_id: { name: string };
    user_id: { avatar_company: string };
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

interface RootState {
  user: {
    _id: string;
    access_token: string;
    favorite_jobs: Array<{ job_id: string }>;
  };
}

interface FavoriteJob {
  job_id: string;
}

interface QueryParams {
  current: number;
  pageSize: number;
  query: { user_id: string };
}

const FavoriteJob = () => {
  const { t } = useTranslation();
  const userDetail = useSelector((state: RootState) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const fetchFavoriteJobs = async ({
    current,
    pageSize,
  }: {
    current: number;
    pageSize: number;
  }) => {
    const params: QueryParams = {
      current,
      pageSize,
      query: { user_id: userDetail?._id },
    };
    const res = await API_FAVORITE_JOB.getAllJobFavorite(
      params,
      userDetail?.access_token
    );
    return res.data;
  };
  const { formatDate } = useMomentFn();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["favoriteJobs", currentPage, pageSize, userDetail?._id],
    queryFn: () => fetchFavoriteJobs({ current: currentPage, pageSize }),
    enabled: !!userDetail?._id,
  });

  const favoriteMutation = useMutation({
    mutationFn: async ({
      jobId,
      jobTitle,
    }: {
      jobId: string;
      jobTitle: string;
    }) => {
      const params = { user_id: userDetail?._id, job_id: jobId, jobTitle };
      return await API_FAVORITE_JOB.createFavoriteJobs(
        params,
        userDetail?.access_token
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favoriteJobs"] });
    },
  });

  const handleFavorite = async (jobId: string, jobTitle: string) => {
    favoriteMutation.mutate({ jobId, jobTitle });
  };

  const columns = [
    {
      title: t("job"),
      dataIndex: "title",
      key: "title",
      render: (text: string, record: JobApplication) => (
        <div className="flex items-center gap-4">
          <Image
            width={60}
            height={60}
            className="shadow-md !object-contain rounded-lg border-gray-200 hover:scale-105 transition-transform duration-300"
            src={record?.job_id?.user_id?.avatar_company || avatarDefault}
            fallback={avatarDefault}
            preview={false}
          />
          <div className="flex flex-col gap-1">
            <div className="flex flex-row items-center justify-start gap-4">
              <h3 className="font-semibold text-[14px] text-gray-900">
                {record?.job_id === null
                  ? t("job_not_exist")
                  : record?.job_id?.title}
              </h3>
              {record?.job_id?.job_type?.key && (
                <h3 className="px-3 py-1 rounded-full text-[10px] font-medium bg-blue-50 text-blue-600 border-blue-100 shadow-sm hover:bg-blue-100 transition-colors duration-200">
                  {t(record?.job_id?.job_type?.key)}
                </h3>
              )}
              {record?.job_id?.expire_date && (
                <h3
                  className={`px-3 py-1 rounded-full text-[10px] font-medium ${
                    isExpired(record?.job_id?.expire_date)
                      ? "bg-red-50 text-red-600 border-red-100"
                      : "bg-blue-50 text-blue-600 border-blue-100"
                  } shadow-sm hover:bg-blue-100 transition-colors duration-200`}
                >
                  {isExpired(record?.job_id?.expire_date)
                    ? t("expired")
                    : formatDate(record?.job_id?.expire_date)}
                </h3>
              )}
            </div>
            <div className="flex items-center gap-4">
              {record?.job_id?.is_negotiable ? (
                <span className="text-[14px] text-gray-600">
                  {t("salary")}: {t("negotiable")}
                </span>
              ) : (
                <div>
                  {record?.job_id?.salary_range_min !== undefined &&
                    record?.job_id?.salary_range_max !== undefined && (
                      <span className="text-[12px] text-gray-600">
                        {t("salary")}:{" "}
                        {formatCurrency(record?.job_id?.salary_range_min)}
                        {record?.job_id?.type_money?.symbol} -{" "}
                        {formatCurrency(record?.job_id?.salary_range_max)}
                        {record?.job_id?.type_money?.symbol}
                      </span>
                    )}
                </div>
              )}
              {record?.job_id?.city_id?.name && (
                <div className="flex items-center gap-1">
                  <MapPin size={14} color="#6b7280" />
                  <span className="text-[12px] text-gray-600">
                    {record?.job_id?.district_id?.name},{" "}
                    {record?.job_id?.city_id?.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ),
      className: "min-w-[400px] text-[14px]",
    },
    {
      title: t("status"),
      key: "status",
      render: (record: JobApplication) => {
        if (record?.job_id === null) return null;

        const expireDate = record?.job_id?.expire_date
          ? new Date(record?.job_id?.expire_date)
          : null;
        const isExpired = expireDate && expireDate < new Date();
        const daysRemaining = expireDate
          ? Math.ceil(
              (expireDate.getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24)
            )
          : 0;
        return (
          <div className="flex items-center gap-2">
            <span>
              {isExpired ? (
                <CircleX className="text-red-500" size={14} />
              ) : (
                <CircleCheck size={14} className="text-blue-600" />
              )}
            </span>
            {expireDate && (
              <h3
                className={`px-3 py-1 rounded-full text-[10px] font-medium ${
                  isExpired
                    ? "bg-red-50 text-red-600 border-red-100"
                    : "bg-blue-50 text-blue-600 border-blue-100"
                } shadow-sm hover:bg-blue-100 transition-colors duration-200`}
              >
                {isExpired
                  ? t("expired")
                  : `${daysRemaining} ${t("days_remaining")}`}
              </h3>
            )}
          </div>
        );
      },
    },
    {
      key: "action",
      render: (record: JobApplication) => {
        if (record?.job_id === null) return null;

        const expireDate = record?.job_id?.expire_date
          ? new Date(record?.job_id?.expire_date)
          : null;
        const isExpired = expireDate && expireDate < new Date();

        return (
          <div className="flex justify-start items-center gap-4">
            <FaBookmark
              onClick={() =>
                handleFavorite(record?.job_id?._id, record?.job_id?.title)
              }
              size={18}
              className="text-primaryColor hover:scale-110 transform transition-transform duration-200 cursor-pointer"
            />
            {isExpired ? (
              <Button
                onClick={() =>
                  navigate(`/job-information/${record?.job_id?._id}`)
                }
                size="small"
                type="primary"
                className="!bg-blue-500 hover:!bg-blue-600 text-[14px] font-medium transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg rounded-md px-2 py-1 flex items-center gap-1"
              >
                <Eye className="w-3 h-3" />
                {t("view_detail")}
              </Button>
            ) : (
              <Button
                onClick={() =>
                  navigate(`/job-information/${record?.job_id?._id}`)
                }
                size="small"
                type="primary"
                className="!bg-blue-500 hover:!bg-blue-600 text-[14px] font-medium transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg rounded-md px-2 py-1 flex items-center gap-1"
              >
                <CheckCircle className="w-3 h-3" />
                {t("apply_now")}
              </Button>
            )}
          </div>
        );
      },
      className: "min-w-[200px] text-[14px]",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip={isFetching ? t("caching") : t("loading")} />
      </div>
    );
  }

  return (
    <div className="">
      <h1 className="text-[20px] font-semibold mb-6">
        {t("favorite_job")} ({data?.items?.length || 0})
      </h1>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table
          columns={columns}
          dataSource={data?.items}
          pagination={false}
          className="sm:w-full w-auto"
        />
      </div>

      <div className="mt-4 flex justify-center">
        <CustomPagination
          currentPage={data?.meta?.current_page || 1}
          total={data?.meta?.total || 0}
          perPage={data?.meta?.per_page || 10}
          onPageChange={(current, pageSize) => {
            setCurrentPage(current);
            setPageSize(pageSize);
          }}
        />
      </div>
    </div>
  );
};

export default FavoriteJob;
