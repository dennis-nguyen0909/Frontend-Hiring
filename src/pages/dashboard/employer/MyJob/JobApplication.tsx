import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Dropdown,
  Empty,
  Form,
  Input,
  Menu,
  message,
  Radio,
  Space,
  TimePicker,
  Typography,
} from "antd";
import { DownloadOutlined, EllipsisOutlined } from "@ant-design/icons";
import { Application, Job, Meta } from "../../../../types";
import { API_APPLICATION } from "../../../../services/modules/ApplicationServices";
import { useSelector } from "react-redux";
import GeneralModal from "../../../../components/ui/GeneralModal/GeneralModal";
import ApplicationCard from "../Application/ApplicationCard";
import { ChevronsLeft } from "lucide-react";
import { useForm } from "antd/es/form/Form";
import { USER_API } from "../../../../services/modules/userServices";
import moment from "moment";
import LoadingComponentSkeleton from "../../../../components/Loading/LoadingComponentSkeleton";
import { useNavigate, useParams } from "react-router-dom";

const { Title, Text } = Typography;
interface IPropJobApplication {
  handleChangeHome?: () => void;
  selectedJob?: Job;
}
const JobApplication: React.FC<IPropJobApplication> = ({
  handleChangeHome,
  selectedJob,
}) => {
  const sortMenu = (
    <Menu>
      <Menu.Item key="newest">
        <Radio value="newest">Newest</Radio>
      </Menu.Item>
      <Menu.Item key="oldest">
        <Radio value="oldest">Oldest</Radio>
      </Menu.Item>
    </Menu>
  );

  const userDetail = useSelector((state) => state.user);
  const [applications, setApplications] = useState<Application[]>([]);
  const [visibleEdit, setVisibleEdit] = useState<boolean>(false);
  const [visibleEmail, setVisibleEmail] = useState<boolean>(false);
  const [selectedApplied, setSelectedApplie] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [meta, setMeta] = useState<Meta>({
    count: 0,
    current_page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0,
  });
  const location = useParams()
  const navigate = useNavigate()

  const handleEditSubmit = () => {};
  const handleBack = ()=>{
    navigate(-1)
  }
  const onBack = handleChangeHome || handleBack
  const renderEdit = () => {
    return (
      <Form onFinish={handleEditSubmit}>
        <Form.Item
          label="User Name"
          name="user_id"
          rules={[{ required: true, message: "Please input the user name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Job Title"
          name="job_id"
          rules={[{ required: true, message: "Please input the job title!" }]}
        >
          <Input />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Lưu thay đổi
        </Button>
      </Form>
    );
  };

  const onFinish = async (values: any) => {
    setIsLoading(true)
    const params = {
      ...values,
      interviewDate: moment(values.interviewDate).format("DD/MM/YYYY"),
      interviewTime: moment(values.interviewTime).format(" HH:mm:ss"),
    };
    const res = await USER_API.employerSendMailtoCandidate(
      params,
      userDetail?.access_token
    );
    if (+res.statusCode === 201) {
      setVisibleEmail(false);
      setSelectedApplie({});
      message.success("Gửi email thành công!");
    }
    setIsLoading(false)
  };
  const [form] = useForm();
  const handleOpenModalEmail = (applied: any) => {
    setVisibleEmail(true);
    setSelectedApplie(applied);
  };

  const renderBodyEmail = () => {
    return (
     <LoadingComponentSkeleton isLoading={isLoading}>
       <Form
        form={form}
        onFinish={onFinish}
        initialValues={{
          recruiterCompany: userDetail?.company_name,
          recruiterEmail: userDetail?.email,
          candidateName: selectedApplied?.user_id?.full_name,
          jobTitle: selectedApplied?.job_id?.title,
          candidateEmail: selectedApplied?.user_id?.email,
        }}
        layout="vertical"
      >
        <Form.Item label="Tên công ty" name="recruiterCompany">
          <Input placeholder="Enter company name" disabled />
        </Form.Item>
        <Form.Item label="Recruiter Email" name="recruiterEmail">
          <Input type="email" placeholder="Enter recruiter email" disabled />
        </Form.Item>

        <Form.Item label="Ứng Viên Name" name="candidateName">
          <Input placeholder="Enter candidate name" disabled />
        </Form.Item>

        <Form.Item label="Ứng Viên Email" name="candidateEmail">
          <Input placeholder="Enter candidate name" disabled />
        </Form.Item>

        <Form.Item label="Job Title" name="jobTitle">
          <Input placeholder="Enter job title" disabled />
        </Form.Item>

        <Form.Item
          label="Interview Date"
          name="interviewDate"
          rules={[
            { required: true, message: "Please select the interview date!" },
          ]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Interview Time"
          name="interviewTime"
          rules={[
            { required: true, message: "Please select the interview time!" },
          ]}
        >
          <TimePicker style={{ width: "100%" }} format="HH:mm" />
        </Form.Item>

        <Form.Item
          label="Interview Location"
          name="interviewLocation"
          rules={[
            { required: true, message: "Please input the interview location!" },
          ]}
        >
          <Input placeholder="Enter interview location" />
        </Form.Item>

        <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
          Generate Email
        </Button>
      </Form>
     </LoadingComponentSkeleton>
    );
  };
  console.log("duydeptrai lo",location)
  const handleGetJobByEmployer = async ({ current = 1, pageSize = 10 }) => {
    const params = {
      current, // Trang hiện tại
      pageSize, // Số lượng phần tử mỗi trang
    };

    try {
      const res = await API_APPLICATION.getApplicationByEmployerJobId(
        selectedJob?._id || location?.id,
        params,
        userDetail.access_token
      );
      if (res.data) {
        setApplications(res.data.items);
        setMeta(res.data.meta);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };
  useEffect(() => {
    handleGetJobByEmployer({ current: 1, pageSize: 10 });
  }, [location?.id,selectedJob?._id]);
  return (
    <div className="p-6">
      <div className="mb-6 text-sm text-gray-500">
        {/* <ChevronLeft /> */}
        <ChevronsLeft
          className="cursor-pointer hover:text-primaryColor rounded-full"
          onClick={onBack}
          size={40}
        />
      </div>

      <div className="mb-6 flex items-center justify-between">
        <Title level={2} className="m-0 !text-[16px]">
          Đơn ứng tuyển
        </Title>
        <Space>
          <Button className="!text-[12px]">Filter</Button>
          <Dropdown overlay={sortMenu} trigger={["click"]}>
            <Button className="!text-[12px]">
              Sort <DownloadOutlined />
            </Button>
          </Dropdown>
        </Space>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <div className="flex items-center justify-between mb-4">
            <Title
              level={4}
              className="m-0 bg-yellow-500 text-white px-[15px]  rounded-full !text-[14px]"
            >
              Đang chờ
            </Title>
            <Button icon={<EllipsisOutlined />} type="text" />
          </div>
          {applications.length > 0 ? (
            applications?.map((applied) => {
              return (
                <>
                  {applied.status === "pending" && (
                    <ApplicationCard
                      applied={applied}
                      handleFetchData={() =>
                        handleGetJobByEmployer({ current: 1, pageSize: 10 })
                      }
                    />
                  )}
                </>
              );
            })
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <Title
              level={4}
              className="m-0 bg-red-500 text-white px-[15px]  rounded-full !text-[14px]"
            >
              Từ chối
            </Title>
            <Button icon={<EllipsisOutlined />} type="text" />
          </div>
          {applications?.map((applied) => {
            return (
              <>
                {applied.status === "rejected" && (
                  <ApplicationCard
                    applied={applied}
                    handleFetchData={() =>
                      handleGetJobByEmployer({ current: 1, pageSize: 10 })
                    }
                  />
                )}
              </>
            );
          })}
        </div>
        <div>
          <div className="flex items-center justify-between mb-4">
            <Title
              level={4}
              className="m-0 bg-green-500 text-white px-[15px]  rounded-full !text-[14px]"
            >
              Chấp nhận
            </Title>
            <Button icon={<EllipsisOutlined />} type="text" />
          </div>
          {applications?.map((applied) => {
            return (
              <>
                {applied.status === "accepted" && (
                  <ApplicationCard
                    handleOpenModalEmail={handleOpenModalEmail}
                    applied={applied}
                    handleFetchData={() =>
                      handleGetJobByEmployer({ current: 1, pageSize: 10 })
                    }
                  />
                )}
              </>
            );
          })}
        </div>
      </div>
      <GeneralModal
        title="Cập nhật"
        onOk={handleEditSubmit}
        renderBody={renderEdit}
        visible={visibleEdit}
        onCancel={() => setVisibleEdit(false)}
      />
      <GeneralModal
        title="Gửi email"
        onOk={() => setVisibleEmail(false)}
        renderBody={renderBodyEmail}
        visible={visibleEmail}
        onCancel={() => setVisibleEmail(false)}
      />
    </div>
  );
};

export default JobApplication;
