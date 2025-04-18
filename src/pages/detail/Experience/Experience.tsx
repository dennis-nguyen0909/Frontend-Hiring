import { useState, useEffect, useRef } from "react";
import {
  Form,
  Input,
  Checkbox,
  Button,
  notification,
  Card,
  Typography,
  Select,
  Avatar,
  DatePicker,
} from "antd";
import { LinkOutlined, PictureOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import moment from "moment";
import GeneralModal from "../../../components/ui/GeneralModal/GeneralModal";
import { Brain, Briefcase, Pencil } from "lucide-react";
import { ExperienceApi } from "../../../services/modules/experienceServices";
import { MediaApi } from "../../../services/modules/mediaServices";
import LoadingComponent from "../../../components/Loading/LoadingComponent";
import useCalculateUserProfile from "../../../hooks/useCaculateProfile";
import LoadingComponentSkeleton from "../../../components/Loading/LoadingComponentSkeleton";
import useMomentFn from "../../../hooks/useMomentFn";
import { useTranslation } from "react-i18next";
import i18n from "../../../config/i18n.config";
import dayjs from "dayjs";
const { TextArea } = Input;

interface WorkExperienceProps {
  company: string;
  position: string;
  start_date: string;
  end_date: string | null;
  currently_working: boolean;
  description: string;
  image?: string;
  id: string;
}

const ExperienceComponent = () => {
  const { t } = useTranslation();
  const { formatDate } = useMomentFn();
  const [currentlyWorking, setCurrentlyWorking] = useState(false);
  const userDetail = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);
  const inputRef = useRef(null);
  const [form] = Form.useForm();
  const user = useSelector((state: any) => state.user);
  const [listWorkExperiences, setListWorkExperiences] = useState([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [workExperience, setWorkExperience] =
    useState<WorkExperienceProps | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [actionType, setActionType] = useState<string>("create");
  const handleOpenExperience = (type: string, id?: string) => {
    setVisibleModal(true);
    setActionType(type);
    setSelectedId(id);
  };
  const closeModal = () => {
    setVisibleModal(false);
    setWorkExperience(null);
    setSelectedId("");
    form.resetFields();
    setCurrentlyWorking(false);
    setActionType("");
  };

  const { handleUpdateProfile } = useCalculateUserProfile(
    userDetail?._id,
    userDetail?.access_token
  );
  const handleDeleteManyExperience = async (
    ids: Array<string>,
    accessToken: string
  ) => {
    try {
      setIsLoading(true);
      const res = await ExperienceApi.deleteManyExperience(ids, accessToken);
      return res;
    } catch (error) {
      notification.error({
        message: t("notification"),
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleCreateWorkExperience = async (
    params: any,
    accessToken: string
  ) => {
    try {
      setIsLoading(true);
      const res = await ExperienceApi.postExperience(params, accessToken);
      return res;
    } catch (error) {
      notification.error({
        message: t("notification"),
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    setIsLoading(true);
    const {
      currently_working,
      company,
      position,
      description,
      start_date,
      end_date,
    } = values;

    const params = {
      company,
      position,
      user_id: user._id,
      start_date: start_date,
      end_date: end_date,
      currently_working,
      description,
    };

    const res = await handleCreateWorkExperience(
      params,
      userDetail.access_token
    );
    if (res.data) {
      await handleGetWorkExperiencesByUser();
      notification.success({
        message: t("notification"),
        description: t("create_success"),
      });
      await handleUpdateProfile();
      closeModal();
      setIsLoading(false);
    } else {
      notification.error({
        message: t("notification"),
        description: i18n.exists(res.message) ? t(res.message) : res.message,
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetWorkExperiencesByUser();
  }, []);
  const handleGetWorkExperiencesByUser = async () => {
    try {
      const res = await ExperienceApi.getExperienceByUserId(
        userDetail?.access_token
      );
      if (res.data) {
        setListWorkExperiences(res.data);
      }
    } catch (error) {
      notification.error({
        message: t("notification"),
        description: error.message,
      });
    }
  };
  const handleGetDetailExperience = async (selectedId: string) => {
    try {
      setIsLoadingDetail(true);
      const res = await ExperienceApi.getExperienceById(
        selectedId,
        userDetail.access_token
      );
      if (res.data) {
        setWorkExperience(res.data);
      }
    } catch (error) {
      notification.error({
        message: t("notification"),
        description: error.message,
      });
    } finally {
      setIsLoadingDetail(false);
    }
  };

  useEffect(() => {
    if (workExperience) {
      form.setFieldsValue({
        company: workExperience.company,
        position: workExperience.position,
        end_date: workExperience.end_date
          ? dayjs(workExperience.end_date)
          : null,
        currently_working: workExperience.currently_working,
        description: workExperience.description,
        image: workExperience.image,
        start_date: workExperience.start_date
          ? dayjs(workExperience.start_date)
          : null,
      });
      setCurrentlyWorking(workExperience?.currently_working);
    }
  }, [workExperience]);

  useEffect(() => {
    if (selectedId) {
      handleGetDetailExperience(selectedId);
    }
  }, [selectedId]);

  const handleDeleteExperience = async () => {
    const res = await handleDeleteManyExperience(
      [selectedId],
      userDetail.access_token
    );
    if (res.data) {
      await handleGetWorkExperiencesByUser();
      notification.success({
        message: t("notification"),
        description: t("delete_success"),
      });
      closeModal();
      await handleUpdateProfile();
    } else {
      notification.error({
        message: t("notification"),
        description: t("delete_failed"),
      });
      closeModal();
    }
  };

  const handleUpdateExperience = async () => {
    setIsLoading(true);
    let data = form.getFieldsValue();

    if (selectedFile) {
      data = {
        ...data,
        image_url: selectedFile,
      };
    }
    data = {
      ...data,
      end_date: currentlyWorking ? null : data.end_date,
    };
    console.log("duydeptrai", data);
    const res = await ExperienceApi.updateExperience(
      selectedId,
      data,
      userDetail?.access_token
    );

    if (res.data) {
      await handleGetWorkExperiencesByUser();
      notification.success({
        message: t("notification"),
        description: t("update_success"),
      });
      closeModal();
      await handleUpdateProfile();
      setIsLoading(false);
    } else {
      console.log("res", res);
      notification.error({
        message: t("notification"),
        description: i18n.exists(res.message[0])
          ? t(res.message[0])
          : res.message,
      });
      closeModal();
      setIsLoading(false);
    }
  };
  const handleOnClickImage = () => {
    inputRef.current.click();
  };

  const handleChangeFile = async (e) => {
    setIsLoading(true);
    // Chuyển sang async để chờ kết quả upload
    const file = e.target.files[0];
    if (file) {
      try {
        const res = await MediaApi.postMedia(
          file,
          userDetail?._id,
          userDetail.access_token
        );
        if (res?.data?.url) {
          setSelectedFile(res?.data?.url);
        }
        setIsLoading(false);
      } catch (error) {
        notification.error({
          message: t("notification"),
          description: error.message,
        });
        setIsLoading(false);
      }
    }
  };

  const renderBody = () => {
    return (
      <LoadingComponentSkeleton isLoading={isLoadingDetail}>
        <LoadingComponent isLoading={isLoading}>
          <Form onFinish={onFinish} form={form} layout="vertical">
            <Form.Item
              label={<div className="text-[12px]">{t("company")}</div>}
              name="company"
              required
              rules={[
                { required: true, message: t("please_enter_company_name") },
              ]}
            >
              <Input placeholder={t("company")} className="text-[12px]" />
            </Form.Item>

            <Form.Item
              label={<div className="text-[12px]">{t("position")}</div>}
              name="position"
              required
              rules={[{ required: true, message: t("please_enter_position") }]}
            >
              <Input placeholder={t("office_staff")} className="text-[12px]" />
            </Form.Item>

            <Form.Item name="currently_working" valuePropName="checked">
              <Checkbox
                className="text-[12px]"
                checked={currentlyWorking}
                onChange={(e) => setCurrentlyWorking(e.target.checked)}
              >
                {t("i_am_working_here")}
              </Checkbox>
            </Form.Item>
            <Form.Item
              label={<div className="text-[12px]">{t("start_date")}</div>}
              name="start_date"
              rules={[
                { required: true, message: t("please_select_start_date") },
              ]}
            >
              <DatePicker style={{ width: "100%", fontSize: "12px" }} />
            </Form.Item>

            <Form.Item
              label={<div className="text-[12px]">{t("end_date")}</div>}
              name="end_date"
              rules={[
                {
                  required: !currentlyWorking,
                  message: t("please_select_end_date"),
                },
              ]}
            >
              <DatePicker
                style={{ width: "100%", fontSize: "12px" }}
                disabled={currentlyWorking}
              />
            </Form.Item>
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography.Text className="text-[12px]">
                  <span className="text-red-500 pr-1">*</span>
                  {t("start_date")}
                </Typography.Text>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Form.Item
                    name="startMonth"
                    rules={[
                      {
                        required: true,
                        message: t("please_select_start_date"),
                      },
                    ]}
                  >
                    <Select
                      placeholder={t("select_month")}
                      options={months}
                      className="text-[12px]"
                    />
                  </Form.Item>
                  <Form.Item
                    name="startYear"
                    rules={[
                      {
                        required: true,
                        message: t("please_select_start_date"),
                      },
                    ]}
                  >
                    <Select
                      placeholder={t("select_year")}
                      options={years}
                      className="text-[12px]"
                    />
                  </Form.Item>
                </div>
              </div>

              <div>
                <Typography.Text className="text-[12px]">
                  <span className="text-red-500 pr-1">*</span>
                  {t("end_date")}
                </Typography.Text>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Form.Item
                    name="endMonth"
                    rules={[
                      {
                        required: !currentlyWorking,
                        message: t("please_select_end_date"),
                      },
                    ]}
                  >
                    <Select
                      placeholder={t("select_month")}
                      options={months}
                      disabled={currentlyWorking}
                    />
                  </Form.Item>
                  <Form.Item
                    name="endYear"
                    rules={[
                      {
                        required: !currentlyWorking,
                        message: t("please_select_end_date"),
                      },
                    ]}
                  >
                    <Select
                      placeholder={t("select_year")}
                      options={years}
                      disabled={currentlyWorking}
                    />
                  </Form.Item>
                </div>
              </div>
            </div> */}

            <Form.Item
              label={<div className="text-[12px]">{t("description")}</div>}
              name="description"
            >
              <TextArea
                placeholder={t("description_experience")}
                rows={4}
                className="text-[12px]"
              />
            </Form.Item>

            <Form.Item>
              {actionType === "create" ? (
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full !bg-primaryColor"
                  size="middle"
                >
                  {t("add")}
                </Button>
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <Button
                    type="primary"
                    onClick={() => handleUpdateExperience()}
                    className="!bg-primaryColorH text-white"
                    danger
                    style={{
                      width: "100%",
                    }}
                  >
                    {t("update")}
                  </Button>
                  <Button
                    danger
                    onClick={() => handleDeleteExperience()}
                    type="primary"
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
            <input
              ref={inputRef}
              onChange={handleChangeFile}
              type="file"
              style={{ display: "none" }}
            />
          </Form>
        </LoadingComponent>
      </LoadingComponentSkeleton>
    );
  };
  const WorkExperience = ({
    company,
    position,
    start_date,
    end_date,
    image,
    id,
    currently_working,
  }: WorkExperienceProps) => {
    return (
      <Card className="mt-3">
        <div className="flex items-start gap-4">
          {image ? (
            <Avatar
              size={64}
              src={image}
              alt="Work experience attachment"
              className="rounded"
            />
          ) : (
            <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <Briefcase className="text-xl text-gray-600" />
            </div>
          )}

          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <p style={{ margin: 0 }}>{company}</p>
                <p className="block text-gray-600 text-[10px]">{position}</p>
                <p className="block text-gray-500 text-[10px]">
                  {formatDate(start_date)} -{" "}
                  {currently_working ? t("present") : formatDate(end_date + "")}
                </p>
              </div>
              <Pencil
                size={16}
                className="text-primaryColor cursor-pointer"
                onClick={() => handleOpenExperience("edit", id)}
              />
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div>
      {listWorkExperiences.length > 0 ? (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-[#d3464f]" size={12} />
              <h2 className="font-semibold text-[12px]">{t("experience")}</h2>
            </div>
            <Button
              size="middle"
              className="text-[12px]"
              onClick={() => handleOpenExperience("create")}
            >
              {t("add")}
            </Button>
          </div>
          {/* <div className="flex items-center justify-start"> */}
          <div>
            {listWorkExperiences?.map((item: any, index: number) => (
              <WorkExperience
                id={item._id}
                key={index}
                company={item.company}
                position={item.position}
                start_date={item.start_date}
                end_date={item.end_date}
                currently_working={item.currently_working}
                image={item.image_url}
                description={item.description}
              />
            ))}
          </div>
          {/* </div> */}
        </Card>
      ) : (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-[#d3464f]" size={12} />
              <h2 className="font-semibold text-[12px]">{t("experience")}</h2>
            </div>
            <Button
              size="middle"
              className="text-[12px]"
              onClick={() => handleOpenExperience("create")}
            >
              {t("add")}
            </Button>
          </div>
          <p className="text-gray-500 !text-[12px]">
            {t(
              "if_you_have_a_CV_on_DevHire_click_update_to_automatically_fill_this_part_according_to_the_CV"
            )}
          </p>
        </Card>
      )}
      <GeneralModal
        visible={visibleModal}
        onCancel={closeModal}
        onOk={closeModal}
        renderBody={renderBody}
        title={
          actionType === "create"
            ? t("experience")
            : actionType === "edit"
            ? t("update")
            : t("delete")
        }
      />
    </div>
  );
};

export default ExperienceComponent;
