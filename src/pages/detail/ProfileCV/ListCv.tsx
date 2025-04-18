import { Avatar, Button, Form, Input, notification, Popconfirm } from "antd";
import { Download, Star, Forward, Trash, Pencil } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CV_API } from "../../../services/modules/CvServices";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Meta } from "../../../types";
import avtDefault from "../../../assets/avatars/avatar-default.jpg";
import GeneralModal from "../../../components/ui/GeneralModal/GeneralModal";
import useMomentFn from "../../../hooks/useMomentFn";
import { RootState } from "../../../redux/store/store";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface CV {
  _id: string;
  user_id: string;
  cv_name: string;
  cv_link: string;
  public_id: string;
  createdAt: string;
  updatedAt: string;
  isPrimary?: boolean;
}

interface CVResponse {
  items: CV[];
  meta: Meta;
}

const CVCard = ({
  cv,
  userDetail,
  onDelete,
  onUpdate,
  handleShare,
}: {
  cv: CV;
  userDetail: any;
  onDelete: () => void;
  onUpdate: () => void;
  handleShare: () => void;
}) => {
  const { t } = useTranslation();
  const onDownloadCV = () => {
    const link = document.createElement("a");
    link.href = cv?.cv_link;
    link.download = cv?.cv_name;
    link.click();
  };
  const { formatDate } = useMomentFn();
  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-b from-green-100/80 to-gray-800 max-w-lg shadow-lg mt-5">
      {/* Avatar and Badge */}
      <div className="relative p-6 bg-gradient-to-b from-green-100/50 to-transparent">
        <div>
          <Avatar src={userDetail?.avatar || avtDefault} size={80} />
        </div>
        {cv?.isPrimary && (
          <div className="absolute top-6 right-6 flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md">
            <Star className="w-5 h-5" />
            <span className="text-sm font-semibold">
              {t("set_as_primary_cv")}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 pt-0">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-[12px] font-semibold text-white truncate">
            {cv.cv_name}
          </h3>
          <div
            onClick={onUpdate}
            className="bg-[#5c6674] hover:bg-[#ccc] cursor-pointer px-1 py-1 rounded-full"
          >
            <Pencil size={14} color="white" />
          </div>
        </div>
        <p className="text-[12px] text-white/80 mb-5">
          {t("last_updated")} {formatDate(cv.updatedAt)}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div
              onClick={handleShare}
              className="bg-[#5c6674] w-[90px] rounded-full flex items-center justify-center gap-2 px-2 py-1 hover:bg-[#ccc] cursor-pointer"
            >
              <Forward size={14} color="white" />
              <p className="text-[10px] text-white ">{t("share")}</p>
            </div>
            <div
              onClick={onDownloadCV}
              className="bg-[#5c6674] w-[90px] rounded-full flex items-center justify-center gap-2 px-2 py-1 hover:bg-[#ccc] cursor-pointer"
            >
              <Download size={14} color="white" />
              <p className="text-[10px] text-white ">{t("download")}</p>
            </div>
          </div>
          <div className="hover:bg-[#ccc] cursor-pointer px-1 py-1 rounded-full">
            <Popconfirm onConfirm={onDelete} title={"Bạn có chắc xóa ?"}>
              <Trash size={14} color="white" />
            </Popconfirm>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ListCV() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userDetail = useSelector((state: RootState) => state.user);
  const [visible, setVisible] = useState<boolean>(false);
  const [cv, setCv] = useState<CV>({} as CV);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  // Fetch CVs with React Query
  const { data: cvData } = useQuery<CVResponse>({
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Delete CV mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await CV_API.deleteManyCVByUser([id], userDetail?.access_token);
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
      onClose();
    },
    onError: () => {
      notification.error({
        message: t("notification"),
        description: t("update_failed"),
      });
    },
  });

  const onClose = () => {
    setVisible(false);
    setCv({} as CV);
  };

  const handleShare = () => {
    notification.info({
      message: t("notification"),
      description: t("feature_not_developed"),
    });
  };

  const onDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleSubmit = () => {
    const values = form.getFieldsValue();
    updateMutation.mutate({ id: cv._id, cv_name: values.cv_name });
  };

  const renderBody = () => {
    return (
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          className="!text-[12px]"
          label={t("cv_name")}
          name="cv_name"
          rules={[{ required: true, message: t("please_enter_cv_name") }]}
        >
          <Input
            placeholder={t("enter_cv_name")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 !text-[14px]"
          />
        </Form.Item>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            onClick={onClose}
            className="px-6 hover:bg-gray-100 !text-[12px]"
          >
            {t("cancel")}
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            className="px-6 bg-green-500 hover:bg-green-600 border-none !text-[12px]"
          >
            {t("update")}
          </Button>
        </div>
      </Form>
    );
  };

  const onUpdate = async (id: string) => {
    try {
      const res = await CV_API.findById(id, userDetail?.access_token);
      if (res.data) {
        setVisible(true);
        setCv(res.data);
        form.setFieldsValue({
          cv_name: res.data.cv_name,
        });
      }
    } catch (error) {
      notification.error({
        message: t("notification"),
        description: t("update_failed"),
      });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[14px] font-bold">
          {t("uploaded_cvs_to_hiredev")}
        </h2>
        <Button
          onClick={() => navigate("/upload-cv")}
          type="primary"
          className="!bg-primaryColor cursor-pointer !text-[12px] !h-[30px]"
        >
          {t("upload_cv")}
        </Button>
      </div>
      <div className="flex gap-10 flex-wrap">
        {cvData?.items?.map((cv) => (
          <div key={cv._id} className="w-[300px]">
            <CVCard
              handleShare={handleShare}
              cv={cv}
              userDetail={userDetail}
              onDelete={() => onDelete(cv._id)}
              onUpdate={() => onUpdate(cv._id)}
            />
          </div>
        ))}
      </div>
      <GeneralModal
        visible={visible}
        title={t("edit")}
        renderBody={renderBody}
        onCancel={onClose}
        onOk={onClose}
      />
    </div>
  );
}
