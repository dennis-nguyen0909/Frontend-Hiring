import { useState, useEffect } from "react";
import { Form, Input, Button, notification, Card, Rate } from "antd";
import { useSelector } from "react-redux";
import GeneralModal from "../../../components/ui/GeneralModal/GeneralModal";
import { Briefcase, Feather, Pencil } from "lucide-react";
import LoadingComponent from "../../../components/Loading/LoadingComponent";
import { SkillApi } from "../../../services/modules/skillServices";
import useCalculateUserProfile from "../../../hooks/useCaculateProfile";
import { useTranslation } from "react-i18next";
const { TextArea } = Input;

interface SkillProps {
  id: string;
  name: string;
  evalute: string;
  description: string;
}

const SkillComponent = () => {
  const { t } = useTranslation();
  const userDetail = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const user = useSelector((state: any) => state.user);
  const [listSkills, setListSkills] = useState<SkillProps[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [skill, setSkill] = useState<SkillProps | null>(null);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [actionType, setActionType] = useState<string>("create");
  const handleOpenSkill = (type: string, id?: string) => {
    setVisibleModal(true);
    setActionType(type);
    if (id) {
      handleGetDetailSkill(id);
    }
  };
  const handleGetDetailSkill = async (id) => {
    try {
      const res = await SkillApi.getSkillById(id, user.access_token);
      setSelectedId(id);
      if (res.data) {
        setSkill(res.data);
        form.setFieldsValue({
          name: res.data.name,
          evalute: res.data.evalute,
          description: res.data.description,
        });
      }
    } catch (error) {
      notification.error({
        message: t("notification"),
        description: error.message,
      });
    }
  };
  const closeModal = () => {
    setVisibleModal(false);
    setSkill(null);
    setSelectedId("");
    form.resetFields();
    setActionType("");
  };

  const handleGetSkillByUserId = async () => {
    try {
      const res = await SkillApi.getSkillByUserId(userDetail.access_token);
      if (res.data) {
        setListSkills([...res.data]);
      }
    } catch (error) {
      notification.error({
        message: t("notification"),
        description: error.message,
      });
    }
  };
  const { handleUpdateProfile } = useCalculateUserProfile(
    userDetail?._id,
    userDetail?.access_token
  );
  useEffect(() => {
    handleGetSkillByUserId();
  }, []);

  const onFinish = async (values: any) => {
    const { name, evalute, description } = values;
    const params = {
      name,
      evalute,
      description,
      user_id: userDetail?._id,
    };
    try {
      const res = await SkillApi.postSkill(params, user.access_token);
      if (res.data) {
        await handleGetSkillByUserId();
        notification.success({
          message: t("notification"),
          description: t("create_success"),
        });

        closeModal();
        await handleUpdateProfile();
      }
    } catch (error) {
      notification.error({
        message: t("notification"),
        description: error.message,
      });
      closeModal();
    }
  };
  const handleDeleteSkill = async () => {
    try {
      const res = await SkillApi.deleteManySkill(
        [selectedId],
        userDetail.access_token
      );
      if (res.data) {
        await handleGetSkillByUserId();
        notification.success({
          message: t("notification"),
          description: t("delete_success"),
        });
        closeModal();
        await handleUpdateProfile();
      }
    } catch (error) {
      notification.error({
        message: t("notification"),
        description: error.message,
      });
    }
  };

  const handleUpdateSkill = async () => {
    try {
      const data = form.getFieldsValue();
      const res = await SkillApi.updateSkill(
        selectedId,
        data,
        userDetail.access_token
      );
      if (res.data) {
        await handleGetSkillByUserId();
        notification.success({
          message: t("notification"),
          description: t("update_success"),
        });
        closeModal();
        await handleUpdateProfile();
      }
    } catch (error) {
      notification.error({
        message: t("notification"),
        description: error.message,
      });
    }
  };
  const renderBody = () => {
    return (
      <LoadingComponent isLoading={isLoading}>
        <Form onFinish={onFinish} form={form} layout="vertical">
          <Form.Item
            label={<div className="text-[12px]">{t("skill_name")}</div>}
            name="name"
            required
            rules={[{ required: true, message: t("please_enter_skill_name") }]}
          >
            <Input placeholder={t("skill_name")} className="text-[12px]" />
          </Form.Item>

          <Form.Item
            label={<div className="text-[12px]">{t("evaluation")}</div>}
            name="evalute"
            required
            rules={[{ required: true, message: t("please_select_evaluation") }]}
          >
            {/* Thay thế ngôi sao tĩnh bằng Ant Design's Rate component */}
            <Rate allowHalf />
          </Form.Item>
          <Form.Item
            label={<div className="text-[12px]">{t("description")}</div>}
            name="description"
          >
            <TextArea
              className="text-[12px]"
              placeholder={t("descript_skill")}
              rows={4}
            />
          </Form.Item>

          <Form.Item>
            {actionType === "create" ? (
              <Button
                size="middle"
                htmlType="submit"
                className="w-full !bg-primaryColorH !text-white !text-[12px]"
              >
                {t("add")}
              </Button>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <Button
                  className="!bg-primaryColorH text-white !text-[12px]"
                  onClick={handleUpdateSkill}
                  danger
                  style={{
                    width: "100%",
                  }}
                >
                  {t("update")}
                </Button>
                <Button
                  type="primary"
                  className="!text-[12px]"
                  onClick={handleDeleteSkill}
                  style={{
                    width: "100%",
                    backgroundColor: "black",
                    borderColor: "#4CAF50",
                    border: "none",
                  }}
                >
                  {t("delete")}
                </Button>
              </div>
            )}
          </Form.Item>
        </Form>
      </LoadingComponent>
    );
  };
  const Skill = ({ id, name, evalute, description }: SkillProps) => {
    return (
      <Card className="mt-3">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <Briefcase className="text-xl text-gray-600" />
          </div>

          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <p style={{ margin: 0 }}>{name}</p>
                <p className="block text-gray-600 text-[10px]">{evalute}</p>
              </div>
              <Pencil
                className="text-primaryColor cursor-pointer"
                onClick={() => handleOpenSkill("edit", id)}
              />
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div>
      {listSkills.length > 0 ? (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Feather className="h-6 w-6 text-[#d3464f]" size={12} />
              <h2 className="font-semibold  text-[12px]">{t("skill")}</h2>
            </div>
            <Button
              size="middle"
              className="!text-[12px]"
              onClick={() => handleOpenSkill("create")}
            >
              {t("add")}
            </Button>
          </div>
          <div>
            {listSkills?.map((item: any, index: number) => (
              <Skill
                id={item._id}
                name={item.name}
                description={item.description}
                evalute={item.evalute}
              />
            ))}
          </div>
        </Card>
      ) : (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Feather className="h-6 w-6 text-[#d3464f]" size={12} />
              <h2 className="font-semibold text-[12px]">{t("skill")}</h2>
            </div>
            <Button
              size="middle"
              className="text-[12px]"
              onClick={() => handleOpenSkill("create")}
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
        visible={visibleModal}
        onCancel={closeModal}
        onOk={closeModal}
        renderBody={renderBody}
        title={
          actionType === "create"
            ? t("skill")
            : actionType === "edit"
            ? t("update")
            : t("delete")
        }
      />
    </div>
  );
};

export default SkillComponent;
