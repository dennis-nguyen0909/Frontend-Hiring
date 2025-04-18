import { Button, Table, Tag, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store/store";
import { useQuery } from "@tanstack/react-query";
import { API_APPLICATION } from "../../../../../services/modules/ApplicationServices";
import { Job, Application } from "../../../../../types";
import CustomPagination from "../../../../../components/ui/CustomPanigation/CustomPanigation";
import { useState } from "react";

interface JobApplicationProps {
  handleChangeHome: () => void;
  selectedJob: Job;
}

interface Candidate {
  full_name: string;
  email: string;
}

interface ApplicationRecord extends Application {
  candidate: Candidate;
  cv_url: string;
}

const JobApplication = ({
  handleChangeHome,
  selectedJob,
}: JobApplicationProps) => {
  const { t } = useTranslation();
  const userDetail = useSelector((state: RootState) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch job applications
  const { data: jobApplicationsData, isLoading } = useQuery({
    queryKey: ["jobApplications", selectedJob._id, currentPage, pageSize],
    queryFn: async () => {
      const params = {
        current: currentPage,
        pageSize,
        query: {
          job_id: selectedJob._id,
        },
      };
      const res = await API_APPLICATION.getApplicationByEmployerJobId(
        selectedJob._id,
        params,
        userDetail?.access_token
      );
      return res.data;
    },
    enabled: !!selectedJob._id && !!userDetail?.access_token,
  });

  const handlePageChange = (current: number, pageSize: number) => {
    setCurrentPage(current);
    setPageSize(pageSize);
  };

  const columns = [
    {
      title: t("candidate"),
      dataIndex: "candidate",
      key: "candidate",
      render: (candidate: Candidate) => (
        <div>
          <div className="font-medium">{candidate?.full_name}</div>
          <div className="text-gray-500 text-sm">{candidate?.email}</div>
        </div>
      ),
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={
            status === "pending"
              ? "orange"
              : status === "accepted"
              ? "green"
              : "red"
          }
        >
          {t(status)}
        </Tag>
      ),
    },
    {
      title: t("applied_date"),
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: t("actions"),
      key: "actions",
      render: (record: ApplicationRecord) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            onClick={() => window.open(record.cv_url, "_blank")}
          >
            {t("view_cv")}
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => {
              // Handle reject application
            }}
          >
            {t("reject")}
          </Button>
          <Button
            type="primary"
            onClick={() => {
              // Handle accept application
            }}
          >
            {t("accept")}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <Typography.Title level={4}>{t("job_applications")}</Typography.Title>
        <Button onClick={handleChangeHome}>{t("back")}</Button>
      </div>

      <Table
        columns={columns}
        dataSource={jobApplicationsData?.items}
        loading={isLoading}
        pagination={false}
      />

      {jobApplicationsData?.items?.length > 0 && (
        <CustomPagination
          currentPage={jobApplicationsData?.meta?.current_page}
          total={jobApplicationsData?.meta?.total}
          perPage={jobApplicationsData?.meta?.per_page}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default JobApplication;
