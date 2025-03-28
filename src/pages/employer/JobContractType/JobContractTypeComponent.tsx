import { useEffect, useState } from 'react'
import { Table, Button, notification, Popconfirm, Tooltip, Form, Input, Pagination } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import GeneralModal from '../../../components/ui/GeneralModal/GeneralModal'
import DrawerGeneral from '../../../components/ui/GeneralDrawer/GeneralDrawer'
import { Meta, Level } from '../../../types'
import CustomPagination from '../../../components/ui/CustomPanigation/CustomPanigation'
import { JOB_CONTRACT_TYPE_API } from '../../../services/modules/JobContractTypeService'


export default function JobContractTypeComponent() {
  const [form] = Form.useForm<Level>()
  const [visible, setVisible] = useState<boolean>(false)
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false)
  const [listLevels, setListLevels] = useState<Level[]>([])
  const [selectedSkill, setSelectedSkill] = useState<Level | null>(null)
  const [meta, setMeta] = useState<Meta | null>({
    count: 0,
    current_page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0
  })
  const userDetail = useSelector(state => state.user)

  const handleGetAllEmployerSkills = async (params?: any) => {
    try {
      const newParams={
        ...params,
      }
      const res = await JOB_CONTRACT_TYPE_API.getAll(newParams,userDetail?.access_token)
      if (res.data) {
        setListLevels(res.data.items)
        setMeta(res.data.meta)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    handleGetAllEmployerSkills({ current: 1, pageSize: 10 })
  }, [])

  const onFinish = async (values: Level) => {
    const { name, description,key } = values
    const res = await JOB_CONTRACT_TYPE_API.create({ name, description, user_id: userDetail?._id,key}, userDetail.access_token)
    if (res.data) {

      notification.success({
        message: "Thông báo",
        description: "Thêm thành công",
      })
      form.resetFields()
      handleGetAllEmployerSkills({ current: 1, pageSize: 10 })
      setVisible(false)
      
    } else {
      notification.error({
        message: "Thông báo",
        description: "Thêm thất bại",
      })
    }
  }

  const handleOpenDrawer = (record: any) => {
    setSelectedSkill(record)
    setVisibleDrawer(true)
    form.setFieldsValue(record)
  }

  const handleUpdate = async (values: any) => {
    const res = await JOB_CONTRACT_TYPE_API.update(selectedSkill?._id, values, userDetail.access_token)
    if (res.data) {
      notification.success({
        message: "Thông báo",
        description: "Cập nhật thành công!",
      })
      handleGetAllEmployerSkills({ current: 1, pageSize: 10 })
      setVisibleDrawer(false)
    } else {
      notification.error({
        message: "Thông báo",
        description: "Cap Nhat That Bai!",
      })
    }
  }

  const handleDelete = async (record: any) => {
    const res = await JOB_CONTRACT_TYPE_API.deleteManyLevels([record._id], userDetail.access_token)
    if (res.data) {
      notification.success({
        message: "Thông báo",
        description: "Xóa thành công",
      })
      handleGetAllEmployerSkills({ current: 1, pageSize: 10 })
    } else {
      notification.error({
        message: "Thông báo",
        description: "Xoa That Bai!",
      })
    }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Key',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: Level) => (
        <div>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleOpenDrawer(record)}
              style={{ marginRight: 8 }}
            />
          </Tooltip>
  
          <Popconfirm
            title="Are you sure you want to delete?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Xóa">
              <Button
                icon={<DeleteOutlined />}
                danger
              />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ]
  const removeVietnameseTones = (str) => {
    return str
      .normalize('NFD') // Chuẩn hóa chuỗi, tách các ký tự có dấu
      .replace(/[\u0300-\u036f]/g, '') // Xóa các dấu
      .replace(/đ/g, 'd') // Chuyển 'đ' thành 'd'
      .replace(/Đ/g, 'D'); // Chuyển 'Đ' thành 'D'
  };
  
  const onValuesChange = (changedValues, allValues) => {
    if (changedValues.name) {
        // Loại bỏ dấu tiếng Việt, chuyển thành chữ thường và thay khoảng trắng bằng dấu gạch dưới
        const key = removeVietnameseTones(changedValues.name)
          .toLowerCase()
          .replace(/\s+/g, '_'); // Thay thế khoảng trắng bằng dấu gạch dưới
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
  }

  return (
    <>
      <Button className='!bg-primaryColor mb-4' onClick={() => setVisible(true)}>
        Add
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
        title="Thêm loại hợp đồng"
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
              label="Tên cấp độ"
              rules={[{ required: true, message: 'Vui lòng nhập tên cấp độ!' }]}
            >
              <Input placeholder="Nhập tên ..." />
            </Form.Item>
      
            <Form.Item
              name="key"
              label="Key"
            >
              <Input disabled />
            </Form.Item>
      
            <Form.Item name="description" label="Mô tả">
              <Input.TextArea placeholder="Nhập mô tả.." autoSize={{ minRows: 3, maxRows: 6 }} />
            </Form.Item>
      
            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full !bg-primaryColor">
                Lưu
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
          <Form form={form} onFinish={handleUpdate} onValuesChange={onValuesChange} layout="vertical">
            <Form.Item
              name="name"
              label="Tên loại hợp đồng"
              rules={[{ required: true, message: 'Vui lòng nhập tên loại hợp đồng!' }]}
            >
              <Input placeholder="Nhập tên ..." />
            </Form.Item>
      
            <Form.Item
              name="key"
              label="Key"
            >
              <Input disabled />
            </Form.Item>
      
            <Form.Item name="description" label="Mô tả">
              <Input.TextArea placeholder="Nhập mô tả.." autoSize={{ minRows: 3, maxRows: 6 }} />
            </Form.Item>
      
            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full !bg-primaryColor">
                Submit
              </Button>
            </Form.Item>
          </Form>
        )}
        renderFooter={() => null}
        renderTitle={() => 'Cập nhật'}
      />
    </>
  )
}
