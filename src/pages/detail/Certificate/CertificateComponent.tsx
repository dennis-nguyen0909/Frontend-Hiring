import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  notification,
  Card,
  Checkbox,
  Typography,
  DatePicker,
  Tooltip,
  Image,
} from "antd";
import { useSelector } from "react-redux";
import GeneralModal from "../../../components/ui/GeneralModal/GeneralModal";
import { BookOpen, CheckCircle, ShieldCheck, XCircle } from "lucide-react";
import LoadingComponent from "../../../components/Loading/LoadingComponent";
import UploadForm from "../../../components/ui/UploadForm/UploadForm";
import { CERTIFICATE_API } from "../../../services/modules/CertificateServices";
import { MediaApi } from "../../../services/modules/mediaServices";
import useCalculateUserProfile from "../../../hooks/useCaculateProfile";
import LoadingComponentSkeleton from "../../../components/Loading/LoadingComponentSkeleton";
import useMomentFn from "../../../hooks/useMomentFn";
import { useTranslation } from "react-i18next";
import moment from "moment";

interface Certificate {
  _id: string;
  certificate_name: string;
  organization_name: string;
  start_date: string;
  is_not_expired: boolean;
  candidate_id: string;
  createdAt: string;
  updatedAt: string;
  img_certificate?: string;
  link_certificate?: string;
  __v: number;
}

