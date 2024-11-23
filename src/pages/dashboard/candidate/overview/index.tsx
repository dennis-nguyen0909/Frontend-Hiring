import { Button, Table } from "antd";
import { API_APPLICATION } from "../../../../services/modules/ApplicationServices";
import { useEffect, useState } from "react";
import LoadingComponent from "../../../../components/Loading/LoadingComponent";

const OverViewCandidate = ({ userDetail }) => {
  const recentlyAppliedColumns = [
    {
      title: 'Job',
      dataIndex: 'job',
      key: 'job',
      render: (text, record) => (
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-lg mr-3 flex items-center justify-center text-white ${record.bgColor}`}>
            {record.icon}
          </div>
          <div>
            <div className="font-semibold">{text}</div>
            <div className="text-gray-500 text-sm">
              <span className="mr-2">{record.location}</span>
              <span>{record.salary}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Date Applied',
      dataIndex: 'dateApplied',
      key: 'dateApplied',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <span className="text-green-500">✓ {text}</span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Button type="primary" className="bg-blue-500 hover:bg-blue-600">View Details</Button>
      ),
    },
  ];

  const [loading, setLoading] = useState<boolean>(false);
  const [jobsApplied, setJobsApplied] = useState<any[]>([]);
  const [countApplied, setCountApplied] = useState<number>(0);
  const [endValue, setEndValue] = useState<number>(0); // Giá trị đích từ API

  const handleGetAppliedUser = async () => {
    const res = await API_APPLICATION.getCountAppliedCandidate(userDetail?._id, userDetail?.access_token);
    if (res.data) {
      console.log("res.data",res.data)
      setEndValue(+res.data);
      setCountApplied(0);
    }
  };

  const handleGetJobsAppliedRecent = async () => {
    setLoading(true);
    const res = await API_APPLICATION.getRecentlyAppliedCandidate(userDetail?._id, '10', userDetail?.access_token);
    if (res.data) {
      const formattedData = res.data.map(item => ({
        key: item._id,
        job: item.job_id.title,
        location: `${item.job_id.address}`,
        salary: item.job_id.salary_range ? `$${item.job_id.salary_range.min || 0} - $${item.job_id.salary_range.max || 0}` : 'Negotiable',
        dateApplied: new Date(item.applied_date).toLocaleString(),
        status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
        bgColor: 'bg-green-500',
        icon: 'Up',
      }));
      setJobsApplied(formattedData);
    }
    setLoading(false);
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
      <h1 className="text-2xl font-semibold mb-1">Hello, {userDetail?.full_name}</h1>
      <p className="text-gray-500 mb-6">Here is your daily activities and job alerts</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-3xl font-bold">{countApplied || 0}</div>
          <div className="text-blue-600">Applied jobs</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-3xl font-bold">238</div>
          <div className="text-yellow-600">Favorite jobs</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-3xl font-bold">574</div>
          <div className="text-green-600">Job Alerts</div>
        </div>
      </div>

      {/* Profile Alert */}
      <div className="bg-red-100 p-4 rounded-lg flex items-center mb-6">
        <img src="/placeholder.svg?height=40&width=40" alt="Profile" className="w-10 h-10 rounded-full mr-4" />
        <div className="flex-1">
          <h3 className="font-semibold text-red-700">Your profile editing is not completed.</h3>
          <p className="text-red-600">Complete your profile editing & build your custom Resume</p>
        </div>
        <Button type="primary" className="bg-white text-red-500 border-red-500 hover:bg-red-50">
          Edit Profile →
        </Button>
      </div>

      {/* Recently Applied Jobs */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Recently Applied</h2>
          <a href="#" className="text-blue-500 hover:underline">View all →</a>
        </div>
        <LoadingComponent isLoading={loading}>
        <Table columns={recentlyAppliedColumns} dataSource={jobsApplied} pagination={false} />

        </LoadingComponent>
      </div>
    </div>
  );
};

export default OverViewCandidate;
