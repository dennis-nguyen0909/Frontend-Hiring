import { Avatar, Button, Table } from "antd";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { API_FAVORITE_JOB } from "../../../../services/modules/FavoriteJobServices";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Meta } from "../../../../types";
import CustomPagination from "../../../../components/ui/CustomPanigation/CustomPanigation";
import LoadingComponent from "../../../../components/Loading/LoadingComponent";
import { useNavigate } from "react-router-dom";
import { isExpired } from "../../../../untils";
import avatarDefault from '../../../../assets/avatars/avatar-default.jpg'
interface JobApplication {
  _id: ObjectId;
  user_id: string;
  job_id: string;
  createdAt: Date;
  updatedAt: Date;
}
const FavoriteJob = () => {
  const userDetail = useSelector((state) => state.user);
  const [jobFavorites, setJobFavorites] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [meta, setMeta] = useState<Meta>({});
  const navigate = useNavigate();

  const onApplyNow = async (id) => {
    navigate(`/job-information/${id}`);
  };

  const handleFavorite = async (jobId: string) => {
    const params = {
      user_id: userDetail?._id,
      job_id: jobId,
    };
    const res = await API_FAVORITE_JOB.createFavoriteJobs(
      params,
      userDetail?.access_token
    );
    if (+res.statusCode === 201) {
      handleGetAll();
    }
  };

  const columns = [
    {
      title: "Tên công việc",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <div className="flex items-center gap-3 flex-wrap-nowrap">
          <Avatar
            size={55}
            shape="square"
            src={record?.job_id?.user_id?.avatar_company || avatarDefault}
          />
          <div className="flex flex-col">
            <div className="font-semibold">{record?.job_id?.title}</div>
            <div className="text-gray-500 text-[12px] flex flex-col gap-1">
              <span className="mr-2">
                {record?.job_id?.district_id?.name +
                  ", " +
                  record?.job_id?.city_id?.name}
              </span>
              {record?.job_id?.is_negotiable ? (
                <span className="mr-2">Lương: Thỏa thuận</span>
              ) : (
                <span className="mr-2">
                  Lương:{" "} {record?.job_id?.salary_range?.min}{record?.job_id?.type_money?.symbol} - {record?.job_id?.salary_range?.max}{record?.job_id?.type_money?.symbol}
                  {console.log("duydeptrai",record)}
                  
                </span>
              )}
              {record.jobExpire && (
                <span className="text-red-500">{record.jobExpire}</span>
              )}
            </div>
            <span
              className={`text-xs px-2 py-1 rounded ${record.jobTypeBg} ${record.jobTypeColor}`}
            >
              {record.jobType}
            </span>
          </div>
        </div>
      ),
      className: "min-w-[400px] text-[12px]",
    },
    {
      title: "Hành động",
      key: "bookmark",
      render: (_, record) => (
        <div className="flex justify-start items-center gap-4">
          {userDetail?.favorite_jobs.some(job => job.job_id === record?.job_id?._id) ? (
        // Nếu công việc nằm trong danh sách yêu thích, hiển thị Bookmark với màu xanh
        <BookmarkCheck
          size={20}
          onClick={() => handleFavorite(record?.job_id?._id)}
          className="text-blue-500 cursor-pointer"
        />
      ) : (
        // Nếu không nằm trong danh sách yêu thích, hiển thị Bookmark với màu xám
        <Bookmark
          size={20}
          onClick={() => handleFavorite(record?.job_id?._id)}
          className="text-gray-400 cursor-pointer"
        />
      )}
          <Button
          size="small"
            onClick={() => onApplyNow(record?.job_id?._id)}
            type={
              isExpired(record?.job_id?.expire_date) ? "default" : "primary"
            }
            className={
              isExpired(record?.job_id?.expire_date)
                ? "bg-gray-200 text-gray-500 text-[12px]"
                : "bg-blue-500 hover:bg-blue-600 text-[12px]"
            }
          >
            {isExpired(record?.job_id?.expire_date)
              ? "Job Đã hết hạn"
              : "Ứng tuyển ngay →"}
          </Button>
        </div>
      ),
      className: "min-w-[400px] text-[12px]",
    },
  ];

  const handleGetAll = async (current = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const params = {
        current,
        pageSize,
        query: {
          user_id: userDetail?._id,
        },
      };
      const res = await API_FAVORITE_JOB.getAllJobFavorite(
        params,
        userDetail?.access_token
      );
      if (res.data) {
        setJobFavorites(res.data.items);
        setMeta(res.data.meta);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetAll();
  }, []);

  return (
    <div className="">
      <h1 className="text-[16px] font-semibold mb-6">
        Công việc yêu thích ({jobFavorites.length || 0})
      </h1>

      <LoadingComponent isLoading={loading}>
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <Table
            columns={columns}
            dataSource={jobFavorites}
            pagination={false}
            className="sm:w-full w-auto"
          />
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-center">
          <CustomPagination
            currentPage={meta.current_page}
            total={meta.total}
            perPage={meta.per_page}
            onPageChange={(current, pageSize) => {
              handleGetAll(current, pageSize);
            }}
          />
        </div>
      </LoadingComponent>
    </div>
  );
};

export default FavoriteJob;
