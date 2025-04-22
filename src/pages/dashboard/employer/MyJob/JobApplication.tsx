import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  message,
  Typography,
  Avatar,
  Form,
  DatePicker,
  TimePicker,
  Modal,
  Table,
  Popconfirm,
  Space,
  Tooltip,
  Switch,
  Empty,
} from "antd";
import {
  SearchOutlined,
  SortAscendingOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Job } from "../../../../types";
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
import { SAVE_CANDIDATE_API } from "../../../../services/modules/SaveCandidateServices";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
  DropResult,
} from "@hello-pangea/dnd";
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

interface ExtendedApplication {
  _id: string;
  __v: number;
  applied_date: string;
  cover_letter: string;
  employer_id: {
    _id: string;
    full_name: string;
    phone: string;
    address: string;
    role: string;
  };
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
  job_id: {
    _id: string;
    title: string;
    description: string;
    requirement: string[];
  };
  updatedAt: string;
  key?: string;
}

interface ColumnType {
  id: string;
  title: string;
  dataIndex: string;
  key: string;
  color: string;
  items: ExtendedApplication[];
  loading: boolean;
  hasMore: boolean;
  page: number;
  render: (
    text: string,
    record: ExtendedApplication
  ) => React.ReactElement | null;
}

interface Meta {
  page: number;
  limit: number;
  total: number;
  per_page?: number;
  current_page?: number;
}

