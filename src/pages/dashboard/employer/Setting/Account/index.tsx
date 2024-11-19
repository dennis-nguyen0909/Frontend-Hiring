'use client'

import { useState } from 'react'
import { Tabs, Form, Input, Button, Select, Modal, message } from 'antd'
import { UserOutlined, GlobalOutlined, WifiOutlined, SettingOutlined, MailOutlined, EyeOutlined, EyeInvisibleOutlined, DeleteOutlined } from '@ant-design/icons'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'

export default function AccountSettingEmployer() {
  const [form] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const handleSaveContact = () => {
    form.validateFields().then((values) => {
      message.success('Contact information updated successfully')
    })
  }

  const handleChangePassword = () => {
    passwordForm.validateFields().then((values) => {
      message.success('Password changed successfully')
      passwordForm.resetFields()
    })
  }

  const handleDeleteAccount = () => {
    setShowDeleteModal(false)
    message.success('Account deleted successfully')
  }

  const items = [
    {
      key: '1',
      label: (
        <span className="flex items-center gap-2">
          <UserOutlined />
          Company Info
        </span>
      ),
    },
    {
      key: '2',
      label: (
        <span className="flex items-center gap-2">
          <GlobalOutlined />
          Founding Info
        </span>
      ),
    },
    {
      key: '3',
      label: (
        <span className="flex items-center gap-2">
          <WifiOutlined />
          Social Media Profile
        </span>
      ),
    },
    {
      key: '4',
      label: (
        <span className="flex items-center gap-2 text-blue-500">
          <SettingOutlined />
          Account Setting
        </span>
      ),
    },
  ]

  const containerStyle = {
    width: '100%',
    height: '200px'
  }

  const center = {
    lat: -3.745,
    lng: -38.523
  }

  return (
    <div className="p-6  min-h-screen">
      <div className="mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Settings</h1>
        
        <div className="p-6">
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
              <Form
                form={form}
                layout="vertical"
                initialValues={{
                  phone: '',
                  email: '',
                }}
              >
                <div className="mb-4">
                  <label className="block mb-2">Map Location</label>
                  <LoadScript googleMapsApiKey="your-google-maps-api-key">
                    <GoogleMap
                      mapContainerStyle={containerStyle}
                      center={center}
                      zoom={10}
                    >
                      <Marker position={center} />
                    </GoogleMap>
                  </LoadScript>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[{ required: true, message: 'Please enter phone number' }]}
                  >
                    <Input
                      addonBefore={
                        <Select defaultValue="+880" style={{ width: 100 }}>
                          <Select.Option value="+880">+880</Select.Option>
                          <Select.Option value="+1">+1</Select.Option>
                          <Select.Option value="+44">+44</Select.Option>
                        </Select>
                      }
                      placeholder="Phone number..."
                    />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: 'Please enter email' },
                      { type: 'email', message: 'Please enter a valid email' }
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined className="text-gray-400" />}
                      placeholder="Email address"
                    />
                  </Form.Item>
                </div>

                <Button 
                  type="primary" 
                  onClick={handleSaveContact}
                  className="bg-blue-500"
                >
                  Save Changes
                </Button>
              </Form>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Change Password</h2>
              <Form
                form={passwordForm}
                layout="vertical"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Form.Item
                    label="Current Password"
                    name="currentPassword"
                    rules={[{ required: true, message: 'Please enter current password' }]}
                  >
                    <Input.Password
                      placeholder="Password"
                      iconRender={(visible) => 
                        visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    label="New Password"
                    name="newPassword"
                    rules={[{ required: true, message: 'Please enter new password' }]}
                  >
                    <Input.Password
                      placeholder="Password"
                      iconRender={(visible) => 
                        visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    dependencies={['newPassword']}
                    rules={[
                      { required: true, message: 'Please confirm password' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('newPassword') === value) {
                            return Promise.resolve()
                          }
                          return Promise.reject(new Error('Passwords do not match'))
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      placeholder="Password"
                      iconRender={(visible) => 
                        visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                      }
                    />
                  </Form.Item>
                </div>

                <Button 
                  type="primary" 
                  onClick={handleChangePassword}
                  className="bg-blue-500"
                >
                  Change Password
                </Button>
              </Form>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Delete Your Company</h2>
              <p className="text-gray-500 mb-4">
                If you delete your company, there is no going back. Please be certain. All information 
                will be removed from the platform. You will be abandoned from all the services of jobplat.com
              </p>
              <Button 
                danger
                icon={<DeleteOutlined />}
                onClick={() => setShowDeleteModal(true)}
              >
                Close Account
              </Button>
            </div>
          </div>
      </div>

      <Modal
        title="Confirm Account Deletion"
        open={showDeleteModal}
        onOk={handleDeleteAccount}
        onCancel={() => setShowDeleteModal(false)}
        okText="Yes, Delete Account"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete your company account? This action cannot be undone.</p>
      </Modal>
    </div>
  )
}