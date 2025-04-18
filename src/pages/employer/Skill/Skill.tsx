import { useState } from "react";
import {
  Table,
  Button,
  notification,
  Popconfirm,
  Tooltip,
  Form,
  Input,
  TablePaginationConfig,
} from "antd";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { EmployerSkillApi } from "../../../services/modules/EmployerSkillServices";
import { useSelector } from "react-redux";
import GeneralModal from "../../../components/ui/GeneralModal/GeneralModal";
import DrawerGeneral from "../../../components/ui/GeneralDrawer/GeneralDrawer";
import { SkillEmployerFormData } from "../../../types";
import "./styles.css";
import CustomPagination from "../../../components/ui/CustomPanigation/CustomPanigation";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface RootState {
  user: {
    _id: string;
    access_token: string;
  };
}

interface TableFilters {
  [key: string]: FilterValue | null;
}

interface SkillData extends SkillEmployerFormData {
  _id: string;
  name: string;
  description?: string;
}

export default function SkillEmployer() {
  const { t } = useTranslation();
  const [form] = Form.useForm<SkillEmployerFormData>();
  const [visible, setVisible] = useState<boolean>(false);
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [selectedSkill, setSelectedSkill] = useState<SkillData | null>(null);
  const userDetail = useSelector((state: RootState) => state.user);
  const queryClient = useQueryClient();

  const { data: skillsData, isLoading } = useQuery({
    queryKey: ["skills", userDetail?._id],
    queryFn: async () => {
      const res = await EmployerSkillApi.getSkillByUserId(
        userDetail.access_token,
        { current: 1, pageSize: 10 }
      );
      return res.data;
    },
    enabled: !!userDetail?._id && !!userDetail?.access_token,
  });

  const createSkillMutation = useMutation({
    mutationFn: async (values: SkillEmployerFormData) => {
      const res = await EmployerSkillApi.postSkill(
        { ...values, user_id: userDetail?._id },
        userDetail.access_token
      );
      return res.data;
    },
    onSuccess: () => {
      notification.success({
        message: t("notification"),
        description: t("create_success"),
      });
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      setVisible(false);
      form.resetFields();
    },
    onError: () => {
      notification.error({
        message: t("notification"),
        description: t("create_failed"),
      });
    },
  });

  const updateSkillMutation = useMutation({
    mutationFn: async (values: SkillEmployerFormData) => {
      const res = await EmployerSkillApi.updateSkill(
        selectedSkill?._id,
        values,
        userDetail.access_token
      );
      return res.data;
    },
    onSuccess: () => {
      notification.success({
        message: t("notification"),
        description: t("update_success"),
      });
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      setVisibleDrawer(false);
    },
    onError: () => {
      notification.error({
        message: t("notification"),
        description: t("update_failed"),
      });
    },
  });

  const deleteSkillMutation = useMutation({
    mutationFn: async (id: string | undefined) => {
      if (!id) return;
      const res = await EmployerSkillApi.deleteManySkill(
        [id],
        userDetail.access_token
      );
      return res.data;
    },
    onSuccess: () => {
      notification.success({
        message: t("notification"),
        description: t("delete_success"),
      });
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
    onError: () => {
      notification.error({
        message: t("notification"),
        description: t("delete_failed"),
      });
    },
  });

  const handleOpenDrawer = (record: SkillData) => {
    setSelectedSkill(record);
    setVisibleDrawer(true);
    form.setFieldsValue(record);
  };

  const onFinish = (values: SkillEmployerFormData) => {
    createSkillMutation.mutate(values);
  };

  const handleUpdate = (values: SkillEmployerFormData) => {
    updateSkillMutation.mutate(values);
  };

  const handleDelete = (record: SkillData) => {
    if (record._id) {
      deleteSkillMutation.mutate(record._id);
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
      render: (_: unknown, record: SkillData) => (
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

  const onChange = async (
    pagination: TablePaginationConfig,
    filters: TableFilters,
    sorter: SorterResult<SkillData> | SorterResult<SkillData>[]
  ) => {
    const currentPage = pagination.current || 1;
    const pageSize = pagination.pageSize || 10;
    await queryClient.invalidateQueries({ queryKey: ["skills"] });
    queryClient.prefetchQuery({
      queryKey: ["skills", currentPage, pageSize],
      queryFn: async () => {
        const res = await EmployerSkillApi.getSkillByUserId(
          userDetail.access_token,
          { current: currentPage, pageSize, ...filters, ...sorter }
        );
        return res.data;
      },
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
        dataSource={skillsData?.items}
        onChange={onChange}
        pagination={false}
        rowKey="_id"
        loading={isLoading}
      />

      <CustomPagination
        currentPage={skillsData?.meta?.current_page || 1}
        total={skillsData?.meta?.total || 0}
        perPage={skillsData?.meta?.per_page || 10}
        onPageChange={(current, pageSize) => {
          queryClient.invalidateQueries({ queryKey: ["skills"] });
          queryClient.prefetchQuery({
            queryKey: ["skills", current, pageSize],
            queryFn: async () => {
              const res = await EmployerSkillApi.getSkillByUserId(
                userDetail.access_token,
                { current, pageSize }
              );
              return res.data;
            },
          });
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
                loading={createSkillMutation.isPending}
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
                loading={updateSkillMutation.isPending}
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
