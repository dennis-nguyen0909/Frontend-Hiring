import { Button, Upload, message, notification } from "antd";
import {
  InboxOutlined,
  BarChartOutlined,
  SendOutlined,
  MessageOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd";
import { CV_API } from "../../../services/modules/CvServices";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
const { Dragger } = Upload;

export default function UploadPDF() {
  const { t } = useTranslation();
  const userDetail = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [fileUrl, setFileUrl] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [publicId, setPublicId] = useState<string>("");
  const [bytes, setBytes] = useState<number>(0);

  useEffect(() => {
    if (!userDetail?.access_token) {
      navigate("/");
      return;
    }
  }, [userDetail?.access_token]);

  const props: UploadProps = {
    name: "file",
    multiple: false,
    accept: ".doc,.docx,.pdf",
    action: `${import.meta.env.VITE_API_URL}/media/upload-pdf`,
    data: {
      userId: userDetail?.id,
    },
    headers: {
      "x-requested-with": "XMLHttpRequest", // Thêm header này
    },
    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        setFileUrl(info.file.response.data.url);
        setPublicId(info.file.response.data.result.public_id);
        setFileName(info.file.response.data.originalName);
        setBytes(info.file.response.data.result.bytes);
        message.success(`${info.file.name} ${t("upload_success")}.`);
      } else if (status === "error") {
        notification.error({
          message: t("notification"),
          description: t("upload_failed"),
        });
        message.error(`${info.file.name} ${t("upload_failed")}.`);
      }
    },
    onDrop(e) {
      console.error("Dropped files", e.dataTransfer.files);
    },
  };

  const onUpdate = async () => {
    try {
      const params = {
        user_id: userDetail?._id,
        cv_name: fileName,
        cv_link: fileUrl,
        public_id: publicId,
        bytes: bytes,
      };
      const res = await CV_API.create(params, userDetail.access_token);
      if (res.data) {
        notification.success({
          message: t("notification"),
          description: t("update_success"),
        });
      }
    } catch (error) {
      notification.error({
        message: t("notification"),
        description: error.message,
      });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-4">
      {/* Header Banner */}
      <div className="bg-green-600 text-white p-8 rounded-t-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-2">
            {t("upload_cv_to_let_the_job_opportunities_find_you")}
          </h1>
          <p className="text-green-100">
            {t("reduce_the_time_needed_to_find_a_suitable_job")}
          </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3">
          <div className="relative h-full w-full">
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <div className="w-32 h-32 relative">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-green-400/20 transform rotate-45"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-green-400/20 transform -rotate-45"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white p-8 border border-gray-200 rounded-b-lg">
        <p className="text-gray-600 mb-6 text-center max-w-2xl mx-auto">
          {t(
            "you_already_have_your_cv_ready_to_upload_the_system_will_automatically_suggest_your_cv_to_trusted_employers_save_time_find_a_suitable_job_and_take_control_of_your_career"
          )}
        </p>

        <Dragger {...props} className="mb-8">
          <p className="ant-upload-drag-icon">
            <InboxOutlined className="text-green-500 text-4xl" />
          </p>
          <p className="ant-upload-text font-medium">
            {t("upload_cv_from_your_computer_select_or_drag_and_drop")}
          </p>
          <p className="ant-upload-hint text-gray-500">
            {t("support_the_format_doc_docx_pdf_with_a_size_under_5mb")}
          </p>
        </Dragger>
        <div className="mt-5 flex items-center">
          <Button onClick={onUpdate}>{t("update")}</Button>
        </div>
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="p-6 border border-gray-100 rounded-lg text-center">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileTextOutlined className="text-2xl text-green-500" />
            </div>
            <h3 className="font-medium mb-2">
              {t("receive_the_best_job_opportunities")}
            </h3>
            <p className="text-gray-500 text-sm">
              {t(
                "your_cv_will_be_prioritized_for_display_with_verified_employers_receive_invitations_with_attractive_job_opportunities_from_reputable_companies"
              )}
            </p>
          </div>

          <div className="p-6 border border-gray-100 rounded-lg text-center">
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChartOutlined className="text-2xl text-orange-500" />
            </div>
            <h3 className="font-medium mb-2">
              {t("track_your_cv_views_optimize_your_cv")}
            </h3>
            <p className="text-gray-500 text-sm">
              {t(
                "track_your_cv_views_know_which_employers_on_topcv_are_interested_in_your_cv"
              )}
            </p>
          </div>

          <div className="p-6 border border-gray-100 rounded-lg text-center">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <SendOutlined className="text-2xl text-blue-500" />
            </div>
            <h3 className="font-medium mb-2">{t("share_your_cv_anywhere")}</h3>
            <p className="text-gray-500 text-sm">
              {t("upload_once_and_use_the_link_to_send_to_multiple_employers")}
            </p>
          </div>

          <div className="p-6 border border-gray-100 rounded-lg text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageOutlined className="text-2xl text-red-500" />
            </div>
            <h3 className="font-medium mb-2">
              {t("connect_with_employers_quickly")}
            </h3>
            <p className="text-gray-500 text-sm">
              {t(
                "easily_connect_with_employers_who_view_and_are_interested_in_your_cv"
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
