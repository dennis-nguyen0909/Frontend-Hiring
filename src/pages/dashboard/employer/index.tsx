'use client'

import { useState } from 'react'
import { Layout, Menu, Table, Button, Dropdown, Badge, Typography } from 'antd'
import {
  UserOutlined,
  FileTextOutlined,
  SaveOutlined,
  SettingOutlined,
  LogoutOutlined,
  EllipsisOutlined,
  TeamOutlined,
  DollarOutlined,
  BankOutlined,
} from '@ant-design/icons'
import OverviewEmployer from './Overview'
import PostJob from './PostJob'
import MyJobEmployer from './MyJob'
import SettingEmployer from './Setting'
import SavedCandidate from './SavedCandidate'

const { Header, Sider, Content } = Layout
const { Title, Text } = Typography

export default function DashBoardEmployer() {
  const [collapsed, setCollapsed] = useState(false)
  const [currentTab, setCurrentTab] = useState('1') // Initialize state for the current tab

  const menuItems = [
    { key: '1', icon: <UserOutlined />, label: 'Overview', className: 'bg-blue-50' },
    { key: '2', icon: <TeamOutlined />, label: 'Employers Profile' },
    { key: '3', icon: <FileTextOutlined />, label: 'Post a Job' },
    { key: '4', icon: <FileTextOutlined />, label: 'My Jobs' },
    { key: '5', icon: <SaveOutlined />, label: 'Saved Candidate' },
    { key: '6', icon: <DollarOutlined />, label: 'Plans & Billing' },
    { key: '7', icon: <BankOutlined />, label: 'All Companies' },
    { key: '8', icon: <SettingOutlined />, label: 'Settings' },
  ]


  const columns = [
    {
      title: 'JOBS',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: any) => (
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

  const data = [
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
      title: 'Technical Support Specialist',
      type: 'Part Time',
      timeRemaining: '4 days remaining',
      status: 'Active',
      applications: 558,
    },
    {
      key: '4',
      title: 'Junior Graphic Designer',
      type: 'Full Time',
      timeRemaining: '24 days remaining',
      status: 'Active',
      applications: 583,
    },
    {
      key: '5',
      title: 'Front End Developer',
      type: 'Full Time',
      timeRemaining: 'Dec 7, 2019',
      status: 'Expired',
      applications: 740,
    },
  ]

  return (
    <Layout className="min-h-screen">
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        className="bg-white"
      >
        <div className="p-4 text-xl font-bold text-center border-b">
          {!collapsed && "EMPLOYERS DASHBOARD"}
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          selectedKeys={[currentTab]} // Use currentTab for active tab
          onClick={(e) => setCurrentTab(e.key)} // Update currentTab on click
          items={menuItems}
          className="border-r-0"
        />
        <div className="absolute bottom-0 w-full p-4 border-t">
          <Menu mode="inline" className="border-r-0">
            <Menu.Item key="logout" icon={<LogoutOutlined />}>
              Log-out
            </Menu.Item>
          </Menu>
        </div>
      </Sider>
      <Layout>
        <Content className="p-6 bg-gray-50">
          {currentTab === '1' && (
              <OverviewEmployer />
          ) }
           {currentTab === '3' && (
              <PostJob />
          ) }
          {currentTab === '4' && (
            <MyJobEmployer />
          )}
          {currentTab === '8' && (
            <SettingEmployer  />
          )}
          {currentTab === '5' && (
            <SavedCandidate />
          )}
        </Content>
      </Layout>
    </Layout>
  )
}
