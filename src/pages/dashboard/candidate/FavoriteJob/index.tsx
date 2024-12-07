import { Avatar, Button, notification, Pagination, Table } from "antd";
import { Bookmark } from "lucide-react";
import { API_FAVORITE_JOB } from "../../../../services/modules/FavoriteJobServices";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Meta } from "../../../../types";
import CustomPagination from "../../../../components/ui/CustomPanigation/CustomPanigation";
import { current } from "@reduxjs/toolkit";
import TableComponent from "../../../../components/Table/TableComponent";
import LoadingComponent from "../../../../components/Loading/LoadingComponent";
import { API_APPLICATION } from "../../../../services/modules/ApplicationServices";
import { useNavigate } from "react-router-dom";

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
  const [loading,setLoading]=useState<boolean>(false)
  const [meta, setMeta] = useState<Meta>({});
  const navigate = useNavigate()
const onApplyNow = async(id)=>{
    navigate(`/job-information/${id}`)
}
  const columns = [
    {
      title: "Tên công việc",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <div className="flex items-center gap-3">
            <Avatar size={55} shape="square" src={record?.job_id?.user_id.avatar_company} />
          <div>
            <div className="font-semibold">{record?.job_id?.title}</div>
            <div className="text-gray-500 text-sm flex flex-col">
              <span className="mr-2">{record?.job_id?.district_id?.name + ", "+record?.job_id?.city_id?.name}</span>
              {record?.job_id?.is_negotiable  ? (
                      <span className="mr-2">Lương: Thỏa thuận</span>
              ):(
                <span className="mr-2">Lương: {record?.job_id?.salary_range.min + record?.job_id?.salary_range.max + record?.job_id?.type_money   }</span>
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
    },
    {
      title: "",
      key: "bookmark",
      render: () => <Bookmark className="text-gray-400" />,
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Button
        onClick={()=>onApplyNow(record?.job_id?._id)}
          type={record.isExpired ? "default" : "primary"}
          className={record.isExpired ? "bg-gray-200 text-gray-500" : "bg-blue-500 hover:bg-blue-600"}
        >
          {record.isExpired ? "Job Expired" : "Apply Now →"}
        </Button>
      ),
    },
  ];

  const mapJobData = (jobFavorites: JobApplication[]) => {
    return jobFavorites.map((job) => ({
      key: job._id,
      title: job.job_id.title,
      location: job.job_id.city_id,  // Update to use city name if available
      salary: job.job_id.salary_range ? `${job.job_id.salary_range.min}-${job.job_id.salary_range.max}` : "Negotiable",
      jobExpire: job.job_id.is_expired ? "Expired" : null,
      bgColor: "bg-gray-200", // Set default background color or customize
      icon: job?.job_id?.title.charAt(0), // First letter of job title
      jobType: job?.job_id?.job_contract_type,  // Full time, part time etc.
      jobTypeBg: job?.job_id?.job_contract_type === "fulltime" ? "bg-blue-100" : "bg-green-100",
      jobTypeColor: job?.job_id?.job_contract_type === "fulltime" ? "text-blue-600" : "text-green-600",
      isExpired: job.job_id?.is_expired,
    }));
  };

  const handleGetAll = async (current = 1, pageSize = 10) => {
    setLoading(true)
    try {
      const params = {
        current,
        pageSize,
        query: {
          user_id: userDetail?._id,
        },
      };
        const res = await API_FAVORITE_JOB.getAllJobFavorite(params, userDetail?.access_token);
        if (res.data) {
          setJobFavorites(res.data.items);
          setMeta(res.data.meta);
          setLoading(false)
        }
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    handleGetAll();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Công việc yêu thích ({jobFavorites.length || 0})</h1>

      {/* Favorite Jobs Table */}
     <LoadingComponent isLoading={loading}>

     <div className="bg-white rounded-lg shadow">
        <Table columns={columns} dataSource={jobFavorites} pagination={false} />
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

