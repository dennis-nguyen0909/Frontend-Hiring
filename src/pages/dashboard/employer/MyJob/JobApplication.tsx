import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Empty,
  Input,
  message,
  Typography,
  Select,
  Avatar,
  Form,
  DatePicker,
  TimePicker,
} from "antd";
import {
  EllipsisOutlined,
  SearchOutlined,
  SortAscendingOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { Job, Application } from "../../../../types";
import { API_APPLICATION } from "../../../../services/modules/ApplicationServices";
import { useSelector } from "react-redux";
import GeneralModal from "../../../../components/ui/GeneralModal/GeneralModal";
import ApplicationCard from "../Application/ApplicationCard";
import { ChevronsLeft } from "lucide-react";
import { useForm } from "antd/es/form/Form";
import { USER_API } from "../../../../services/modules/userServices";
import LoadingComponentSkeleton from "../../../../components/Loading/LoadingComponentSkeleton";
import useMomentFn from "../../../../hooks/useMomentFn";
import { useTranslation } from "react-i18next";
import CustomPagination from "../../../../components/ui/CustomPanigation/CustomPanigation";
import { SAVE_CANDIDATE_API } from "../../../../services/modules/SaveCandidateServices";
import type {
  DropResult,
  DraggableProvided,
  DroppableProvided,
  DroppableProps,
} from "@hello-pangea/dnd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { COMPANY_STATUS_API } from "../../../../services/modules/CompanyStatusServices";

const { Title } = Typography;

interface IPropJobApplication {
  handleChangeHome?: () => void;
  selectedJob?: Job;
}

interface RootState {
  user: {
    id: string;
    access_token: string;
    company_name: string;
    email: string;
  };
}

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
  extends Omit<Application, "cv_id" | "user_id" | "status"> {
  user_id: {
    _id: string;
    full_name: string;
    email?: string;
    avatar?: string;
    total_experience_months?: number;
  };
  status: CompanyStatus;
  cv_id: {
    cv_link: string;
    cv_name: string;
  };
  updatedAt: string;
  key: string;
}

interface ColumnType {
  id: string;
  title: string;
  dataIndex: string;
  key: string;
  color: string;
  items: ExtendedApplication[];
  render: (
    text: string,
    record: ExtendedApplication
  ) => React.ReactElement | null;
}

interface Meta {
  count: number;
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

const DroppableComponent = Droppable as React.ComponentType<DroppableProps>;

const JobApplication: React.FC<IPropJobApplication> = ({
  handleChangeHome,
  selectedJob,
}) => {
  const { t } = useTranslation();
  const userDetail = useSelector((state: RootState) => state.user);
  const [applications, setApplications] = useState<ExtendedApplication[]>([]);
  const [visibleEmail, setVisibleEmail] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [savedCandidateIds, setSavedCandidateIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "experience" | "updatedAt">(
    "updatedAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [meta, setMeta] = useState<Meta>({
    count: 0,
    current_page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0,
  });
  const [companyStatuses, setCompanyStatuses] = useState<CompanyStatus[]>([]);
  const { formatDate } = useMomentFn();
  const location = useParams();
  const navigate = useNavigate();
  const [form] = useForm();

  const filteredAndSortedApplications = useMemo(() => {
    let filtered = [...applications];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((item) => {
        const { full_name, email } = item.user_id;
        const { title } = item.job_id;
        return (
          full_name.toLowerCase().includes(query) ||
          email?.toLowerCase().includes(query) ||
          title.toLowerCase().includes(query)
        );
      });
    }

    filtered.sort((a, b) => {
      let compareResult = 0;
      switch (sortBy) {
        case "name":
          compareResult = a.user_id.full_name.localeCompare(
            b.user_id.full_name
          );
          break;
        case "experience": {
          const expA =
            parseInt(a.user_id.total_experience_months?.toString() || "0") || 0;
          const expB =
            parseInt(b.user_id.total_experience_months?.toString() || "0") || 0;
          compareResult = expA - expB;
          break;
        }
        case "updatedAt":
          compareResult =
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
      }
      return sortOrder === "asc" ? compareResult : -compareResult;
    });

    return filtered;
  }, [applications, searchQuery, sortBy, sortOrder]);

  const handleViewApplication = (application: ExtendedApplication) => {
    // Implement view application logic
    console.log("View application:", application);
  };

  const handleDownloadCV = (cvId: string) => {
    // Implement CV download logic
    console.log("Download CV:", cvId);
  };

  const columns = useMemo(() => {
    return companyStatuses.map((status: CompanyStatus) => ({
      id: status._id,
      title: status.name,
      dataIndex: "status",
      key: status.name,
      color: status.color,
      items: applications.filter((app) => app.status.name === status.name),
      render: (text: string, record: ExtendedApplication) => {
        const isStatusMatch = record.status.name === status.name;
        return isStatusMatch ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Avatar src={record.user_id.avatar} />
              <div>
                <div className="font-medium">{record.user_id.full_name}</div>
                <div className="text-sm text-gray-500">
                  {record.user_id.email}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                type="primary"
                onClick={() => handleViewApplication(record)}
              >
                View Application
              </Button>
              <Button onClick={() => handleDownloadCV(record.cv_id.cv_link)}>
                Download CV
              </Button>
            </div>
          </div>
        ) : null;
      },
    })) as ColumnType[];
  }, [companyStatuses, applications]);

  const handleBack = () => {
    navigate(-1);
  };

  const onBack = handleChangeHome || handleBack;

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      try {
        const newStatus = companyStatuses.find(
          (status) => status._id === destination.droppableId
        );
        if (!newStatus) return;

        // Update UI immediately
        const updatedApplications = applications.map((app) => {
          if (app._id === draggableId) {
            return {
              ...app,
              status: newStatus,
            };
          }
          return app;
        });
        setApplications(updatedApplications);

        // Call API in background
        await handleStatusChange(draggableId, newStatus._id);

        message.success(t("status_updated_successfully"));
      } catch (err) {
        // Revert UI if API call fails
        handleGetJobByEmployer({
          current: meta.current_page,
          pageSize: meta.per_page,
        });
        console.error("Error updating application status:", err);
        message.error(t("failed_to_update_status"));
      }
    }
  };

  const handleOpenModalEmail = (applied: ExtendedApplication) => {
    setVisibleEmail(true);
  };

  const onFinish = async (values: Record<string, unknown>) => {
    setIsLoading(true);
    const params = {
      ...values,
      interviewDate: formatDate(values.interviewDate as string),
      interviewTime: formatDate(values.interviewTime as string),
    };
    try {
      const res = await USER_API.employerSendMailtoCandidate(
        params,
        userDetail?.access_token
      );
      if (+res.statusCode === 201) {
        setVisibleEmail(false);
        message.success(t("send_email_success"));
      }
    } catch (err) {
      console.error("Error sending email:", err);
      message.error(t("send_email_failed"));
    }
    setIsLoading(false);
  };

  const fetchSavedCandidates = async () => {
    try {
      if (userDetail?.id) {
        const res = await SAVE_CANDIDATE_API.employerSavedCandidate(
          userDetail.id,
          userDetail.access_token
        );
        if (res.data) {
          setSavedCandidateIds(res.data.savedCandidateIds);
        }
      }
    } catch (err) {
      console.error("Error fetching saved candidates:", err);
    }
  };

  const fetchCompanyStatuses = async () => {
    try {
      if (userDetail?.id) {
        const res = await COMPANY_STATUS_API.getCompanyStatuses(
          userDetail.id,
          userDetail.access_token
        );
        if (res.data) {
          setCompanyStatuses(res.data);
        }
      }
    } catch (err) {
      console.error("Error fetching company statuses:", err);
    }
  };

  const handleGetJobByEmployer = async ({ current = 1, pageSize = 10 }) => {
    try {
      const jobId = selectedJob?._id || location?.id;
      if (!jobId) return;

      const res = await API_APPLICATION.getApplicationByEmployerJobId(
        jobId,
        { current, pageSize },
        userDetail.access_token
      );
      if (res.data) {
        setApplications(res.data.items as ExtendedApplication[]);
        setMeta(res.data.meta);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  const handleStatusChange = async (
    applicationId: string,
    newStatus: string
  ) => {
    try {
      await API_APPLICATION.updateApplication(
        applicationId,
        { status: newStatus },
        userDetail.access_token
      );
      message.success("Application status updated successfully");
      handleGetJobByEmployer({
        current: meta.current_page,
        pageSize: meta.per_page,
      });
    } catch (error) {
      message.error("Failed to update application status");
    }
  };

  const renderBodyEmail = () => {
    return (
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          label={t("subject")}
          name="subject"
          rules={[{ required: true, message: t("please_input_subject") }]}
        >
          <Input placeholder={t("enter_subject")} />
        </Form.Item>
        <Form.Item
          label={t("interview_date")}
          name="interviewDate"
          rules={[
            { required: true, message: t("please_select_interview_date") },
          ]}
        >
          <DatePicker className="w-full" format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          label={t("interview_time")}
          name="interviewTime"
          rules={[
            { required: true, message: t("please_select_interview_time") },
          ]}
        >
          <TimePicker className="w-full" format="HH:mm" />
        </Form.Item>
        <Form.Item
          label={t("message")}
          name="message"
          rules={[{ required: true, message: t("please_input_message") }]}
        >
          <Input.TextArea rows={4} placeholder={t("enter_message")} />
        </Form.Item>
        <Form.Item className="mb-0">
          <Button type="primary" htmlType="submit" loading={isLoading} block>
            {t("send")}
          </Button>
        </Form.Item>
      </Form>
    );
  };

  useEffect(() => {
    handleGetJobByEmployer({ current: 1, pageSize: 10 });
    fetchSavedCandidates();
    fetchCompanyStatuses();
  }, [location?.id, selectedJob?._id]);

  return (
    <div className="md:px-4 lg:px-primary mt-10 min-h-screen bg-gray-100">
      <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <ChevronsLeft
            className="cursor-pointer text-gray-500 hover:text-primaryColor transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full"
            onClick={onBack}
            size={40}
          />
          <div className="m-0 !text-[24px] font-semibold text-gray-800">
            {t("job_application")}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Input
            placeholder={t("search_applications")}
            prefix={<SearchOutlined className="text-gray-400" />}
            className="w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select
            value={sortBy}
            onChange={(value: "name" | "experience" | "updatedAt") =>
              setSortBy(value)
            }
            className="w-40"
            options={[
              { label: t("name"), value: "name" },
              { label: t("experience"), value: "experience" },
              { label: t("updated_date"), value: "updatedAt" },
            ]}
          />
          <Button
            type="text"
            icon={
              <SortAscendingOutlined rotate={sortOrder === "desc" ? 180 : 0} />
            }
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="flex items-center"
          >
            {t("sort")}
          </Button>
          <Button
            type="text"
            icon={<QuestionCircleOutlined />}
            className="flex items-center"
          />
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-4 gap-6">
          {columns.map((column) => (
            <div
              key={column.id}
              className="flex flex-col bg-gray-50 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <Title
                  level={4}
                  className={`m-0 text-white px-[15px] rounded-full !text-[14px]`}
                  style={{ backgroundColor: column.color }}
                >
                  {column.title}
                  <span className="ml-2">({column.items.length})</span>
                </Title>
                <Button icon={<EllipsisOutlined />} type="text" />
              </div>
              <DroppableComponent droppableId={column.id}>
                {(provided: DroppableProvided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2"
                  >
                    <LoadingComponentSkeleton isLoading={isLoading}>
                      {column.items.length > 0 ? (
                        column.items.map((applied, index) => (
                          <Draggable
                            key={applied._id}
                            draggableId={applied._id}
                            index={index}
                          >
                            {(provided: DraggableProvided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <ApplicationCard
                                  applied={applied}
                                  handleFetchData={() =>
                                    handleGetJobByEmployer({
                                      current: 1,
                                      pageSize: 10,
                                    })
                                  }
                                  companyStatuses={companyStatuses}
                                  handleOpenModalEmail={handleOpenModalEmail}
                                  savedCandidateIds={savedCandidateIds}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))
                      ) : (
                        <Empty
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          description={t("no_data")}
                        />
                      )}
                    </LoadingComponentSkeleton>
                    {provided.placeholder}
                  </div>
                )}
              </DroppableComponent>
            </div>
          ))}
        </div>
      </DragDropContext>

      <div className="mt-6 flex justify-center">
        <CustomPagination
          currentPage={meta.current_page}
          total={meta.total}
          perPage={meta.per_page}
          onPageChange={(page: number, size: number) => {
            handleGetJobByEmployer({ current: page, pageSize: size });
          }}
        />
      </div>

      <GeneralModal
        title={t("send_email")}
        onOk={() => setVisibleEmail(false)}
        renderBody={renderBodyEmail}
        visible={visibleEmail}
        onCancel={() => setVisibleEmail(false)}
      />
    </div>
  );
};

export default JobApplication;
