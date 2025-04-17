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
import { useTranslation } from "react-i18next";
import moment from "moment";

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
  const { t } = useTranslation();
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
          start_date: moment(res.data.start_date)
            ? moment(res.data.start_date)
            : "",
          end_date: moment(res.data.end_date) ? moment(res.data.end_date) : "",
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

      const formattedStartDate = moment(start_date);
      const formattedEndDate = moment(end_date);

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
          message: t("notification"),
          description: t("create_success"),
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
    const res = await MediaApi.postMedia(
      file,
      userDetail?._id,
      userDetail.access_token
    );
    if (res.data.url) {
      setImgUrl(res.data.url);
    } else {
      notification.error({
        message: t("notification"),
        description: t("upload_failed"),
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
          message: t("notification"),
          description: t("update_success"),
        });
        await handleGetCoursesByUserId({});
        closeModal();
        await handleUpdateProfile();
      }
    } catch (error) {
      notification.error({
        message: t("notification"),
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
          message: t("notification"),
          description: t("delete_success"),
        });
        await handleGetCoursesByUserId({});
        closeModal();
        await handleUpdateProfile();
      }
    } catch (error) {
      notification.error({
        message: t("notification"),
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
                label={<span className="text-[12px]">{t("course_name")}</span>}
                name="course_name"
                rules={[
                  { required: true, message: t("please_enter_course_name") },
                ]}
              >
                <Input
                  placeholder={t("course_name")}
                  className="w-full text-[12px]"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-[12px]">
                    {t("organization_name_course")}
                  </span>
                }
                name="organization_name"
                rules={[
                  {
                    required: true,
                    message: t("please_enter_organization_name_course"),
                  },
                ]}
              >
                <Input
                  placeholder={t("organization_name_course")}
                  className="w-full text-[12px]"
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-[12px]">{t("start_date")}</span>}
                name="start_date"
                rules={[
                  { required: true, message: t("please_enter_start_date") },
                ]}
              >
                <Input type="date" className="text-[12px]" />
              </Form.Item>

              <Form.Item
                label={<span className="text-[12px]">{t("end_date")}</span>}
                name="end_date"
                rules={[
                  { required: true, message: t("please_enter_end_date") },
                ]}
              >
                <Input type="date" className="text-[12px]" />
              </Form.Item>

              <Form.Item
                label={<span className="text-[12px]">{t("description")}</span>}
                name="description"
              >
                <TextArea
                  placeholder={t("description")}
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
                  {t("add")}
                </Button>
              )}
              {type === "edit" && (
                <div className="flex justify-between gap-2">
                  <Button
                    type="primary"
                    onClick={onUpdate}
                    className="w-full !bg-primaryColor text-[12px]"
                  >
                    {t("update")}
                  </Button>
                  <Button
                    type="primary"
                    onClick={onDelete}
                    className="w-full !bg-black text-[12px]"
                  >
                    {t("delete")}
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
              <h2 className="font-semibold  text-[12px]">{t("course")}</h2>
            </div>
            <Button
              className="!text-[12px]"
              onClick={() => handleOpenModel("create")}
            >
              {t("add")}
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
              <h2 className="font-semibold  text-[12px]">{t("course")}</h2>
            </div>
            <Button
              className="!text-[12px]"
              onClick={() => handleOpenModel("create")}
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
        renderBody={renderBody}
        visible={visible}
        title={type === "create" ? t("course") : t("update")}
        onCancel={closeModal}
      />
    </>
  );
}
