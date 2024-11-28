import React, { useEffect, useState } from "react";
import {
  Button,
  Dropdown,
  Empty,
  Form,
  Input,
  Menu,
  Radio,
  Space,
  Typography,
} from "antd";
import { DownloadOutlined, EllipsisOutlined } from "@ant-design/icons";
import { Application, Job, Meta } from "../../../../types";
import { API_APPLICATION } from "../../../../services/modules/ApplicationServices";
import { useSelector } from "react-redux";
import GeneralModal from "../../../../components/ui/GeneralModal/GeneralModal";
import ApplicationCard from "../Application/ApplicationCard";
import { ChevronsLeft } from "lucide-react";

const { Title, Text } = Typography;
interface IPropJobApplication {
  handleChangeHome: () => void;
  selectedJob: Job;
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
  const [meta, setMeta] = useState<Meta>({
    count: 0,
    current_page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0,
  });

  const handleEditSubmit = () => {};

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
          Save Changes
        </Button>
      </Form>
    );
  };
  const handleGetJobByEmployer = async ({ current = 1, pageSize = 10 }) => {
    const params = {
      current, // Trang hiện tại
      pageSize, // Số lượng phần tử mỗi trang
    };

    try {
      const res = await API_APPLICATION.getApplicationByEmployerJobId(
        selectedJob._id,
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
  }, []);
  return (
    <div className="p-6">
      <div className="mb-6 text-sm text-gray-500">
      {/* <ChevronLeft /> */}
      <ChevronsLeft  className="cursor-pointer hover:text-primaryColor rounded-full" onClick={handleChangeHome} size={40} />
        {/* <span className="hover:text-gray-700 cursor-pointer">Home</span>
        {" / "}
        <span className="hover:text-gray-700 cursor-pointer">Job</span>
        {" / "}
        <span className="hover:text-gray-700 cursor-pointer">
          Senior UI/UX Designer
        </span>
        {" / "}
        <span className="text-gray-700">Applications</span> */}
      </div>

      <div className="mb-6 flex items-center justify-between">
        
        <Title level={2} className="m-0">
          Job Applications
        </Title>
        <Space>
          <Button>Filter</Button>
          <Dropdown overlay={sortMenu} trigger={["click"]}>
            <Button>
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
              className="m-0 bg-yellow-500 text-white px-[15px]  rounded-full"
            >
              Đang chờ
            </Title>
            <Button icon={<EllipsisOutlined />} type="text" />
          </div>
          {applications.length>0 ? applications?.map((applied) => {
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
          }) :(<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />)}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <Title
              level={4}
              className="m-0 bg-red-500 text-white px-[15px]  rounded-full"
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
              className="m-0 bg-green-500 text-white px-[15px]  rounded-full"
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
    </div>
  );
};

export default JobApplication;
