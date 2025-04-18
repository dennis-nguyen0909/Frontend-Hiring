import { useEffect, useState } from "react";
import {
  List,
  Button,
  Dropdown,
  message,
  Avatar,
  notification,
  Card,
} from "antd";
import {
  MoreOutlined,
  MailOutlined,
  DownloadOutlined,
  BookOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { SAVE_CANDIDATE_API } from "../../../../services/modules/SaveCandidateServices";
import { useSelector } from "react-redux";
import { Meta } from "../../../../types";
import { defaultMeta } from "../../../../untils";
import CustomPagination from "../../../../components/ui/CustomPanigation/CustomPanigation";
import CandidateDetailView from "../CandidateDetail/CandidateDetail";
import LoadingComponentSkeleton from "../../../../components/Loading/LoadingComponentSkeleton";
import { USER_API } from "../../../../services/modules/userServices";
import { useTranslation } from "react-i18next";
import useMomentFn from "../../../../hooks/useMomentFn";

interface SaveCandidates {
  _id: string;
  employer: object | string;
  candidate: object | string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function SavedCandidate() {
  const { t } = useTranslation();
  const { formatDate } = useMomentFn();
  const userDetail = useSelector((state) => state.user);
  const [saveCandidates, setSaveCandidates] = useState<SaveCandidates[]>([]);
  const [currentTab, setCurrentTab] = useState("save_candidate");
  const [meta, setMeta] = useState<Meta>(defaultMeta);
  const [selectedCandidate, setSelectedCandidate] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleBookmark = (candidateId: string) => {
    setSaveCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === candidateId
          ? { ...candidate, isActive: !isActive }
          : candidate
      )
    );
  };

  const handleGetCandidate = async (id: string, access_token: string) => {
    try {
      const res = await USER_API.getDetailUser(id, access_token);
      return res;
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewProfile = async (candidate: any) => {
    try {
      const res = await handleGetCandidate(
        candidate?._id,
        userDetail?.access_token
      );
      if (res?.data?.items) {
        const { is_profile_privacy } = res.data.items;
        if (is_profile_privacy) {
          setCurrentTab("view_profile");
          setSelectedCandidate(candidate?._id);
        } else {
          notification.error({
            message: t("notification"),
            description: t("candidate_not_public_info"),
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendEmail = (candidateId: string) => {
    message.success(t("send_email_success"));
  };

  const handleDownloadCV = (candidateId: string) => {
    message.success(t("download_cv_success"));
  };

  const handleGetSaveCandidates = async ({ current = 1, pageSize = 10 }) => {
    setIsLoading(true);
    const params = {
      current,
      pageSize,
    };
    const res = await SAVE_CANDIDATE_API.getSaveCandidateByEmployerId(
      userDetail?._id,
      params,
      userDetail?.access_token
    );
    if (res.data) {
      setSaveCandidates(res.data.items);
      setMeta(res.data.meta);
    } else {
      setSaveCandidates([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    handleGetSaveCandidates({ current: 1, pageSize: 10 });
  }, []);

  const renderItem = (item) => {
    const { candidate, isActive } = item;
    return (
      <Card className="mb-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar
              size={64}
              src={candidate.avatar}
              icon={<UserOutlined />}
              className="border-2 border-blue-500"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {candidate.full_name}
              </h3>
              <p className="text-gray-600">{candidate.position}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              type="text"
              className="hover:bg-blue-50"
              icon={
                <BookOutlined
                  className={isActive ? "text-blue-500" : "text-gray-400"}
                />
              }
              onClick={() => handleBookmark(candidate._id)}
              aria-label={isActive ? t("remove_bookmark") : t("add_bookmark")}
            />
            <Button
              type="primary"
              className="bg-blue-500 hover:bg-blue-600"
              onClick={() => handleViewProfile(candidate)}
            >
              {t("view_profile")}
            </Button>
            <Dropdown
              menu={{
                items: [
                  {
                    key: "1",
                    icon: <MailOutlined />,
                    label: t("send_email"),
                    onClick: () => handleSendEmail(candidate._id),
                  },
                  {
                    key: "2",
                    icon: <DownloadOutlined />,
                    label: t("download_cv"),
                    onClick: () => handleDownloadCV(candidate._id),
                  },
                ],
              }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <Button
                icon={<MoreOutlined />}
                type="text"
                className="hover:bg-gray-100"
                aria-label={t("more_options")}
              />
            </Dropdown>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {currentTab === "save_candidate" && (
        <div className="mx-auto max-w-7xl">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-4 lg:mb-0">
                {t("saved_candidate")}
              </h1>
              <p className="text-sm text-gray-500">
                {t("all_of_the_saveCandidates_are_visible_until", {
                  date: formatDate(new Date()),
                })}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <LoadingComponentSkeleton isLoading={isLoading}>
              {saveCandidates.map((candidate) => renderItem(candidate))}
            </LoadingComponentSkeleton>
          </div>

          <div className="mt-6">
            <CustomPagination
              currentPage={meta?.current_page}
              total={meta?.total}
              perPage={meta?.per_page}
              onPageChange={(current, pageSize) => {
                handleGetSaveCandidates({ current, pageSize });
              }}
            />
          </div>
        </div>
      )}

      {currentTab === "view_profile" && (
        <CandidateDetailView
          candidateId={selectedCandidate}
          userDetail={userDetail}
        />
      )}
    </div>
  );
}
