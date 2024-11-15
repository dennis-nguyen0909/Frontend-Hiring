'use client'

import { Form, Input, Select, InputNumber, Checkbox, Radio, Button } from 'antd'
import { Editor } from '@tinymce/tinymce-react'
import { DollarOutlined } from '@ant-design/icons'

const { TextArea } = Input

export default function PostJob() {
  const [form] = Form.useForm()

  const jobBenefits = [
    'Paid salary', 'Scheduled Team', 'Apple', 'Vision Insurance', 'Dental Insurance',
    'Medical Insurance', 'Unlimited vacation', 'Edm membership', 'Company retreat',
    'Learning budget', 'Free gym membership', 'Pay to crypto', 'Profit Sharing',
    'Bonus Compensation', 'Tax enhancement services', 'No parking cost', 'Working visa cost cover'
  ]

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Form
        form={form}
        layout="vertical"
        className="max-w-4xl mx-auto"
        // className="mx-auto"
      >
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Post a Job</h2>
          
          <Form.Item
            label="Job Title"
            name="jobTitle"
            rules={[{ required: true }]}
          >
            <Input placeholder="Add job title, role, vacancies etc..." />
          </Form.Item>

          <Form.Item
            label="Tags"
            name="tags"
          >
            <Select
              mode="tags"
              placeholder="Job keywords, tags etc..."
              className="w-full"
            />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item label="Job Size" name="jobSize">
              <Select placeholder="Select">
                <Select.Option value="small">Small</Select.Option>
                <Select.Option value="medium">Medium</Select.Option>
                <Select.Option value="large">Large</Select.Option>
              </Select>
            </Form.Item>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Salary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item label="Min Salary" name="minSalary">
              <InputNumber
                prefix={<DollarOutlined />}
                className="w-full"
                placeholder="Minimum salary..."
                addonAfter="USD"
              />
            </Form.Item>
            
            <Form.Item label="Max Salary" name="maxSalary">
              <InputNumber
                prefix={<DollarOutlined />}
                className="w-full"
                placeholder="Maximum salary..."
                addonAfter="USD"
              />
            </Form.Item>

            <Form.Item label="Salary Type" name="salaryType">
              <Select placeholder="Select">
                <Select.Option value="yearly">Yearly</Select.Option>
                <Select.Option value="monthly">Monthly</Select.Option>
                <Select.Option value="hourly">Hourly</Select.Option>
              </Select>
            </Form.Item>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Advanced Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item label="Education" name="education">
              <Select placeholder="Select">
                <Select.Option value="bachelor">Bachelor's Degree</Select.Option>
                <Select.Option value="master">Master's Degree</Select.Option>
                <Select.Option value="phd">PhD</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Experience" name="experience">
              <Select placeholder="Select">
                <Select.Option value="entry">Entry Level</Select.Option>
                <Select.Option value="intermediate">Intermediate</Select.Option>
                <Select.Option value="senior">Senior</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Job Type" name="jobType">
              <Select placeholder="Select">
                <Select.Option value="fulltime">Full Time</Select.Option>
                <Select.Option value="parttime">Part Time</Select.Option>
                <Select.Option value="contract">Contract</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="Vacancies" name="vacancies">
              <InputNumber className="w-full" placeholder="Number of positions..." />
            </Form.Item>

            <Form.Item label="Expiration Date" name="expirationDate">
              <Input type="date" />
            </Form.Item>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Location</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="Country" name="country">
              <Select placeholder="Select">
                <Select.Option value="us">United States</Select.Option>
                <Select.Option value="uk">United Kingdom</Select.Option>
                <Select.Option value="ca">Canada</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="City" name="city">
              <Select placeholder="Select">
                <Select.Option value="ny">New York</Select.Option>
                <Select.Option value="sf">San Francisco</Select.Option>
                <Select.Option value="la">Los Angeles</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item name="isRemote" valuePropName="checked">
            <Checkbox>Fully Remote Position / Worldwide</Checkbox>
          </Form.Item>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Job Benefits</h2>
          
          <Form.Item name="benefits">
            <div className="flex flex-wrap gap-2">
              {jobBenefits.map(benefit => (
                <Checkbox key={benefit} className="bg-gray-50 px-3 py-1 rounded-full">
                  {benefit}
                </Checkbox>
              ))}
            </div>
          </Form.Item>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Job Description</h2>
          
          <Form.Item name="description">
            <Editor
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code help wordcount'
                ],
                toolbar:
                  'undo redo | formatselect | bold italic backcolor | \
                  alignleft aligncenter alignright alignjustify | \
                  bullist numlist outdent indent | removeformat | help'
              }}
            />
          </Form.Item>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Apply Job on:</h2>
          
          <Form.Item name="applicationMethod">
            <Radio.Group className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <Radio value="jobplat" className="w-full">
                    <div>
                      <div className="font-medium">On Jobplat</div>
                      <div className="text-sm text-gray-500">Candidates will be applying directly at our platform</div>
                    </div>
                  </Radio>
                </div>
                
                <div className="border rounded-lg p-4">
                  <Radio value="external" className="w-full">
                    <div>
                      <div className="font-medium">External Platform</div>
                      <div className="text-sm text-gray-500">Candidates apply on your career site</div>
                    </div>
                  </Radio>
                </div>
                
                <div className="border rounded-lg p-4">
                  <Radio value="email" className="w-full">
                    <div>
                      <div className="font-medium">On Your Email</div>
                      <div className="text-sm text-gray-500">Candidates will send their applications to your email</div>
                    </div>
                  </Radio>
                </div>
              </div>
            </Radio.Group>
          </Form.Item>
        </div>

        <div className="flex justify-end">
          <Button type="primary" size="large" className="bg-blue-500">
            Post Job
          </Button>
        </div>
      </Form>
    </div>
  )
}