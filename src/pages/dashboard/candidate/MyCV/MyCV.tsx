import type React from "react";
import { useState } from "react";
import {
  Button,
  Dropdown,
  Form,
  Input,
  Modal,
  notification,
  Upload,
  Skeleton,
  Spin,
} from "antd";
import type { UploadChangeParam, UploadFile } from "antd/es/upload";
import {
  FileText,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  Download,
  Forward,
} from "lucide-react";
import { InboxOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useTranslation } from "react-i18next";
import useMomentFn from "../../../../hooks/useMomentFn";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { CV_API } from "../../../../services/modules/CvServices";

interface CV {
  _id: string;
  cv_name: string;
  cv_link: string;
  updatedAt: string;
  isPrimary: boolean;
}

interface CVResponse {
  items: CV[];
}

const MyCV: React.FC = () => {
  const { t } = useTranslation();
  const { formatDate } = useMomentFn();
  const [visible, setVisible] = useState<boolean>(false);
  const [uploadModalVisible, setUploadModalVisible] = useState<boolean>(false);
  const [selectedCV, setSelectedCV] = useState<CV | null>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const userDetail = useSelector((state: RootState) => state.user);
  const [uploading, setUploading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Fetch CVs with React Query
  const { data: cvData, refetch: refetchCVs } = useQuery<CVResponse>({
    queryKey: ["cvs", userDetail?.id],
    queryFn: async () => {
      const params = {
        current: 1,
        pageSize: 10,
        query: {
          user_id: userDetail?.id,
        },
      };
      const res = await CV_API.getAll(params, userDetail?.access_token);
      return res.data;
    },
    enabled: !!userDetail?.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Delete CV mutation
  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      return await CV_API.deleteManyCVByUser(ids, userDetail?.access_token);
    },
    onSuccess: () => {
      notification.success({
        message: t("notification"),
        description: t("delete_success"),
      });
      queryClient.invalidateQueries({ queryKey: ["cvs"] });
    },
    onError: () => {
      notification.error({
        message: t("notification"),
        description: t("delete_failed"),
      });
    },
  });

  // Update CV mutation
  const updateMutation = useMutation({
    mutationFn: async (data: { id: string; cv_name: string }) => {
      return await CV_API.update(
        data.id,
        { cv_name: data.cv_name },
        userDetail?.access_token
      );
    },
    onSuccess: () => {
      notification.success({
        message: t("notification"),
        description: t("update_success"),
      });
      queryClient.invalidateQueries({ queryKey: ["cvs"] });
      handleCloseModal();
    },
    onError: () => {
      notification.error({
        message: t("notification"),
        description: t("update_failed"),
      });
    },
  });

  const handleCloseModal = () => {
    setVisible(false);
    setSelectedCV(null);
    form.resetFields();
  };

  const handleEdit = async (cv: CV) => {
    setSelectedCV(cv);
    setVisible(true);
    form.setFieldsValue({
      cv_name: cv.cv_name,
    });
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: t("delete_cv"),
      content: t("are_you_sure_delete_cv"),
      okText: t("yes"),
      cancelText: t("no"),
      onOk: () => deleteMutation.mutate([id]),
    });
  };

  const handleDeleteAll = () => {
    if (cvData?.items && cvData.items.length > 0) {
      Modal.confirm({
        title: t("delete_all"),
        content: t("are_you_sure_delete_all_cv"),
        okText: t("yes"),
        cancelText: t("no"),
        onOk: () => {
          const ids = cvData.items.map((cv) => cv._id);
          deleteMutation.mutate(ids);
        },
      });
    }
  };

  const handleSubmit = () => {
    if (!selectedCV) return;
    const values = form.getFieldsValue();
    updateMutation.mutate({ id: selectedCV._id, cv_name: values.cv_name });
  };

  const handleDownload = (cv: CV) => {
    const link = document.createElement("a");
    link.href = cv.cv_link;
    link.download = cv.cv_name;
    link.click();
  };

  const handleShare = () => {
    notification.info({
      message: t("notification"),
      description: t("feature_not_available"),
    });
  };

  const handleUploadCV = async () => {
    try {
      setUploading(true);
      let successCount = 0;
      let failedCount = 0;

      // Process files sequentially
      for (const file of fileList) {
        if (file.response) {
          try {
            const params = {
              user_id: userDetail?.id,
              cv_name: file.response.data.originalName,
              cv_link: file.response.data.url,
              public_id: file.response.data.result.public_id,
              bytes: file.response.data.result.bytes,
            };
            const result = await CV_API.create(
              params,
              userDetail?.access_token
            );
            if (result?.data) {
              successCount++;
            } else {
              failedCount++;
            }
          } catch (error) {
            failedCount++;
            console.error("Error uploading file:", error);
          }
        }
      }

      // Show summary notification
      if (successCount > 0) {
        notification.success({
          message: t("notification"),
          description: t("upload_success_count", { count: successCount }),
        });
      }
      if (failedCount > 0) {
        notification.warning({
          message: t("notification"),
          description: t("upload_failed_count", { count: failedCount }),
        });
      }

      await refetchCVs();
      setUploadModalVisible(false);
      setFileList([]);
    } catch (error: unknown) {
      notification.error({
        message: t("notification"),
        description:
          error instanceof Error ? error.message : t("upload_failed"),
      });
    } finally {
      setUploading(false);
    }
  };

  const uploadProps = {
    name: "file",
    multiple: true,
    accept: ".doc,.docx,.pdf",
    action: `${import.meta.env.VITE_API_URL}/media/upload-pdf`,
    headers: {
      "x-requested-with": "XMLHttpRequest",
    },
    fileList,
    onChange(info: UploadChangeParam<UploadFile>) {
      setFileList(info.fileList);
      const { status } = info.file;
      if (status === "done" && info.file.response) {
        notification.success({
          message: t("notification"),
          description: t("file_upload_success"),
        });
      } else if (status === "error") {
        notification.error({
          message: t("notification"),
          description: t("upload_failed"),
        });
      }
    },
  };

  const getDropdownItems = (cv: CV): MenuProps["items"] => [
    {
      key: "download",
      label: (
        <div
          className="flex items-center text-blue-500 py-2 px-1"
          onClick={() => handleDownload(cv)}
        >
          <Download size={16} className="mr-2" />
          <span>{t("download")}</span>
        </div>
      ),
    },
    {
      key: "share",
      label: (
        <div
          className="flex items-center text-green-500 py-2 px-1"
          onClick={handleShare}
        >
          <Forward size={16} className="mr-2" />
          <span>{t("share")}</span>
        </div>
      ),
    },
    {
      key: "edit",
      label: (
        <div
          className="flex items-center text-blue-500 py-2 px-1"
          onClick={() => handleEdit(cv)}
        >
          <Edit size={16} className="mr-2" />
          <span>{t("edit")}</span>
        </div>
      ),
    },
    {
      key: "delete",
      label: (
        <div
          className="flex items-center text-red-500 py-2 px-1"
          onClick={() => handleDelete(cv._id)}
        >
          <Trash2 size={16} className="mr-2" />
          <span>{t("delete")}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">{t("your_resume")}</h1>
        {cvData?.items && cvData.items.length > 0 && (
          <Button
            type="primary"
            danger
            onClick={handleDeleteAll}
            icon={<Trash2 size={16} />}
            loading={deleteMutation.isPending}
          >
            {t("delete_all")}
          </Button>
        )}
      </div>

      <Spin spinning={deleteMutation.isPending} tip={t("deleting")}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cvData?.items.map((cv) => (
            <div
              key={cv._id}
              className="bg-gray-50 p-4 rounded-lg flex justify-between items-center"
            >
              <div className="flex items-center">
                <FileText size={24} className="text-blue-500 mr-3" />
                <div>
                  <h3 className="font-medium">{cv.cv_name}</h3>
                  <p className="text-gray-500 text-sm">
                    {t("last_updated")} {formatDate(cv.updatedAt)}
                  </p>
                  {cv.isPrimary && (
                    <span className="text-green-500 text-sm">
                      {t("primary_cv")}
                    </span>
                  )}
                </div>
              </div>

              <Dropdown
                menu={{ items: getDropdownItems(cv) }}
                trigger={["click"]}
                placement="bottomRight"
                overlayClassName="w-40"
                disabled={deleteMutation.isPending}
              >
                <button className="p-1 hover:bg-gray-200 rounded-full">
                  <MoreHorizontal size={20} className="text-gray-500" />
                </button>
              </Dropdown>
            </div>
          ))}

          <div
            onClick={() => setUploadModalVisible(true)}
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
          >
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-2">
              <Plus size={24} className="text-blue-500" />
            </div>
            <h3 className="font-medium">{t("add_cv_resume")}</h3>
            <p className="text-gray-500 text-sm text-center">
              {t("browse_file_hint")}
            </p>
          </div>
        </div>
      </Spin>

      <Modal
        title={t("edit_cv")}
        open={visible}
        onCancel={handleCloseModal}
        footer={null}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            label={t("cv_name")}
            name="cv_name"
            rules={[{ required: true, message: t("please_enter_cv_name") }]}
          >
            <Input className="w-full" />
          </Form.Item>

          <div className="flex justify-end gap-3 mt-6">
            <Button onClick={handleCloseModal}>{t("cancel")}</Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              className="bg-blue-500"
            >
              {t("update")}
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        title={t("upload_cv")}
        open={uploadModalVisible}
        onCancel={() => {
          setUploadModalVisible(false);
          setFileList([]);
        }}
        footer={null}
        width={600}
      >
        <div className="p-6">
          <Upload.Dragger {...uploadProps} className="mb-6">
            <p className="ant-upload-drag-icon">
              <InboxOutlined className="text-blue-500 text-4xl" />
            </p>
            <p className="ant-upload-text font-medium">{t("upload_cv_hint")}</p>
            <p className="ant-upload-hint text-gray-500">
              {t("supported_formats")}
            </p>
          </Upload.Dragger>

          <div className="flex justify-end gap-3 mt-4">
            <Button
              onClick={() => {
                setUploadModalVisible(false);
                setFileList([]);
              }}
            >
              {t("cancel")}
            </Button>
            <Button
              type="primary"
              onClick={handleUploadCV}
              disabled={fileList.length === 0 || uploading}
              loading={uploading}
              className="bg-blue-500"
            >
              {t("upload")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyCV;
