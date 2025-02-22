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
import { Meta } from "../../../../types";
import { calculateTimeRemaining, defaultMeta } from "../../../../untils";
import { JobApi } from "../../../../services/modules/jobServices";
import CustomPagination from "../../../../components/ui/CustomPanigation/CustomPanigation";
import "./styles.css";
import { useNavigate } from "react-router-dom";

const { Text, Title } = Typography;

const OverviewEmployer = () => {
  const navigate = useNavigate();
  const columns = [
    {
      title: "Công việc",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: any) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-gray-500 !text-[12px]">
            {record?.job_contract_type?.name} •{" "}
            {calculateTimeRemaining(record?.expire_date)}
          </div>
        </div>
      ),
      width: "30%",
      className: "whitespace-nowrap overflow-hidden text-ellipsis text-[12px]", // Thêm class CSS để ngăn nội dung xuống dòng
    },
    {
      title: "Trạng thái",
      dataIndex: "expire_date",
      key: "expire_date",
      render: (expire_date: Date) => {
        // Chú ý: expire_date có kiểu Date
        const isExpired = new Date(expire_date).getTime() < Date.now(); // So sánh chính xác
        return (
          <div>
            <Badge
              status={!isExpired ? "success" : "error"} // Dùng !isExpired để xác định trạng thái
              text={
                !isExpired ? (
                  <span className="text-[12px]">Hoạt động</span>
                ) : (
                  <span className="text-[12px]">Đã hết hạn</span>
                )
              }
              className="whitespace-nowrap !text-[12px]"
            />
          </div>
        );
      },
      width: "15%",
      className: "whitespace-nowrap overflow-hidden text-ellipsis text-[12px]", // Thêm class CSS để ngăn nội dung xuống dòng
    },
    {
      title: "Số lượng ứng tuyển",
      dataIndex: "count_apply",
      key: "count_apply",
      render: (count: number) => (
        <div className="flex items-center gap-2">
          <TeamOutlined />
          <span className="!text-[12px]">{count || 0} Người ứng tuyển</span>
        </div>
      ),
      width: "20%",
      className: "whitespace-nowrap overflow-hidden text-ellipsis text-[12px]", // Thêm class CSS để ngăn nội dung xuống dòng
    },
    {
      title: "Hành động",
      key: "actions",
      render: (item) => (
        <div className="flex gap-2">
          <Button
            onClick={() => navigate(`/my-application/${item?._id}`)}
            type="primary"
            className="bg-blue-500 !text-[12px]"
          >
            Xem đơn ứng tuyển
          </Button>
          <Dropdown
            menu={{
              items: [
                { key: "1", label: "Quảng bá việc làm" },
                {
                  key: "2",
                  label: "Xem chi tiết",
                  onClick: () => navigate(`/my-job-detail/${item?._id}`),
                },
                { key: "3", label: "Đánh dấu là đã hết hạn" },
              ],
            }}
            trigger={["click"]}
          >
            <Button icon={<EllipsisOutlined />} />
          </Dropdown>
        </div>
      ),
      width: "20%",
      className: "whitespace-nowrap overflow-hidden text-ellipsis text-[12px]", // Thêm class CSS để ngăn nội dung xuống dòng
    },
  ];

  const [metaSaveCandidate, setMetaSaveCandidate] = useState<Meta>(defaultMeta);
  const [jobRecents, setJobRecents] = useState<never[]>([]);
  const [metaJobRecents, setMetaJobRecents] = useState<Meta>(defaultMeta);
  const userDetail = useSelector((state) => state.user);
  const [countJobActive, setCountJobActive] = useState<number>(0);
  const [countOpenJob, setCountOpenJob] = useState(0);
  const [countSaveCandidate, setCountSaveCandidate] = useState(1);

  const handleGetSaveCandidate = async ({ current = 1, pageSize = 10 }) => {
    const params = {
      current, // Trang hiện tại
      pageSize, // Số lần phần tử một trang
    };

    try {
      const res = await SAVE_CANDIDATE_API.getSaveCandidateByEmployerId(
        userDetail?._id,
        params,
        userDetail?.access_token
      );
      if (res.data) {
        setMetaSaveCandidate(res.data.meta);
      }
    } catch (error) {
      /* empty */
    }
  };

  const handleGetAllJobRecent = async ({ current = 1, pageSize = 10 }) => {
    try {
      const params = {
        current,
        pageSize,
        query: {
          user_id: userDetail?._id,
        },
      };
      const res = await JobApi.getAllJobRecent(params, userDetail?._id);
      if (res.data) {
        setJobRecents(res.data.items);
        setMetaJobRecents(res.data.meta);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handletGetJobActivity = async () => {
    try {
      const res = await JobApi.countActiveJobsByUser(
        userDetail?._id,
        userDetail?.access_token
      );
      if (res.data) {
        setCountJobActive(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetSaveCandidate({ current: 1, pageSize: 10 });
    handleGetAllJobRecent({ current: 1, pageSize: 10 });
    handletGetJobActivity();
  }, []);

  useEffect(() => {
    if (countJobActive === 0) return;
    let start = 0;
    const end = countJobActive;
    const duration = 500;

    const intervalTime = duration / (end - start);

    const interval = setInterval(() => {
      start += 1;
      setCountOpenJob(start);
      if (start >= end) {
        clearInterval(interval); // Dừng interval khi đếm đến cuối
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [countJobActive]);

  useEffect(() => {
    if (metaSaveCandidate.count === 0) {
      setCountSaveCandidate(0);
      return;
    }

    let start = 1;
    const end = metaSaveCandidate.count;
    const duration = 500;

    const intervalTime = duration / (end - start);

    const interval = setInterval(() => {
      start += 1;
      setCountSaveCandidate(start);

      if (start >= end) {
        clearInterval(interval); // Stop interval once it reaches the end
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [metaSaveCandidate.count]);

  return (
    <div className="mx-2">
      <div className="mb-8 flex flex-col gap-1">
        <Text className="font-semibold text-3xl">
          Hello, {userDetail?.full_name}
        </Text>
        <Text className="font-semibold !text-[12px]">
          Company : {userDetail?.company_name}
        </Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="text-3xl font-bold !text-[20px]">{countOpenJob}</div>
          <div className="flex items-center gap-2">
            <FileTextOutlined />
            <span className="!text-[12px]">Việc làm mở</span>
          </div>
        </div>
        <div className="bg-orange-50 p-6 rounded-lg">
          <div className="text-3xl font-bold !text-[20px]">
            {countSaveCandidate}
          </div>
          <div className="flex items-center gap-2">
            <SaveOutlined />
            <span className="!text-[12px]">Lưu ứng viên</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <p className="mb-0 text-[12px]">Công việc đăng gần đây</p>
          <Button className="!text-[12px]" type="link">
            Xem tất cả
          </Button>
        </div>
        <div className="overflow-y-auto max-h-96">
          <Table
            columns={columns}
            dataSource={jobRecents}
            pagination={false}
            tableLayout="auto" // Cho phép các cột tự động co giãn
            className="[&_.ant-table-thead_.ant-table-cell]:bg-gray-50"
          />
        </div>
      </div>

      <CustomPagination
        currentPage={metaJobRecents?.current_page}
        total={metaJobRecents?.total}
        perPage={metaJobRecents?.per_page}
        onPageChange={(current, pageSize) => {
          handleGetAllJobRecent({ current, pageSize });
        }}
      />
    </div>
  );
};

export default OverviewEmployer;
