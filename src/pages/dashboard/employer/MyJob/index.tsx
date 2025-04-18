import { Table, Button, Dropdown, Badge, Select, notification } from "antd";
import { EllipsisOutlined, TeamOutlined } from "@ant-design/icons";
import { JobApi } from "../../../../services/modules/jobServices";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Job } from "../../../../types";
import CustomPagination from "../../../../components/ui/CustomPanigation/CustomPanigation";
import {
  DELETE,
  MARK_AS_EXPIRED,
  MY_JOB_HOME,
  PROMOTE_JOB,
  VIEW_DETAIL,
  VIEW_DETAIL_APPLICATION,
} from "../../../../utils/role.utils";
import JobApplication from "./JobApplication";
import JobDetail from "./JodDetail";
import LoadingComponentSkeleton from "../../../../components/Loading/LoadingComponentSkeleton";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RootState } from "../../../../redux/store/store";

interface MenuEvent {
  key: string;
}

export default function MyJobEmployer() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const userDetail = useSelector((state: RootState) => state.user);
  const [currentMenu, setCurrentMenu] = useState<string>(MY_JOB_HOME);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch jobs with React Query
  const { data: jobsData, isLoading } = useQuery({
    queryKey: ["myJobs", userDetail?.id, currentPage, pageSize],
    queryFn: async () => {
      const params = {
        current: currentPage,
        pageSize,
        query: {
          user_id: userDetail?.id,
        },
      };
      const res = await JobApi.getJobByEmployerID(
        params,
        userDetail.access_token
      );
      return res.data;
    },
    enabled: !!userDetail?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Update job mutation
  const updateJobMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: { is_active: boolean };
    }) => {
      return await JobApi.updateJob(id, data, userDetail.access_token);
    },
    onSuccess: () => {
      notification.success({
        message: t("notification"),
        description: t("update_success"),
      });
      queryClient.invalidateQueries({ queryKey: ["myJobs"] });
    },
  });

  // Delete job mutation
  const deleteJobMutation = useMutation({
    mutationFn: (id: string) => {
      if (!userDetail?.id) {
        throw new Error("User ID is required");
      }
      return JobApi.deleteManyJobs(
        [id],
        userDetail.id,
        userDetail?.access_token
      );
    },
    onSuccess: () => {
      notification.success({
        message: t("notification.success"),
        description: t("notification.deleteJobSuccess"),
      });
      queryClient.invalidateQueries({ queryKey: ["jobs", userDetail?.id] });
    },
    onError: () => {
      notification.error({
        message: t("notification.error"),
        description: t("notification.deleteJobError"),
      });
    },
  });

  const handleOnChangeMenu = async (e: MenuEvent, record: Job) => {
    if (e.key === MARK_AS_EXPIRED) {
      updateJobMutation.mutate({ id: record._id, data: { is_active: true } });
      return;
    }
    if (e.key === DELETE) {
      deleteJobMutation.mutate(record._id);
      return;
    }
    if (e.key) {
      setCurrentMenu(e.key);
      setSelectedJob(record);
    }
  };

  const handleChangeHome = () => {
    setCurrentMenu(MY_JOB_HOME);
    setSelectedJob(null);
  };

  const handlePageChange = (current: number, pageSize: number) => {
    setCurrentPage(current);
    setPageSize(pageSize);
  };

  const columns = [
    {
      title: t("job_title"),
      dataIndex: "title",
      key: "title",
      render: (text: string, record: Job) => (
        <div className="truncate">
          <div className="font-medium">{text}</div>
          <div className="text-gray-500 text-sm">
            {record.job_contract_type?.name} • {record.city_id?.name},{" "}
            {record.district_id?.name}
          </div>
        </div>
      ),
      className: "text-[12px]",
      onHeaderCell: () => ({
        style: {
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
        },
      }),
    },
    {
      title: t("location"),
      key: "location",
      render: (record: Job) => (
        <div className="truncate">
          <div>
            {record.city_id.name}, {record.district_id.name}
          </div>
        </div>
      ),
      className: "text-[12px]",
      onHeaderCell: () => ({
        style: {
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
        },
      }),
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
              className="whitespace-nowrap"
            />
          </div>
        );
      },
      className: "text-[12px]",

      // Prevent title from wrapping
      onHeaderCell: () => ({
        style: {
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
        },
      }),
    },
    {
      title: t("number_of_applications"),
      dataIndex: "candidate_ids",
      key: "candidate_ids",
      render: (candidateIds: [string]) => (
        <div className="flex items-center gap-2 truncate">
          <TeamOutlined />
          <span>
            {candidateIds?.length && candidateIds.length}{" "}
            {t("number_of_applications")}
          </span>
        </div>
      ),
      className: "text-[12px]",
      onHeaderCell: () => ({
        style: {
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
        },
      }),
    },
    {
      title: t("actions"),
      key: "actions",
      render: (record: Job) => (
        <div className="flex gap-2">
          <Button
            onClick={() =>
              handleOnChangeMenu({ key: VIEW_DETAIL_APPLICATION }, record)
            }
            type="primary"
            className="bg-blue-500 !text-[12px]"
          >
            {t("view_application")}
          </Button>
          <Dropdown
            menu={{
              items: [
                { key: PROMOTE_JOB, label: t("promote_job") },
                { key: VIEW_DETAIL, label: t("view_detail") },
                // { key: DELETE, label: t("delete") },
              ],
              onClick: (e) => handleOnChangeMenu(e, record),
            }}
            trigger={["click"]}
          >
            <Button icon={<EllipsisOutlined />} />
          </Dropdown>
        </div>
      ),
      className: "text-[12px]",
      onHeaderCell: () => ({
        style: {
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
        },
      }),
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen ">
      {!selectedJob && currentMenu === MY_JOB_HOME && (
        <div className="rounded-lg">
          <div>
            <div className="flex flex-wrap justify-between items-start mx-2 gap-4">
              <h1 className="text-2xl font-semibold">
                {t("my_jobs")}{" "}
                <span className="text-gray-400">
                  ({jobsData?.meta?.total || 0})
                </span>
              </h1>
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex gap-4 flex-wrap justify-start w-full sm:w-auto">
                  <Select
                    defaultValue="status"
                    style={{ width: "100%", fontSize: "12px" }}
                    options={[
                      {
                        value: "status",
                        label: (
                          <span style={{ fontSize: "12px" }}>
                            {t("job_status")}
                          </span>
                        ),
                      },
                      {
                        value: "active",
                        label: (
                          <span style={{ fontSize: "12px" }}>
                            {t("active")}
                          </span>
                        ),
                      },
                      {
                        value: "expired",
                        label: (
                          <span style={{ fontSize: "12px" }}>
                            {t("expired")}
                          </span>
                        ),
                      },
                    ]}
                  />

                  <Select
                    defaultValue="all"
                    style={{ width: "100%", fontSize: "12px" }}
                    options={[
                      {
                        value: "all",
                        label: (
                          <span style={{ fontSize: "12px" }}>
                            {t("all_jobs")}
                          </span>
                        ),
                      },
                      {
                        value: "fulltime",
                        label: (
                          <span style={{ fontSize: "12px" }}>
                            {t("full_time")}
                          </span>
                        ),
                      },
                      {
                        value: "parttime",
                        label: (
                          <span style={{ fontSize: "12px" }}>
                            {t("part_time")}
                          </span>
                        ),
                      },
                      {
                        value: "contract",
                        label: (
                          <span style={{ fontSize: "12px" }}>
                            {t("contract")}
                          </span>
                        ),
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
          <LoadingComponentSkeleton isLoading={isLoading}>
            <div className="overflow-x-auto mt-5">
              <Table
                columns={columns}
                dataSource={jobsData?.items}
                pagination={false}
                className="[&_.ant-table-thead_.ant-table-cell]:bg-gray-50"
              />
            </div>

            {jobsData?.items?.length > 0 && (
              <CustomPagination
                currentPage={jobsData?.meta?.current_page}
                total={jobsData?.meta?.total}
                perPage={jobsData?.meta?.per_page}
                onPageChange={handlePageChange}
              />
            )}
          </LoadingComponentSkeleton>
        </div>
      )}

      {currentMenu === VIEW_DETAIL_APPLICATION && selectedJob && (
        <div className="bg-white rounded-lg shadow-sm">
          <JobApplication
            handleChangeHome={handleChangeHome}
            selectedJob={selectedJob}
          />
        </div>
      )}

      {currentMenu === VIEW_DETAIL && selectedJob && (
        <div className="bg-white rounded-lg shadow-sm">
          <JobDetail
            handleChangeHome={handleChangeHome}
            idJob={selectedJob._id}
          />
        </div>
      )}
    </div>
  );
}
