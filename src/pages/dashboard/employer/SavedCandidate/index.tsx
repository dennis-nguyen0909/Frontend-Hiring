import { useEffect, useState } from "react";
import { List, Button, Dropdown, message, Avatar, notification } from "antd";
import {
  MoreOutlined,
  MailOutlined,
  DownloadOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { SAVE_CANDIDATE_API } from "../../../../services/modules/SaveCandidateServices";
import { useSelector } from "react-redux";
import { Meta } from "../../../../types";
import { defaultMeta } from "../../../../untils";
import CustomPagination from "../../../../components/ui/CustomPanigation/CustomPanigation";
import CandidateDetailView from "../CandidateDetail/CandidateDetail";
import LoadingComponentSkeleton from "../../../../components/Loading/LoadingComponentSkeleton";

interface SaveCandidates {
  _id: string;
  employer: object | string;
  candidate: object | string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function SavedCandidate() {
  const userDetail = useSelector((state) => state.user);
  const [saveCandidates, setSaveCandidates] = useState<SaveCandidates[]>([]);
  const [currentTab, setCurrentTab] = useState("save_candidate");
  const [meta, setMeta] = useState<Meta>(defaultMeta);
  const [selectedCandidate, setSelectedCandidate] = useState<string>("");
  const [isLoading,setIsLoading]=useState<boolean>(false)

  const handleBookmark = (candidateId: string) => {
    setSaveCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === candidateId
          ? { ...candidate, isActive: !isActive }
          : candidate
      )
    );
  };

  const handleViewProfile = (candidate:any) => {
    if(candidate.is_profile_privacy){
      setCurrentTab("view_profile");
      setSelectedCandidate(candidate?._id);
      console.log("candidate",candidate)
    }else{
      notification.error({
        message:'Thông báo',
        description:'Ứng viên chưa công khai thông tin'
      })
    }
  };

  const handleSendEmail = (candidateId: string) => {
    message.success("Email dialog opened");
  };

  const handleDownloadCV = (candidateId: string) => {
    message.success("Downloading CV...");
  };

  const handleGetSaveCandidates = async ({ current = 1, pageSize = 10 }) => {
    setIsLoading(true)
    const params = {
      current, // Trang hiện tại
      pageSize, // Số lượng phần tử mỗi trang
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
    setIsLoading(false)
  };
  useEffect(() => {
    handleGetSaveCandidates({ current: 1, pageSize: 10 });
  }, []);

  const renderItem = (item) => {
    const { candidate, isActive } = item;
    return (
      <List.Item
        key={candidate._id}
        className="px-6 hover:bg-gray-50 transition-colors"
        actions={[
          <Button
            key="bookmark"
            type="text"
            icon={<BookOutlined className={isActive ? "text-blue-500" : ""} />}
            onClick={() => handleBookmark(candidate._id)}
            aria-label={isActive ? "Remove bookmark" : "Add bookmark"}
          />,
          <Button
            key="view"
            type="primary"
            className="bg-blue-500"
            onClick={() => handleViewProfile(candidate)}
          >
            Xem thông tin
          </Button>,
          <Dropdown
            key="more"
            menu={{
              items: [
                {
                  key: "1",
                  icon: <MailOutlined />,
                  label: "Send Email",
                  onClick: () => handleSendEmail(candidate._id),
                },
                {
                  key: "2",
                  icon: <DownloadOutlined />,
                  label: "Download CV",
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
              aria-label="More options"
            />
          </Dropdown>,
        ]}
      >
        <List.Item.Meta
          avatar={
            <Avatar
              src={candidate.avatar}
              alt={`${candidate.name}'s avatar`}
              className="w-10 h-10"
            />
          }
          title={<span className="font-medium">{candidate.full_name}</span>}
          description={
            <span className="text-gray-500">{candidate.position}123</span>
          }
        />
      </List.Item>
    );
  };
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {currentTab === "save_candidate" && (
        <div className=" mx-auto">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">
Ứng viên đã lưu</h1>
                <p className="text-sm text-gray-500">
                  All of the saveCandidates are visible until 24 march, 2021
                </p>
              </div>
            </div>

          <div className="px-4 py-4">
            <LoadingComponentSkeleton isLoading={isLoading}>
            <List
                itemLayout="horizontal"
                dataSource={saveCandidates}
                renderItem={(candidate) => renderItem(candidate)}
              />
            </LoadingComponentSkeleton>
          </div>
          </div>
          <div>
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
