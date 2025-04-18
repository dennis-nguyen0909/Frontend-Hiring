import {
  EllipsisOutlined,
  FileTextOutlined,
  SaveOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Badge, Button, Dropdown, Table, Typography } from "antd";
import { useSelector } from "react-redux";
import { SAVE_CANDIDATE_API } from "../../../../services/modules/SaveCandidateServices";
import { useEffect, useState } from "react";
import { calculateTimeRemaining } from "../../../../untils";
import { JobApi } from "../../../../services/modules/jobServices";
import CustomPagination from "../../../../components/ui/CustomPanigation/CustomPanigation";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { RootState } from "../../../../redux/store/store";
import { Job } from "../../../../types";
const { Text } = Typography;

const OverviewEmployer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const userDetail = useSelector((state: RootState) => state.user);
  const [countOpenJob, setCountOpenJob] = useState(0);
  const [countSaveCandidate, setCountSaveCandidate] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch saved candidates
  const { data: savedCandidatesData } = useQuery({
    queryKey: ["savedCandidates", userDetail?.id],
    queryFn: async () => {
      if (!userDetail?.id) throw new Error("User ID is required");
      const params = {
        current: 1,
        pageSize: 10,
      };
      const res = await SAVE_CANDIDATE_API.getSaveCandidateByEmployerId(
        userDetail.id,
        params,
        userDetail?.access_token
      );
      return res.data;
    },
    enabled: !!userDetail?.id,
  });

  // Fetch recent jobs
  const { data: recentJobsData } = useQuery({
    queryKey: ["recentJobs", userDetail?.id, currentPage, pageSize],
    queryFn: async () => {
      if (!userDetail?.id) throw new Error("User ID is required");
      const params = {
        current: currentPage,
        pageSize: pageSize,
        query: {
          user_id: userDetail.id,
        },
      };
      const res = await JobApi.getAllJobRecent(params, userDetail.id);
      return res.data;
    },
    enabled: !!userDetail?.id,
  });

  // Fetch active jobs count
  const { data: activeJobsCount } = useQuery({
    queryKey: ["activeJobsCount", userDetail?.id],
    queryFn: async () => {
      if (!userDetail?.id) throw new Error("User ID is required");
      const res = await JobApi.countActiveJobsByUser(
        userDetail.id,
        userDetail?.access_token
      );
      return res.data;
    },
    enabled: !!userDetail?.id,
  });

  // Animate countOpenJob
  useEffect(() => {
    if (!activeJobsCount) return;
    let start = 0;
    const end = activeJobsCount;
    const duration = 500;
    const intervalTime = duration / (end - start);

    const interval = setInterval(() => {
      start += 1;
      setCountOpenJob(start);
      if (start >= end) {
        clearInterval(interval);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [activeJobsCount]);

  // Animate countSaveCandidate
  useEffect(() => {
    if (!savedCandidatesData?.meta?.total_pages) {
      setCountSaveCandidate(0);
      return;
    }

    let start = 0;
    const end = savedCandidatesData.meta.total_pages;
    const duration = 500;
    const intervalTime = duration / (end - start);

    const interval = setInterval(() => {
      start += 1;
      setCountSaveCandidate(start);
      if (start >= end) {
        clearInterval(interval);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [savedCandidatesData?.meta?.total_pages]);

  const columns = [
    {
      title: t("job"),
      dataIndex: "title",
      key: "title",
      render: (text: string, record: Job) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-gray-500 !text-[12px]">
            {record?.job_contract_type?.name} •{" "}
            {calculateTimeRemaining(record?.expire_date, t)}
          </div>
        </div>
      ),
      width: "30%",
      className: "whitespace-nowrap overflow-hidden text-ellipsis text-[12px]",
    },
    {
      title: t("status"),
      dataIndex: "expire_date",
      key: "expire_date",
      render: (expire_date: Date) => {
        const isExpired = new Date(expire_date).getTime() < Date.now();
        return (
          <div>
            <Badge
              status={!isExpired ? "success" : "error"}
              text={
                !isExpired ? (
                  <span className="text-[12px]">{t("active")}</span>
                ) : (
                  <span className="text-[12px]">{t("expired")}</span>
                )
              }
              className="whitespace-nowrap !text-[12px]"
            />
          </div>
        );
      },
      width: "15%",
      className: "whitespace-nowrap overflow-hidden text-ellipsis text-[12px]",
    },
    {
      title: t("number_of_applications"),
      dataIndex: "count_apply",
      key: "count_apply",
      render: (count: number) => (
        <div className="flex items-center gap-2">
          <TeamOutlined />
          <span className="!text-[12px]">
            {count || 0} {t("number_of_applications")}
          </span>
        </div>
      ),
      width: "20%",
      className: "whitespace-nowrap overflow-hidden text-ellipsis text-[12px]",
    },
    {
      title: t("action"),
      key: "actions",
      render: (item: Job) => (
        <div className="flex gap-2">
          <Button
            onClick={() => navigate(`/my-application/${item?._id}`)}
            type="primary"
            className="bg-blue-500 !text-[12px]"
          >
            {t("view_application")}
          </Button>
          <Dropdown
            menu={{
              items: [
                { key: "1", label: t("promote_job") },
                {
                  key: "2",
                  label: t("view_detail"),
                  onClick: () => navigate(`/my-job-detail/${item?._id}`),
                },
                { key: "3", label: t("mark_as_expired") },
              ],
            }}
            trigger={["click"]}
          >
            <Button icon={<EllipsisOutlined />} />
          </Dropdown>
        </div>
      ),
      width: "20%",
      className: "whitespace-nowrap overflow-hidden text-ellipsis text-[12px]",
    },
  ];

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  return (
    <div className="mx-2">
      <div className="mb-8 flex flex-col gap-1">
        <Text className="font-semibold text-3xl">
          {t("hello")}, {userDetail?.full_name}
        </Text>
        <Text className="font-semibold !text-[12px]">
          {t("company")} : {userDetail?.company_name}
        </Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="text-3xl font-bold !text-[20px]">{countOpenJob}</div>
          <div className="flex items-center gap-2">
            <FileTextOutlined />
            <span className="!text-[12px]">{t("job_open")}</span>
          </div>
        </div>
        <div className="bg-orange-50 p-6 rounded-lg">
          <div className="text-3xl font-bold !text-[20px]">
            {countSaveCandidate}
          </div>
          <div className="flex items-center gap-2">
            <SaveOutlined />
            <span className="!text-[12px]">{t("saved_candidate")}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <p className="mb-0 text-[12px]">{t("recent_jobs")}</p>
          <Button className="!text-[12px]" type="link">
            {t("view_all")}
          </Button>
        </div>
        <div className="overflow-y-auto max-h-96">
          <Table
            columns={columns}
            dataSource={recentJobsData?.items}
            pagination={false}
            tableLayout="auto"
            className="[&_.ant-table-thead_.ant-table-cell]:bg-gray-50"
          />
        </div>
      </div>

      <CustomPagination
        currentPage={recentJobsData?.meta?.current_page || currentPage}
        total={recentJobsData?.meta?.total || 0}
        perPage={recentJobsData?.meta?.per_page || pageSize}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default OverviewEmployer;
