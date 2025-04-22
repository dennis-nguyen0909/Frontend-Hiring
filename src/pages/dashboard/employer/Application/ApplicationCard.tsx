import React, { useState, useEffect } from "react";
import { Button, Dropdown, Menu, message, Space } from "antd";
import {
  CheckCircleOutlined,
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

// Define the RootState interface for Redux state
interface RootState {
  user: {
    id: string;
    access_token: string;
  };
}

// Extended Application interface to include additional properties
interface CompanyStatus {
  _id: string;
  company_id: string;
  name: string;
  description: string;
  order: number;
  color: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

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
  status: CompanyStatus;
  updatedAt: string;
}

interface ApplicationCardProps {
  applied: ExtendedApplication;
  handleFetchData: () => void;
  handleOpenModalEmail?: (applied: ExtendedApplication) => void;
  savedCandidateIds?: string[];
  companyStatuses?: CompanyStatus[];
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  applied,
  handleFetchData,
  handleOpenModalEmail,
  savedCandidateIds,
  companyStatuses = [],
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const userDetail = useSelector((state: RootState) => state.user);
  const { t, i18n } = useTranslation();

  // Check if candidate is saved on component mount
  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        if (
          savedCandidateIds &&
          savedCandidateIds.includes(applied?.user_id?._id)
        ) {
          setIsSaved(true);
          return;
        }

        const res = await SAVE_CANDIDATE_API.isSaveCandidate(
          applied?.user_id?._id,
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

    if (userDetail?.id && applied?.user_id?._id) {
      checkIfSaved();
    }
  }, [
    userDetail.id,
    applied?.user_id?._id,
    userDetail.access_token,
    savedCandidateIds,
  ]);

  const handleStatusChange = async (newStatus: CompanyStatus) => {
    setIsLoading(true);
    try {
      const res = await API_APPLICATION.updateApplication(
        applied._id,
        { status: newStatus._id },
        userDetail.access_token
      );
      if (res?.data) {
        handleFetchData();
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      message.error(t("failed_to_update_status"));
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
      console.log("applied1231231", applied);
      const res = await SAVE_CANDIDATE_API.toggleSaveCandidate(
        applied?.user_id?._id,
        userDetail?.id,
        userDetail?.access_token
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

  const menu = (
    <Menu>
      {companyStatuses.map((status) => (
        <Menu.Item
          key={status._id}
          onClick={() => handleStatusChange(status)}
          icon={<CheckCircleOutlined />}
        >
          {i18n.exists(status.name) ? t(status.name) : status.name}
        </Menu.Item>
      ))}
      <Menu.Item
        key="email"
        onClick={() => handleOpenModalEmail?.(applied)}
        icon={<MailOutlined />}
      >
        {t("send_email")}
      </Menu.Item>
      <Menu.Item
        key="delete"
        onClick={handleDelete}
        icon={<DeleteOutlined />}
        danger
      >
        {t("delete")}
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-gray-200">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-sm truncate max-w-[120px]">
            {applied?.user_id?.full_name}
          </span>
          <Button
            type="text"
            size="small"
            icon={
              isSaved ? (
                <StarFilled className="text-yellow-500 text-xs" />
              ) : (
                <StarOutlined className="text-xs" />
              )
            }
            onClick={handleSaveCandidate}
            loading={isLoading}
            className="!p-0 !h-5 !w-5 hover:scale-110 transition-transform"
          />
        </div>
        <Space size={2}>
          <Button
            type="text"
            size="small"
            icon={<MailOutlined className="text-xs" />}
            onClick={() =>
              (window.location.href = `mailto:${applied?.user_id?.email}`)
            }
            className="!p-0 !h-5 !w-5 hover:scale-110 transition-transform"
          />
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button
              icon={<EllipsisOutlined className="text-xs" />}
              size="small"
              className="!p-0 !h-5 !w-5 hover:scale-110 transition-transform"
            />
          </Dropdown>
        </Space>
      </div>

      {applied?.cv_id && (
        <div className="mb-1.5 flex items-center">
          <span className="text-gray-500 text-xs mr-1">{t("cv")}:</span>
          <a
            href={applied?.cv_id?.cv_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 text-xs truncate max-w-[150px] hover:underline"
          >
            {applied?.cv_id?.cv_name}
          </a>
        </div>
      )}

      <div className="mb-1.5 flex items-center">
        <span className="text-gray-500 text-xs mr-1">{t("exp")}:</span>
        <span className="font-medium text-xs">
          {applied?.user_id?.total_experience_months
            ? `${Math.floor(applied?.user_id?.total_experience_months / 12)}${t(
                "y"
              )} ${applied?.user_id?.total_experience_months % 12}${t("m")}`
            : t("no_exp")}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-gray-500 text-xs">
          {new Date(applied?.applied_date).toLocaleDateString()}
        </span>
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-medium`}
          style={{
            backgroundColor: applied?.status?.color + "15",
            color: applied?.status?.color,
          }}
        >
          {i18n.exists(applied?.status?.name)
            ? t(applied?.status?.name)
            : applied?.status?.name}
        </span>
      </div>
    </div>
  );
};

export default ApplicationCard;
