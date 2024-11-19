import { useState } from 'react'
import { Layout, Menu, Typography } from 'antd'
import {
  UserOutlined,
  FileTextOutlined,
  SaveOutlined,
  SettingOutlined,
  LogoutOutlined,
  TeamOutlined,
  DollarOutlined,
  BankOutlined,
} from '@ant-design/icons'
import OverviewEmployer from './Overview'
import PostJob from './PostJob'
import MyJobEmployer from './MyJob'
import SettingEmployer from './Setting'
import SavedCandidate from './SavedCandidate'

const { Sider, Content } = Layout
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
