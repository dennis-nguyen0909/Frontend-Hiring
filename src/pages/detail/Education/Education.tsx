import React, { useState, useEffect } from "react";
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
import { BookOpen, Pencil, School } from "lucide-react";
import { updateUser } from "../../../redux/slices/userSlices";
const { TextArea } = Input;

interface typePostEducation {
  school: string;
  major: string;
  start_date: string;
  end_date?: string;
  user_id: string;
  _id: string;
}

const EducationComponent = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
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

  const handleGetEducation = async (id: string, access_token: string) => {
    try {
      const res = await EducationApi.getEducationById(id, access_token);
      setEducation(res.data);
    } catch (error) {
      notification.error({
        message: "Notification",
        description: error.message,
      });
    }
  };

  useEffect(()=>{
    handleGetEducationByUserId()
  },[])

  const handleGetEducationByUserId = async () => {
    try {
      const res = await EducationApi.getEducationByUserId(userDetail.access_token);
      if(res.data){
        setListEducation(res.data)
        dispatch(updateUser({ ...userDetail, ...res?.data,access_token: user.access_token }));
      }
    } catch (error) {
      notification.error({
        message: "Notification",
        description: error.message,
      });
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
    idx,
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
        message: "Notification",
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
        }
      }
    } catch (error) {
      notification.error({
        message: "Thông báo",
        description: error.message,
      });
    }
  };

  const handleUpdateEducation = async () => {
    try {
      if (education) {
        const data = form.getFieldsValue();
        console.log("data",data)
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
        }
      }
    } catch (error) {
      notification.error({
        message: "Notification",
        description: error.message,
      });
    }
  };


  const onFinish = async (values: any) => {
    setLoading(true);  // Bắt đầu trạng thái loading
    const params = {
      ...values,
      user_id: user._id,
    };
  
    try {
      // Gọi API để tạo mới học vấn
      const res = await handlePostEducation(params, user.access_token);
      if (res.data) {
        notification.success({
          message: "Thông báo",
          description: "Tạo thành công!",
        });
        // Gọi API để lấy danh sách học vấn mới
        await handleGetEducationByUserId();  // Đảm bảo gọi API lấy danh sách học vấn sau khi tạo thành công
        dispatch(updateUser({ ...userDetail, ...res?.data, access_token: user.access_token }));
        closeModal();
        setSelectedEducationId("");
        setEducation(null);
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
    }
  }, [actionType, selectedEducationId, form]);

  useEffect(() => {
    if (education) {
      form.setFieldsValue({
        school: education.school,
        major: education.major,
        start_date: education.start_date ? moment(education.start_date) : null,
        end_date: education.end_date ? moment(education.end_date) : null,
        currently_studying:
          education.end_date === null ||
          !education.end_date ||
          education.end_date === undefined
            ? true
            : false,
      });
    }
  }, [education,selectedEducationId]);


  const renderBody = () => {
    return (
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="school"
          label="Trường"
          rules={[{ required: true, message: "Vui lòng nhập tên trường" }]}
        >
          <Input
            prefix={<BookOutlined />}
            placeholder="Trường học"
          />
        </Form.Item>

        <Form.Item name="major" label="Chuyên ngành">
          <Input placeholder="Công nghệ phần mềm, Kinh tế, Tự động hóa, ...." />
        </Form.Item>

        <Form.Item name="currently_studying" valuePropName="checked">
          <Checkbox
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
            label="Bắt đầu"
            style={{ width: "200px" }}
            rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}
          >
            <DatePicker picker="month" style={{ width: "100%" }} />
          </Form.Item>

          {!isCurrentlyStudying && (
            <Form.Item
              name="end_date"
              label="Kết thúc"
              style={{ width: "200px" }}
              rules={[
                { required: true, message: "Vui lòng chọn ngày kết thúc" },
              ]}
            >
              <DatePicker picker="month" style={{ width: "100%" }} />
            </Form.Item>
          )}
        </Space>

        <Form.Item name="description" label="Mô tả chi tiết">
          <TextArea
            rows={4}
            placeholder="Mô tả chi tiết quá trình học của bạn để nhà tuyển dụng có thể hiểu bạn hơn"
          />
        </Form.Item>

        <Form.Item>
          {actionType === "create" ? (
            <Button
              type="primary"
              loading={loading}
              htmlType="submit"
              style={{
                width: "100%",
                backgroundColor: "#4CAF50",
                borderColor: "#4CAF50",
              }}
            >
              Thêm
            </Button>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <Button
              className="!bg-primaryColorH text-white"
                danger
                onClick={()=>handleDeleteEducation()}
                style={{
                  width: "100%",
                }}
              >
                Xóa
              </Button>
              <Button
                type="primary"
                loading={loading}
                onClick={()=>handleUpdateEducation()}
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
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-[#d3464f]" />
              <h2 className="font-semibold">Học vấn</h2>
            </div>
            <Button onClick={() => handleOpenModalEducation("create")}>
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
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-[#d3464f]" />
              <h2 className="font-semibold">Học vấn</h2>
            </div>
            <Button onClick={() => handleOpenModalEducation("create")}>Thêm mục</Button>
          </div>
          <p className="text-sm text-gray-500">
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
            ? "Thêm học vấn"
            : actionType === "edit"
            ? "Chỉnh sửa học vấn"
            : "Xóa học vấn"
        }
      />
    </div>
  );
};

export default EducationComponent;
