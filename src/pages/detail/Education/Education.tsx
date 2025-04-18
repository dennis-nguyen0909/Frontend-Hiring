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
import GeneralModal from "../../../components/ui/GeneralModal/GeneralModal";
import { GraduationCap, Pencil, School } from "lucide-react";
import { updateUser } from "../../../redux/slices/userSlices";
import useCalculateUserProfile from "../../../hooks/useCaculateProfile";
import LoadingComponentSkeleton from "../../../components/Loading/LoadingComponentSkeleton";
import LoadingComponent from "../../../components/Loading/LoadingComponent";
import useMomentFn from "../../../hooks/useMomentFn";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

const { TextArea } = Input;

interface typePostEducation {
  school: string;
  major: string;
  start_date: string;
  end_date?: string;
  user_id: string;
  _id: string;
  description: string;
  currently_studying?: boolean;
}

const EducationComponent = () => {
  const { formatDate, dateFormat } = useMomentFn();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCurrentlyStudying, setIsCurrentlyStudying] = useState(false);
  const user = useSelector((state: any) => state.user);
  const [education, setEducation] = useState<typePostEducation | null>(null);
  const [listEducations, setListEducation] = useState<typePostEducation[]>([]);
  const [visibleModalEducation, setVisibleModalEducation] =
    useState<boolean>(false);
  const [selectedEducationId, setSelectedEducationId] = useState<string>("");
  const userDetail = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [actionType, setActionType] = useState<string>("create");
  const { handleUpdateProfile } = useCalculateUserProfile(
    userDetail?._id,
    userDetail?.access_token
  );
  const { t, i18n } = useTranslation();

  const handleGetEducation = async (id: string, access_token: string) => {
    try {
      setIsLoading(true);
      const res = await EducationApi.getEducationById(id, access_token);
      setEducation(res.data);
    } catch (error: any) {
      notification.error({
        message: t("notification"),
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetEducationByUserId();
  }, []);

  const handleGetEducationByUserId = async () => {
    try {
      setLoading(true);
      const res = await EducationApi.getEducationByUserId(
        userDetail.access_token
      );
      if (res.data) {
        setListEducation(res.data);
        dispatch(
          updateUser({
            ...userDetail,
            educations: res?.data, // Corrected: Use 'educations' to match the slice
            access_token: user.access_token,
          })
        );
      }
    } catch (error: any) {
      notification.error({
        message: t("notification"),
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModalEducation = (type: string, id?: string) => {
    setVisibleModalEducation(true);
    setSelectedEducationId(id || "");
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
                  {formatDate(start_date)} -{" "}
                  {end_date === null || end_date === undefined
                    ? t("present")
                    : formatDate(end_date)}
                </p>
              </div>
              <Pencil
                size={16}
                className="text-primaryColor cursor-pointer"
                onClick={() => handleOpenModalEducation("edit", id)}
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
    } catch (error: any) {
      notification.error({
        message: t("notification"),
        description: error.response.data.message[0],
      });
    }
  };

  const closeModal = () => {
    setVisibleModalEducation(false);
    setSelectedEducationId("");
    setEducation(null);
    setActionType("");
    setIsCurrentlyStudying(false);
    form.resetFields();
    form.setFieldsValue({});
  };

  const handleDeleteEducation = async () => {
    try {
      setLoading(true);
      if (education) {
        const res = await EducationApi.deleteEducation(
          education._id,
          user.access_token
        );
        if (res.data) {
          notification.success({
            message: t("notification"),
            description: t("delete_success"),
          });
          await handleGetEducationByUserId();
          await handleUpdateProfile();
          closeModal();
        }
      }
    } catch (error: any) {
      notification.error({
        message: t("notification"),
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEducation = async () => {
    try {
      setLoading(true);
      if (education) {
        const data = form.getFieldsValue();
        const updatedData = {
          end_date: data.currently_studying
            ? null
            : data.end_date
            ? dayjs(data.end_date)
            : undefined,
          start_date: data.start_date ? dayjs(data.start_date) : undefined,
          ...data,
        };
        const res = await EducationApi.updateEducation(
          education._id,
          updatedData,
          user.access_token
        );

        if (res.status === 400) {
          notification.error({
            message: t("notification"),
            description: i18n.exists(res.message[0])
              ? t(res.message[0])
              : res.message,
          });
        }
        if (res.data) {
          await handleGetEducationByUserId();
          closeModal();
          notification.success({
            message: t("notification"),
            description: t("update_success"),
          });
          await handleUpdateProfile();
        }
      }
    } catch (error: any) {
      notification.error({
        message: t("notification"),
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    const params = {
      ...values,
      user_id: user._id,
      currently_studying: values.currently_studying || false,
      start_date: values.start_date ? dayjs(values.start_date) : undefined,
      end_date: values.end_date ? dayjs(values.end_date) : undefined,
    };

    try {
      const res = await handlePostEducation(params, user.access_token);
      if (res.status === 400) {
        notification.error({
          message: t("notification"),
          description: i18n.exists(res.message[0])
            ? t(res.message[0])
            : res.message,
        });
      }
      if (res?.data) {
        notification.success({
          message: t("notification"),
          description: t("create_success"),
        });
        await handleGetEducationByUserId();
        closeModal();
        await handleUpdateProfile();
      }
    } catch (error: any) {
      notification.error({
        message: t("notification"),
        description: error.message,
      });
    } finally {
      setLoading(false);
      // closeModal();
    }
  };

  const handleCheckboxChange = (e: any) => {
    setIsCurrentlyStudying(e.target.checked);
    if (e.target.checked) {
      form.setFieldsValue({ end_date: undefined });
    } else if (education?.end_date) {
      form.setFieldsValue({ end_date: dayjs(education.end_date) });
    }
  };

  useEffect(() => {
    if (actionType === "edit") {
      handleGetEducation(selectedEducationId, user.access_token);
    } else {
      form.resetFields();
      form.setFieldsValue({});
      setIsCurrentlyStudying(false);
    }
  }, [actionType, selectedEducationId]);

  useEffect(() => {
    if (education) {
      const isCurrentlyStudying = !education.end_date;
      form.setFieldsValue({
        school: education.school,
        major: education.major,
        start_date: education.start_date ? dayjs(education.start_date) : null,
        end_date: education.end_date ? dayjs(education.end_date) : null,
        currently_studying: isCurrentlyStudying,
        description: education.description,
      });
      setIsCurrentlyStudying(isCurrentlyStudying);
    } else if (actionType === "create") {
      form.resetFields();
      form.setFieldsValue({});
      setEducation(null);
      setIsCurrentlyStudying(false);
    }
  }, [education, form, actionType, dateFormat]);

  const renderBody = () => {
    return (
      <LoadingComponentSkeleton isLoading={isLoading}>
        <LoadingComponent isLoading={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            preserve={false}
            // initialValues={{
            //   school: education?.school || "",
            //   major: education?.major || "",
            //   start_date: education?.start_date
            //     ? dayjs(education.start_date)
            //     : null,
            //   end_date: education?.end_date ? dayjs(education.end_date) : null,
            //   currently_studying: education?.currently_studying || false,
            //   description: education?.description || "",
            // }}
          >
            <Form.Item
              name="school"
              label={<div className="text-[12px]">{t("school")}</div>}
              rules={[{ required: true, message: t("please_enter_school") }]}
            >
              <Input
                prefix={<BookOutlined />}
                placeholder={t("school")}
                className="text-[12px]"
              />
            </Form.Item>

            <Form.Item
              name="major"
              label={<div className="text-[12px]">{t("major")}</div>}
              rules={[{ required: true, message: t("please_enter_major") }]}
            >
              <Input placeholder={t("major")} className="text-[12px]" />
            </Form.Item>

            <Form.Item name="currently_studying" valuePropName="checked">
              <Checkbox className="text-[12px]" onChange={handleCheckboxChange}>
                {t("i_am_studying_here")}
              </Checkbox>
            </Form.Item>

            <Space
              style={{ width: "100%", justifyContent: "space-between" }}
              align="start"
            >
              <Form.Item
                name="start_date"
                label={<div className="text-[12px]">{t("start_date")}</div>}
                style={{ width: "200px" }}
                rules={[
                  { required: true, message: t("please_select_start_date") },
                ]}
              >
                <DatePicker style={{ width: "100%", fontSize: "12px" }} />
              </Form.Item>

              {!isCurrentlyStudying && (
                <Form.Item
                  name="end_date"
                  label={<div className="text-[12px]">{t("end_date")}</div>}
                  style={{ width: "200px" }}
                  rules={[
                    {
                      required: !isCurrentlyStudying,
                      message: t("please_select_end_date"),
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%", fontSize: "12px" }}
                    disabled={isCurrentlyStudying}
                  />
                </Form.Item>
              )}
            </Space>

            <Form.Item
              name="description"
              label={<div className="text-[12px]">{t("description")}</div>}
            >
              <TextArea
                className="text-[12px]"
                rows={4}
                placeholder={t("description_education")}
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
                    size="middle"
                  >
                    {t("add")}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <Button
                    className="!bg-primaryColorH text-white"
                    danger
                    onClick={() => handleUpdateEducation()}
                    style={{
                      width: "100%",
                    }}
                  >
                    {t("update")}
                  </Button>
                  <Button
                    type="primary"
                    loading={loading}
                    onClick={() => handleDeleteEducation()}
                    style={{
                      width: "100%",
                      backgroundColor: "black",
                      borderColor: "#4CAF50",
                      border: "none",
                    }}
                    className="!text-[12px]"
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

  return (
    <div>
      {listEducations.length > 0 ? (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-[#d3464f]" size={12} />

              <h2 className="font-semibold text-[12px]">{t("education")}</h2>
            </div>
            <Button
              className="text-[12px]"
              size="middle"
              onClick={() => handleOpenModalEducation("create")}
            >
              {t("add")}
            </Button>
          </div>
          <div>
            {listEducations?.map((item: typePostEducation, index: number) => (
              <EducationItem
                key={item._id}
                school={item.school}
                major={item.major}
                start_date={item.start_date}
                end_date={item.end_date}
                idx={index}
                id={item._id}
              />
            ))}
          </div>
        </Card>
      ) : (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-[#d3464f]" size={12} />
              <h2 className="font-semibold text-[12px]">{t("education")}</h2>
            </div>
            <Button
              size="middle"
              className="!text-[12px]"
              onClick={() => handleOpenModalEducation("create")}
            >
              {t("add")}
            </Button>
          </div>
          <p className="text-[12px] text-gray-500">
            {t(
              "if_you_have_a_CV_on_DevHire_click_update_to_automatically_fill_this_part_according_to_the_CV"
            )}
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
            ? t("education")
            : actionType === "edit"
            ? t("update")
            : t("delete")
        }
      />
    </div>
  );
};

export default EducationComponent;
