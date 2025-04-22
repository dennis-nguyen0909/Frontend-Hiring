import { useState, useEffect } from "react";
import { Button, Image, Table, Spin, Dropdown, Modal } from "antd";
import type { MenuProps } from "antd";
import { useSelector } from "react-redux";
import { Meta } from "../../../../types";
import CustomPagination from "../../../../components/ui/CustomPanigation/CustomPanigation";
import { Circle, CircleCheck, CircleX, MapPin, Ellipsis } from "lucide-react";
import { capitalizeFirstLetter, formatCurrency } from "../../../../untils";
import useMomentFn from "../../../../hooks/useMomentFn";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { API_APPLICATION } from "../../../../services/modules/ApplicationServices";
import { CloseOutlined, EyeFilled, FileTextOutlined } from "@ant-design/icons";

interface Applied {
  _id: string;
  user_id: string;
  job_id: {
    _id: string;
    title: string;
    city_id: { name: string };
    salary_range_min?: number;
    salary_range_max?: number;
    type_money?: { symbol: string };
    job_type?: { name: string };
    expire_date?: string;
    is_negotiable?: boolean;
  };
  employer_id: { avatar_company: string };
  applied_date: string;
  status: string;
  cv_link: string;
}

interface AppliedResponse {
  items: Applied[];
  meta: Meta;
}

interface RootState {
  user: { _id: string; access_token: string };
}

const Applied = () => {
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

  const handleWithdraw = (record: Applied) => {
    const modal = Modal.info({
      title: (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileTextOutlined className="text-blue-500" />
            <span className="text-lg font-semibold">{t("cv_preview")}</span>
          </div>
          <CloseOutlined
            onClick={() => modal.destroy()}
            className="text-gray-500 hover:text-red-500 cursor-pointer text-lg"
          />
        </div>
      ),
      width: "80%",
      className: "cv-preview-modal",
      content: (
        <div className="bg-gray-50 rounded-lg">
          <iframe
            src={record.cv_link}
            className="w-full h-[70vh] rounded-lg shadow-md"
            style={{ border: "none" }}
            title={t("cv_preview")}
          />
        </div>
      ),
      okButtonProps: { style: { display: "none" } }, // Ẩn nút OK
      closable: false, // Không hiển thị icon mặc định
      maskClosable: true,
      maskStyle: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
    });
  };

  const getMenuItems = (record: Applied): MenuProps["items"] => [
    {
      key: "view",
      label: t("view_detail"),
      icon: <FileTextOutlined className="w-3 h-3" />,
      onClick: () => navigate(`/job-information/${record.job_id._id}`),
    },
    {
      key: "withdraw",
      label: t("withdraw_application"),
      icon: <EyeFilled className="w-3 h-3 " />,
      className: "text-blue-500 hover:text-blue-600",
      onClick: () => handleWithdraw(record),
    },
  ];

  const queryOptions: UseQueryOptions<AppliedResponse> = {
    queryKey: [
      "appliedJobs",
      userDetail?._id,
      meta.current_page,
      meta.per_page,
    ],
    queryFn: async () => {
      const params = {
        current: meta.current_page,
        pageSize: meta.per_page,
        query: { user_id: userDetail?._id },
      };
      const res = await API_APPLICATION.getAllRecentlyAppliedCandidate(
        params,
        userDetail?.access_token
      );
      return res.data;
    },
    enabled: !!userDetail?._id,
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
            src={record.employer_id?.avatar_company}
            fallback="https://via.placeholder.com/60"
            preview={false}
          />
          <div className="flex flex-col gap-1">
            <div className="flex flex-row items-center justify-start gap-4">
              {record?.job_id === null ? (
                <h3 className="font-semibold text-[14px] text-gray-900">
                  {t("job_not_exist")}
                </h3>
              ) : (
                <>
                  <h3 className="font-semibold text-[14px] text-gray-900">
                    {record?.job_id?.title}
                  </h3>
                  {record?.job_id?.job_type?.name && (
                    <h3 className="px-3 py-1 rounded-full text-[10px] font-medium bg-blue-50 text-blue-600 border-blue-100 shadow-sm hover:bg-blue-100 transition-colors duration-200">
                      {t(record?.job_id?.job_type?.name)}
                    </h3>
                  )}
                  {record?.job_id?.expire_date && (
                    <h3
                      className={`px-3 py-1 rounded-full text-[10px] font-medium ${
                        new Date(record?.job_id?.expire_date) < new Date()
                          ? "bg-red-50 text-red-600 border-red-100"
                          : "bg-blue-50 text-blue-600 border-blue-100"
                      } shadow-sm hover:bg-blue-100 transition-colors duration-200`}
                    >
                      {new Date(record?.job_id?.expire_date) < new Date()
                        ? t("expired")
                        : formatDate(record?.job_id?.expire_date)}
                    </h3>
                  )}
                </>
              )}
            </div>
            <div className="flex items-center gap-4">
              {record?.job_id?.is_negotiable ? (
                <span className="text-[12px] text-gray-600">
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
                    {record?.job_id?.city_id?.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ),
      className: "min-w-[200px] text-[14px]",
    },
    {
      title: t("date_applied"),
      dataIndex: "dateApplied",
      key: "dateApplied",
      className: "min-w-[150px] text-[14px]",
      render: (text: string, record: Applied) => (
        <div className="text-[14px]">{formatDate(record?.applied_date)}</div>
      ),
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (text: string) => (
        <div className="flex items-center gap-2">
          {/* <span>
            {text === "pending" ? (
              <Circle size={14} className="text-yellow-500" />
            ) : text === "rejected" ? (
              <CircleX className="text-red-500" size={14} />
            ) : (
              <CircleCheck size={14} className="text-green-500" />
            )}
          </span> */}
          <span
            className={`text-[14px]`}
            style={{ color: text?.color || "#95a5a6" }}
          >
            {capitalizeFirstLetter(text?.name)}
          </span>
        </div>
      ),
      className: "min-w-[120px] text-[14px]",
    },
    {
      title: "",
      key: "action",
      render: (record: Applied) => (
        <Dropdown
          menu={{ items: getMenuItems(record) }}
          placement="bottomRight"
          trigger={["hover"]}
        >
          <Button
            size="small"
            type="text"
            className="!bg-gray-100 hover:!bg-gray-200 text-[14px] font-medium transition-all duration-300 ease-in-out transform hover:scale-105 shadow-sm hover:shadow-md rounded-md px-2 py-1 flex items-center justify-center"
          >
            <Ellipsis className="w-4 h-4 text-gray-600" />
          </Button>
        </Dropdown>
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
        {t("job_applied")} ({data?.items?.length || 0})
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

export default Applied;
