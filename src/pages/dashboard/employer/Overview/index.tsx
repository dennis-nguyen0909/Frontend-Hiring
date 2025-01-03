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
import './styles.css'
const { Text, Title } = Typography;
const OverviewEmployer = () => {
  const columns = [
    {
      title: "Công việc",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: any) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-gray-500 text-sm">
            {record?.job_contract_type?.name} • {calculateTimeRemaining(record?.expire_date)}
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      key: "is_active",
      render: (isActive:any) => (
        <>
        <Badge
          status={isActive ? "success" : "error"}
          text={isActive ? "Hoạt động" : "Đã hết hạn"}
          className="whitespace-nowrap"
          />
          </>
      ),
    },
    {
      title: "Số lượng ứng tuyển",
      dataIndex: "applications",
      key: "applications",
      render: (count: number) => (
        <div className="flex items-center gap-2">
          <TeamOutlined />
          <span>{count} Người ứng tuyển</span>
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: () => (
        <div className="flex gap-2">
          <Button type="primary" className="bg-blue-500">
            Xem đơn ứng tuyển
          </Button>
          <Dropdown
            menu={{
              items: [
                { key: "1", label: "Quảng bá việc làm" },
                { key: "2", label: "Xem chi tiết" },
                { key: "3", label: "Đánh dấu là đã hết hạn" },
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
  const [countOpenJob, setCountOpenJob] = useState(0);
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
      const params ={
        current,
        pageSize,
        query:{
          user_id:userDetail?._id
        }
      }
      const res = await JobApi.getAllJobRecent(params,userDetail?._id);
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

    // Cleanup interval khi component unmount hoặc countJobActive thay đổi
    return () => clearInterval(interval);
  }, [countJobActive]); // Khi countJobActive thay đổi, bắt đầu đếm lại

  useEffect(() => {
    // If the count is 0, do not start the interval
    if (metaSaveCandidate.count === 0) {
      setCountSaveCandidate(0); // Set count to 0 directly when there's no count
      return; // Exit early if count is 0
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
  
    // Cleanup interval on unmount hoặc when metaSaveCandidate.count changes
    return () => clearInterval(interval);
  }, [metaSaveCandidate.count]); 
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
            <span>Việc làm mở</span>
          </div>
        </div>
        <div className="bg-orange-50 p-6 rounded-lg">
          <div className="text-3xl font-bold">{countSaveCandidate}</div>
          <div className="flex items-center gap-2">
            <SaveOutlined />
            <span>Lưu ứng viên</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <p className="mb-0">Công việc đăng gần đây</p>
          <Button type="link">Xemall</Button>
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
