import { Avatar, Popover, List } from "antd";
import { CircleHelp } from "lucide-react";
import {
  BulbOutlined,
  BookOutlined,
  VideoCameraOutlined,
  UserOutlined,
  HistoryOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const FloatingButton = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleNavigate = (route: string) => {
    navigate(route);
  };

  const popoverContent = (
    <div className="w-64">
      <List
        itemLayout="horizontal"
        dataSource={[
          // { icon: <BulbOutlined />, text: "Đánh giá" },
          // { icon: <BookOutlined />, text: "Hướng dẫn sử dụng" },
          // { icon: <VideoCameraOutlined />, text: "Video hướng dẫn" },
          // { icon: <UserOutlined />, text: "Đặt lịch demo" },
          {
            icon: <HistoryOutlined />,
            text: t("system_activities"),
            route: "/system/activities",
          },
          // { icon: <FileTextOutlined />, text: "Phiên bản: 6.19.0" },
          // { icon: <QuestionCircleOutlined />, text: "Giúp đỡ và hỗ trợ" },
          // { icon: <MessageOutlined />, text: "Chat trực tiếp" },
        ]}
        renderItem={(item) => (
          <List.Item
            className="!cursor-pointer hover:!bg-gray-100 !rounded-md transition-all duration-200 ease-in-out"
            onClick={() => item.route && handleNavigate(item.route)}
          >
            <List.Item.Meta
              avatar={
                <span className="text-gray-400 text-lg mr-2">{item.icon}</span>
              }
              title={
                <span className="text-gray-600 font-medium">{item.text}</span>
              }
              className="!items-center"
            />
          </List.Item>
        )}
      />
    </div>
  );

  return (
    <div className="fixed bottom-8 right-10">
      <Popover content={popoverContent} trigger="hover" placement="topLeft">
        <Avatar
          shape="square"
          icon={<CircleHelp />}
          size={45}
          className="shadow-lg !bg-white !text-primaryColor border-none hover:!shadow-zinc-400 !cursor-pointer rounded-full"
        />
      </Popover>
    </div>
  );
};

export default FloatingButton;
