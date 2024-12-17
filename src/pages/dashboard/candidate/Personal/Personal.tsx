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
import { USER_API } from "../../../../services/modules/userServices";
import { useDispatch } from "react-redux";
import { updateUser } from "../../../../redux/slices/userSlices";
import { useNavigate } from "react-router-dom";
import { useCities } from "../../../../hooks/useCities";
import { useDistricts } from "../../../../hooks/useDistricts";
import { useWards } from "../../../../hooks/useWards";
import moment from "moment";
import { MediaApi } from "../../../../services/modules/mediaServices";
import LoadingComponent from "../../../../components/Loading/LoadingComponent";
interface CV {
  _id: string; 
  user_id: string; 
  cv_name: string; 
  cv_link: string;
  public_id: string;
  createdAt: string;
  updatedAt: string; 
}

const Personal = () => {
  const [openPopoverIndex, setOpenPopoverIndex] = useState<number | null>(null);
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string>("");
  const [listCv, setListCv] = useState<CV[]>([]);
  const userDetail = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [iframeSrc, setIframeSrc] = useState("");
  const [city, setCity] = useState( userDetail?.city_id?._id || "");
  const [district, setDistrict] = useState( userDetail?.district_id?._id ||"");
  const [ward, setWard] = useState(userDetail?.ward_id?._id||"");
  const { cities, loading: citiesLoading } = useCities();
  const { districts, loading: districtLoading } = useDistricts(city);
  const { wards, loading: wardsLoading } = useWards(district);
  const [loading,setLoading]=useState<boolean>(false)
  const handleCityChange = (value) => {
      setCity(value);
    };
    const handleDistrictChange = (value) => {
      setDistrict(value);
    };
  
    const handleWardChange = (value) => {
      setWard(value);
    };
  const handleGetCVbyUser = async (current = 1, pageSize = 10) => {
    const params = {
      current,
      pageSize,
      query: {
        user_id: userDetail?._id,
      },
    };
    const res = await CV_API.getAll(params, userDetail?.access_token);
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
    setLoading(true)
    const params = {
      ...values,
      id: userDetail?._id,
      city_id:city,
      district_id:district,
      ward_id:ward
    };
    const res = await USER_API.updateUser(params,userDetail?.access_token);
    if (res.data) {
      dispatch(
        updateUser({
          ...res?.data,
          access_token: userDetail?.access_token,
          refresh_token: userDetail?.refresh_token,
        })
      );
      message.success("Changes saved successfully");
    }
    setLoading(false)
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
      <Button onClick={handleDeleteCv}>Xóa</Button>
    </div>
  );
  const [avatar, setAvatar] = useState(userDetail?.avatar || '');

  const handleAvatarChange = async(e) => {
    const file = e.target.files[0];
    setLoading(true)
    if (file) {
      const reader = new FileReader();
      const res = await MediaApi.postMedia(file,userDetail?.access_token);
      if(res.data){
        reader.onloadend = () => {
          setAvatar(res.data.url);
          handleSaveChanges({avatar:res.data.url})
        };
        reader.readAsDataURL(file);
      }
    }
    setLoading(false)
  };
  return (
    <LoadingComponent isLoading={loading}>
      <h2 className="text-xl font-semibold mb-4">Thông tin cơ bản</h2>
      <Form
        layout="vertical"
        onFinish={handleSaveChanges}
        initialValues={{
          full_name: userDetail?.full_name,
          introduce: userDetail?.introduce,
          port_folio: userDetail?.port_folio,
          gender: userDetail?.gender,
          city:userDetail?.city_id?.name,
          district:userDetail?.district_id?.name,
          ward:userDetail?.ward_id?.name,
          address:userDetail?.address,
          birthday: userDetail?.birthday ? moment(userDetail?.birthday).format('YYYY-MM-DD') : '' // Chuyển sang định dạng YYYY-MM-DD
        }}
      >
        <div className="">
          <div className="col-span-1 md:col-span-2">
            {userDetail?.avatar ? (
             <div className="relative">
             <div className="relative inline-block group">
               <Avatar
                 size={150}
                 shape="circle"
                 src={avatar}
                 className="transition-opacity duration-300"
               />
               {/* Chữ "Update" sẽ chỉ hiện khi hover vào div chứa avatar */}
               <span className="absolute top-[50px] inset-0 flex justify-center items-center text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 Update
               </span>
               <input
                 type="file"
                 accept="image/*"
                 onChange={handleAvatarChange}
                 className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
               />
             </div>
           </div>
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
                      Browse photo hoặc drop here
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
            style={{ width: "500px" }} // Thiết lập chiều rộng cố định hoặc tùy chỉnh
          >
            <Input placeholder="Enter your full name" />
          </Form.Item>
          <Form.Item
            style={{ width: "500px" }}
            name="gender"
            label="Giới tính"
            rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
          >
            <Select placeholder="Chọn giới tính">
              <Select.Option value={0}>Nam</Select.Option>
              <Select.Option value={1}>Nữ</Select.Option>
              <Select.Option value={2}>Không xác định</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Ngày sinh"
            name="birthday"
            rules={[{ required: true, message: "Please enter your birthday" }]}
            style={{ width: "500px" }}
          >
            <Input type="date"/>
          </Form.Item>
          <Form.Item
            label="Giới thiệu"
            name="introduce"
            rules={[
              { required: true, message: "Please input your introduction!" },
            ]}
            style={{ marginBottom: "20px", width: "800px" }} // Chiều rộng cố định cho TextArea
          >
            <Input.TextArea
              placeholder="Enter your introduction"
              autoSize={{ minRows: 3, maxRows: 6 }}
              showCount
              maxLength={200}
              style={{
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
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
            style={{ width: "500px" }} // Thiết lập chiều rộng cố định cho Input
          >
            <Input
              prefix={<LinkOutlined className="site-form-item-icon" />}
              placeholder="Website URL..."
            />
          </Form.Item>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* City Field */}
            <Form.Item
              label="Thành phố"
              name="city"
              rules={[{ required: true, message: "Vui lòng chọn thành phố" }]}
            >
              <Select
                placeholder="Chọn Thành Phố"
                value={city}
                onChange={handleCityChange}
                loading={citiesLoading}
              >
                {/* Render city options dynamically from the hook */}
                {cities.map((cityItem) => (
                  <Select.Option key={cityItem._id} value={cityItem._id}>
                    {cityItem.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* District Field */}
            <Form.Item
              label="Quận/Huyện"
              name="district"
              rules={[{ required: true, message: "Vui lòng chọn quận huyện" }]}
            >
              <Select
                placeholder="Chọn Quận/Huyện"
                value={district}
                onChange={handleDistrictChange}
                loading={districtLoading}
              >
                {/* Render city options dynamically from the hook */}
                {districts.map((district) => (
                  <Select.Option key={district._id} value={district._id}>
                    {district.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ward Field */}
            <Form.Item
              label="Xã"
              name="ward"
              rules={[{ required: true, message: "Vui lòng chọn xã" }]}
            >
              <Select
                placeholder="Chọn xã..."
                value={ward}
                onChange={handleWardChange}
                loading={wardsLoading}
              >
                {wards.map((ward) => (
                  <Select.Option key={ward._id} value={ward._id}>
                    {ward.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* Address Field */}
            <Form.Item label="Địa chỉ" name="address">
              <Input placeholder="Vui lòng nhập địa chỉ" />
            </Form.Item>
          </div>
        <Form.Item>
        <Button htmlType="submit"  className="px-4 !bg-[#201527] !text-primaryColor !border-none !hover:text-white">
          Lưu thay đổi
        </Button>
        </Form.Item>
      </Form>

      <h2 className="text-xl font-semibold mt-8 mb-4">CV & Sơ yếu lý lịch</h2>
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
          <div onClick={() => navigate("/upload-cv")}>
            <div className="font-medium">Thêm CV & Sơ yếu lý lịch</div>
            <div className="text-sm text-gray-500">
              Duyệt tập tin hoặc thả ở đây, chỉ pdf
            </div>
          </div>
        </div>
        {/* {iframeSrc && (
       <PDFViewer fileUrl={iframeSrc} />
      )} */}
      </div>
    </LoadingComponent>
  );
};

export default Personal;
