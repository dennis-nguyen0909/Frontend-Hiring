'use client'

import { Table, Button, Dropdown, Badge, Select } from 'antd'
import { EllipsisOutlined, TeamOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface JobData {
  key: string
  title: string
  type: string
  timeRemaining: string
  status: 'Active' | 'Expire'
  applications: number
}

export default function MyJobEmployer() {
  const columns: ColumnsType<JobData> = [
    {
      title: 'JOBS',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: JobData) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-gray-500 text-sm">
            {record.type} • {record.timeRemaining}
          </div>
        </div>
      ),
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={status === 'Active' ? 'success' : 'error'} 
          text={status} 
          className="whitespace-nowrap"
        />
      ),
    },
    {
      title: 'APPLICATIONS',
      dataIndex: 'applications',
      key: 'applications',
      render: (count: number) => (
        <div className="flex items-center gap-2">
          <TeamOutlined />
          <span>{count} Applications</span>
        </div>
      ),
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      render: () => (
        <div className="flex gap-2">
          <Button type="primary" className="bg-blue-500">
            View Applications
          </Button>
          <Dropdown
            menu={{
              items: [
                { key: '1', label: 'Promote Job' },
                { key: '2', label: 'View Detail' },
                { key: '3', label: 'Mark as expired' },
              ],
            }}
            trigger={['click']}
          >
            <Button icon={<EllipsisOutlined />} />
          </Dropdown>
        </div>
      ),
    },
  ]

  const data: JobData[] = [
    {
      key: '1',
      title: 'UI/UX Designer',
      type: 'Full Time',
      timeRemaining: '27 days remaining',
      status: 'Active',
      applications: 798,
    },
    {
      key: '2',
      title: 'Senior UX Designer',
      type: 'Internship',
      timeRemaining: '8 days remaining',
      status: 'Active',
      applications: 185,
    },
    {
      key: '3',
      title: 'Junior Graphic Designer',
      type: 'Full Time',
      timeRemaining: '24 days remaining',
      status: 'Active',
      applications: 583,
    },
    {
      key: '4',
      title: 'Front End Developer',
      type: 'Full Time',
      timeRemaining: 'Dec 7, 2019',
      status: 'Expire',
      applications: 740,
    },
    {
      key: '5',
      title: 'Technical Support Specialist',
      type: 'Part Time',
      timeRemaining: '4 days remaining',
      status: 'Active',
      applications: 558,
    },
    {
      key: '6',
      title: 'Interaction Designer',
      type: 'Contract Base',
      timeRemaining: 'Feb 2, 2019',
      status: 'Expire',
      applications: 428,
    },
    {
      key: '7',
      title: 'Software Engineer',
      type: 'Temporary',
      timeRemaining: '9 days remaining',
      status: 'Active',
      applications: 922,
    },
    {
      key: '8',
      title: 'Product Designer',
      type: 'Full Time',
      timeRemaining: '7 days remaining',
      status: 'Active',
      applications: 894,
    },
    {
      key: '9',
      title: 'Project Manager',
      type: 'Full Time',
      timeRemaining: 'Dec 4, 2019',
      status: 'Expire',
      applications: 196,
    },
    {
      key: '10',
      title: 'Marketing Manager',
      type: 'Full Time',
      timeRemaining: '4 days remaining',
      status: 'Active',
      applications: 492,
    },
  ]

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">
              My Jobs <span className="text-gray-400">(589)</span>
            </h1>
            <div className="flex gap-4">
              <Select
                defaultValue="status"
                style={{ width: 120 }}
                options={[
                  { value: 'status', label: 'Job status' },
                  { value: 'active', label: 'Active' },
                  { value: 'expired', label: 'Expired' },
                ]}
              />
              <Select
                defaultValue="all"
                style={{ width: 120 }}
                options={[
                  { value: 'all', label: 'All Jobs' },
                  { value: 'fulltime', label: 'Full Time' },
                  { value: 'parttime', label: 'Part Time' },
                  { value: 'contract', label: 'Contract' },
                ]}
              />
            </div>
          </div>
        </div>
        
        <Table 
          columns={columns} 
          dataSource={data}
          pagination={{
            total: 50,
            pageSize: 10,
            current: 1,
            showSizeChanger: false,
            itemRender: (page, type, originalElement) => {
              if (type === 'prev') {
                return <Button size="small">Previous</Button>
              }
              if (type === 'next') {
                return <Button size="small">Next</Button>
              }
              return originalElement
            },
          }}
          className="[&_.ant-table-thead_.ant-table-cell]:bg-gray-50"
        />
      </div>
    </div>
  )
}