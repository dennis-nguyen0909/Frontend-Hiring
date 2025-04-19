import React, { useState, useEffect } from "react";
import {
  Button,
  Dropdown,
  Menu,
  message,
  Modal,
  Space,
  Typography,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  MailOutlined,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons";
import { Application } from "../../../../types";
import { API_APPLICATION } from "../../../../services/modules/ApplicationServices";
import { useSelector } from "react-redux";
import { SAVE_CANDIDATE_API } from "../../../../services/modules/SaveCandidateServices";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

// Define the RootState interface for Redux state
interface RootState {
  user: {
    id: string;
    access_token: string;
  };
}

// Extended Application interface to include additional properties
interface ExtendedApplication
  extends Omit<Application, "cv_id" | "user_id" | "job_id"> {
  user_id: {
    _id: string;
    full_name: string;
    email?: string;
    avatar?: string;
    total_experience_months?: number;
  };
  job_id: {
    _id: string;
    title: string;
    description: string;
    requirement: string[];
  };
  cv_id: {
    cv_link: string;
    cv_name: string;
  };
}

interface ApplicationCardProps {
  applied: ExtendedApplication;
  handleFetchData: () => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  applied,
  handleFetchData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const userDetail = useSelector((state: RootState) => state.user);
  const { t } = useTranslation();

  // Check if candidate is saved on component mount
  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        const res = await SAVE_CANDIDATE_API.isSaveCandidate(
          applied.user_id._id,
          userDetail.id,
          userDetail.access_token
        );
        if (res?.data) {
          setIsSaved(res.data.isSaved);
        }
      } catch (error) {
        console.error("Error checking if candidate is saved:", error);
      }
    };

    if (userDetail.id && applied.user_id._id) {
      checkIfSaved();
    }
  }, [userDetail.id, applied.user_id._id, userDetail.access_token]);

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      const res = await API_APPLICATION.updateApplication(
        applied._id,
        { status: "accepted" },
        userDetail.access_token
      );
      if (res?.data) {
        message.success(t("accept"));
        handleFetchData();
      }
    } catch (error) {
      console.error("Error accepting application:", error);
      message.error(t("error"));
    }
    setIsLoading(false);
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      const res = await API_APPLICATION.updateApplication(
        applied._id,
        { status: "rejected" },
        userDetail.access_token
      );
      if (res?.data) {
        message.success(t("reject"));
        handleFetchData();
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
      message.error(t("error"));
    }
    setIsLoading(false);
  };

  const handlePending = async () => {
    setIsLoading(true);
    try {
      const res = await API_APPLICATION.updateApplication(
        applied._id,
        { status: "pending" },
        userDetail.access_token
      );
      if (res?.data) {
        message.success(t("reject"));
        handleFetchData();
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
      message.error(t("error"));
    }
    setIsLoading(false);
  };

  const handleWithdraw = async () => {
    setIsLoading(true);
    try {
      const res = await API_APPLICATION.updateApplication(
        applied._id,
        { status: "withdrawn" },
        userDetail.access_token
      );
      if (res?.data) {
        message.success(t("withdraw_application_success"));
        handleFetchData();
      }
    } catch (error) {
      console.error("Error withdrawing application:", error);
      message.error(t("withdraw_application_failed"));
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await API_APPLICATION.deleteManyApplication(
        [applied._id],
        userDetail.access_token
      );
      if (res?.data) {
        message.success(t("delete_success"));
        handleFetchData();
      }
    } catch (error) {
      console.error("Error deleting application:", error);
      message.error(t("delete_failed"));
    }
    setIsLoading(false);
  };

  const handleSaveCandidate = async () => {
    setIsLoading(true);
    try {
      const res = await SAVE_CANDIDATE_API.toggleSaveCandidate(
        applied.user_id._id,
        userDetail.id,
        userDetail.access_token
      );
      if (res?.data) {
        setIsSaved(!isSaved);
        message.success(isSaved ? t("remove_bookmark") : t("add_bookmark"));
      }
    } catch (error) {
      console.error("Error saving candidate:", error);
      message.error(t("error"));
    }
    setIsLoading(false);
  };

  const handleMenuClick = (key: string) => {
    switch (key) {
      case "accept":
        handleAccept();
        break;
      case "reject":
        handleReject();
        break;
      case "pending":
        handlePending();
        break;
      default:
        break;
    }
  };

  const menu = (
    <Menu onClick={({ key }) => handleMenuClick(key)}>
      <Menu.Item key="accept" icon={<CheckCircleOutlined />}>
        {t("accept")}
      </Menu.Item>
      <Menu.Item key="reject" icon={<CloseCircleOutlined />}>
        {t("reject")}
      </Menu.Item>
      <Menu.Item key="pending" icon={<DeleteOutlined />}>
        {t("pending")}
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Title level={5} className="!mb-0">
            {applied.user_id.full_name}
          </Title>
          <Button
            type="text"
            icon={
              isSaved ? (
                <StarFilled className="text-yellow-500" />
              ) : (
                <StarOutlined />
              )
            }
            onClick={handleSaveCandidate}
            loading={isLoading}
          />
        </div>
        <Space>
          <Button
            type="text"
            icon={<MailOutlined />}
            onClick={() =>
              (window.location.href = `mailto:${applied.user_id.email}`)
            }
          />
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button icon={<EllipsisOutlined />} />
          </Dropdown>
        </Space>
      </div>

      {applied.cv_id && (
        <div className="mb-2">
          <div className="text-gray-500 text-sm mb-1">{t("cv_candidate")}</div>
          <a
            href={applied?.cv_id?.cv_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700"
          >
            {applied?.cv_id?.cv_name}
          </a>
        </div>
      )}

      <div className="mb-2">
        <div className="text-gray-500 text-sm mb-1">{t("work_experience")}</div>
        <div className="font-medium">
          {applied?.user_id?.total_experience_months
            ? `${Math.floor(
                applied?.user_id?.total_experience_months / 12
              )} ${t("year")} ${
                applied?.user_id?.total_experience_months % 12
              } ${t("month")}`
            : t("no_experience")}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-gray-500 text-sm">
          {t("application_date")}:{" "}
          {new Date(applied.applied_date).toLocaleDateString()}
        </div>
        <div
          className={`px-3 py-1 rounded-full text-sm ${
            applied.status === "accepted"
              ? "bg-green-100 text-green-800"
              : applied.status === "rejected"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {t(applied.status)}
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
