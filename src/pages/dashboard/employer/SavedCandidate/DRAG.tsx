import { useState, useMemo } from "react";
import { Button, Dropdown, Avatar, notification, Input, Select } from "antd";
import {
  MoreOutlined,
  MailOutlined,
  DownloadOutlined,
  SearchOutlined,
  UserOutlined,
  SortAscendingOutlined,
  QuestionCircleOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import type {
  DropResult,
  DraggableProvided,
  DroppableProvided,
} from "@hello-pangea/dnd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { SAVE_CANDIDATE_API } from "../../../../services/modules/SaveCandidateServices";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CandidateDetailView from "../CandidateDetail/CandidateDetail";
import LoadingComponentSkeleton from "../../../../components/Loading/LoadingComponentSkeleton";
import { USER_API } from "../../../../services/modules/userServices";
import { useTranslation } from "react-i18next";
import type { ReactElement } from "react";

interface SaveCandidateItem {
  _id: string;
  candidate: {
    _id: string;
    full_name: string;
    position: string;
    avatar?: string;
    experience?: string;
  };
  status: "pending" | "reviewed" | "shortlisted" | "interviewed" | "rejected";
  isActive: boolean;
  updatedAt: string;
}

interface BoardColumn {
  id: string;
  title: string;
  icon: ReactElement;
  items: SaveCandidateItem[];
}

type SortOption = "name" | "experience" | "updatedAt";

export default function SavedCandidate() {
  const { t } = useTranslation();
  const userDetail = useSelector((state: RootState) => state.user);
  const [currentTab, setCurrentTab] = useState("save_candidate");
  const [selectedCandidate, setSelectedCandidate] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("updatedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const queryClient = useQueryClient();

  const columns: BoardColumn[] = [
    {
      id: "pending",
      title: "Đang chờ",
      icon: <FileTextOutlined className="text-gray-600" />,
      items: [],
    },
    {
      id: "reviewed",
      title: "Đã xem CV",
      icon: <CheckCircleOutlined className="text-blue-600" />,
      items: [],
    },
    {
      id: "shortlisted",
      title: "Qua vòng hồ sơ",
      icon: <TeamOutlined className="text-green-600" />,
      items: [],
    },
    {
      id: "interviewed",
      title: "Đã phỏng vấn",
      icon: <CheckCircleOutlined className="text-purple-600" />,
      items: [],
    },
    {
      id: "rejected",
      title: "Từ chối",
      icon: <CloseCircleOutlined className="text-red-600" />,
      items: [],
    },
  ];

  // Fetch saved candidates
  const { data: saveCandidatesData, isLoading } = useQuery({
    queryKey: ["savedCandidates", userDetail?.id],
    queryFn: async () => {
      const res = await SAVE_CANDIDATE_API.getSaveCandidateByEmployerId(
        userDetail?.id || "",
        {},
        userDetail?.access_token || ""
      );
      return res.data;
    },
    enabled: !!userDetail?.id && !!userDetail?.access_token,
  });

  // Update candidate status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      candidateId,
      status,
    }: {
      candidateId: string;
      status: SaveCandidateItem["status"];
    }) => {
      return await SAVE_CANDIDATE_API.updateCandidateStatus(
        candidateId,
        status,
        userDetail?.access_token || ""
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedCandidates"] });
      notification.success({
        message: "Cập nhật trạng thái",
        description: "Cập nhật trạng thái ứng viên thành công",
      });
    },
    onError: () => {
      notification.error({
        message: "Lỗi",
        description: "Không thể cập nhật trạng thái ứng viên",
      });
    },
  });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      updateStatusMutation.mutate({
        candidateId: draggableId,
        status: destination.droppableId as SaveCandidateItem["status"],
      });
    }
  };

  const handleViewProfile = async (
    candidate: SaveCandidateItem["candidate"]
  ) => {
    try {
      const res = await USER_API.getDetailUser(
        candidate._id,
        userDetail?.access_token
      );
      if (res?.data?.items) {
        const { is_profile_privacy } = res.data.items;
        if (is_profile_privacy) {
          setCurrentTab("view_profile");
          setSelectedCandidate(candidate._id);
        } else {
          notification.error({
            message: t("notification"),
            description: t("candidate_not_public_info"),
          });
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        notification.error({
          message: t("notification"),
          description: error.message,
        });
      }
      console.error(error);
    }
  };

  const handleSendEmail = (candidate: SaveCandidateItem["candidate"]) => {
    window.location.href = `mailto:${candidate._id}`;
  };

  const handleDownloadCV = (candidate: SaveCandidateItem["candidate"]) => {
    // TODO: Implement CV download functionality
    notification.info({
      message: "Tải CV",
      description: "Tính năng đang được phát triển",
    });
  };

  const filteredAndSortedCandidates = useMemo(() => {
    if (!saveCandidatesData?.items) return [];

    let filtered = [...saveCandidatesData.items];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((item) => {
        const { full_name, position, experience } = item.candidate;
        return (
          full_name.toLowerCase().includes(query) ||
          position.toLowerCase().includes(query) ||
          experience?.toLowerCase().includes(query)
        );
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const getValue = (item: SaveCandidateItem) => {
        switch (sortBy) {
          case "name":
            return item.candidate.full_name;
          case "experience": {
            const exp = parseInt(item.candidate.experience || "0");
            return isNaN(exp) ? 0 : exp;
          }
          case "updatedAt":
            return new Date(item.updatedAt).getTime();
          default:
            return 0;
        }
      };

      const valueA = getValue(a);
      const valueB = getValue(b);

      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortOrder === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      return sortOrder === "asc"
        ? Number(valueA) - Number(valueB)
        : Number(valueB) - Number(valueA);
    });

    return filtered;
  }, [saveCandidatesData?.items, searchQuery, sortBy, sortOrder]);

  const renderCandidateCard = (item: SaveCandidateItem, index: number) => (
    <Draggable key={item._id} draggableId={item._id} index={index}>
      {(provided: DraggableProvided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white rounded-lg shadow-sm p-4 mb-3 hover:shadow-md transition-all"
        >
          <div className="flex items-center space-x-3">
            <Avatar
              size={40}
              src={item.candidate.avatar}
              icon={<UserOutlined />}
              className="border-2 border-gray-200"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {item.candidate.full_name}
              </h4>
              <p className="text-xs text-gray-500 truncate">
                {item.candidate.position}
              </p>
              <p className="text-xs text-gray-400">
                {item.candidate.experience || "0 năm kinh nghiệm"}
              </p>
            </div>
            <Dropdown
              menu={{
                items: [
                  {
                    key: "view",
                    label: "Xem hồ sơ",
                    onClick: () => handleViewProfile(item.candidate),
                  },
                  {
                    key: "email",
                    label: "Gửi email",
                    icon: <MailOutlined />,
                    onClick: () => handleSendEmail(item.candidate),
                  },
                  {
                    key: "download",
                    label: "Tải CV",
                    icon: <DownloadOutlined />,
                    onClick: () => handleDownloadCV(item.candidate),
                  },
                ],
              }}
              trigger={["click"]}
            >
              <Button
                type="text"
                icon={<MoreOutlined />}
                className="hover:bg-gray-100"
              />
            </Dropdown>
          </div>
        </div>
      )}
    </Draggable>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {currentTab === "save_candidate" ? (
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-800">
                Quản lý Đơn Ứng Tuyển
              </h1>
              <div className="flex items-center space-x-4">
                <Input
                  placeholder="Bộ lọc nâng cao"
                  prefix={<SearchOutlined className="text-gray-400" />}
                  className="w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Select
                  value={sortBy}
                  onChange={(value: SortOption) => setSortBy(value)}
                  className="w-40"
                  options={[
                    { label: "Tên", value: "name" },
                    { label: "Kinh nghiệm", value: "experience" },
                    { label: "Ngày cập nhật", value: "updatedAt" },
                  ]}
                />
                <Button
                  type="text"
                  icon={
                    <SortAscendingOutlined
                      rotate={sortOrder === "desc" ? 180 : 0}
                    />
                  }
                  onClick={() =>
                    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                  }
                  className="flex items-center"
                >
                  Sắp xếp
                </Button>
                <Button
                  type="text"
                  icon={<QuestionCircleOutlined />}
                  className="flex items-center"
                />
              </div>
            </div>
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-5 gap-4">
              {columns.map((column) => (
                <div key={column.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-4">
                    {column.icon}
                    <h3 className="font-medium text-gray-700">
                      {column.title}
                    </h3>
                    <span className="text-sm text-gray-500">
                      (
                      {
                        filteredAndSortedCandidates.filter(
                          (item) => item.status === column.id
                        ).length
                      }
                      )
                    </span>
                  </div>
                  <Droppable droppableId={column.id}>
                    {(provided: DroppableProvided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="min-h-[calc(100vh-250px)]"
                      >
                        <LoadingComponentSkeleton isLoading={isLoading}>
                          {filteredAndSortedCandidates
                            .filter(
                              (item: SaveCandidateItem) =>
                                item.status === column.id
                            )
                            .map((item: SaveCandidateItem, index: number) =>
                              renderCandidateCard(item, index)
                            )}
                        </LoadingComponentSkeleton>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        </div>
      ) : (
        <CandidateDetailView
          candidateId={selectedCandidate}
          userDetail={userDetail}
        />
      )}
    </div>
  );
}
