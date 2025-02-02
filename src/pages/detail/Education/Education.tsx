import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Checkbox,
  Button,
  DatePicker,
  Space,
  notification,
  Card,
} from "antd";
import { BookOutlined } from "@ant-design/icons";
import { EducationApi } from "../../../services/modules/educationServices";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import GeneralModal from "../../../components/ui/GeneralModal/GeneralModal";
import { GraduationCap, Pencil, School } from "lucide-react";
import { updateUser } from "../../../redux/slices/userSlices";
import useCalculateUserProfile from "../../../hooks/useCaculateProfile";
import LoadingComponentSkeleton from "../../../components/Loading/LoadingComponentSkeleton";
import LoadingComponent from "../../../components/Loading/LoadingComponent";
const { TextArea } = Input;

interface typePostEducation {
  school: string;
  major: string;
  start_date: string;
  end_date?: string;
  user_id: string;
  _id: string;
  description:string;
}

const EducationComponent = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCurrentlyStudying, setIsCurrentlyStudying] = useState(false);
  const user = useSelector((state: any) => state.user);
  const [education, setEducation] = useState<typePostEducation | null>(null);
  const [listEducations,setListEducation] = useState<typePostEducation[]>([])
  const [visibleModalEducation, setVisibleModalEducation] =
    useState<boolean>(false);
  const [selectedEducationId, setSelectedEducationId] = useState<string>("");
  const userDetail = useSelector((state) => state.user);
  const dispatch =useDispatch()
  const [actionType, setActionType] = useState<string>("create");
  const {
    handleUpdateProfile
  } = useCalculateUserProfile(userDetail?._id, userDetail?.access_token);
  const handleGetEducation = async (id: string, access_token: string) => {
    try {
      setIsLoading(true)
      const res = await EducationApi.getEducationById(id, access_token);
      setEducation(res.data);
    } catch (error) {
      notification.error({
        message: "Thông báo",
        description: error.message,
      });
    } finally{
      setIsLoading(false)
    }
  };

  useEffect(()=>{
    handleGetEducationByUserId()
  },[])

  const handleGetEducationByUserId = async () => {
    try {
      setLoading(true)
      const res = await EducationApi.getEducationByUserId(userDetail.access_token);
      if(res.data){
        setListEducation(res.data)
        dispatch(updateUser({ ...userDetail, ...res?.data,access_token: user.access_token }));
      }
    } catch (error) {
      notification.error({
        message: "Thông báo",
        description: error.message,
      });
    } finally{
      setLoading(false)
    }
  }
  const handleOpenModalEducation = (type: string, id?: string) => {
    setVisibleModalEducation(true);
    setSelectedEducationId(id);
    setActionType(type);
  };
  const EducationItem = ({
    school,
    major,
    start_date,
    end_date,
    id,
  }: {
    school: string;
    major: string;
    start_date: string;
    end_date?: string;
    idx: number;
    id: string;
  }) => {
    const formatDate = (date: string | null) => {
      if (!date) return 'Hiện tại';
      return moment(date).format('MM/YYYY');
    };
  
    return (
      <Card className="mt-3">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <School className="text-xl text-gray-600" />
          </div>
  
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <p style={{ margin: 0 }}>{school}</p>
                <p className="block text-gray-600 text-[10px]">{major}</p>
                <p className="block text-gray-500 text-[10px]">
                  {formatDate(start_date)} - {formatDate(end_date || null)}
                </p>
              </div>
              <Pencil
              size={16}
                className="text-primaryColor cursor-pointer"
                onClick={() => handleOpenModalEducation('edit', id)}
              />
            </div>
          </div>
        </div>
      </Card>
    );
  };
  
  const handlePostEducation = async (
    values: typePostEducation,
    accessToken: string
  ) => {
    try {
      const res = await EducationApi.postEducation(values, accessToken);
      return res;
    } catch (error) {
      notification.error({
        message: "Thông báo",
        description: error.message,
      });
    }
  };
  const closeModal = () => {
    setVisibleModalEducation(false);
    setSelectedEducationId("");
    setEducation(null);
  };
  const handleDeleteEducation = async () => {
    try {
      setLoading(true)
      if (education) {
       const res =  await EducationApi.deleteEducation(
          education._id,
          user.access_token
        );
        if(res.data){
          notification.success({
            message: "Thông báo",
            description: "Xóa thành công!",
          });
          await handleGetEducationByUserId();
          
          closeModal();
          setSelectedEducationId("");
          setEducation(null);
          await handleUpdateProfile()
        }
      }
    } catch (error) {
      notification.error({
        message: "Thông báo",
        description: error.message,
      });
    } finally{
      setLoading(false)
    }
  };

  const handleUpdateEducation = async () => {
    try {
      setLoading(true)
      if (education) {
      const data = form.getFieldsValue();
       const res =  await EducationApi.updateEducation(
          education._id,
          data,
          user.access_token
        );
        if(res.data){
          await handleGetEducationByUserId();
          closeModal();
          setSelectedEducationId("");
          setEducation(null);
          notification.success({
            message: "Thông báo",
            description: "Cập nhật thành công",
          });
          await handleUpdateProfile()
        }
      }
    } catch (error) {
      notification.error({
        message: "Thông báo",
        description: error.message,
      });
    } finally {
      setLoading(false)
    }
  };


  const onFinish = async (values: any) => {
    setLoading(true);
    const params = {
      ...values,
      user_id: user._id,
    };
  
    try {
      const res = await handlePostEducation(params, user.access_token);
      if (res.data) {
        notification.success({
          message: "Thông báo",
          description: "Tạo thành công!",
        });
        await handleGetEducationByUserId();
        closeModal();
        setSelectedEducationId("");
        setEducation(null);
        await handleUpdateProfile()
      }
    } catch (error) {
      notification.error({
        message: "Thông báo",
        description: error.message,
      });
    } finally {
      setLoading(false);  // Kết thúc trạng thái loading
      closeModal();  // Đóng modal sau khi hoàn tất
    }
  };
  

  const handleCheckboxChange = (e: any) => {
    setIsCurrentlyStudying(e.target.checked);
  };
  useEffect(() => {
    if (actionType === "edit" && selectedEducationId) {
      handleGetEducation(selectedEducationId, user.access_token);
    } else {
      form.resetFields();
      setIsCurrentlyStudying(false)
    }
  }, [actionType, selectedEducationId, form]);

  useEffect(() => {
    if (education) {
      form.setFieldsValue({
        school: education?.school,
        major: education?.major,
        start_date: education?.start_date ? moment(education?.start_date) : null,
        end_date: education?.end_date ? moment(education?.end_date) : null,
        currently_studying:
          education?.end_date === null ||
          !education?.end_date ||
          education?.end_date === undefined
            ? true
            : false,
        description:education?.description
      });
      setIsCurrentlyStudying(education?.currently_studying)
    }
  }, [education,selectedEducationId]);


  const renderBody = () => {
    return (
    <LoadingComponentSkeleton isLoading={isLoading}>
       <LoadingComponent isLoading={loading}>
       <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="school"
          label={<div className="text-[12px]">Trường</div>}
          rules={[{ required: true, message: "Vui lòng nhập tên trường" }]}
        >
          <Input
            prefix={<BookOutlined />}
            placeholder="Trường học"
            className="text-[12px]"
          />
        </Form.Item>

        <Form.Item name="major"
          label={<div className="text-[12px]">Chuyên ngành</div>}
          rules={[{ required: true, message: "Vui lòng nhập chuyên ngành" }]}
        
        >
          <Input placeholder="Công nghệ phần mềm, Kinh tế, Tự động hóa, .... " className="text-[12px]"  />
        </Form.Item>

        <Form.Item name="currently_studying" valuePropName="checked">
          <Checkbox
          className="text-[12px]"
            onChange={handleCheckboxChange}
          >
            Tôi đang học ở đây
          </Checkbox>
        </Form.Item>

        <Space
          style={{ width: "100%", justifyContent: "space-between" }}
          align="start"
        >
          <Form.Item
            name="start_date"
            label={<div className="text-[12px]">Bắt đầu</div>}
            style={{ width: "200px" }}
            rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}
          >
            <DatePicker picker="month" style={{ width: "100%",fontSize:'12px' }} />
          </Form.Item>

          {!isCurrentlyStudying && (
            <Form.Item
              name="end_date"
            label={<div className="text-[12px]">Kết thúc</div>}

              style={{ width: "200px" }}
              rules={[
                { required: true, message: "Vui lòng chọn ngày kết thúc" },
              ]}
            >
              <DatePicker picker="month" style={{ width: "100%",fontSize:'12px' }} />
            </Form.Item>
          )}
        </Space>

        <Form.Item name="description"
            label={<div className="text-[12px]">Mô tả chi tiết</div>}
        >
          <TextArea
           className="text-[12px]" 
            rows={4}
            placeholder="Mô tả chi tiết quá trình học của bạn để nhà tuyển dụng có thể hiểu bạn hơn"
          />
        </Form.Item>

        <Form.Item>
          {actionType === "create" ? (
            <div className="w-full">
              <Button
              type="primary"
              loading={loading}
              htmlType="submit"
              className="!bg-primaryColor w-full !text-[12px]"
            >
              Thêm
            </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <Button
              className="!bg-primaryColorH text-white"
                danger
                onClick={()=>handleUpdateEducation()}
                style={{
                  width: "100%",
                }}
              >
                Cập nhật
              </Button>
              <Button
                type="primary"
                loading={loading}
                onClick={()=>handleDeleteEducation()}
                style={{
                  width: "100%",
                  backgroundColor: "black",
                  borderColor: "#4CAF50",
                  border:'none'
                }}
                className="!text-[12px]"
              >
                Xóa
              </Button>
            </div>
          )}
        </Form.Item>
      </Form>
       </LoadingComponent>
    </LoadingComponentSkeleton>
    );
  };

  useEffect(() => {
    if (selectedEducationId) {
      handleGetEducation(selectedEducationId, user.access_token);
    }
  }, [selectedEducationId]);

  return (
    <div>
      {listEducations.length > 0 ? (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
            <GraduationCap  className="h-6 w-6 text-[#d3464f]" size={12} />

              <h2 className="font-semibold text-[12px]">Học vấn</h2>
            </div>
            <Button className="text-[12px]" onClick={() => handleOpenModalEducation("create")}>
              Thêm mục
            </Button>
          </div>
          {/* <div className="flex items-center justify-start"> */}
          <div>
            {listEducations?.map((item: any, index: number) => (
              <EducationItem
                school={item.school}
                major={item.major}
                start_date={item.start_date}
                end_date={item.end_date}
                idx={index}
                id={item._id}
              />
            ))}
          </div>
          {/* </div> */}
        </Card>
      ) : (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <GraduationCap  className="h-6 w-6 text-[#d3464f]" size={12} />
              <h2 className="font-semibold text-[12px]">Học vấn</h2>
            </div>
            <Button size="small" className="!text-[12px]" onClick={() => handleOpenModalEducation("create")}>Thêm mục</Button>
          </div>
          <p className="text-[12px] text-gray-500">
            Nếu bạn đã có CV trên DevHire, bấm Cập nhật để hệ thống tự động điền
            phần này theo CV.
          </p>
        </Card>
      )}
      <GeneralModal
        visible={visibleModalEducation}
        onCancel={() => {
          closeModal();
        }}
        onOk={closeModal}
        renderBody={renderBody}
        title={
          actionType === "create"
            ? "Học vấn"
            : actionType === "edit"
            ? "Cập nhật"
            : "Xóa học vấn"
        }
      />
    </div>
  );
};

export default EducationComponent;
