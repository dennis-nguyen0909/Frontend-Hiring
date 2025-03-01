import { useEffect, useState } from "react";
import {
  Table,
  Button,
  notification,
  Popconfirm,
  Tooltip,
  Form,
  Input,
  Pagination,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { EmployerSkillApi } from "../../../services/modules/EmployerSkillServices";
import { useSelector } from "react-redux";
import GeneralModal from "../../../components/ui/GeneralModal/GeneralModal";
import DrawerGeneral from "../../../components/ui/GeneralDrawer/GeneralDrawer";
import { Meta, SkillEmployerFormData } from "../../../types";
import "./styles.css";
import CustomPagination from "../../../components/ui/CustomPanigation/CustomPanigation";
import { useTranslation } from "react-i18next";

export default function SkillEmployer() {
  const { t } = useTranslation();
  const [form] = Form.useForm<SkillEmployerFormData>();
  const [visible, setVisible] = useState<boolean>(false);
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [listSkills, setListSkills] = useState<SkillEmployerFormData[]>([]);
  const [selectedSkill, setSelectedSkill] =
    useState<SkillEmployerFormData | null>(null);
  const [meta, setMeta] = useState<Meta | null>({
    count: 0,
    current_page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0,
  });
  const userDetail = useSelector((state) => state.user);

  const handleGetAllEmployerSkills = async (params?: any) => {
    try {
      const res = await EmployerSkillApi.getSkillByUserId(
        userDetail.access_token,
        params
      );
      if (res.data) {
        setListSkills(res.data.items);
        setMeta(res.data.meta);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetAllEmployerSkills({ current: 1, pageSize: 10 });
  }, []);

  const onFinish = async (values: SkillEmployerFormData) => {
    const { name, description } = values;
    const res = await EmployerSkillApi.postSkill(
      { name, description, user_id: userDetail?._id },
      userDetail.access_token
    );
    if (res.data) {
      notification.success({
        message: t("notification"),
        description: t("create_success"),
      });
      handleGetAllEmployerSkills({ current: 1, pageSize: 10 });
      setVisible(false);
      form.resetFields();
    } else {
      notification.error({
        message: t("notification"),
        description: t("create_failed"),
      });
    }
  };

  const handleOpenDrawer = (record: any) => {
    setSelectedSkill(record);
    setVisibleDrawer(true);
    form.setFieldsValue(record);
  };

  const handleUpdate = async (values: any) => {
    const res = await EmployerSkillApi.updateSkill(
      selectedSkill?._id,
      values,
      userDetail.access_token
    );
    if (res.data) {
      notification.success({
        message: t("notification"),
        description: t("update_success"),
      });
      handleGetAllEmployerSkills({ current: 1, pageSize: 10 });
      setVisibleDrawer(false);
    } else {
      notification.error({
        message: t("notification"),
        description: t("update_failed"),
      });
    }
  };

  const handleDelete = async (record: any) => {
    const res = await EmployerSkillApi.deleteManySkill(
      [record._id],
      userDetail.access_token
    );
    if (res.data) {
      notification.success({
        message: t("notification"),
        description: t("delete_success"),
      });
      handleGetAllEmployerSkills({ current: 1, pageSize: 10 });
    } else {
      notification.error({
        message: t("notification"),
        description: t("delete_failed"),
      });
    }
  };

  const columns = [
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("description"),
      dataIndex: "description",
      key: "description",
    },
    {
      title: t("actions"),
      key: "actions",
      render: (text: any, record: SkillEmployerFormData) => (
        <div>
          <Tooltip title={t("edit")}>
            <Button
              icon={<EditOutlined />}
              onClick={() => handleOpenDrawer(record)}
              style={{ marginRight: 8 }}
            />
          </Tooltip>

          <Popconfirm
            title={t("delete_confirm_skill")}
            onConfirm={() => handleDelete(record)}
            okText={t("delete_confirm_skill_button")}
            cancelText={t("no")}
          >
            <Tooltip title={t("delete")}>
              <Button icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const onChange = async (pagination: any, filters: any, sorter: any) => {
    const currentPage = pagination.current;
    const pageSize = pagination.pageSize;

    await handleGetAllEmployerSkills({
      current: currentPage,
      pageSize: pageSize,
      ...filters,
      ...sorter,
    });
  };

  return (
    <>
      <Button
        className="!bg-primaryColor mb-4"
        onClick={() => setVisible(true)}
      >
        Add
      </Button>
      <Table
        columns={columns}
        dataSource={listSkills}
        onChange={onChange}
        pagination={false}
        rowKey="id"
      />

      {/* Pagination Component */}
      <CustomPagination
        currentPage={meta?.current_page}
        total={meta?.total}
        perPage={meta?.per_page}
        onPageChange={(current, pageSize) => {
          handleGetAllEmployerSkills({ current, pageSize });
        }}
      />

      <GeneralModal
        title="Add Skill"
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => setVisible(false)}
        renderBody={() => (
          <Form
            form={form}
            name="skillEmployerForm"
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="name"
              label={t("name")}
              rules={[{ required: true, message: t("please_input_the_name") }]}
            >
              <Input placeholder={t("name")} />
            </Form.Item>

            <Form.Item name="description" label={t("description")}>
              <Input.TextArea
                placeholder={t("description")}
                autoSize={{ minRows: 3, maxRows: 6 }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full !bg-primaryColor"
              >
                {t("create")}
              </Button>
            </Form.Item>
          </Form>
        )}
      />

      <DrawerGeneral
        visible={visibleDrawer}
        onCancel={() => setVisibleDrawer(false)}
        onOk={() => setVisibleDrawer(false)}
        renderBody={() => (
          <Form
            form={form}
            name="skillEmployerForm"
            onFinish={handleUpdate}
            layout="vertical"
          >
            <Form.Item
              name="name"
              label={t("name")}
              rules={[
                { required: true, message: t("please_input_the_name_skill") },
              ]}
            >
              <Input placeholder={t("name")} />
            </Form.Item>

            <Form.Item name="description" label={t("description")}>
              <Input.TextArea
                placeholder={t("description")}
                autoSize={{ minRows: 3, maxRows: 6 }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full !bg-primaryColor"
              >
                {t("update")}
              </Button>
            </Form.Item>
          </Form>
        )}
        renderFooter={() => null}
        renderTitle={() => t("update_skill")}
      />
    </>
  );
}
