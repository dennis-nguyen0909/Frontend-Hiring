import { Avatar, Button, Table } from "antd";
import { API_APPLICATION } from "../../../../services/modules/ApplicationServices";
import { useEffect, useState } from "react";
import LoadingComponent from "../../../../components/Loading/LoadingComponent";
import { BadgeDollarSign, Circle, CircleCheck, CircleX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useCalculateUserProfile from "../../../../hooks/useCaculateProfile";
import moment from "moment";
import LoadingComponentSkeleton from "../../../../components/Loading/LoadingComponentSkeleton";
import CustomPagination from "../../../../components/ui/CustomPanigation/CustomPanigation";
import { Meta } from "../../../../types";

const OverViewCandidate = ({ userDetail }) => {
  const navigate = useNavigate();
  const { data: caculateProfile } = useCalculateUserProfile(userDetail?._id, userDetail?.access_token);

  const recentlyAppliedColumns = [
    {
      title: 'Việc làm',
      dataIndex: 'job',
      key: 'job',
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <Avatar shape="square" className="shadow-lg" size={45} src={record.icon} />
          <div>
            <div className="font-semibold text-[12px]">{text}</div>
            <div className="text-gray-500 text-[12px]">
              {record.is_negotiable ? (
                <div className="flex items-center gap-1">
                  <span className="mr-2 text-[12px]">{record.location}</span>
                  <BadgeDollarSign size={12} />
                  <span className="text-[12px]">Thỏa thuận</span>
                </div>
              ) : (
                <span>{record.salary}</span>
              )}
            </div>
          </div>
        </div>
      ),
      className: "min-w-[200px] text-[12px]" // Giữ chiều rộng tối thiểu cho cột "Việc làm"
    },
    {
      title: 'Ngày nộp',
      dataIndex: 'dateApplied',
      key: 'dateApplied',
      className: "min-w-[150px] text-[12px]", // Giữ chiều rộng tối thiểu cho cột "Ngày nộp"
      render:(dateApplied)=><div className="text-[12px]">{moment(dateApplied).format('DD/MM/YYYY HH:mm')}</div>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <div className="flex items-center gap-2">
          <span>
            {text === 'Pending' ? (
              <Circle size={12} className="text-orange-400" />
            ) : text === 'Rejected' ? (
              <CircleX className="text-red-500" size={12} />
            ) : (
              <CircleCheck size={12} className="text-green-500" />
            )}
          </span>
          <span className={`${text === 'Pending' ? 'text-orange-400' : text === 'Rejected' ? 'text-red-500' : 'text-green-500'} text-[12px]`}>
            {text}
          </span>
        </div>
      ),
      className: "min-w-[120px] text-[12px]" // Giữ chiều rộng tối thiểu cho cột "Trạng thái"
    },
    {
      title: 'Hành động',
      key: 'action',
      render: () => <Button size="small" type="primary" className="bg-blue-500 hover:bg-blue-600 text-[12px]">Xem chi tiết</Button>,
      className: "min-w-[150px] text-[12px]", // Giữ chiều rộng tối thiểu cho cột "Hành động"
    },
  ];

  const [loading, setLoading] = useState(false);
  const [jobsApplied, setJobsApplied] = useState([]);
  const [meta,setMeta]=useState<Meta>({})
  const [countApplied, setCountApplied] = useState(0);
  const [endValue, setEndValue] = useState(0);

  const handleGetAppliedUser = async () => {
    const res = await API_APPLICATION.getCountAppliedCandidate(userDetail?._id, userDetail?.access_token);
    if (res.data) {
      setEndValue(+res.data);
      setCountApplied(0);
    }
  };

  const handleGetJobsAppliedRecent = async (current=1,pageSize=15) => {
    try {
      setLoading(true)
      const params ={
        current,
        pageSize,
        query:{
          user_id:userDetail?._id
        }
      }
      const res = await API_APPLICATION.getAll(params,userDetail?.access_token);
      if(res?.data){
        const formattedData = res?.data?.items?.map(item => ({
              key: item?._id,
              job: item?.job_id?.title,
              location: `${item?.job_id?.city_id?.name}`,
              salary: item?.job_id?.salary_range ? `$${item?.job_id?.salary_range?.min || 0} - $${item?.job_id?.salary_range?.max || 0}` : 'Negotiable',
              dateApplied: new Date(item?.applied_date)?.toLocaleString(),
              status: item?.status?.charAt(0)?.toUpperCase() + item?.status?.slice(1),
              icon: item?.employer_id?.avatar_company,
              is_negotiable: item?.job_id?.is_negotiable,
            }));
        setJobsApplied(formattedData)
        setMeta(res.data.meta)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    handleGetJobsAppliedRecent();
    handleGetAppliedUser();
  }, []);

  useEffect(() => {
    if (countApplied >= endValue || endValue === 0) return;
    const duration = 500;
    const intervalTime = duration / (endValue - countApplied);
    const interval = setInterval(() => {
      setCountApplied((prevCount) => {
        const newCount = prevCount + 1;
        if (newCount >= endValue) {
          clearInterval(interval);
          return endValue;
        }
        return newCount;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [countApplied, endValue]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1">Xin chào, {userDetail?.full_name}</h1>
      <p className="text-gray-500 mb-6 text-[12px]">Đây là hoạt động hàng ngày và thông báo công việc của bạn</p>

      {/* Stats */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-[18px] font-bold">{countApplied || 0}</div>
          <div className="text-blue-600 text-[12px]">Việc làm ứng tuyển</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-[18px] font-bold">{userDetail?.favorite_jobs.length || 0}</div>
          <div className="text-yellow-600 text-[12px]">Việc làm yêu thích</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-[18px] font-bold">0</div>
          <div className="text-green-600 text-[12px]">Thông báo việc làm</div>
        </div>
      </div>

      {/* Profile Alert */}
      {+caculateProfile < 100 && (
        <div className="bg-[#e05051] p-4 rounded-lg flex flex-col sm:flex-row items-center mb-6">
          <Avatar size={50} src={userDetail?.avatar} />
          <div className="flex-1 ml-3">
            <h3 className="font-semibold text-white text-[12px] text-center lg:text-left">Việc chỉnh sửa hồ sơ của bạn chưa hoàn tất.</h3>
            <p className="text-white text-[12px] text-center lg:text-left">Hoàn tất chỉnh sửa hồ sơ của bạn và xây dựng Sơ yếu lý lịch tùy chỉnh của bạn</p>
          </div>
          <Button onClick={() => navigate(`/profile/${userDetail?._id}`)} type="primary" className="mt-4 sm:mt-0 !bg-white !text-[#e05051] !border-red-500 !hover:bg-red-50 !text-[12px]">
            Cập nhật ngay
          </Button>
        </div>
      )}

      {/* Recently Applied Việc làm */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-[12px] font-semibold">Đã ứng tuyển gần đây</h2>
          <a href="#" className="text-blue-500 text-[12px] hover:underline">Xem tất cả →</a>
        </div>
          <div className="overflow-x-auto">
            <Table
            loading={loading}
              className="text-[12px] w-full"
              columns={recentlyAppliedColumns}
              dataSource={jobsApplied}
              pagination={false}
              scroll={{ x: 'max-content' }}  // Cấu hình cuộn ngang
            />
          </div>
          {jobsApplied.length>0 && <CustomPagination className="py-2 text-[12px]" currentPage={meta?.current_page} perPage={meta?.per_page} total={meta?.total} onPageChange={(current,pageSize)=>(
            handleGetJobsAppliedRecent(current,pageSize)
          )} />}
      </div>
    </div>
  );
};

export default OverViewCandidate;