interface ApiResponseItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  avatar: string;
  position: {
    id: string;
    name: string;
  };
  status: {
    id: string;
    name: string;
  };
  cv_url: string;
  applied_date: string;
  total_experience_months: number;
  total_experience_years: number;
  cover_letter: string;
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
  const [sortBy, setSortBy] = useState<string>("applied_date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    limit: 10,
    total: 0,
    per_page: 10,
    current_page: 1,
  });
  const [companyStatuses, setCompanyStatuses] = useState<CompanyStatus[]>([]);
  const { formatDate } = useMomentFn();
  const location = useParams();
  const navigate = useNavigate();
  const [form] = useForm();
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [editingStatus, setEditingStatus] = useState<CompanyStatus | null>(
    null
  );
  const [statusForm] = useForm();
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );
  const [hasMoreStates, setHasMoreStates] = useState<Record<string, boolean>>(
    {}
  );
  const [pageStates, setPageStates] = useState<Record<string, number>>({});
  const [showAllCandidates, setShowAllCandidates] = useState(false);

  const handleViewApplication = (application: ExtendedApplication) => {
    // Implement view application logic
  };

  const handleDownloadCV = (cvId: string) => {
    // Implement CV download logic
  };

  const getCandidatesByStatusIdAndJobId = async (
    statusId: string,
    jobId: string,
    pageSize: number,
    current: number
  ) => {
    try {
      const res = await API_APPLICATION.getCandidatesByStatusIdAndJobId(
        statusId,
        jobId,
        userDetail.access_token,
        pageSize,
        current
      );

      if (res?.data?.items) {
        const newApplications = res.data.items
          .map((item: ApiResponseItem) => {
            // For "All" column, use the status from the API response
            const matchingStatus =
              statusId === "all"
                ? {
                    _id: item.status.id,
                    name: item.status.name,
                    color: "#000000",
                    order: 0,
                    is_active: true,
                    company_id: userDetail.id,
                    description: "",
                    createdAt: "",
                    updatedAt: "",
                    __v: 0,
                  }
                : companyStatuses.find((status) => status._id === statusId);

            if (!matchingStatus) {
              console.error("No matching status found for:", statusId);
              return null;
            }

            return {
              _id: item.id,
              __v: 0,
              applied_date: item.applied_date,
              cover_letter: item.cover_letter,
              employer_id: {
                _id: userDetail.id,
                full_name: userDetail.company_name,
                phone: "",
                address: "",
                role: "",
              },
              user_id: {
                _id: item.user_id,
                full_name: item.name,
                email: item.email,
                avatar: item.avatar,
                total_experience_months: item.total_experience_months,
              },
              status: {
                _id: matchingStatus._id,
                name: matchingStatus.name,
                color: matchingStatus.color,
                order: matchingStatus.order,
                is_active: matchingStatus.is_active,
                company_id: matchingStatus.company_id,
                description: matchingStatus.description,
                createdAt: matchingStatus.createdAt,
                updatedAt: matchingStatus.updatedAt,
                __v: matchingStatus.__v,
              },
              cv_id: {
                cv_link: item.cv_url,
                cv_name: "CV",
              },
              job_id: {
                _id: item.position.id,
                title: item.position.name,
                description: "",
                requirement: [],
              },
              updatedAt: item.applied_date,
              key: item.id,
            };
          })
          .filter(Boolean);

        setApplications((prevApplications) => {
          if (statusId === "all") {
            // For "All" column, replace all applications
            return newApplications;
          }
          // For other columns, filter and add new applications
          const filteredApplications = prevApplications.filter(
            (app) => app.status._id !== statusId
          );
          return [...filteredApplications, ...newApplications];
        });

        setLoadingStates((prev) => ({ ...prev, [statusId]: false }));
        setHasMoreStates((prev) => ({
          ...prev,
          [statusId]: current < (res.data.meta?.total_pages || 1),
        }));
        setPageStates((prev) => ({ ...prev, [statusId]: current }));
      }
    } catch (err) {
      console.error("Error fetching candidates by status:", err);
      message.error(t("failed_to_fetch_candidates"));
      setLoadingStates((prev) => ({ ...prev, [statusId]: false }));
    }
  };

  const loadMore = async (statusId: string) => {
    if (loadingStates[statusId] || !hasMoreStates[statusId]) return;

    const jobId = selectedJob?._id || location?.id;
    if (!jobId) return;

    setLoadingStates((prev) => ({ ...prev, [statusId]: true }));
    const nextPage = (pageStates[statusId] || 0) + 1;
    await getCandidatesByStatusIdAndJobId(statusId, jobId, 10, nextPage);
  };

  useEffect(() => {
    if (companyStatuses.length > 0 && (selectedJob?._id || location?.id)) {
      const jobId = selectedJob?._id || location?.id;
      if (!jobId) return;

      // Initialize states for each status including "all"
      const initialLoadingStates: Record<string, boolean> = { all: false };
      const initialHasMoreStates: Record<string, boolean> = { all: true };
      const initialPageStates: Record<string, number> = { all: 0 };

      companyStatuses.forEach((status) => {
        initialLoadingStates[status._id] = false;
        initialHasMoreStates[status._id] = true;
        initialPageStates[status._id] = 0;
      });

      setLoadingStates(initialLoadingStates);
      setHasMoreStates(initialHasMoreStates);
      setPageStates(initialPageStates);

      // Clear existing applications
      setApplications([]);

      // Fetch initial data for each status including "all"
      getCandidatesByStatusIdAndJobId("all", jobId, 10, 1);
      companyStatuses.forEach((status) => {
        getCandidatesByStatusIdAndJobId(status._id, jobId, 10, 1);
      });
    }
  }, [companyStatuses, selectedJob?._id, location?.id]);

  // Update columns when applications change
  useEffect(() => {
    const statusColumns = companyStatuses.map((status: CompanyStatus) => {
      const statusApplications = applications.filter(
        (app) => app.status._id === status._id
      );

      return {
        id: status._id,
        title: status.name,
        dataIndex: "status",
        key: status.name,
        color: status.color,
        items: statusApplications,
        loading: loadingStates[status._id] || false,
        hasMore: hasMoreStates[status._id] || false,
        page: pageStates[status._id] || 0,
        render: (text: string, record: ExtendedApplication) => {
          const isStatusMatch = record.status._id === status._id;
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
      };
    });

    const allCandidatesColumn = {
      id: "all",
      title: t("all_candidates"),
      dataIndex: "status",
      key: "all",
      color: "#1890ff",
      items: applications,
      loading: loadingStates["all"] || false,
      hasMore: hasMoreStates["all"] || false,
      page: pageStates["all"] || 0,
      render: (text: string, record: ExtendedApplication) => (
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
      ),
    };

    setColumns(
      showAllCandidates
        ? [allCandidatesColumn, ...statusColumns]
        : statusColumns
    );
  }, [
    companyStatuses,
    applications,
    loadingStates,
    hasMoreStates,
    pageStates,
    showAllCandidates,
  ]);

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

        // Update UI immediately for better UX
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

        // Call API to update status
        await API_APPLICATION.updateApplication(
          draggableId,
          { status: newStatus._id },
          userDetail.access_token
        );

        // Refresh data after successful update
        await getCandidatesByStatusIdAndJobId(
          source.droppableId,
          selectedJob?._id || location?.id || "",
          meta.per_page,
          meta.current_page
        );
        await getCandidatesByStatusIdAndJobId(
          destination.droppableId,
          selectedJob?._id || location?.id || "",
          meta.per_page,
          meta.current_page
        );
      } catch (err) {
        // Revert UI if API call fails
        const revertedApplications = applications.map((app) => {
          if (app._id === draggableId) {
            const originalStatus = companyStatuses.find(
              (status) => status._id === source.droppableId
            );
            return {
              ...app,
              status: originalStatus || app.status,
            };
          }
          return app;
        });
        setApplications(revertedApplications);

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

  useEffect(() => {
    fetchSavedCandidates();
    fetchCompanyStatuses();
  }, [location?.id, selectedJob?._id]);

  const handleStatusSubmit = async (values: Record<string, unknown>) => {
    try {
      setIsStatusLoading(true);
      if (editingStatus) {
        if (editingStatus.name.toLowerCase() === "pending") {
          message.warning(t("cannot_edit_default_status"));
          setIsStatusLoading(false);
          return;
        }

        const orderValue = parseInt(String(values.order), 10);
        if (isNaN(orderValue)) {
          message.error(t("order_must_be_number"));
          setIsStatusLoading(false);
          return;
        }

        await COMPANY_STATUS_API.updateCompanyStatus(
          editingStatus._id,
          {
            ...values,
            order: orderValue,
          },
          userDetail.access_token
        );
        message.success(t("update_status_success"));
      } else {
        const orderValue = parseInt(String(values.order), 10);
        if (isNaN(orderValue)) {
          message.error(t("order_must_be_number"));
          setIsStatusLoading(false);
          return;
        }

        await COMPANY_STATUS_API.createCompanyStatus(
          {
            ...values,
            order: orderValue,
          },
          userDetail.id,
          userDetail.access_token
        );
        message.success(t("create_status_success"));
      }
      setIsStatusModalVisible(false);
      setEditingStatus(null);
      statusForm.resetFields();
      fetchCompanyStatuses();
    } catch (err) {
      console.error("Error saving status:", err);
      message.error(t("save_status_failed"));
    } finally {
      setIsStatusLoading(false);
    }
  };

  const statusColumns = [
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("description"),
      dataIndex: "description",
      key: "description",
    },
    {
      title: t("color"),
      dataIndex: "color",
      key: "color",
      render: (color: string) => (
        <div className="flex items-center">
          <div
            className="w-6 h-6 rounded-full mr-2"
            style={{ backgroundColor: color }}
          />
          <span>{color}</span>
        </div>
      ),
    },
    {
      title: t("order"),
      dataIndex: "order",
      key: "order",
    },
    {
      title: t("status"),
      dataIndex: "is_active",
      key: "is_active",
      render: (isActive: boolean) => (
        <span className={isActive ? "text-green-500" : "text-red-500"}>
          {isActive ? t("active") : t("inactive")}
        </span>
      ),
    },
    {
      title: t("actions"),
      key: "actions",
      render: (_: unknown, record: CompanyStatus) => {
        const isPending = record.name.toLowerCase() === "pending";
        return (
          <Space>
            <Tooltip
              title={isPending ? t("default_status_cannot_edit") : t("edit")}
            >
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => {
                  setEditingStatus(record);
                  statusForm.setFieldsValue({
                    name: record.name,
                    description: record.description,
                    color: record.color,
                    order: record.order,
                    is_active: record.is_active,
                  });
                  setIsStatusModalVisible(true);
                }}
                disabled={isPending}
              />
            </Tooltip>
            <Popconfirm
              title={t("delete_status_confirm")}
              onConfirm={async () => {
                try {
                  if (record.name.toLowerCase() === "pending") {
                    message.warning(t("cannot_delete_default_status"));
                    return;
                  }
                  await COMPANY_STATUS_API.deleteCompanyStatus(
                    record._id,
                    userDetail.access_token
                  );
                  message.success(t("delete_status_success"));
                  fetchCompanyStatuses();
                } catch (err) {
                  console.error("Error deleting status:", err);
                  message.error(t("delete_status_failed"));
                }
              }}
              okText={t("yes")}
              cancelText={t("no")}
              disabled={isPending}
            >
              <Tooltip
                title={
                  isPending ? t("default_status_cannot_delete") : t("delete")
                }
              >
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  disabled={isPending}
                />
              </Tooltip>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

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

  return (
    <div className="md:px-4 min-h-screen bg-gray-50">
      <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm sticky top-0 z-10">
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
          <Button
            type={showAllCandidates ? "primary" : "default"}
            onClick={() => setShowAllCandidates(!showAllCandidates)}
            icon={<PlusOutlined />}
          >
            {showAllCandidates
              ? t("hide_all_candidates")
              : t("show_all_candidates")}
          </Button>
          <Tooltip title={t("manage_statuses")}>
            <Button
              icon={<SettingOutlined />}
              onClick={() => setIsStatusModalVisible(true)}
              className="flex items-center"
            >
              {t("manage_statuses")}
            </Button>
          </Tooltip>
          <Input
            placeholder={t("search_applications")}
            prefix={<SearchOutlined className="text-gray-400" />}
            className="w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

      <Modal
        title={t("manage_statuses")}
        open={isStatusModalVisible}
        onCancel={() => setIsStatusModalVisible(false)}
        footer={null}
        width={800}
      >
        <div className="mb-6">
          <Table
            dataSource={companyStatuses}
            columns={statusColumns}
            rowKey="_id"
            pagination={false}
          />
        </div>
        <Form form={statusForm} layout="vertical" onFinish={handleStatusSubmit}>
          <Form.Item
            name="name"
            label={t("name")}
            rules={[{ required: true, message: t("please_input_name") }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label={t("description")}
            rules={[{ required: true, message: t("please_input_description") }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="color"
            label={t("color")}
            rules={[{ required: true, message: t("please_input_color") }]}
          >
            <Input type="color" />
          </Form.Item>
          <Form.Item
            name="order"
            label={t("order")}
            rules={[{ required: true, message: t("please_input_order") }]}
          >
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item
            name="is_active"
            label={t("status")}
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
          <Form.Item className="mb-0 flex justify-end">
            <Space>
              <Button onClick={() => setIsStatusModalVisible(false)}>
                {t("cancel")}
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isStatusLoading}
              >
                {editingStatus ? t("update") : t("create")}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="flex min-w-max gap-6 px-2 py-1">
            {columns.map((column) => (
              <div
                key={column.id}
                className="flex flex-col bg-white rounded-lg p-4 shadow-sm w-[320px] min-w-[320px] border border-gray-100 hover:shadow-md transition-shadow duration-300 h-[calc(100vh-180px)]"
              >
                <div className="flex items-center justify-between mb-4">
                  <Title
                    level={4}
                    className={`m-0 text-white px-[15px] py-1.5 rounded-full !text-[14px] whitespace-nowrap font-medium flex items-center`}
                    style={{ backgroundColor: column.color }}
                  >
                    {column.title}
                    <span className="ml-2 bg-white bg-opacity-20 px-2 py-0.5 rounded-full text-xs">
                      {column.items.length}
                    </span>
                  </Title>
                </div>
                <DroppableComponent droppableId={column.id}>
                  {(provided: DroppableProvided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1"
                    >
                      <LoadingComponentSkeleton isLoading={column.loading}>
                        {column.items.length > 0 ? (
                          <>
                            {column.items.map((applied, index) => (
                              <Draggable
                                key={applied._id}
                                draggableId={applied._id}
                                index={index}
                              >
                                {(provided: DraggableProvided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`bg-gray-50 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-gray-200 ${
                                      snapshot.isDragging
                                        ? "shadow-lg border-primaryColor"
                                        : ""
                                    }`}
                                  >
                                    <ApplicationCard
                                      applied={applied}
                                      handleFetchData={() =>
                                        getCandidatesByStatusIdAndJobId(
                                          applied.status._id,
                                          applied.job_id._id,
                                          10,
                                          1
                                        )
                                      }
                                      companyStatuses={companyStatuses}
                                      handleOpenModalEmail={
                                        handleOpenModalEmail
                                      }
                                      savedCandidateIds={savedCandidateIds}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </>
                        ) : (
                          <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={t("no_data")}
                            className="py-8"
                          />
                        )}
                      </LoadingComponentSkeleton>
                    </div>
                  )}
                </DroppableComponent>
              </div>
            ))}
          </div>
        </div>
      </DragDropContext>

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
