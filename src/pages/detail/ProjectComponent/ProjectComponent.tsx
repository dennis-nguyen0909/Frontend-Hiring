import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  notification,
  Popconfirm,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import UploadForm from "../../../components/ui/UploadForm/UploadForm";
import { MediaApi } from "../../../services/modules/mediaServices";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import GeneralModal from "../../../components/ui/GeneralModal/GeneralModal";
import { FolderOpenDot } from "lucide-react";
import { PROJECT_API } from "../../../services/modules/ProjectServices";
import LoadingComponent from "../../../components/Loading/LoadingComponent";
import useCalculateUserProfile from "../../../hooks/useCaculateProfile";
import LoadingComponentSkeleton from "../../../components/Loading/LoadingComponentSkeleton";
import useMomentFn from "../../../hooks/useMomentFn";
interface Project {
  _id: string;
  user_id: string;
  project_name: string;
  customer_name: string;
  team_number: number;
  location: string;
  mission: string;
  technology: string;
  start_date: Date; // Assuming you're working with Date objects
  end_date: Date; // Assuming you're working with Date objects
  project_link: string | null;
  project_image: string | null;
  description: string;
}

const ProjectComponent = () => {
  const [form] = Form.useForm();
  const [link, setLink] = useState<string>("");
  const [imgUrl, setImgUrl] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);
  const [type, setType] = useState<string>("");
  const userDetail = useSelector((state) => state.user);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { formatDate } = useMomentFn();
  const { handleUpdateProfile } = useCalculateUserProfile(
    userDetail?._id,
    userDetail?.access_token
  );

  const handleGetProjectsByUserId = async ({ current = 1, pageSize = 10 }) => {
    try {
      const params = {
        current,
        pageSize,
        query: {
          user_id: userDetail?._id,
        },
      };
      const res = await PROJECT_API.getAll(params, userDetail.access_token);
      if (res.data) {
        setProjects(res.data.items);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleSubmit = async (values: any) => {
    const params = {
      user_id: userDetail?._id,
      project_name: values.project_name,
      customer_name: values.customer_name,
      team_number: values.team_number,
      location: values.location,
      mission: values.mission,
      technology: values.technology,
      start_date: values?.project_time[0],
      end_date: values?.project_time[1],
      project_link: link || null,
      project_image: imgUrl || null,
      description: values.description,
    };
    try {
      setLoading(true);
      const res = await PROJECT_API.create(params, userDetail.access_token);
      if (res.data) {
        notification.success({
          message: "Thành công",
          description: "Thêm dự án thành công",
        });
        await handleGetProjectsByUserId({});
        closeModal();
        await handleUpdateProfile();
      }
    } catch (error) {
      notification.error({
        message: "Thông báo",
        description: "An error occurred while creating the project.",
      });
    } finally {
      setLoading(false);
    }
  };
  const closeModal = () => {
    setVisible(false);
    setType("");
    form.resetFields();
    setLink("");
    setImgUrl("");
    setSelectedId("");
  };
  useEffect(() => {
    handleGetProjectsByUserId({});
  }, []);
  const onFileChange = async (file: any) => {
    try {
      setLoading(true);
      const res = await MediaApi.postMedia(file, userDetail?.access_token);
      if (res.data.url) {
        setImgUrl(res.data.url);
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "An error occurred while uploading the file.",
      });
    }
    setLoading(false);
  };
  const onUpdate = async () => {
    try {
      setLoading(true);
      const values = form.getFieldsValue();
      const params = {
        ...values,
        project_image: imgUrl || null,
        project_link: link || null,
      };
      const res = await PROJECT_API.update(
        selectedId,
        params,
        userDetail.access_token
      );
      if (res.data) {
        notification.success({
          message: "Thông báo",
          description: "Cập nhật thành công",
        });
        await handleGetProjectsByUserId({});
        closeModal();
        await handleUpdateProfile();
      }
    } catch (error) {
      notification.error({
        message: "Thông báo",
        description: "An error occurred while updating the project.",
      });
    } finally {
      setLoading(false);
    }
  };
  const handletGetDetail = async (id: string) => {
    try {
      setIsLoading(true);
      const res = await PROJECT_API.findById(id, userDetail.access_token);
      setSelectedId(id);
      if (res.data) {
        form.setFieldsValue({
          project_name: res.data.project_name || "",
          customer_name: res.data.customer_name || "",
          team_number: res.data.team_number || "",
          location: res.data.location || "",
          mission: res.data.mission || "",
          technology: res.data.technology || "",
          project_time: [
            res.data.start_date ? formatDate(res.data.start_date) : null,
            res.data.end_date ? formatDate(res.data.end_date) : null,
          ],
          project_link: res.data.project_link || "",
          description: res.data.description || "",
        });
        setLink(res.data.project_link);
        setImgUrl(res.data.project_image);
      }
    } catch (error) {
      notification.error({
        message: "Thông báo",
        description: "An error occurred while getting the project.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (selectedId) {
      handletGetDetail(selectedId);
    }
  }, [selectedId]);
  const onDelete = async (id: string) => {
    try {
      setLoading(true);
      const res = await PROJECT_API.deleteByUser(id, userDetail.access_token);
      if (+res.statusCode === 200) {
        notification.success({
          message: "Thông báo",
          description: "Xóa dự án",
        });
        await handleGetProjectsByUserId({});
        closeModal();
        await handleUpdateProfile();
      }
    } catch (error) {
      notification.error({
        message: "Thông báo",
        description: "An error occurred while deleting the project.",
      });
    } finally {
      setLoading(false);
    }
  };
  const renderBody = () => {
    return (
      <LoadingComponentSkeleton isLoading={isLoading}>
        <LoadingComponent isLoading={loading}>
          <Form form={form} layout="vertical" className="space-y-4">
            <Form.Item
              label={<div className="text-[12px]">Tên dự án</div>}
              name="project_name"
              rules={[{ required: true, message: "Vui lòng nhập tên dự án" }]}
            >
              <Input placeholder="Tên dự án" className="w-full text-[12px]" />
            </Form.Item>

            <Form.Item
              label={<div className="text-[12px]">Khách hàng</div>}
              name="customer_name"
              rules={[
                { required: true, message: "Vui lòng nhập tên khách hàng" },
              ]}
            >
              <Input placeholder="Tên khách hàng" className="text-[12px]" />
            </Form.Item>

            <Form.Item
              label={<div className="text-[12px]">Số thành viên</div>}
              name="team_number"
              rules={[
                { required: true, message: "Vui lòng nhập số thành viên" },
              ]}
            >
              <InputNumber
                placeholder="Số thành viên tham gia dự án"
                className="w-full text-[12px]"
              />
            </Form.Item>

            <Form.Item
              label={<div className="text-[12px]">Vị trí</div>}
              name="location"
              rules={[{ required: true, message: "Vui lòng nhập vị trí" }]}
            >
              <Input
                placeholder="Vị trí của bạn trong dự án"
                className="text-[12px]"
              />
            </Form.Item>

            <Form.Item
              label={<div className="text-[12px]">Nhiệm vụ</div>}
              name="mission"
              rules={[{ required: true, message: "Vui lòng nhập nhiệm vụ" }]}
            >
              <Input
                placeholder="Nhiệm vụ của bạn trong dự án"
                className="text-[12px]"
              />
            </Form.Item>

            <Form.Item
              label={<div className="text-[12px]">Công nghệ sử dụng</div>}
              name="technology"
            >
              <Input
                placeholder="Công nghệ được sử dụng trong dự án"
                className="text-[12px]"
              />
            </Form.Item>

            <Form.Item
              label={<div className="text-[12px]">Thời gian</div>}
              name="project_time"
              rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}
            >
              <DatePicker.RangePicker
                className="w-full"
                placeholder={["Bắt đầu", "Kết thúc"]}
              />
            </Form.Item>

            <Form.Item
              label={<div className="text-[12px]">Mô tả chi tiết</div>}
              name="description"
            >
              <TextArea
                rows={4}
                placeholder="Mô tả chi tiết dự án"
                className="text-[12px]"
              />
            </Form.Item>

            <Form.Item
              label={<div className="text-[12px]">Hình ảnh dự án (nếu có)</div>}
              name="project_image"
            >
              <UploadForm
                link={link}
                setLink={setLink}
                onFileChange={onFileChange}
              />
            </Form.Item>

            <Form.Item className="w-full">
              {type === "create" && (
                <Button
                  onClick={handleSubmit}
                  htmlType="submit"
                  className="!bg-primaryColor !text-white !w-full !border-none text-[12px]"
                >
                  Thêm
                </Button>
              )}
              {type === "edit" && (
                <div className="flex justify-between gap-4">
                  <Button
                    htmlType="submit"
                    className="px-4 !bg-primaryColor !text-white !border-none !hover:text-white w-full !cursor-pointer text-[12px]"
                    onClick={onUpdate}
                  >
                    Cập nhật
                  </Button>
                  <Button
                    htmlType="submit"
                    className="px-4 !bg-black !text-white !border-none !hover:text-white w-full !cursor-pointer text-[12px]"
                    onClick={() => onDelete(selectedId)}
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

  const showModal = (type: string, id?: string) => {
    setVisible(true);
    setType(type);
    if (id) {
      handletGetDetail(id);
    }
  };
  return (
    <div>
      {projects.length > 0 && (
        <Card className=" mt-6 !border-none">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <FolderOpenDot className="h-6 w-6 text-[#d3464f] text-[12px]" />
              <h2 className="text-[12px] font-semibold">Dự án</h2>
            </div>
            <Button
              className="!text-[12px]"
              onClick={() => showModal("create")}
            >
              Thêm mục
            </Button>
          </div>
          {projects.map((project: Project) => (
            <Card key={project._id} className="mb-4 ">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div>
                    {project?.project_image && (
                      <Avatar
                        shape="square"
                        size={64}
                        src={project?.project_image}
                        alt={project?.project_image}
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[14px]">
                      {project.project_name}
                    </h3>
                    <p className="text-[12px]">
                      Khách hàng: {project.customer_name}
                    </p>
                    <p className="text-[12px]">
                      Thời gian: {formatDate(project.start_date)} -{" "}
                      {formatDate(project.end_date)}
                    </p>
                    <p className="text-[12px]">Nhiệm vụ: {project.mission}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => showModal("edit", project?._id)}
                  />
                  <Popconfirm
                    title="Bạn có chắc muốn xóa dự án này?"
                    onConfirm={() => onDelete(project?._id)}
                    okText="Xóa"
                    cancelText="Hủy"
                  >
                    <Button icon={<DeleteOutlined />} />
                  </Popconfirm>
                </div>
              </div>
            </Card>
          ))}
        </Card>
      )}
      {!projects.length > 0 && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <FolderOpenDot className="h-6 w-6 text-[#d3464f] text-[12px]" />
              <h2 className="text-[12px] font-semibold">Dự án</h2>
            </div>
            <Button
              className="!text-[12px]"
              onClick={() => showModal("create")}
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
        width={"1000px"}
        centered={false}
        visible={visible}
        onCancel={closeModal}
        onOk={closeModal}
        title={type === "create" ? "Dự án" : "Cập nhật"}
        renderBody={renderBody}
      />
    </div>
  );
};

export default ProjectComponent;

{
  /* <Card className="!border-none flex items-center">
            <div className="border-gray-50 border-e-2">
              <p className="text-muted-foreground text-[12px]">
                Bạn có thể mô tả rõ hơn trong CV bằng cách chèn thêm hình ảnh
                hoặc liên kết mô tả dự án.
              </p>
            </div>
          </Card> */
}
