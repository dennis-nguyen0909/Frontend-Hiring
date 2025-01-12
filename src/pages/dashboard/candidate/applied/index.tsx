import { Avatar, Button, Table } from "antd";
import { API_APPLICATION } from "../../../../services/modules/ApplicationServices";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Meta } from "../../../../types";
import CustomPagination from "../../../../components/ui/CustomPanigation/CustomPanigation";
import moment from "moment";
import { Circle, CircleCheck, CircleX, MapPin } from "lucide-react";
import { capitalizeFirstLetter } from "../../../../untils";
import LoadingComponentSkeleton from "../../../../components/Loading/LoadingComponentSkeleton";

interface Applied {
  _id: string;
  user_id: any;
  job_id: any;
  employer_id: any;
  cover_letter: string;
  status: string;
  save_candidates: any[];
  applied_date: string;
}

const Applied = () => {
  const userDetail = useSelector((state) => state.user);
  const [listApplied, setListApplied] = useState<Applied[]>([]);
  const [isLoading,setIsLoading]=useState<boolean>(false)
  const [meta, setMeta] = useState<Meta>({});

  const columns = [
    {
      title: "Công việc",
      dataIndex: "job",
      key: "job",
      render: (text, record) => (
        <div className="flex items-center">
          <div className={`flex items-center justify-center mr-5`}>
            <Avatar size={45} shape="square" src={record?.employer_id?.avatar_company} />
          </div>
          <div className="flex flex-col">
            <div className="font-semibold text-[12px]">{record?.job_id?.title}</div>
            <div className="text-gray-500 text-sm">
              <div className="flex items-center gap-1">
                <MapPin size={12} />
                <span className="mr-2 text-[12px]">{record?.job_id?.city_id.name}</span>
              </div>
              <span className=" text-[12px]">{record.salary}</span>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded text-[12px] ${record.jobTypeBg} ${record.jobTypeColor}`}
            >
              {record.jobType}
            </span>
          </div>
        </div>
      ),
      className: "text-[12px]"
    },
    {
      title: "Ngày nộp",
      dataIndex: "dateApplied",
      key: "dateApplied",
      render: (record) => (
        <span className=" text-[12px]">{moment(record?.applied_date).format("DD-MM-YYYY")}</span>
      ),
            className: "text-[12px]"
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <div className="flex items-center gap-2">
          <span>
            {text === "pending" ? (
              <Circle size={12} className="text-orange-400" />
            ) : text === "rejected" ? (
              <CircleX className="text-red-500" size={12} />
            ) : (
              <CircleCheck size={12} className="text-green-500" />
            )}
          </span>
          <span
            className={`${
              text === "pending"
                ? "text-orange-400"
                : text === "rejected"
                ? "text-red-500"
                : "text-green-500"
            } text-[12px]`}
          >
            {capitalizeFirstLetter(text)}
          </span>
        </div>
      ),
            className: "text-[12px]"
    },
    {
      title: "Hành động",
      key: "action",
      render: () => (
        <Button type="primary" className="bg-blue-500 hover:bg-blue-600 !text-[12px]">
          Xem chi tiết
        </Button>
      ),
            className: "text-[12px]"
    },
  ];

  const handleGetData = async (current = 1, pageSize = 10) => {
    try {
      setIsLoading(true)
      const params = {
        current,
        pageSize,
        query: {
          user_id: userDetail?._id,
        },
      };
      const res = await API_APPLICATION.getAllRecentlyAppliedCandidate(
        params,
        userDetail?.access_token
      );
      if (res.data) {
        setListApplied(res.data.items);
        setMeta(res.data.meta);
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);

  return (
    <div>
      <h1 className="text-[16px] font-semibold mb-6">Việc làm đã ứng tuyển ({listApplied.length || 0})</h1>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table
          columns={columns}
          dataSource={listApplied}
          pagination={false}
          loading={isLoading}
          scroll={{ x: "max-content" }}
          className="min-w-full"
          />
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        <CustomPagination
          currentPage={meta.current_page}
          total={meta.total}
          perPage={meta.per_page}
          onPageChange={(current, pageSize) => {
            handleGetData(current, pageSize);
          }}
        />
      </div>
    </div>
  );
};

export default Applied;
