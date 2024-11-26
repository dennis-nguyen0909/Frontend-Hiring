import {
  EllipsisOutlined,
  FileTextOutlined,
  LinkOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Form,
  Input,
  message,
  notification,
  Popover,
  Select,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CV_API } from "../../../../services/modules/CvServices";
import PDFViewer from "../../../../components/PDFViewer/PDFViewer";
import { USER_API } from "../../../../services/modules/userServices";
import { useDispatch } from "react-redux";
import { updateUser } from "../../../../redux/slices/userSlices";
import { useNavigate } from "react-router-dom";
interface CV {
  _id: string; // ID của CV
  user_id: string; // ID của người dùng
  cv_name: string; // Tên của CV (tên file)
  cv_link: string; // Link tải CV
  public_id: string; // Public ID của CV trên cloud storage
  createdAt: string; // Thời gian tạo CV (dưới dạng ISO string)
  updatedAt: string; // Thời gian cập nhật CV (dưới dạng ISO string)
}

const Personal = () => {
  const [openPopoverIndex, setOpenPopoverIndex] = useState<number | null>(null);
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState<string>("");
  const [listCv, setListCv] = useState<CV[]>([]);
  const userDetail = useSelector((state) => state.user);
  const dispatch = useDispatch()
  const [iframeSrc, setIframeSrc] = useState(""); // Sử dụng state này để lưu file PDF link
  const handleGetCVbyUser = async (current = 1, pageSize = 10) => {
    const params = {
      current,
      pageSize,
      query: {
        user_id: userDetail?._id,
      },
    };
    const res = await CV_API.getAll(params, userDetail?.access_token);
    console.log("res", res);
    if (res.data) {
      setListCv([...res.data.items]);
    }
  };
  useEffect(() => {
    handleGetCVbyUser();
  }, []);
  const handleGetDetail = (cvLink: string, id: string) => {
    setIframeSrc(cvLink);
    setSelectedId(id);
  };

  const handleSaveChanges = async (values: any) => {
    const params = {
      ...values,
      id: userDetail?._id,
    };
    const res = await USER_API.updateUser(params);
    if(res.data){
      dispatch(updateUser({ ...res?.data, access_token: userDetail?.access_token, refresh_token: userDetail?.refresh_token }));
    }
    message.success("Changes saved successfully");
  };

  const handleFileUpload = (info) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handlePopoverOpen = (index: number) => {
    setOpenPopoverIndex(index);
  };

  const handlePopoverClose = () => {
    setOpenPopoverIndex(null);
  };

  const handleDeleteCv = async () => {
    try {
      const res = await CV_API.deleteManyCVByUser(
        [selectedId],
        userDetail?._id
      );
      console.log("res", res);
      if (+res.statusCode === 200) {
        notification.success({
          message: "Thông báo",
          description: "Xóa thành công",
        });
        handleGetCVbyUser();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const popoverContent = (
    <div className="flex flex-col gap-1">
      <Button>Edit</Button>
      <Button onClick={handleDeleteCv}>Delete</Button>
    </div>
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Thông tin cơ bản</h2>
      <Form
        layout="vertical"
        onFinish={handleSaveChanges}
        initialValues={{
          full_name: userDetail?.full_name,
          introduce:userDetail?.introduce,
          port_folio:userDetail?.port_folio,
          gender:userDetail?.gender
        }}
      >
        <div className="">
          <div className="col-span-1 md:col-span-2">
            {userDetail?.avatar ? (
              <Avatar size={100} shape="square" src={userDetail?.avatar} />
            ) : (
              <Form.Item
                label="Profile Picture"
                name="avatar"
                valuePropName="fileList"
                // getValueFromEvent={normFile}
              >
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  onChange={handleFileUpload}
                >
                  <div className="text-center">
                    <UploadOutlined className="text-2xl mb-1" />
                    <div className="text-xs text-gray-500">
                      Browse photo or drop here
                    </div>
                    <div className="text-xs text-gray-400">
                      A photo larger than 400 pixels works best. Max photo size
                      5 MB.
                    </div>
                  </div>
                </Upload>
              </Form.Item>
            )}
          </div>
          <Form.Item
  label="Họ và tên"
  name="full_name"
  rules={[{ required: true, message: "Please enter your full name" }]}
  style={{ width: '500px' }} // Thiết lập chiều rộng cố định hoặc tùy chỉnh
>
  <Input placeholder="Enter your full name" />
</Form.Item>
<Form.Item
 style={{ width: '500px' }}
        name="gender"
        label="Giới tính"
        rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
      >
        <Select placeholder="Chọn giới tính">
          <Select.Option value={0}>Nam</Select.Option>
          <Select.Option value={1}>Nữ</Select.Option>
          <Select.Option value={2}>Không xác định</Select.Option>
        </Select>
      </Form.Item>
<Form.Item
  label="Giới thiệu"
  name="introduce"
  rules={[{ required: true, message: "Please input your introduction!" }]}
  style={{ marginBottom: '20px', width: '800px' }} // Chiều rộng cố định cho TextArea
>
  <Input.TextArea
    placeholder="Enter your introduction"
    autoSize={{ minRows: 3, maxRows: 6 }}
    showCount
    maxLength={200}
    style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
  />
</Form.Item>

<Form.Item
  label="Port Folio"
  name="port_folio"
  rules={[
    {
      type: "url",
      message: "Please enter a valid URL",
    },
  ]}
  className="col-span-1 md:col-span-2"
  style={{ width: '500px' }} // Thiết lập chiều rộng cố định cho Input
>
  <Input
    prefix={<LinkOutlined className="site-form-item-icon" />}
    placeholder="Website URL..."
  />
</Form.Item>

        </div>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="mt-4 bg-blue-500 hover:bg-blue-600"
          >
            Save Changes
          </Button>
        </Form.Item>
      </Form>

      <h2 className="text-xl font-semibold mt-8 mb-4">Your CV/Resume</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {listCv?.map((resume, index) => (
          <div
            key={index}
            className="bg-gray-100 p-4 rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center">
              <FileTextOutlined className="text-2xl mr-2" />
              <div>
                <div className="font-medium">{resume.cv_name}</div>
                <div className="text-sm text-gray-500">
                  {+resume.bytes
                    ? (+resume.bytes / 1048576).toFixed(2)
                    : "Không có"}{" "}
                  MB
                </div>
              </div>
            </div>

            <div className="flex items-center px-2 py-2 hover:bg-[#ccc] rounded-full cursor-pointer">
              <Popover
                content={popoverContent}
                title="Actions"
                trigger="click"
                open={openPopoverIndex === index}
                onOpenChange={(newOpen) =>
                  newOpen ? handlePopoverOpen(index) : handlePopoverClose()
                }
              >
                <EllipsisOutlined
                  onClick={() => handleGetDetail(resume?.cv_link, resume?._id)}
                  className="text-xl cursor-pointer"
                />
              </Popover>
            </div>
          </div>
        ))}
        <div className="bg-white border-2 border-dashed border-gray-300 p-4 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
          <PlusOutlined className="text-2xl mr-2" />
          <div onClick={()=>navigate('/upload-cv')}>
            <div className="font-medium">Add CV/Resume</div>
            <div className="text-sm text-gray-500">
              Browse file or drop here, only pdf
            </div>
          </div>
        </div>
        {/* {iframeSrc && (
       <PDFViewer fileUrl={iframeSrc} />
      )} */}
      </div>
    </div>
  );
};

export default Personal;
