import {
  DeleteOutlined,
  EditOutlined,
  LineChartOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import {
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
import { LineChart, ProjectorIcon } from "lucide-react";
import { PROJECT_API } from "../../../services/modules/ProjectServices";
import moment from "moment";
import LoadingComponent from "../../../components/Loading/LoadingComponent";
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
  const [loading,setLoading]=useState<boolean>(false)
  const handleGetProjectsByUserId = async ({ current = 1, pageSize = 10 }) => {
    try {
      const params = {
        current,
        pageSize,
        query: {
          user_id: userDetail._id,
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
      user_id: userDetail._id,
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
      const res = await PROJECT_API.create(params, userDetail.access_token);
      if (res.data) {
        notification.success({
          message: "Thành công",
          description: "Thêm dự án thành công",
        });
      }
      handleGetProjectsByUserId({});
      closeModal();
    } catch (error) {
      notification.error({
        message: "Thông báo",
        description: "An error occurred while creating the project.",
      });
    }
  };
  const closeModal = () => {
    setVisible(false);
    setType("");
    form.resetFields();
    setLink("");
    setImgUrl("");
  };
  useEffect(() => {
    handleGetProjectsByUserId({});
  }, []);
  const onFileChange = async (file: any) => {
    try {
        setLoading(true)
        console.log("file",file)
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
    setLoading(false)
  };
  const onUpdate = async () => {
    try {
        const values = form.getFieldsValue();
        const params = {
          ...values,
          project_image: imgUrl || null,
          project_link: link || null,
        };
        const res = await PROJECT_API.update(selectedId, params, userDetail.access_token);
        if (res.data) {
          notification.success({
            message: "Notification",
            description: "Cập nhật danh sách",
          });
          handleGetProjectsByUserId({});
          closeModal();
        }
    }catch (error) {
        notification.error({
            message: "Notification",
            description:'An error occurred while updating the project.'
        })
    }
  };
  console.log("selectedId",selectedId)
  const handletGetDetail = async (id:string) => {
    try {
      const res = await PROJECT_API.findById(id,userDetail.access_token)
      setSelectedId(id)
      if(res.data){
        form.setFieldsValue({
            project_name: res.data.project_name || '',
            customer_name: res.data.customer_name || '',
            team_number: res.data.team_number || '',
            location: res.data.location || '',
            mission: res.data.mission || '',
            technology: res.data.technology || '',
            project_time: [
              res.data.start_date ? moment(res.data.start_date) : null,
              res.data.end_date ? moment(res.data.end_date) : null
            ],
            project_link: res.data.project_link || '',
            description: res.data.description || ''
        })
        setLink(res.data.project_link);
        setImgUrl(res.data.project_image);
    }
    }catch (error) {
        notification.error({
            message: "Notification",
            description:'An error occurred while getting the project.'
        })
    }
}
  useEffect(() => {
     if(selectedId){
     handletGetDetail(selectedId)
     } 
  },[selectedId])
  const onDelete = async (id:string) => {
    try {
      const res = await PROJECT_API.deleteByUser(id,userDetail.access_token)
      if(+res.statusCode === 200){
        notification.success({
            message: "Notification",
            description:'Xóa dự án'
        })
        handleGetProjectsByUserId({})
      }
    } catch (error) {
        notification.error({
            message: "Notification",
            description:'An error occurred while deleting the project.'
        })
    }
  };
  const renderBody = () => {
    return (
    <LoadingComponent isLoading={loading}>
          <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-4"
      >
        <Form.Item
          label="Tên dự án"
          name="project_name"
          rules={[{ required: true, message: "Vui lòng nhập tên dự án" }]}
        >
          <Input placeholder="Tên dự án" className="w-full" />
        </Form.Item>

        <Form.Item
          label="Khách hàng"
          name="customer_name"
          rules={[{ required: true, message: "Vui lòng nhập tên khách hàng" }]}
        >
          <Input placeholder="Tên khách hàng" />
        </Form.Item>

        <Form.Item
          label="Số thành viên"
          name="team_number"
          rules={[{ required: true, message: "Vui lòng nhập số thành viên" }]}
        >
          <InputNumber
            placeholder="Số thành viên tham gia dự án"
            className="w-full"
          />
        </Form.Item>

        <Form.Item
          label="Vị trí"
          name="location"
          rules={[{ required: true, message: "Vui lòng nhập vị trí" }]}
        >
          <Input placeholder="Vị trí của bạn trong dự án" />
        </Form.Item>

        <Form.Item
          label="Nhiệm vụ"
          name="mission"
          rules={[{ required: true, message: "Vui lòng nhập nhiệm vụ" }]}
        >
          <Input placeholder="Nhiệm vụ của bạn trong dự án" />
        </Form.Item>

        <Form.Item label="Công nghệ sử dụng" name="technology">
          <Input placeholder="Công nghệ được sử dụng trong dự án" />
        </Form.Item>

        <Form.Item
          label="Thời gian"
          name="project_time"
          rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}
        >
          <DatePicker.RangePicker
            className="w-full"
            placeholder={["Bắt đầu", "Kết thúc"]}
          />
        </Form.Item>

        <Form.Item label="Mô tả chi tiết" name="description">
          <TextArea rows={4} placeholder="Mô tả chi tiết dự án" />
        </Form.Item>

        <Form.Item label="Hình ảnh dự án" name="project_image">
          <UploadForm
            link={link}
            setLink={setLink}
            onFileChange={onFileChange}
          />
        </Form.Item>

        <Form.Item className="flex justify-end">
          {type === "create" && (
            <Button type="primary" htmlType="submit">
              Thêm{" "}
            </Button>
          )}
          {type === "edit" && (
            <div className="flex justify-between gap-4">
              <Button
                type="primary"
                onClick={onUpdate}
                className="bg-green-500 hover:bg-green-600 text-white px-8 w-full"
              >
                Cập nhật
              </Button>
              <Button
                type="danger"
                onClick={() => onDelete()}
                className="bg-primaryColor hover:bg-green-600 text-white px-8 w-full"
              >
                Xóa
              </Button>
            </div>
          )}
        </Form.Item>
      </Form>
    </LoadingComponent>
    );
  };

  const showModal = (type: string, id?: string) => {
    setVisible(true);
    setType(type);
   if(id){
    handletGetDetail(id)
   }
  };
  return (
    <div>
      <Card className="w-full">
        <div className="flex gap-5 ml-[30px] items-center">
          <ProjectorIcon className="text-primaryColor" />
          <h2 className="text-[18px] font-semibold">Dự án</h2>
        </div>
        {projects.length > 0 ? (
          <Card className="p-4 mt-6">
            {projects.map((project: Project) => (
              <Card key={project._id} className="mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {project.project_name}
                    </h3>
                    <p>Khách hàng: {project.customer_name}</p>
                    <p>
                      Thời gian: {moment(project.start_date).format("MM/YYYY")}{" "}
                      - {moment(project.end_date).format("MM/YYYY")}
                    </p>
                    <p>Nhiệm vụ: {project.mission}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => showModal("edit", project._id)}
                    />
                    <Popconfirm
                      title="Bạn có chắc muốn xóa dự án này?"
                        onConfirm={()=>onDelete(project._id)}
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
        ) : (
          <Card className="flex items-center flex-row justify-between p-6">
            <div>
              <p className="text-muted-foreground">
                Bạn có thể mô tả rõ hơn trong CV bằng cách chèn thêm hình ảnh
                hoặc liên kết mô tả dự án.
              </p>
            </div>
            <div className=" flex items-center justify-between mt-10">
              <Button
                onClick={() => showModal("create")}
                className="mt-4 border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600"
              >
                Thêm mục
              </Button>
              <LineChartOutlined
                size={30}
                className="text-green-500 text-3xl"
              />
            </div>
          </Card>
        )}
      </Card>

      <GeneralModal
        width={"1000px"}
        centered={false}
        visible={visible}
        onCancel={closeModal}
        onOk={closeModal}
        title={type === "create" ? "Thêm dự án" : "Sửa dự án"}
        renderBody={renderBody}
      />
    </div>
  );
};

export default ProjectComponent;