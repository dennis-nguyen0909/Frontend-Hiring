'use client'

import { useEffect, useState } from 'react'
import { Tabs, Select, DatePicker, Input, Button, Form, notification } from 'antd'
import { Editor } from '@tinymce/tinymce-react'
import { UserOutlined, GlobalOutlined, WifiOutlined, SettingOutlined, LinkOutlined } from '@ant-design/icons'
import { ORGANIZATION_API } from '../../../../../services/modules/OrganizationServices'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { updateUser } from '../../../../../redux/slices/userSlices'

export default function Founding() {
  const [form] = Form.useForm()
  const [companyVision, setCompanyVision] = useState('')
  const dispatch = useDispatch()
const userDetail = useSelector(state => state.user)
  const handleSave = () => {
    form.validateFields().then(async(values) => {
      const { year_of_establishment} = values
      const params ={
        ...values,
        owner:userDetail?._id,
        year_of_establishment,
        company_vision:companyVision
        
      }
      const res = await ORGANIZATION_API.createOrganization(params,userDetail.access_token);
      if(res.data){
        notification.success({
          message: "Notification",
          description: "Cập nhật thành công"
        })
        dispatch(updateUser({ ...res.data, access_token: userDetail.access_token }))
      }else{
        notification.error({
          message: "Notification",
          description: res.response.data.message
        })
      }

    })
  }

useEffect(()=>{
  if(userDetail && userDetail.organization){
    form.setFieldsValue({
      organization_type: userDetail?.organization?.organization_type,
      industry_type: userDetail?.organization?.industry_type,
      team_size: userDetail?.organization?.team_size,
      company_website:userDetail?.organization?.company_website,
      year_of_establishment:moment(userDetail?.organization?.year_of_establishment).format('MM/DD/YYYY')
    })
    setCompanyVision(userDetail?.organization?.company_vision)
  }
},[userDetail?.organization])


  const organizationTypes = [
    'Corporation',
    'Limited Liability Company (LLC)',
    'Partnership',
    'Sole Proprietorship',
    'Non-Profit Organization',
  ]

  const industry_type = [
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

  const onFinish = (values: any) => {
  }
  return (
    <div className="p-6 min-h-screen">
      <Form
              form={form}
              layout="vertical"
              initialValues={{
                organization_type: undefined,
                industry_type: undefined,
                team_size: undefined,
                year_of_establishment: undefined,
                company_website: '',
              }}
              onFinish={onFinish}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Form.Item
                  label="Organization Type"
                  name="organization_type"
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
                  name="industry_type"
                  rules={[{ required: true, message: 'Please select industry type' }]}
                >
                  <Select placeholder="Select...">
                    {industry_type.map(type => (
                      <Select.Option key={type} value={type}>
                        {type}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Team Size"
                  name="team_size"
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
                  name="year_of_establishment"
                  rules={[{ required: true, message: 'Please select establishment date' }]}
                >
                 <Input placeholder="dd/mm/yyyy" />
                </Form.Item>

                <Form.Item
                  label="Company Website"
                  name="company_website"
                  rules={[
                    { required: true, message: 'Please enter company_website URL' },
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
              apiKey="px41kgaxf4w89e8p41q6zuhpup6ve0myw5lzxzlf0gc06zh3"
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