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
import moment from "moment";
import { MediaApi } from "../../../services/modules/mediaServices";
import useCalculateUserProfile from "../../../hooks/useCaculateProfile";
import LoadingComponentSkeleton from "../../../components/Loading/LoadingComponentSkeleton";

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
  const userDetail = useSelector((state) => state.user);
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
      console.log(error)
    }
  };

  useEffect(() => {
    handleGetSkillByUserId({});
  }, []);

  const handleGetDetailCertificate = async () => {
    try {
      setIsLoadingDetail(true)
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
        message: "Thông báo",
        description: error.response.data.message,
      });
    } finally {
      setIsLoadingDetail(false)
    }
  };
  useEffect(() => {
    if (selectedId) {
      handleGetDetailCertificate();
    }
  }, [selectedId]);

  const onFinish = async (values: any) => {
    setIsLoading(true)
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
        message: "Thông báo",
        description: "Thêm thành công",
      });
      await handleGetSkillByUserId({});
      closeModal();
      await handleUpdateProfile();
    setIsLoading(false)

    } else {
      notification.error({
        message: "Thông báo",
        description: "Lỗi từ server",
      });
    setIsLoading(false)

    }
  };
  const handleDeleteCertificate = async (id: string) => {
    try {
    setIsLoading(true)
      const res = await CERTIFICATE_API.deleteByUser(
        id,
        userDetail?.access_token
      );
      if (+res.statusCode === 200) {
        notification.success({
          message: "Thông báo",
          description: "Xóa thành công",
        });
        await handleGetSkillByUserId({});
        closeModal();
        await handleUpdateProfile();
    setIsLoading(false)

      }
    } catch (error) {
      notification.error({
        message: "Thông báo",
        description: error.response.data.message,
      });
    } finally {
    setIsLoading(false)

    }
  };

  const handleUpdateCertificate = async (id: string) => {
    try {
    setIsLoading(true)
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
          message: "Thông báo",
          description: "Cập nhật thành công",
        });
        await handleGetSkillByUserId({});
        closeModal();
        await handleUpdateProfile();
    setIsLoading(false)


      }
    } catch (error) {
      notification.error({
        message: "Thông báo",
        description: error.response.data.message,
      });
    } finally {
      setIsLoading(false)


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
        message: "Thông báo",
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
            label={<div className="text-[12px]">Tên chứng chỉ</div>}
            name="certificate_name"
            required
            rules={[
              { required: true, message: "Vui lòng nhập tên chứng chỉ!" },
            ]}
          >
            <Input placeholder="Tên chứng chỉ" className="text-[12px]" />
          </Form.Item>
          <Form.Item
            label={<div className="text-[12px]">Tên tổ chức</div>}
            name="organization_name"
            required
            rules={[{ required: true, message: "Vui lòng nhập tên tổ chức!" }]}
          >
            <Input placeholder="Tên tổ chức" className="text-[12px]" />
          </Form.Item>

          <Form.Item name="is_not_expired" valuePropName="checked">
            <Checkbox
              checked={isNotExpired}
              onChange={(e) => setIsNotExpired(e.target.checked)}
              className="text-[12px]"
            >
              Chứng chỉ vô hạn
            </Checkbox>
          </Form.Item>

          <div className="flex items-center ">
            <div className="mr-4">
              <Typography.Text className="text-[12px]">
                <span className="text-red-500 mr-1">*</span>
                Bắt đầu</Typography.Text>
              <div className="flex justify-between items-center">
                <Form.Item
                  className="text-[12px]"
                  label=""
                  name="start_date"
                  required
                  rules={[
                    { required: true, message: "Vui lòng chọn ngày bắt đầu" },
                  ]}
                >
                  <DatePicker
                    picker="date"
                    placeholder="Chọn ngày bắt đầu"
                    format="DD/MM/YYYY"
                    className="text-[12px] w-full"
                  />
                </Form.Item>
              </div>
            </div>
            <div className="ml-10">
              <Typography.Text className="text-[12px]">
              <span className="text-red-500 mr-1">*</span>
                Kết thúc
              </Typography.Text>
              <Form.Item
                label=""
                name="end_date"
                
                rules={[
                  {
                    validator: (_, value) =>
                      !value || value.isAfter(form.getFieldValue("start_date"))
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error("Ngày kết thúc phải sau ngày bắt đầu")
                          ),
                  },
                ]}
              >
                <DatePicker
                  disabled={isNotExpired}
                  picker="date"
                  placeholder="Chọn ngày, tháng, năm"
                  format="DD/MM/YYYY"
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
                Thêm
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
                  Xóa
                </Button>
                <Button
                  type="primary"
                  className="!text-[12px]"
                  onClick={() => handleUpdateCertificate(selectedId)}
                  style={{
                    width: "100%",
                    backgroundColor: "black"
                  }}
                >
                  Cập nhật
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
              <h2 className="font-semibold text-[12px]">Chứng chỉ</h2>
            </div>
            <Button className="text-[12px]" onClick={() => handleOpenSkill("create")}>Thêm mục</Button>
          </div>
          <div>
            {certificates?.map((item: Certificate, index: number) => (
              <Card
                key={index}
                title={item.certificate_name}
                extra={
                  <Tooltip title="Thông tin chi tiết">
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
                      <strong className="text-[12px]">Tổ chức cấp chứng chỉ: </strong>
                      <span className="ml-2 text-[12px]">{item.organization_name}</span>
                    </div>
                    <div className="flex items-center">
                      <strong className="text-[12px]">Ngày bắt đầu: </strong>
                      <span className="ml-2 text-[12px]">
                        {new Date(item.start_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <strong className="text-[12px]">Chứng chỉ còn hiệu lực: </strong>
                      <span
                        className={`ml-2 text-[12px] ${
                          item.is_not_expired
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {item.is_not_expired ? "Còn hiệu lực" : "Hết hiệu lực"}
                      </span>
                      {item.is_not_expired ? (
                        <CheckCircle size={12} className="ml-2 text-green-500" />
                      ) : (
                        <XCircle size={12} className="ml-2 text-red-500" />
                      )}
                    </div>
                    {item.link_certificate && (
                      <div className="flex items-center">
                        <strong className="text-[12px]">Liên kết</strong>
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
              <h2 className="font-semibold !text-[12px]">Chứng chỉ</h2>
            </div>
            <Button
              className="!text-[12px]"
              onClick={() => handleOpenSkill("create")}
            >
              Thêm mục
            </Button>
          </div>
          <p className="text-sm text-gray-500 !text-[12px]">
            Nếu bạn đã có CV trên DevHire, bấm Cập nhật để hệ thống tự động điền
            phần này theo CV.
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
            ? "Chứng chỉ"
            : actionType === "edit"
            ? "Cập nhật"
            : "Xóa Chứng chỉ"
        }
      />
    </div>
  );
};

export default CertificateComponent;
