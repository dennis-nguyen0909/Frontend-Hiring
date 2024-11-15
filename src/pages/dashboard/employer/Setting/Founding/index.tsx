'use client'

import { useState } from 'react'
import { Tabs, Select, DatePicker, Input, Button, Form } from 'antd'
import { Editor } from '@tinymce/tinymce-react'
import { UserOutlined, GlobalOutlined, WifiOutlined, SettingOutlined, LinkOutlined } from '@ant-design/icons'

export default function Founding() {
  const [form] = Form.useForm()
  const [companyVision, setCompanyVision] = useState('')

  const handleSave = () => {
    form.validateFields().then((values) => {
      console.log('Form values:', { ...values, companyVision })
    })
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
        <span className="flex items-center gap-2 text-blue-500">
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
        <span className="flex items-center gap-2">
          <SettingOutlined />
          Account Setting
        </span>
      ),
    },
  ]

  const organizationTypes = [
    'Corporation',
    'Limited Liability Company (LLC)',
    'Partnership',
    'Sole Proprietorship',
    'Non-Profit Organization',
  ]

  const industryTypes = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Retail',
    'Services',
  ]

  const teamSizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '501-1000 employees',
    '1000+ employees',
  ]

  return (
    <div className="p-6 min-h-screen">
      <Form
              form={form}
              layout="vertical"
              initialValues={{
                organizationType: undefined,
                industryTypes: undefined,
                teamSize: undefined,
                establishmentDate: undefined,
                website: '',
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Form.Item
                  label="Organization Type"
                  name="organizationType"
                  rules={[{ required: true, message: 'Please select organization type' }]}
                >
                  <Select placeholder="Select...">
                    {organizationTypes.map(type => (
                      <Select.Option key={type} value={type}>
                        {type}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Industry Types"
                  name="industryTypes"
                  rules={[{ required: true, message: 'Please select industry type' }]}
                >
                  <Select placeholder="Select...">
                    {industryTypes.map(type => (
                      <Select.Option key={type} value={type}>
                        {type}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Team Size"
                  name="teamSize"
                  rules={[{ required: true, message: 'Please select team size' }]}
                >
                  <Select placeholder="Select...">
                    {teamSizes.map(size => (
                      <Select.Option key={size} value={size}>
                        {size}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Form.Item
                  label="Year of Establishment"
                  name="establishmentDate"
                  rules={[{ required: true, message: 'Please select establishment date' }]}
                >
                  <DatePicker 
                    className="w-full" 
                    format="DD/MM/YYYY"
                    placeholder="dd/mm/yyyy"
                  />
                </Form.Item>

                <Form.Item
                  label="Company Website"
                  name="website"
                  rules={[
                    { required: true, message: 'Please enter website URL' },
                    { type: 'url', message: 'Please enter a valid URL' }
                  ]}
                >
                  <Input 
                    prefix={<LinkOutlined className="text-gray-400" />}
                    placeholder="Website url..."
                  />
                </Form.Item>
              </div>

              <div className="mb-6">
                <label className="block mb-2">Company Vision</label>
                <Editor
                  value={companyVision}
                  onEditorChange={(content) => setCompanyVision(content)}
                  init={{
                    height: 200,
                    menubar: false,
                    plugins: [
                      'advlist autolink lists link image charmap print preview anchor',
                      'searchreplace visualblocks code fullscreen',
                      'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar:
                      'bold italic underline strikethrough | link | alignleft aligncenter alignright alignjustify | bullist numlist | removeformat',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                  }}
                />
              </div>

              <Button 
                type="primary" 
                onClick={handleSave}
                className="bg-blue-500"
              >
                Save Changes
              </Button>
          </Form>
    </div>
  )
}