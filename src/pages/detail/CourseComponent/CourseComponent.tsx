import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Button, Card, Form, Input, notification } from "antd";
import GeneralModal from "../../../components/ui/GeneralModal/GeneralModal";
import UploadForm from "../../../components/ui/UploadForm/UploadForm";
import { MediaApi } from "../../../services/modules/mediaServices";
import { COURSE_API } from "../../../services/modules/CourseServices";
import Course from "./Course";
import { Book } from "lucide-react";
import TextArea from "antd/es/input/TextArea";
import useCalculateUserProfile from "../../../hooks/useCaculateProfile";
import LoadingComponent from "../../../components/Loading/LoadingComponent";
import LoadingComponentSkeleton from "../../../components/Loading/LoadingComponentSkeleton";
import useMomentFn from "../../../hooks/useMomentFn";

interface Course {
  _id: string;
  user_id: string;
  course_name: string;
  organization_name: string;
  start_date?: Date;
  description: string;
  end_date?: Date;
  course_link?: string;
  course_image?: string;
}

export default function CourseView() {
  const { formatDate } = useMomentFn();
  const userDetail = useSelector((state) => state.user);
  const [courses, setCourses] = useState<Course[]>([]);
  const [type, setType] = useState<string>("");
  const [imgUrl, setImgUrl] = useState<string>("");
  const [visible, setVisible] = useState(false);
  const [link, setLink] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const { handleUpdateProfile } = useCalculateUserProfile(
    userDetail?._id,
    userDetail?.access_token
  );

  const handleGetCoursesByUserId = async ({ current = 1, pageSize = 10 }) => {
    try {
      const params = {
        current,
        pageSize,
        query: {
          user_id: userDetail?._id,
        },
      };
      const res = await COURSE_API.getAll(params, userDetail.accessToken);
      if (res.data) {
        setCourses(res.data.items);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetCoursesByUserId({});
  }, []);

  const closeModal = () => {
    setVisible(false);
    setType("");
    form.resetFields();
    setLink("");
    setImgUrl("");
    setSelectedId("");
  };

  const handleGetDetailCourse = async () => {
    try {
      setLoadingDetail(true);
      const res = await COURSE_API.findByCOURSEId(
        selectedId,
        userDetail.accessToken
      );
      if (res.data) {
        form.setFieldsValue({
          ...res.data,
          start_date: formatDate(res.data.start_date)
            ? formatDate(res.data.start_date)
            : "",
          end_date: formatDate(res.data.end_date)
            ? formatDate(res.data.end_date)
            : "",
        });
        setLink(res.data.course_link);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    if (selectedId) {
      handleGetDetailCourse();
    }
  }, [selectedId]);
  const handleOpenModel = (type: string, id?: string) => {
    setType(type);
    setVisible(!visible);
    setSelectedId(id || "");
  };

  const [form] = Form.useForm();

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      const { start_date, end_date } = values;

      const formattedStartDate = formatDate(start_date);
      const formattedEndDate = formatDate(end_date);

      const params = {
        user_id: userDetail?._id,
        course_name: values.course_name,
        organization_name: values.organization_name,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        course_link: link || null,
        course_image: imgUrl || null,
        description: values.description,
      };

      const res = await COURSE_API.create(params, userDetail.accessToken);
      if (res.data) {
        notification.success({
          message: "Thông báo",
          description: "Thêm Khóa học thành công",
        });
        await handleGetCoursesByUserId({});
        closeModal();
        await handleUpdateProfile();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleOnchangeFile = async (file: File) => {
    setLoading(true);
    const res = await MediaApi.postMedia(file, userDetail.access_token);
    if (res.data.url) {
      setImgUrl(res.data.url);
    } else {
      notification.error({
        message: "Thông báo",
        description: "Tải thất bại",
      });
    }
    setLoading(false);
  };

  const onUpdate = async () => {
    setLoading(true);
    const values = form.getFieldsValue();
    const params = {
      ...values,
      course_link: link || null,
      course_image: imgUrl || null,
    };
    try {
      const res = await COURSE_API.update(
        selectedId,
        params,
        userDetail.accessToken
      );
      if (res.data) {
        notification.success({
          message: "Thông báo",
          description: "Cập nhật thành công",
        });
        await handleGetCoursesByUserId({});
        closeModal();
        await handleUpdateProfile();
      }
    } catch (error) {
      notification.error({
        message: "Thông báo",
        description: error.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };
  const onDelete = async () => {
    try {
      setLoading(true);

      const res = await COURSE_API.deleteByUser(
        selectedId,
        userDetail.accessToken
      );
      if (+res.statusCode === 200) {
        notification.success({
          message: "Thông báo",
          description: "Xóa thành công",
        });
        await handleGetCoursesByUserId({});
        closeModal();
        await handleUpdateProfile();
      }
    } catch (error) {
      notification.error({
        message: "Thông báo",
        description: error.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderBody = () => {
    return (
      <LoadingComponentSkeleton isLoading={loadingDetail}>
        <LoadingComponent isLoading={loading}>
          <Form form={form} layout="vertical" onFinish={onSubmit}>
            <LoadingComponent isLoading={loading}>
              <Form.Item
                label={<span className="text-[12px]">Tên khóa học</span>}
                name="course_name"
                rules={[
                  { required: true, message: "Vui lòng nhập tên khóa học" },
                ]}
              >
                <Input
                  placeholder="Tên khóa học"
                  className="w-full text-[12px]"
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-[12px]">Tổ chức</span>}
                name="organization_name"
                rules={[
                  { required: true, message: "Vui lòng nhập tên tổ chức" },
                ]}
              >
                <Input placeholder="Tổ chức" className="w-full text-[12px]" />
              </Form.Item>

              <Form.Item
                label={<span className="text-[12px]">Ngày bắt đầu</span>}
                name="start_date"
                rules={[
                  { required: true, message: "Vui lòng nhập ngày bắt đầu" },
                ]}
              >
                <Input type="date" className="text-[12px]" />
              </Form.Item>

              <Form.Item
                label={<span className="text-[12px]">Ngày kết thúc</span>}
                name="end_date"
                rules={[
                  { required: true, message: "Vui lòng nhập ngày kết thúc" },
                ]}
              >
                <Input type="date" className="text-[12px]" />
              </Form.Item>

              <Form.Item
                label={<span className="text-[12px]">Mô tả</span>}
                name="description"
              >
                <TextArea
                  placeholder="Mô tả ngắn gọn ..."
                  className="text-[12px]"
                  rows={3}
                />
              </Form.Item>

              <div className="mt-4 mb-6">
                <UploadForm
                  onFileChange={handleOnchangeFile}
                  link={link}
                  setLink={setLink}
                />
              </div>

              {type === "create" && (
                <Button
                  htmlType="submit"
                  className="px-4 !bg-primaryColor !text-white !border-none !hover:text-white w-full !cursor-pointer"
                >
                  Thêm
                </Button>
              )}
              {type === "edit" && (
                <div className="flex justify-between gap-2">
                  <Button
                    type="primary"
                    onClick={onUpdate}
                    className="w-full !bg-primaryColor text-[12px]"
                  >
                    Cập nhật
                  </Button>
                  <Button
                    type="primary"
                    onClick={onDelete}
                    className="w-full !bg-black text-[12px]"
                  >
                    Xóa
                  </Button>
                </div>
              )}
            </LoadingComponent>
          </Form>
        </LoadingComponent>
      </LoadingComponentSkeleton>
    );
  };

  return (
    <>
      {courses?.length > 0 ? (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Book className="h-6 w-6 text-[#d3464f] text-[12px]" />
              <h2 className="font-semibold  text-[12px]">Khóa học</h2>
            </div>
            <Button
              className="!text-[12px]"
              onClick={() => handleOpenModel("create")}
            >
              Thêm mục
            </Button>
          </div>
          {courses?.map((course) => (
            <Course
              {...course}
              start_date={course.start_date}
              end_date={course.end_date}
              course_name={course.course_name}
              organization_name={course.organization_name}
              description={course?.description}
              course_link={course?.course_link}
              course_image={course?.course_image}
              onEdit={() => handleOpenModel("edit", course._id)}
            />
          ))}
        </Card>
      ) : (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Book className="h-6 w-6 text-[#d3464f] text-[12px]" />
              <h2 className="font-semibold  text-[12px]">Khóa học</h2>
            </div>
            <Button
              className="!text-[12px]"
              onClick={() => handleOpenModel("create")}
            >
              Thêm mục
            </Button>
          </div>
          <div className="text-[12px]">
            Nếu bạn đã có CV trên DevHire, bấm Cập nhật để hệ thống tự động điền
            phần này theo CV.
          </div>
        </Card>
      )}

      <GeneralModal
        renderBody={renderBody}
        visible={visible}
        title={type === "create" ? "Khóa học" : "Cập nhật"}
        onCancel={closeModal}
      />
    </>
  );
}
