import { Avatar, Button, Pagination, Table } from "antd";
import { API_APPLICATION } from "../../../../services/modules/ApplicationServices";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Meta } from "../../../../types";
import CustomPagination from "../../../../components/ui/CustomPanigation/CustomPanigation";
import moment from "moment";
import { Circle, CircleCheck, CircleX, MapPin } from "lucide-react";
import { capitalizeFirstLetter } from "../../../../untils";
interface Applied {
  _id:string;
  user_id:any;
  job_id:any;
  employer_id:any;
  cover_letter:string;
  status:string;
  save_candidates:any[];
  applied_date:string;

}
const Applied = () => {
  const userDetail = useSelector((state) => state.user);
  const [listApplied, setListApplied] = useState<Applied[]>([]);
  const [meta, setMeta] = useState<Meta>({});
  const columns = [
    {
      title: "JOBS",
      dataIndex: "job",
      key: "job",
      render: (text, record) => (
        <div className="flex items-center">
          <div
            className={`flex items-center justify-center mr-5`}
          >
            <Avatar  size={45} shape="square"  src={record?.employer_id?.avatar_company} />
          </div>
          <div className="flex flex-col">
            <div className="font-semibold">{record?.job_id?.title}</div>
            <div className="text-gray-500 text-sm">
              <div className="flex items-center gap-1">
              <MapPin size={16} />
              <span className="mr-2">{record?.job_id?.city_id.name}</span>
              </div>
              <span>{record.salary}</span>
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
      title: "DATE APPLIED",
      dataIndex: "dateApplied",
      key: "dateApplied",
      render:(record)=>(
        <span>{moment(record?.applied_date).format("DD-MM-YYYY")}</span>
      )
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <div className="flex items-center gap-2" >
        <span>{text === 'pending' ? <Circle size={16} className="text-orange-400"/> : text==='rejected' ?<CircleX  className="text-red-500" size={16}/> :<CircleCheck size={16} className="text-green-500" />}</span>
        <span className={`${text === 'pending' ? "text-orange-400" : text === 'rejected' ? 'text-red-500' :"text-green-500"}`}>  {capitalizeFirstLetter(text)} {console.log("text",text)}</span>
        </div >
      )
    },
    {
      title: "ACTION",
      key: "action",
      render: () => (
        <Button type="primary" className="bg-blue-500 hover:bg-blue-600">
          View Details
        </Button>
      ),
    },
  ];

  const data = [
    {
      key: "1",
      job: "Networking Engineer",
      location: "Washington",
      salary: "$50k-80k/month",
      dateApplied: "Feb 2, 2019 19:28",
      status: "Active",
      bgColor: "bg-green-500",
      icon: "Up",
      jobType: "Remote",
      jobTypeBg: "bg-blue-100",
      jobTypeColor: "text-blue-600",
    },
    {
      key: "2",
      job: "Product Designer",
      location: "Dhaka",
      salary: "$50k-80k/month",
      dateApplied: "Dec 7, 2019 23:26",
      status: "Active",
      bgColor: "bg-pink-500",
      icon: "Pd",
      jobType: "Full Time",
      jobTypeBg: "bg-purple-100",
      jobTypeColor: "text-purple-600",
    },
    {
      key: "3",
      job: "Junior Graphic Designer",
      location: "Brazil",
      salary: "$50k-80k/month",
      dateApplied: "Feb 2, 2019 19:28",
      status: "Active",
      bgColor: "bg-black",
      icon: "🍎",
      jobType: "Temporary",
      jobTypeBg: "bg-yellow-100",
      jobTypeColor: "text-yellow-600",
    },
    {
      key: "4",
      job: "Visual Designer",
      location: "Wisconsin",
      salary: "$50k-80k/month",
      dateApplied: "Dec 7, 2019 23:26",
      status: "Active",
      bgColor: "bg-blue-500",
      icon: "Vd",
      jobType: "Contract Base",
      jobTypeBg: "bg-green-100",
      jobTypeColor: "text-green-600",
    },
    {
      key: "5",
      job: "Marketing Officer",
      location: "United States",
      salary: "$50k-80k/month",
      dateApplied: "Dec 4, 2019 21:42",
      status: "Active",
      bgColor: "bg-blue-400",
      icon: "🐦",
      jobType: "Full Time",
      jobTypeBg: "bg-purple-100",
      jobTypeColor: "text-purple-600",
    },
    {
      key: "6",
      job: "UI/UX Designer",
      location: "North Dakota",
      salary: "$50k-80k/month",
      dateApplied: "Dec 30, 2019 07:52",
      status: "Active",
      bgColor: "bg-blue-600",
      icon: "f",
      jobType: "Full Time",
      jobTypeBg: "bg-purple-100",
      jobTypeColor: "text-purple-600",
    },
    {
      key: "7",
      job: "Software Engineer",
      location: "New York",
      salary: "$50k-80k/month",
      dateApplied: "Dec 30, 2019 05:18",
      status: "Active",
      bgColor: "bg-gray-300",
      icon: "🧩",
      jobType: "Full Time",
      jobTypeBg: "bg-purple-100",
      jobTypeColor: "text-purple-600",
    },
    {
      key: "8",
      job: "Front End Developer",
      location: "Michigan",
      salary: "$50k-80k/month",
      dateApplied: "Mar 20, 2019 23:14",
      status: "Active",
      bgColor: "bg-orange-500",
      icon: "🅾️",
      jobType: "Full Time",
      jobTypeBg: "bg-purple-100",
      jobTypeColor: "text-purple-600",
    },
  ];

  const handleGetData = async (current = 1, pageSize = 10) => {
    const params = {
      current,
      pageSize,
      query: {
        user_id: userDetail?.id,
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
  };

  useEffect(() => {
    handleGetData();
  }, []);

  const onChange =()=>{

  }
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Applied Jobs ({listApplied.length || 0})</h1>

      <div className="bg-white rounded-lg shadow">
        <Table columns={columns} dataSource={listApplied} pagination={false} />
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
