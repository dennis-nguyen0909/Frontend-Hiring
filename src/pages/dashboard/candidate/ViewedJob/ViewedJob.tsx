import { Button, Image, Table, Spin } from "antd";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Meta } from "../../../../types";
import CustomPagination from "../../../../components/ui/CustomPanigation/CustomPanigation";
import { Circle, CircleCheck, CircleX, MapPin, Eye } from "lucide-react";
import { capitalizeFirstLetter, formatCurrency } from "../../../../untils";
import useMomentFn from "../../../../hooks/useMomentFn";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { USER_API } from "../../../../services/modules/userServices";

interface Applied {
  _id: string;
  title: string;
  city_id: { name: string };
  salary_range_min?: number;
  salary_range_max?: number;
  type_money?: { symbol: string };
  job_type?: { name: string };
  expire_date?: string;
  is_negotiable?: boolean;
  user_id: { avatar_company: string };
}

interface AppliedResponse {
  items: Applied[];
  meta: Meta;
}

interface RootState {
  user: { _id: string; access_token: string };
}

const ViewedJob = () => {
  const userDetail = useSelector((state: RootState) => state.user);
  const [meta, setMeta] = useState<Meta>({
    current_page: 1,
    per_page: 10,
    total: 0,
    count: 0,
    total_pages: 0,
  });
  const { formatDate } = useMomentFn();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const queryOptions: UseQueryOptions<AppliedResponse> = {
    queryKey: ["viewedJobs", userDetail?._id, meta.current_page, meta.per_page],
    queryFn: async () => {
      const params = { current: meta.current_page, pageSize: meta.per_page };
      const res = await USER_API.getViewedJobs(
        userDetail?._id,
        params,
        userDetail?.access_token
      );
      return res.data;
    },
    enabled: !!userDetail?._id,
    keepPreviousData: true,
  };

  const { data, isLoading, isFetching } =
    useQuery<AppliedResponse>(queryOptions);

  useEffect(() => {
    if (data?.meta) setMeta(data.meta);
  }, [data?.meta]);

  const columns = [
    {
      title: t("job"),
      dataIndex: "job",
      key: "job",
      render: (text: string, record: Applied) => (
        <div className="flex items-center gap-4">
          <Image
            width={60}
            height={60}
            className="shadow-md !object-contain rounded-lg border-gray-200 hover:scale-105 transition-transform duration-300"
            src={record.user_id?.avatar_company}
            fallback="https://via.placeholder.com/60"
            preview={false}
          />
          <div className="flex flex-col gap-1">
            <div className="flex flex-row items-center justify-start gap-4">
              {record === null ? (
                <h3 className="font-semibold text-[14px] text-gray-900">
                  {t("job_not_exist")}
                </h3>
              ) : (
                <>
                  <h3 className="font-semibold text-[14px] text-gray-900">
                    {record.title}
                  </h3>
                  {record.job_type?.key && (
                    <h3 className="px-3 py-1 rounded-full text-[10px] font-medium bg-blue-50 text-blue-600 border-blue-100 shadow-sm hover:bg-blue-100 transition-colors duration-200">
                      {t(record.job_type?.key)}
                    </h3>
                  )}
                  {record.expire_date && (
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
                </>
              )}
            </div>
            <div className="flex items-center gap-4">
              {record.is_negotiable ? (
                <span className="text-[12px] text-gray-600">
                  {t("salary")}: {t("negotiable")}
                </span>
              ) : (
                <div>
                  {record.salary_range_min !== undefined &&
                    record.salary_range_max !== undefined && (
                      <span className="text-[12px] text-gray-600">
                        {t("salary")}: {formatCurrency(record.salary_range_min)}
                        {record.type_money?.symbol} -{" "}
                        {formatCurrency(record.salary_range_max)}
                        {record.type_money?.symbol}
                      </span>
                    )}
                </div>
              )}
              {record.city_id?.name && (
                <div className="flex items-center gap-1">
                  <MapPin size={14} color="#6b7280" />
                  <span className="text-[12px] text-gray-600">
                    {record.city_id?.name}
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
      render: (record: Applied) => (
        <div className="text-[12px]">{formatDate(record?.expire_date)}</div>
      ),
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (text: string) => (
        <div className="flex items-center gap-2">
          <span>
            {text === "pending" ? (
              <Circle size={14} className="text-yellow-500" />
            ) : text === "rejected" ? (
              <CircleX className="text-red-500" size={14} />
            ) : (
              <CircleCheck size={14} className="text-green-500" />
            )}
          </span>
          <span
            className={`${
              text === "pending"
                ? "text-yellow-500"
                : text === "rejected"
                ? "text-red-500"
                : "text-green-500"
            } text-[14px]`}
          >
            {capitalizeFirstLetter(text)}
          </span>
        </div>
      ),
      className: "min-w-[120px] text-[12px]",
    },
    {
      title: t("action"),
      key: "action",
      render: (record: Applied) => (
        <Button
          onClick={() => navigate(`/job-information/${record._id}`)}
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip={isFetching ? t("caching") : t("loading")} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-[20px] font-semibold mb-6">
        {t("job_seen")} ({data?.meta.total || 0})
      </h1>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table
          columns={columns}
          dataSource={data?.items}
          pagination={false}
          scroll={{ x: "max-content" }}
          className="min-w-full"
        />
      </div>

      <div className="mt-4 flex justify-center">
        <CustomPagination
          currentPage={meta.current_page}
          total={meta.total}
          perPage={meta.per_page}
          onPageChange={(current, pageSize) =>
            setMeta((prev) => ({
              ...prev,
              current_page: current,
              per_page: pageSize,
            }))
          }
        />
      </div>
    </div>
  );
};

export default ViewedJob;
