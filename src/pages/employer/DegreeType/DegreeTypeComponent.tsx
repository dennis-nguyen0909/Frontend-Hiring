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
import { useSelector } from "react-redux";
import GeneralModal from "../../../components/ui/GeneralModal/GeneralModal";
import DrawerGeneral from "../../../components/ui/GeneralDrawer/GeneralDrawer";
import { Meta, Level } from "../../../types";
import CustomPagination from "../../../components/ui/CustomPanigation/CustomPanigation";
import { DEGREE_TYPE_API } from "../../../services/modules/DegreeTypeService";
import { useTranslation } from "react-i18next";

export default function DegreeTypeComponent() {
  const { t } = useTranslation();
  const [form] = Form.useForm<Level>();
  const [visible, setVisible] = useState<boolean>(false);
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [listLevels, setListLevels] = useState<Level[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<Level | null>(null);
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
      const newParams = {
        ...params,
      };
      const res = await DEGREE_TYPE_API.getAll(
        newParams,
        userDetail?.access_token
      );
      if (res.data) {
        setListLevels(res.data.items);
        setMeta(res.data.meta);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetAllEmployerSkills({ current: 1, pageSize: 10 });
  }, []);

  const onFinish = async (values: Level) => {
    const { name, description, key } = values;
    const res = await DEGREE_TYPE_API.create(
      { name, description, user_id: userDetail?._id, key },
      userDetail.access_token
    );
    if (res.data) {
      notification.success({
        message: t("notification"),
        description: t("add_success"),
      });
      form.resetFields();
      handleGetAllEmployerSkills({ current: 1, pageSize: 10 });
      setVisible(false);
    } else {
      notification.error({
        message: t("notification"),
        description: t("add_failed"),
      });
    }
  };

  const handleOpenDrawer = (record: any) => {
    setSelectedSkill(record);
    setVisibleDrawer(true);
    form.setFieldsValue(record);
  };

  const handleUpdate = async (values: any) => {
    const res = await DEGREE_TYPE_API.update(
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
      form.resetFields();
    } else {
      notification.error({
        message: t("notification"),
        description: t("update_failed"),
      });
    }
  };

  const handleDelete = async (record: any) => {
    const res = await DEGREE_TYPE_API.deleteManyLevels(
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
      title: t("key"),
      dataIndex: "key",
      key: "key",
    },
    {
      title: t("description"),
      dataIndex: "description",
      key: "description",
    },
    {
      title: t("actions"),
      key: "actions",
      render: (text: any, record: Level) => (
        <div>
          <Tooltip title={t("edit")}>
            <Button
              icon={<EditOutlined />}
              onClick={() => handleOpenDrawer(record)}
              style={{ marginRight: 8 }}
            />
          </Tooltip>

          <Popconfirm
            title={t("are_you_sure_you_want_to_delete")}
            onConfirm={() => handleDelete(record)}
            okText={t("yes")}
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
  const removeVietnameseTones = (str) => {
    return str
      .normalize("NFD") // Chuẩn hóa chuỗi, tách các ký tự có dấu
      .replace(/[\u0300-\u036f]/g, "") // Xóa các dấu
      .replace(/đ/g, "d") // Chuyển 'đ' thành 'd'
      .replace(/Đ/g, "D"); // Chuyển 'Đ' thành 'D'
  };

  const onValuesChange = (changedValues, allValues) => {
    if (changedValues.name) {
      // Loại bỏ dấu tiếng Việt, chuyển thành chữ thường và thay khoảng trắng bằng dấu gạch dưới
      const key = removeVietnameseTones(changedValues.name)
        .toLowerCase()
        .replace(/\s+/g, "_"); // Thay thế khoảng trắng bằng dấu gạch dưới
      form.setFieldsValue({
        key: key,
      });
    }
  };

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
        {t("add")}
      </Button>
      <Table
        columns={columns}
        dataSource={listLevels}
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
        title={t("add_degree_type")}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => setVisible(false)}
        renderBody={() => (
          <Form
            form={form}
            onFinish={onFinish}
            onValuesChange={onValuesChange} // Hàm theo dõi thay đổi giá trị
            layout="vertical"
          >
            <Form.Item
              name="name"
              label={t("name")}
              rules={[
                { required: true, message: t("please_enter_degree_type_name") },
              ]}
            >
              <Input placeholder={t("enter_name")} />
            </Form.Item>

            <Form.Item name="key" label={t("key")}>
              <Input disabled />
            </Form.Item>

            <Form.Item name="description" label={t("description")}>
              <Input.TextArea
                placeholder={t("enter_description")}
                autoSize={{ minRows: 3, maxRows: 6 }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full !bg-primaryColor"
              >
                {t("save")}
              </Button>
            </Form.Item>
          </Form>
        )}
      />

      <DrawerGeneral
        visible={visibleDrawer}
        onCancel={() => {
          setVisibleDrawer(false);
          form.resetFields();
        }}
        onOk={() => {
          setVisibleDrawer(false);
          form.resetFields();
        }}
        renderBody={() => (
          <Form
            form={form}
            onFinish={handleUpdate}
            onValuesChange={onValuesChange}
            layout="vertical"
          >
            <Form.Item
              name="name"
              label={t("name")}
              rules={[{ required: true, message: t("please_input_the_name") }]}
            >
              <Input placeholder={t("enter_name")} />
            </Form.Item>
            <Form.Item name="key" label={t("key")}>
              <Input disabled />
            </Form.Item>

            <Form.Item name="description" label={t("description")}>
              <Input.TextArea
                placeholder={t("enter_description")}
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
        renderTitle={() => t("update")}
      />
    </>
  );
}
