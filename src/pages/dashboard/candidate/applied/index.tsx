import React, { useState, useEffect } from "react";
import { Button, Image, Table, Spin, Dropdown, Modal } from "antd";
import type { MenuProps } from "antd";
import { useSelector } from "react-redux";
import { Meta } from "../../../../types";
import CustomPagination from "../../../../components/ui/CustomPanigation/CustomPanigation";
import {
  Circle,
  CircleCheck,
  CircleX,
  MapPin,
  Eye,
  Ellipsis,
} from "lucide-react";
import { capitalizeFirstLetter, formatCurrency } from "../../../../untils";
import useMomentFn from "../../../../hooks/useMomentFn";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { API_APPLICATION } from "../../../../services/modules/ApplicationServices";
import { Document, Page, pdfjs } from "react-pdf";

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
}

interface AppliedResponse {
  items: Applied[];
  meta: Meta;
}

interface RootState {
  user: { _id: string; access_token: string };
}
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
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
  const [isPdfVisible, setIsPdfVisible] = useState(false);
  const pdfUrl =
    "http://res.cloudinary.com/da1ku5kao/raw/upload/v1744562619/hiring/pdf/ujco7poflxxpl0u6tsgf";
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1); // Để hiển thị trang đầu tiên

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const handleCancelPdf = () => {
    setIsPdfVisible(false);
    setNumPages(null); // Reset số trang khi đóng modal
    setPageNumber(1); // Reset về trang đầu tiên
  };

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
    keepPreviousData: true,
  };

  const { data, isLoading, isFetching } =
    useQuery<AppliedResponse>(queryOptions);

  useEffect(() => {
    if (data?.meta) setMeta(data.meta);
  }, [data?.meta]);

  const handleWithdraw = (record: Applied) => {
    setIsPdfVisible(true);
    console.log("Withdraw application:", record._id);
    // Thêm logic thực tế để rút ứng tuyển tại đây nếu cần
  };

  const getMenuItems = (record: Applied): MenuProps["items"] => [
    {
      key: "view",
      label: t("view_detail"),
      icon: <Eye className="w-3 h-3" />,
      onClick: () => navigate(`/job-information/${record.job_id._id}`),
    },
    {
      key: "withdraw",
      label: t("withdraw_application"),
      icon: <CircleX className="w-3 h-3" />,
      danger: true,
      onClick: () => handleWithdraw(record),
    },
  ];

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
                  {record?.job_id?.job_type?.key && (
                    <h3 className="px-3 py-1 rounded-full text-[10px] font-medium bg-blue-50 text-blue-600 border-blue-100 shadow-sm hover:bg-blue-100 transition-colors duration-200">
                      {t(record?.job_id?.job_type?.key)}
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
      className: "min-w-[200px] text-[12px]",
    },
    {
      title: t("date_applied"),
      dataIndex: "dateApplied",
      key: "dateApplied",
      className: "min-w-[150px] text-[12px]",
      render: (text: string, record: Applied) => (
        <div className="text-[12px]">{formatDate(record?.applied_date)}</div>
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

      <Modal
        title={t("view_pdf")}
        open={isPdfVisible}
        onCancel={handleCancelPdf}
        width="90%"
        style={{ top: 20 }}
        footer={null}
      >
        <div style={{ height: "600px", overflow: "auto" }}>
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            // onError={(error) => console.error('Error loading PDF', error)}
          >
            <Page pageNumber={pageNumber} width={window.innerWidth * 0.8} />{" "}
            {/* Điều chỉnh width cho phù hợp */}
          </Document>
        </div>
        {numPages > 1 && (
          <div style={{ textAlign: "center", marginTop: 10 }}>
            <Button
              disabled={pageNumber <= 1}
              onClick={() => setPageNumber(pageNumber - 1)}
            >
              {t("previous")}
            </Button>
            <span style={{ margin: "0 10px" }}>
              {t("page")} {pageNumber} {t("of")} {numPages}
            </span>
            <Button
              disabled={pageNumber >= numPages}
              onClick={() => setPageNumber(pageNumber + 1)}
            >
              {t("next")}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Applied;
