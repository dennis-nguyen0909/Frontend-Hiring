import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  HeartFilled,
  HeartOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Dropdown,
  Image,
  Menu,
  MenuProps,
  notification,
  Typography,
} from "antd";
import avatarDefault from "../../../../assets/avatars/avatar-default.jpg";
import { API_APPLICATION } from "../../../../services/modules/ApplicationServices";
import { useSelector } from "react-redux";
import useMomentFn from "../../../../hooks/useMomentFn";
import { useTranslation } from "react-i18next";

const { Text } = Typography;
interface IPropsApplicationCard {
  applied: any;
  handleFetchData: () => void;
  className?: any;
  handleOpenModalEmail: () => void;
}

const ApplicationCard = ({
  applied,
  handleFetchData,
  className,
  handleOpenModalEmail,
}: IPropsApplicationCard) => {
  const { t } = useTranslation();
  const { formatDate } = useMomentFn();
  const { user_id, applied_date, job_id, save_candidates } = applied;
  const userDetail = useSelector((state) => state.user);
  const items: MenuProps["items"] = [
    {
      key: "rejected",
      label: <span className="!text-[12px]">{t("reject")}</span>,
      onClick: () => handleMenuClick("rejected", applied._id),
    },
    {
      key: "accepted",
      label: <span className="!text-[12px]">{t("accept")}</span>,
      onClick: () => handleMenuClick("accepted", applied._id),
    },
    {
      key: "pending",
      label: <span className="!text-[12px]">{t("pending")}</span>,
      onClick: () => handleMenuClick("pending", applied._id),
    },
  ];

  const itemsDelete: MenuProps["items"] = [
    {
      key: "delete",
      label: <span className="!text-[12px]">{t("delete")}</span>,
      onClick: () => handleMenuClick("delete", applied._id),
    },
  ];
  const handleDelete = () => {};
  const handleMenuClick = async (action: string, id: string) => {
    try {
      if (action === "delete") {
        const res = await API_APPLICATION.deleteManyApplication(
          [id],
          user_id?.access_token
        );
        if (res.data) {
          handleFetchData();
        }
      } else {
        const res = await API_APPLICATION.updateApplication(
          id,
          { status: action },
          user_id?.access_token
        );
        if (res.data) {
          handleFetchData();
        }
      }
    } catch (error) {
      notification.error({
        message: t("notification"),
        description: error.message,
      });
    }
  };

  const handleSaveCandidate = async (userId: string) => {
    try {
      const res = await API_APPLICATION.saveCandidate(
        applied?._id,
        userId,
        user_id?.access_token,
        userDetail?.access_token
      );
      if (res.data) {
        handleFetchData();
      }
    } catch (error) {
      notification.error({
        message: t("notification"),
        description: error.message,
      });
    }
  };

  const onDownloadCvCandidate = () => {
    const { primary_cv_id } = user_id;
    const cvLink = applied?.cv_id?.cv_link;
    const cvName = applied?.cv_id?.cv_name;
    const link = document.createElement("a");
    if (cvLink === "" || !cvLink) {
      notification.error({
        message: t("notification"),
        description: t("candidate_not_update_cv"),
      });
    }
    link.href = cvLink || primary_cv_id.cv_link;
    link.download = cvName || primary_cv_id.cv_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const isSaved = save_candidates && save_candidates.includes(user_id?._id);
  return (
    <Card className={`mb-4 ${className}`}>
      <div className="flex items-start">
        <Image
          src={user_id?.avatar || avatarDefault}
          width={48}
          height={48}
          className="rounded-full mr-3"
        />
        <div className="flex-grow ml-3 flex flex-col">
          <Text className="font-bold text-[18px]">{user_id?.full_name}</Text>
          <Text type="secondary" className="text-[12px]">
            {job_id?.title}
          </Text>
        </div>
        <div className="flex space-x-2">
          <Dropdown overlay={<Menu items={items} />} placement="top">
            <Button icon={<EditOutlined />} size="small" type="default" />
          </Dropdown>

          <Dropdown overlay={<Menu items={itemsDelete} />} placement="top">
            <Button
              icon={<DeleteOutlined />}
              onClick={handleDelete}
              size="small"
              type="default"
              danger
            />
          </Dropdown>
        </div>
      </div>
      <div className="mt-4 space-y-2 text-sm">
        {user_id?.total_experience_months && user_id?.total_experience_years ? (
          <p className="text-[12px]">
            {t("experience")}:{" "}
            {user_id?.total_experience_months +
              " " +
              t("month") +
              " " +
              user_id?.total_experience_years +
              " " +
              t("year")}
          </p>
        ) : (
          <p className="text-[12px]">
            {t("experience")}: {t("no_experience")}
          </p>
        )}
        {user_id?.education_ids?.map((edu, index) => (
          <p className="text-[12px]" key={index}>
            {t("education")}: {edu.school}
          </p>
        ))}
        <div className="flex justify-between items-center">
          <p className="text-[12px]">
            {t("application_date")}: {formatDate(applied_date)}
          </p>
          <div
            className="cursor-pointer text-xl text-red-500"
            onClick={() => handleSaveCandidate(user_id?._id)}
          >
            {isSaved ? <HeartFilled /> : <HeartOutlined />}
          </div>
        </div>
      </div>
      <Button
        onClick={onDownloadCvCandidate}
        icon={<DownloadOutlined />}
        className="w-full mt-4 !border-black !text-black !hover:text-primaryColor !text-[12px]"
      >
        {t("download_cv")}
      </Button>
      {applied.status === "accepted" && (
        <Button
          className="!text-[12px]"
          onClick={() => handleOpenModalEmail(applied)}
        >
          {t("send_email")}
        </Button>
      )}
    </Card>
  );
};

export default ApplicationCard;
