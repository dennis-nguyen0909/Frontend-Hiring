import { useState } from "react";
import { Button, Dropdown, message, Avatar, notification, Card } from "antd";
import {
  MoreOutlined,
  MailOutlined,
  DownloadOutlined,
  BookOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { SAVE_CANDIDATE_API } from "../../../../services/modules/SaveCandidateServices";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CustomPagination from "../../../../components/ui/CustomPanigation/CustomPanigation";
import CandidateDetailView from "../CandidateDetail/CandidateDetail";
import LoadingComponentSkeleton from "../../../../components/Loading/LoadingComponentSkeleton";
import { USER_API } from "../../../../services/modules/userServices";
import { useTranslation } from "react-i18next";
import useMomentFn from "../../../../hooks/useMomentFn";

interface SaveCandidateItem {
  _id: string;
  candidate: {
    _id: string;
    full_name: string;
    position: string;
    avatar?: string;
  };
  isActive: boolean;
}

interface Candidate {
  _id: string;
  full_name: string;
  position: string;
  avatar?: string;
}

export default function SavedCandidate() {
  const { t } = useTranslation();
  const { formatDate } = useMomentFn();
  const userDetail = useSelector((state: RootState) => state.user);
  const [currentTab, setCurrentTab] = useState("save_candidate");
  const [selectedCandidate, setSelectedCandidate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const queryClient = useQueryClient();

  // Fetch saved candidates
  const { data: saveCandidatesData, isLoading } = useQuery({
    queryKey: ["savedCandidates", userDetail?.id, currentPage, pageSize],
    queryFn: async () => {
      const params = {
        current: currentPage,
        pageSize,
      };
      const res = await SAVE_CANDIDATE_API.getSaveCandidateByEmployerId(
        userDetail?.id || "",
        params,
        userDetail?.access_token || ""
      );
      return res.data;
    },
    enabled: !!userDetail?.id && !!userDetail?.access_token,
  });

  // Update bookmark status mutation
  const updateBookmarkMutation = useMutation({
    mutationFn: async ({
      candidateId,
      isActive,
    }: {
      candidateId: string;
      isActive: boolean;
    }) => {
      return await SAVE_CANDIDATE_API.updateSaveCandidate(
        candidateId,
        isActive,
        userDetail?.access_token || ""
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["savedCandidates", userDetail?.id],
      });
      notification.success({
        message: t("notification.success"),
        description: t("notification.updateBookmarkSuccess"),
      });
    },
    onError: () => {
      notification.error({
        message: t("notification.error"),
        description: t("notification.updateBookmarkError"),
      });
    },
  });

  const handleSaveCandidate = async (candidate: Candidate) => {
    try {
      console.log("candidateduydeptrai", candidate);
      const res = await SAVE_CANDIDATE_API.toggleSaveCandidate(
        candidate?._id,
        userDetail?.id || "",
        userDetail?.access_token || ""
      );

      if (res.data) {
        queryClient.refetchQueries({
          queryKey: ["savedCandidates", userDetail?.id],
        });
      }
    } catch (error) {
      notification.error({
        message: t("notification"),
        description: error.message,
      });
    }
  };
  const handleBookmark = (candidateId: string, isActive: boolean) => {
    updateBookmarkMutation.mutate({ candidateId, isActive: !isActive });
  };

  const handleGetCandidate = async (id: string) => {
    try {
      const res = await USER_API.getDetailUser(id, userDetail?.access_token);
      return res;
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewProfile = async (candidate: Candidate) => {
    try {
      const res = await handleGetCandidate(candidate?._id);
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

  const handleSendEmail = () => {
    message.success(t("send_email_success"));
  };

  const handleDownloadCV = () => {
    message.success(t("download_cv_success"));
  };

  const handlePageChange = (current: number, pageSize: number) => {
    setCurrentPage(current);
    setPageSize(pageSize);
  };

  const renderItem = (item: SaveCandidateItem) => {
    const { candidate, isActive, _id } = item;
    return (
      <Card className="mb-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar
              size={64}
              src={candidate?.avatar}
              icon={<UserOutlined />}
              className="border-2 border-blue-500"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {candidate?.full_name}
              </h3>
              <p className="text-gray-600">{candidate?.position}</p>
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
              onClick={() => handleSaveCandidate(candidate)}
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
                    onClick: handleSendEmail,
                  },
                  {
                    key: "2",
                    icon: <DownloadOutlined />,
                    label: t("download_cv"),
                    onClick: handleDownloadCV,
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
              {saveCandidatesData?.items?.map((candidate: SaveCandidateItem) =>
                renderItem(candidate)
              )}
            </LoadingComponentSkeleton>
          </div>

          <div className="mt-6">
            <CustomPagination
              currentPage={saveCandidatesData?.meta?.current_page}
              total={saveCandidatesData?.meta?.total}
              perPage={saveCandidatesData?.meta?.per_page}
              onPageChange={handlePageChange}
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
