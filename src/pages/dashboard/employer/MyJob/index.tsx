import {
  Table,
  Button,
  Dropdown,
  Badge,
  Select,
  Switch,
  notification,
} from "antd";
import { EllipsisOutlined, TeamOutlined } from "@ant-design/icons";
import { JobApi } from "../../../../services/modules/jobServices";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Job, Meta } from "../../../../types";
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

export default function MyJobEmployer() {
  const columns = [
    {
      title: "Công việc",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: Job) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-gray-500 text-sm">
            {/* {record?.job_contract_type?.name} • {new Date(record.expire_date).toLocaleDateString()} */}
          </div>
        </div>
      ),
    },
    {
      title: "Vị trí",
      key: "location",
      render: (record: Job) => (
        <div>
          <div>
            {record.city_id.name}, {record.district_id.name}
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      key: "is_active",
      render: (isActive: string) => (
        <Badge
          status={isActive ? "success" : "error"}
          text={isActive ? "Hoạt động" : "Đã hết hạn"}
          className="whitespace-nowrap"
        />
      ),
    },
    {
      title: "Số lượng ứng tuyển",
      dataIndex: "candidate_ids",
      key: "candidate_ids",
      render: (candidateIds: [string]) => (
        <div className="flex items-center gap-2">
          <TeamOutlined />
          <span>
            {candidateIds?.length && candidateIds.length} Người ứng tuyển
          </span>
        </div>
      ),
    },
    {
      title: "Toggle trạng thái",
      key: "toggle_active",
      render: (record: Job) => (
        <Switch
          className="custom-switch"
          checked={record.is_active}
          onChange={(checked) => handleToggleActiveJob(record, checked)}
        />
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (record: Job) => (
        <div className="flex gap-2">
          <Button
            onClick={() =>
              handleOnChangeMenu({ key: VIEW_DETAIL_APPLICATION }, record)
            }
            type="primary"
            className="bg-blue-500"
          >
            Xem đơn ứng tuyển
          </Button>
          <Dropdown
            menu={{
              items: [
                { key: PROMOTE_JOB, label: "Quảng bá việc làm" },
                { key: VIEW_DETAIL, label: "Xem chi tiết" },
                { key: DELETE, label: "Xóa" },
                // { key: MARK_AS_EXPIRED, label: 'Đánh dấu là đã hết hạn' },
              ],
              onClick: (e) => handleOnChangeMenu(e, record),
            }}
            trigger={["click"]}
          >
            <Button icon={<EllipsisOutlined />} />
          </Dropdown>
        </div>
      ),
    },
  ];
  const userDetail = useSelector((state) => state.user);
  const [listMyJobs, setListMyJobs] = useState<Job[]>([]);
  const [meta, setMeta] = useState<Meta>({
    count: 0,
    current_page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0,
  });
  const [currentMenu, setCurrentMenu] = useState<string>(MY_JOB_HOME);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleOnChangeMenu = async (e, record) => {
    if (e.key === MARK_AS_EXPIRED) {
      const res = await JobApi.updateJob(
        record._id,
        { is_active: true },
        userDetail.access_token
      );
      if (res.data) {
        notification.success({
          message: "Success",
          description: "Job updated successfully",
        });
        handleGetMyJob({});
      }
      return;
    }
    if (e.key === DELETE) {
      const res = await JobApi.deleteManyJobs(
        [record?._id],
        userDetail?._id,
        userDetail?.access_token
      );
      if (res.data) {
        notification.success({
          message: "Success",
          description: "Deleted successfully!",
        });
        handleGetMyJob({});
      }
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

  const handleGetMyJob = async ({
    current = 1,
    pageSize = 10,
  }: {
    current?: number;
    pageSize?: number;
  }) => {
    const params = {
      current,
      pageSize,
      query: {
        user_id: userDetail?._id,
      },
    };

    try {
      setIsLoading(true);
      // Gọi API với các tham số phân trang
      const res = await JobApi.getJobByEmployerID(
        params,
        userDetail.access_token
      );
      if (res.data) {
        setListMyJobs(res.data.items); // Giả sử bạn có state `jobs` để lưu danh sách công việc
        setMeta(res.data.meta); // Giả sử bạn có state `meta` để lưu thông tin phân trang
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetMyJob({ current: 1, pageSize: 10 });
  }, []);
  const handleToggleActiveJob = async (job: Job, checked: boolean) => {
    const params = {
      is_active: checked,
    };
    const res = await JobApi.updateJob(
      job._id,
      params,
      userDetail.access_token
    );
    if (res.data) {
      notification.success({
        message: "Success",
        description: "Job updated successfully",
      });
      handleGetMyJob({});
    }
  };
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {!selectedJob && currentMenu === MY_JOB_HOME && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold">
                Công việc của tôi{" "}
                <span className="text-gray-400">({meta && meta.total})</span>
              </h1>
              <div className="flex gap-4">
                <Select
                  defaultValue="status"
                  style={{ width: 120 }}
                  options={[
                    { value: "status", label: "Trạng thái công việc" },
                    { value: "active", label: "Hoạt động" },
                    { value: "expired", label: "Đã hết hạn" },
                  ]}
                />
                <Select
                  defaultValue="all"
                  style={{ width: 120 }}
                  options={[
                    { value: "all", label: "All Việc làm" },
                    { value: "fulltime", label: "Full Time" },
                    { value: "parttime", label: "Part Time" },
                    { value: "contract", label: "Contract" },
                  ]}
                />
              </div>
            </div>
          </div>

         {/* <LoadingComponentSkeleton isLoading={isLoading}> */}
         <Table
            columns={columns}
            dataSource={listMyJobs}
            pagination={false}
            className="[&_.ant-table-thead_.ant-table-cell]:bg-gray-50"
          />
          {listMyJobs?.length > 0 && (
            <CustomPagination
              currentPage={meta?.current_page}
              total={meta?.total}
              perPage={meta?.per_page}
              onPageChange={(current, pageSize) => {
                handleGetMyJob({ current, pageSize });
              }}
            />
          )}
         {/* </LoadingComponentSkeleton> */}
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