const CertificateComponent = () => {
  const { t } = useTranslation();
  const userDetail = useSelector((state) => state.user);
  const { formatDate, dateFormat } = useMomentFn();
  const [file, setFile] = useState("");
  const [form] = Form.useForm();
  const [link, setLink] = useState("");
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [actionType, setActionType] = useState<string>("create");
  const [isNotExpired, setIsNotExpired] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);
  const handleOpenSkill = (type: string, id?: string) => {
    setVisibleModal(true);
    setActionType(type);
    setSelectedId(id);
  };
  const closeModal = () => {
    form.resetFields();
    setVisibleModal(false);
    setFile("");
    setLink("");
    setSelectedId("");
    setActionType("");
    setIsNotExpired(false);
  };
  const { handleUpdateProfile } = useCalculateUserProfile(
    userDetail?._id,
    userDetail?.access_token
  );
  const handleGetSkillByUserId = async ({ current = 1, pageSize = 10 }) => {
    try {
      const params = {
        current,
        pageSize,
        query: {
          candidate_id: userDetail?._id,
        },
      };
      const res = await CERTIFICATE_API.getAll(params, userDetail?._id);
      if (res.data) {
        setCertificates(res.data.items);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetSkillByUserId({});
  }, []);

  const handleGetDetailCertificate = async () => {
    try {
      setIsLoadingDetail(true);
      const res = await CERTIFICATE_API.findByCertificateId(
        selectedId,
        userDetail?._id
      );
      if (res.data) {
        const {
          certificate_name,
          organization_name,
          start_date,
          is_not_expired,
          end_date,
          link_certificate,
        } = res.data;

        form.setFieldsValue({
          certificate_name: certificate_name,
          organization_name: organization_name,
          start_date: start_date ? moment(start_date) : null,
          end_date: end_date ? moment(end_date) : null,
          is_not_expired,
        });
        setIsNotExpired(is_not_expired);
        setLink(link_certificate);
      }
    } catch (error) {
      notification.error({
        message: t("notification"),
        description: error.response.data.message,
      });
    } finally {
      setIsLoadingDetail(false);
    }
  };
  useEffect(() => {
    if (selectedId) {
      handleGetDetailCertificate();
    }
  }, [selectedId]);

  const onFinish = async (values: any) => {
    setIsLoading(true);
    let params = {
      ...values,
      candidate_id: userDetail?._id,
      img_certificate: file ? file : null,
    };
    if (link && link.trim() !== "") {
      params.link_certificate = link;
    }
    const response = await CERTIFICATE_API.create(params, userDetail?._id);
    if (response.data) {
      notification.success({
        message: t("notification"),
        description: t("create_success"),
      });
      await handleGetSkillByUserId({});
      closeModal();
      await handleUpdateProfile();
      setIsLoading(false);
    } else {
      notification.error({
        message: t("notification"),
        description: t("error_from_server"),
      });
      setIsLoading(false);
    }
  };
  const handleDeleteCertificate = async (id: string) => {
    try {
      setIsLoading(true);
      const res = await CERTIFICATE_API.deleteByUser(
        id,
        userDetail?.access_token
      );
      if (+res.statusCode === 200) {
        notification.success({
          message: t("notification"),
          description: t("delete_success"),
        });
        await handleGetSkillByUserId({});
        closeModal();
        await handleUpdateProfile();
        setIsLoading(false);
      }
    } catch (error) {
      notification.error({
        message: t("notification"),
        description: error.response.data.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCertificate = async (id: string) => {
    try {
      setIsLoading(true);
      const data = form.getFieldsValue();
      const params = {
        ...data,
        img_certificate: file ? file : null,
      };
      if (link && link.trim() !== "") {
        params.link_certificate = link;
      }
      const res = await CERTIFICATE_API.update(
        id,
        params,
        userDetail?.access_token
      );
      if (res.data) {
        notification.success({
          message: t("notification"),
          description: t("update_success"),
        });
        await handleGetSkillByUserId({});
        closeModal();
        await handleUpdateProfile();
        setIsLoading(false);
      }
    } catch (error) {
      notification.error({
        message: t("notification"),
        description: error.response.data.message,
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleFileChange = async (file) => {
    setIsLoading(true);
    try {
      const res = await MediaApi.postMedia(file, userDetail?.access_token);
      if (res?.data?.url) {
        setFile(res.data.url);
      }
    } catch (error) {
      notification.error({
        message: t("notification"),
        description: error.response.data.message,
      });
    }
    setIsLoading(false);
  };

  const renderBody = () => {
    return (
      <LoadingComponentSkeleton isLoading={isLoadingDetail}>
        <LoadingComponent isLoading={isLoading}>
          <Form onFinish={onFinish} form={form} layout="vertical">
            <Form.Item
              label={<div className="text-[12px]">{t("certificate_name")}</div>}
              name="certificate_name"
              required
              rules={[
                { required: true, message: t("please_enter_certificate_name") },
              ]}
            >
              <Input
                placeholder={t("certificate_name")}
                className="text-[12px]"
              />
            </Form.Item>
            <Form.Item
              label={
                <div className="text-[12px]">{t("organization_name")}</div>
              }
              name="organization_name"
              required
              rules={[
                {
                  required: true,
                  message: t("please_enter_organization_name"),
                },
              ]}
            >
              <Input
                placeholder={t("organization_name")}
                className="text-[12px]"
              />
            </Form.Item>

            <Form.Item name="is_not_expired" valuePropName="checked">
              <Checkbox
                checked={isNotExpired}
                onChange={(e) => setIsNotExpired(e.target.checked)}
                className="text-[12px]"
              >
                {t("unlimited_certificate")}
              </Checkbox>
            </Form.Item>

            <div className="flex items-center ">
              <div className="mr-4">
                <Typography.Text className="text-[12px]">
                  <span className="text-red-500 mr-1">*</span>
                  {t("start_date")}
                </Typography.Text>
                <div className="flex justify-between items-center">
                  <Form.Item
                    className="text-[12px]"
                    label=""
                    name="start_date"
                    required
                    rules={[
                      {
                        required: true,
                        message: t("please_select_start_date"),
                      },
                    ]}
                  >
                    <DatePicker
                      picker="date"
                      placeholder={t("please_select_start_date")}
                      format={dateFormat}
                      className="text-[12px] w-full"
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="ml-10">
                <Typography.Text className="text-[12px]">
                  <span className="text-red-500 mr-1">*</span>
                  {t("end_date")}
                </Typography.Text>
                <Form.Item
                  label=""
                  name="end_date"
                  rules={[
                    {
                      validator: (_, value) =>
                        !value ||
                        value.isAfter(form.getFieldValue("start_date"))
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error(t("end_date_must_be_after_start_date"))
                            ),
                    },
                  ]}
                >
                  <DatePicker
                    disabled={isNotExpired}
                    picker="date"
                    placeholder={t("please_select_end_date")}
                    format={dateFormat}
                    className="text-[12px] w-full"
                  />
                </Form.Item>
              </div>
            </div>
            <UploadForm
              link={link}
              setLink={setLink}
              onFileChange={handleFileChange}
            />
            <Form.Item>
              {actionType === "create" ? (
                <Button
                  htmlType="submit"
                  className="w-full !bg-primaryColorH !text-white"
                >
                  {t("add")}
                </Button>
              ) : (
                <div className="flex items-center justify-between gap-4 mt-4">
                  <Button
                    className="!bg-primaryColorH text-white !text-[12px]"
                    onClick={() => handleDeleteCertificate(selectedId)}
                    danger
                    style={{
                      width: "100%",
                    }}
                  >
                    {t("delete")}
                  </Button>
                  <Button
                    type="primary"
                    className="!text-[12px]"
                    onClick={() => handleUpdateCertificate(selectedId)}
                    style={{
                      width: "100%",
                      backgroundColor: "black",
                    }}
                  >
                    {t("update")}
                  </Button>
                </div>
              )}
            </Form.Item>
          </Form>
        </LoadingComponent>
      </LoadingComponentSkeleton>
    );
  };

  return (
    <div>
      {certificates.length > 0 ? (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-[#d3464f]" size={12} />
              <h2 className="font-semibold text-[12px]">{t("certificate")}</h2>
            </div>
            <Button
              className="text-[12px]"
              onClick={() => handleOpenSkill("create")}
            >
              {t("add")}
            </Button>
          </div>
          <div>
            {certificates?.map((item: Certificate, index: number) => (
              <Card
                key={index}
                title={item.certificate_name}
                extra={
                  <Tooltip title={t("detail_certificate")}>
                    <CheckCircle
                      onClick={() => handleOpenSkill("edit", item?._id)}
                      className="text-green-500 cursor-pointer"
                    />
                  </Tooltip>
                }
                className="shadow-lg rounded-lg mt-4"
              >
                <div className="space-y-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <strong className="text-[12px]">
                        {t("organization_name")}:{" "}
                      </strong>
                      <span className="ml-2 text-[12px]">
                        {item.organization_name}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <strong className="text-[12px]">
                        {t("start_date")}:{" "}
                      </strong>
                      <span className="ml-2 text-[12px]">
                        {moment(item.start_date).format(dateFormat)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <strong className="text-[12px]">
                        {t("certificate_is_effective")}:{" "}
                      </strong>
                      <span
                        className={`ml-2 text-[12px] ${
                          item.is_not_expired
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {item.is_not_expired
                          ? t("certificate_is_effective")
                          : t("certificate_is_not_effective")}
                      </span>
                      {item.is_not_expired ? (
                        <CheckCircle
                          size={12}
                          className="ml-2 text-green-500"
                        />
                      ) : (
                        <XCircle size={12} className="ml-2 text-red-500" />
                      )}
                    </div>
                    {item.link_certificate && (
                      <div className="flex items-center">
                        <strong className="text-[12px]">{t("link")}:</strong>
                        <a
                          target="_blank"
                          href={item.link_certificate}
                          className="ml-2 text-[12px]"
                        >
                          {item?.link_certificate}
                        </a>
                      </div>
                    )}
                  </div>
                  {item?.img_certificate && (
                    <div>
                      <Image
                        preview={false}
                        className="shadow-custom"
                        style={{
                          borderRadius: "20px",
                          maxWidth: 80,
                          maxHeight: 80,
                        }}
                        src={item?.img_certificate}
                      />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </Card>
      ) : (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-[#d3464f]  !text-[12px]" />
              <h2 className="font-semibold !text-[12px]">{t("certificate")}</h2>
            </div>
            <Button
              className="!text-[12px]"
              onClick={() => handleOpenSkill("create")}
            >
              {t("add")}
            </Button>
          </div>
          <p className="text-sm text-gray-500 !text-[12px]">
            {t(
              "if_you_have_a_CV_on_DevHire_click_update_to_automatically_fill_this_part_according_to_the_CV"
            )}
          </p>
        </Card>
      )}
      <GeneralModal
        style={{ width: 900 }}
        visible={visibleModal}
        onCancel={closeModal}
        onOk={closeModal}
        renderBody={renderBody}
        title={
          actionType === "create"
            ? t("certificate")
            : actionType === "edit"
            ? t("update")
            : t("delete")
        }
      />
    </div>
  );
};

export default CertificateComponent;
