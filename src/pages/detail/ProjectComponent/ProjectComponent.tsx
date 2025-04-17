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
import { useTranslation } from "react-i18next";
import moment from "moment";
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
  const { t } = useTranslation();
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
  const { dateFormat, formatDate } = useMomentFn();
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
          message: t("notification"),
          description: t("create_success"),
        });
        await handleGetProjectsByUserId({});
        closeModal();
        await handleUpdateProfile();
      }
    } catch (error) {
      notification.error({
        message: t("notification"),
        description: t("create_failed"),
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
      const res = await MediaApi.postMedia(
        file,
        userDetail?._id,
        userDetail?.access_token
      );
      if (res.data.url) {
        setImgUrl(res.data.url);
      }
    } catch (error) {
      notification.error({
        message: t("notification"),
        description: t("upload_failed"),
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
          message: t("notification"),
          description: t("update_success"),
        });
        await handleGetProjectsByUserId({});
        closeModal();
        await handleUpdateProfile();
      }
    } catch (error) {
      notification.error({
        message: t("notification"),
        description: t("update_failed"),
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
            res.data.start_date ? moment(res.data.start_date) : null,
            res.data.end_date ? moment(res.data.end_date) : null,
          ],
          project_link: res.data.project_link || "",
          description: res.data.description || "",
        });
        setLink(res.data.project_link);
        setImgUrl(res.data.project_image);
      }
    } catch (error) {
      notification.error({
        message: t("notification"),
        description: t("get_project_failed"),
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
          message: t("notification"),
          description: t("delete_success"),
        });
        await handleGetProjectsByUserId({});
        closeModal();
        await handleUpdateProfile();
      }
    } catch (error) {
      notification.error({
        message: t("notification"),
        description: t("delete_failed"),
      });
    } finally {
      setLoading(false);
    }
  };
  const renderBody = () => {
    return (
      <LoadingComponentSkeleton isLoading={isLoading}>
        <LoadingComponent isLoading={loading}>
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            className="space-y-4"
          >
            <Form.Item
              label={<div className="text-[12px]">{t("project_name")}</div>}
              name="project_name"
              rules={[
                { required: true, message: t("please_enter_project_name") },
              ]}
            >
              <Input
                placeholder={t("project_name")}
                className="w-full text-[12px]"
              />
            </Form.Item>

            <Form.Item
              label={<div className="text-[12px]">{t("customer_name")}</div>}
              name="customer_name"
              rules={[
                { required: true, message: t("please_enter_customer_name") },
              ]}
            >
              <Input placeholder={t("customer_name")} className="text-[12px]" />
            </Form.Item>

            <Form.Item
              label={<div className="text-[12px]">{t("team_number")}</div>}
              name="team_number"
              rules={[
                { required: true, message: t("please_enter_team_number") },
              ]}
            >
              <InputNumber
                placeholder={t("team_number")}
                className="w-full text-[12px]"
              />
            </Form.Item>

            <Form.Item
              label={<div className="text-[12px]">{t("location")}</div>}
              name="location"
              rules={[{ required: true, message: t("please_enter_location") }]}
            >
              <Input placeholder={t("location")} className="text-[12px]" />
            </Form.Item>

            <Form.Item
              label={<div className="text-[12px]">{t("mission")}</div>}
              name="mission"
              rules={[{ required: true, message: t("please_enter_mission") }]}
            >
              <Input placeholder={t("mission")} className="text-[12px]" />
            </Form.Item>

            <Form.Item
              label={<div className="text-[12px]">{t("technology")}</div>}
              name="technology"
            >
              <Input
                placeholder={t("technology_used")}
                className="text-[12px]"
              />
            </Form.Item>

            <Form.Item
              label={<div className="text-[12px]">{t("time")}</div>}
              name="project_time"
              rules={[{ required: true, message: t("please_select_time") }]}
            >
              <DatePicker.RangePicker
                className="w-full"
                placeholder={[t("start"), t("end")]}
                format={dateFormat}
              />
            </Form.Item>

            <Form.Item
              label={<div className="text-[12px]">{t("description")}</div>}
              name="description"
            >
              <TextArea
                rows={4}
                placeholder={t("description")}
                className="text-[12px]"
              />
            </Form.Item>

            <Form.Item
              label={<div className="text-[12px]">{t("project_image")}</div>}
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
                  // onClick={handleSubmit}
                  htmlType="submit"
                  className="!bg-primaryColor !text-white !w-full !border-none text-[12px]"
                >
                  {t("add")}
                </Button>
              )}
              {type === "edit" && (
                <div className="flex justify-between gap-4">
                  <Button
                    htmlType="submit"
                    className="px-4 !bg-primaryColor !text-white !border-none !hover:text-white w-full !cursor-pointer text-[12px]"
                    onClick={onUpdate}
                  >
                    {t("update")}
                  </Button>
                  <Button
                    htmlType="submit"
                    className="px-4 !bg-black !text-white !border-none !hover:text-white w-full !cursor-pointer text-[12px]"
                    onClick={() => onDelete(selectedId)}
                  >
                    {t("delete")}
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
              <h2 className="text-[12px] font-semibold">{t("project")}</h2>
            </div>
            <Button
              className="!text-[12px]"
              onClick={() => showModal("create")}
            >
              {t("add")}
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
                      {t("customer_name")}: {project.customer_name}
                    </p>
                    <p className="text-[12px]">
                      {t("time")}:{" "}
                      {moment(project.start_date).format(dateFormat)} -{" "}
                      {moment(project.end_date).format(dateFormat)}
                    </p>
                    <p className="text-[12px]">
                      {t("mission")}: {project.mission}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => showModal("edit", project?._id)}
                  />
                  <Popconfirm
                    title={t("are_you_sure_you_want_to_delete_this_project")}
                    onConfirm={() => onDelete(project?._id)}
                    okText={t("delete")}
                    cancelText={t("cancel")}
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
              <h2 className="text-[12px] font-semibold">{t("project")}</h2>
            </div>
            <Button
              className="!text-[12px]"
              onClick={() => showModal("create")}
            >
              {t("add")}
            </Button>
          </div>
          <div className="text-[12px]">
            {t(
              "if_you_have_a_CV_on_DevHire_click_update_to_automatically_fill_this_part_according_to_the_CV"
            )}
          </div>
        </Card>
      )}
      <GeneralModal
        width={"1000px"}
        centered={false}
        visible={visible}
        onCancel={closeModal}
        onOk={closeModal}
        title={type === "create" ? t("project") : t("update")}
        renderBody={renderBody}
      />
    </div>
  );
};

export default ProjectComponent;
