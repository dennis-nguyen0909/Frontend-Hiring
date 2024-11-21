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
const { Text, Title } = Typography;
const OverviewEmployer = () => {
  const columns = [
    {
      title: "JOBS",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: any) => (
        <div>
          {console.log("reasdad",record)}
          <div className="font-medium">{text}</div>
          <div className="text-gray-500 text-sm">
            {record?.job_type} • {calculateTimeRemaining(record?.expire_date)}
          </div>
        </div>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "is_active",
      key: "is_active",
      render: (isActive:any) => (
        <>
        <Badge
          status={isActive ? "success" : "error"}
          text={isActive ? "Active" : "Expired"}
          className="whitespace-nowrap"
          />
          {console.log("record",isActive)}
          </>
      ),
    },
    {
      title: "APPLICATIONS",
      dataIndex: "applications",
      key: "applications",
      render: (count: number) => (
        <div className="flex items-center gap-2">
          <TeamOutlined />
          <span>{count} Applications</span>
        </div>
      ),
    },
    {
      title: "ACTIONS",
      key: "actions",
      render: () => (
        <div className="flex gap-2">
          <Button type="primary" className="bg-blue-500">
            View Applications
          </Button>
          <Dropdown
            menu={{
              items: [
                { key: "1", label: "Promote Job" },
                { key: "2", label: "View Detail" },
                { key: "3", label: "Mark as expired" },
              ],
            }}
            trigger={["click"]}
          >
            <Button icon={<EllipsisOutlined />} />
          </Dropdown>
        </div>
      ),
    },
  ];

  const [metaSaveCandidate,setMetaSaveCandidate]=useState<Meta>(defaultMeta)
  const [jobRecents, setJobRecents] = useState<never[]>([]);
  const [metaJobRecents, setMetaJobRecents] = useState<Meta>(defaultMeta);
  const userDetail = useSelector((state) => state.user);
  const [countJobActive, setCountJobActive] = useState<number>(0);
  const [countOpenJob, setCountOpenJob] = useState(1);
  const [countSaveCandidate, setCountSaveCandidate] = useState(1);
  const handleGetSaveCandidate = async ({ current = 1, pageSize = 10 }) => {
    const params = {
      current, // Trang hiện tại
      pageSize, // Số lần phần tử một trang
    };

    try {
      // Gọi API với các tham số phân trang
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
  const handleGetAllJobRecent =async ({current=1,pageSize=10})=>{
    try {
      const res = await JobApi.getAllJobRecent({pageSize:pageSize,current:current},userDetail?._id);
      console.log("res",res)
      if(res.data){
        setJobRecents(res.data.items)
        setMetaJobRecents(res.data.meta)
      }
    }catch(error){
      console.error(error)
    }
  }
  const handletGetJobActivity = async ()=>{
    try {
      const res = await JobApi.countActiveJobsByUser(userDetail?._id,userDetail?.access_token);
      if(res.data){
        setCountJobActive(res.data)
      }
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(()=>{
    handleGetSaveCandidate({current:1,pageSize:10})
    handleGetAllJobRecent({current:1,pageSize:10})
    handletGetJobActivity();
  },[])

  useEffect(() => {
    if (countJobActive === 0) return; 
    let start = 1; 
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

    // Cleanup interval khi component unmount hoặc countJobActive thay đổi
    return () => clearInterval(interval);
  }, [countJobActive]); // Khi countJobActive thay đổi, bắt đầu đếm lại

  useEffect(() => {
    if (metaSaveCandidate.total === 0) return; 
    let start = 1; 
    const end = metaSaveCandidate.total;
    const duration = 500;

    const intervalTime = duration / (end - start);

    const interval = setInterval(() => {
      start += 1;
      setCountSaveCandidate(start);
      if (start >= end) {
        clearInterval(interval); // Dừng interval khi đếm đến cuối
      }
    }, intervalTime);

    // Cleanup interval khi component unmount hoặc countJobActive thay đổi
    return () => clearInterval(interval);
  }, [metaSaveCandidate.total]); // Khi countJobActive thay đổi, bắt đầu đếm lại
  return (
    <div>
      <div className="mb-8 flex flex-col gap-1">
        <Text className="font-semibold text-3xl">
          Hello, {userDetail?.full_name}
        </Text>
        <Text className="font-semibold text-1xl">
          Company : {userDetail?.company_name}
        </Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="text-3xl font-bold">{countOpenJob}</div>
          <div className="flex items-center gap-2">
            <FileTextOutlined />
            <span>Open Jobs</span>
          </div>
        </div>
        <div className="bg-orange-50 p-6 rounded-lg">
          <div className="text-3xl font-bold">{countSaveCandidate}</div>
          <div className="flex items-center gap-2">
            <SaveOutlined />
            <span>Saved Candidates</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <p className="mb-0">Recently Posted Jobs</p>
          <Button type="link">View all</Button>
        </div>
        <Table
          columns={columns}
          dataSource={jobRecents}
          pagination={false}
          className="[&_.ant-table-thead_.ant-table-cell]:bg-gray-50"
        />
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
