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
import {
  BookOpen,
  CheckCircle,
  XCircle,
} from "lucide-react";
import LoadingComponent from "../../../components/Loading/LoadingComponent";
import UploadForm from "../../../components/ui/UploadForm/UploadForm";
import { CERTIFICATE_API } from "../../../services/modules/CertificateServices";
import moment from "moment";
import { MediaApi } from "../../../services/modules/mediaServices";
import useCalculateUserProfile from "../../../hooks/useCaculateProfile";
const { TextArea } = Input;

interface Certificate {
  _id: string;
  certificate_name: string;
  organization_name: string;
  start_date: string;
  is_not_expired: boolean;
  candidate_id: string;
  createdAt: string;
  updatedAt: string;
  img_certificate?:string;
  link_certificate?:string;
  __v: number;
}

const CertificateComponent = () => {
  const userDetail = useSelector((state) => state.user);
  const [file, setFile] = useState('');
  const [form] = Form.useForm();
  const [link, setLink] = useState("");
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [actionType, setActionType] = useState<string>("create");
  const [isNotExpired, setIsNotExpired] = useState<boolean>(false);
  const [isLoading,setIsLoading]=useState<boolean>(false)
  const handleOpenSkill = (type: string, id?: string) => {
    setVisibleModal(true);
    setActionType(type);
    setSelectedId(id);
  };
  const closeModal = () => {
      form.resetFields();
    setVisibleModal(false);
    setFile('')
    setLink('')
    setSelectedId("");
    setActionType("");
    setIsNotExpired(false)
  };
  const {
    handleUpdateProfile
  } = useCalculateUserProfile(userDetail?._id, userDetail?.access_token);
  const handleGetSkillByUserId = async ({ current = 1, pageSize = 10 }) => {
    const params = {
      current,
      pageSize,
      query:{
        candidate_id:userDetail?._id
      }
    };

    const res = await CERTIFICATE_API.getAll(params,userDetail?._id);
    if (res.data) {
      setCertificates(res.data.items);
    }
  };

  useEffect(() => {
      handleGetSkillByUserId({});
  }, []);

  const handleGetDetailCertificate = async () => {
    try {
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
          link_certificate
        } = res.data;

        // Nếu start_date và end_date đã là đối tượng moment, không cần tạo lại moment
        form.setFieldsValue({
          certificate_name: certificate_name,
          organization_name: organization_name,
          start_date: start_date ? moment(start_date) : null, // Không cần format ở đây, chỉ cần moment object
          end_date: end_date ? moment(end_date) : null, // Nếu có end_date, tạo moment
          is_not_expired,
        });
        setIsNotExpired(is_not_expired);
        setLink(link_certificate)
      }
    } catch (error) {
      notification.error({
        message: "Thông báo",
        description: error.response.data.message,
      });
    }
  };
  useEffect(() => {
    if (selectedId) {
      handleGetDetailCertificate();
    }
  }, [selectedId]);

  const onFinish = async (values: any) => {
    let params = {
      ...values,
      candidate_id: userDetail?._id,
      img_certificate:file ? file :null
    };
    if (link && link.trim() !== "") {
      params.link_certificate = link;
    }
    const response = await CERTIFICATE_API.create(params, userDetail?._id);
    if (response.data) {
      notification.success({
        message: "Thông báo",
        description: "thành công",
      });
       await handleGetSkillByUserId({});
      closeModal();
      await handleUpdateProfile();
    } else {
      notification.error({
        message: "Thông báo",
        description: "Lỗi từ server",
      });
    }
  };
  const handleDeleteCertificate = async (id:string) => {
    try {
        const res = await CERTIFICATE_API.deleteByUser(id,userDetail?.access_token)
        if(+res.statusCode === 200){
            notification.success({
                message: "Thông báo",
                description: "Xóa thành công",
              });
               await handleGetSkillByUserId({})
              closeModal();
      await handleUpdateProfile();

        }
    } catch (error) {
        notification.error({
            message: "Thông báo",
            description: error.response.data.message,
          });
    }
  };

  const handleUpdateCertificate = async (id: string) => {
    try {
        const data = form.getFieldsValue();
        const params ={
            ...data,
            img_certificate:file ? file :null,

        }
        if (link && link.trim() !== "") {
          params.link_certificate = link;
        }
      const res = await CERTIFICATE_API.update(id, params, userDetail?.access_token);
      if (res.data) {
        notification.success({
          message: "Thông báo",
          description: "Cập nhật thành công",
        });
         await handleGetSkillByUserId({})
        closeModal();
      await handleUpdateProfile();

      }
    } catch (error) {
        notification.error({
            message: "Thông báo",
            description: error.response.data.message,
          });
    }
  };
  const handleFileChange = async (file) => {
    setIsLoading(true);
    try {
        const res = await MediaApi.postMedia(file,userDetail?.access_token);
        if(res?.data?.url){
            setFile(res.data.url)
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
      <LoadingComponent isLoading={isLoading}>
        <Form onFinish={onFinish} form={form} layout="vertical">
          <Form.Item
            label="Tên chứng chỉ"
            name="certificate_name"
            required
            rules={[
              { required: true, message: "Vui lòng nhập tên chứng chỉ!" },
            ]}
          >
            <Input placeholder="Tên chứng chỉ" />
          </Form.Item>
          <Form.Item
            label="Tên tổ chức"
            name="organization_name"
            required
            rules={[{ required: true, message: "Vui lòng nhập tên tổ chức!" }]}
          >
            <Input placeholder="Tên tổ chức" />
          </Form.Item>

          <Form.Item name="is_not_expired" valuePropName="checked">
            <Checkbox
              checked={isNotExpired}
              onChange={(e) => setIsNotExpired(e.target.checked)}
            >
              Chứng chỉ vô hạn
            </Checkbox>
          </Form.Item>

          <div className="flex items-center">
            <div>
              <Typography.Text>Bắt đầu</Typography.Text>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Form.Item name="start_date">
                  <DatePicker
                    picker="date"
                    placeholder="Chọn ngày, tháng, năm"
                    format="DD/MM/YYYY"
                  />
                </Form.Item>
              </div>
            </div>

            <div>
              <Typography.Text>Kết thúc</Typography.Text>
              <Form.Item name="start_date">
                <DatePicker
                  disabled={isNotExpired}
                  picker="date"
                  placeholder="Chọn ngày, tháng, năm"
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </div>
          </div>
          <UploadForm
            link={ link}
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
                  className="!bg-primaryColorH text-white"
                  onClick={()=>handleDeleteCertificate(selectedId)}
                  danger
                  style={{
                    width: "100%",
                  }}
                >
                  Xóa
                </Button>
                <Button
                  type="primary"
                  onClick={()=>handleUpdateCertificate(selectedId)}
                  style={{
                    width: "100%",
                    backgroundColor: "black",
                    borderColor: "#4CAF50",
                  }}
                >
                  Cập nhật
                </Button>
              </div>
            )}
          </Form.Item>
        </Form>
      </LoadingComponent>
    );
  };

  return (
    <div>
      {certificates.length > 0 ? (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-[#d3464f]" />
              <h2 className="font-semibold">Chứng chỉ</h2>
            </div>
            <Button onClick={() => handleOpenSkill("create")}>Thêm mục</Button>
          </div>
          {/* <div className="flex items-center justify-start"> */}
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
                    <strong>Tổ chức cấp chứng chỉ: </strong>
                    <span className="ml-2">{item.organization_name}</span>
                  </div>
                  <div className="flex items-center">
                    <strong>Ngày bắt đầu: </strong>
                    <span className="ml-2">
                      {new Date(item.start_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <strong>Chứng chỉ còn hiệu lực: </strong>
                    <span
                      className={`ml-2 ${
                        item.is_not_expired ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {item.is_not_expired ? "Còn hiệu lực" : "Hết hiệu lực"}
                    </span>
                    {item.is_not_expired ? (
                      <CheckCircle className="ml-2 text-green-500" />
                    ) : (
                      <XCircle className="ml-2 text-red-500" />
                    )}
                  </div>
                  {item.link_certificate && <div className="flex items-center">
                    <strong>Liên kết</strong>
                    <a  target="_blank"  href={item.link_certificate} className="ml-2">{item?.link_certificate}</a>
                  </div>}
                  </div>
                    {item?.img_certificate && <div>
                    <Image  preview={false} className="shadow-custom" style={{borderRadius:'20px',maxWidth:80,maxHeight:80}} src={item?.img_certificate} />
                </div>}
                </div>
              </Card>
            ))}
          </div>
          {/* </div> */}
        </Card>
      ) : (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-[#d3464f]" />
              <h2 className="font-semibold">Chứng chỉ</h2>
            </div>
            <Button onClick={() => handleOpenSkill("create")}>Thêm mục</Button>
          </div>
          <p className="text-sm text-gray-500">
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
