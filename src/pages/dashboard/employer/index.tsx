import { useEffect, useState } from 'react'
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
import * as userServices from '../../../services/modules/userServices'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { updateUser } from '../../../redux/slices/userSlices'
import { TAB_CURRENCY_TYPE, TAB_DEGREE_TYPE, TAB_JOB_CONTRACT_TYPE, TAB_JOB_TYPE, TAB_LEVEL, TAB_SKILL } from '../../../utils/role.utils'
import SkillLevel from '../../employer/SkillLevel/SkillLevel'
import SkillEmployer from '../../employer/Skill/Skill'

const { Sider, Content } = Layout
const { Title, Text } = Typography

export default function DashBoardEmployer() {
  const [collapsed, setCollapsed] = useState(false)
  const [currentTab, setCurrentTab] = useState('1') // Initialize state for the current tab
  const userDetail = useSelector(state => state.user)
  const dispatch = useDispatch()
  const menuItems = [
    { key: '1', icon: <UserOutlined />, label: 'Overview', className: 'bg-blue-50' },
    // { key: '2', icon: <TeamOutlined />, label: 'Employers Profile' },
    { key: '3', icon: <FileTextOutlined />, label: 'Post a Job' },
    { key: '4', icon: <FileTextOutlined />, label: 'My Jobs' },
    { key: '5', icon: <SaveOutlined />, label: 'Saved Candidate' },
    { key: '6', icon: <DollarOutlined />, label: 'Plans & Billing' },
    // { key: '7', icon: <BankOutlined />, label: 'All Companies' },
    { key: '8', icon: <SettingOutlined />, label: 'Settings' },
    {
      key: 'sub4',
      label: 'Quản lý bài viết',
      icon: <SettingOutlined />,
      children: [
        { key: TAB_SKILL, label: 'Quản lý kỹ năng' },
      ],
    },
  ]

const handleCollapse = async (collapsed: boolean) => {
  setCollapsed(collapsed)
  const res = await userServices.updateUser({
    id: userDetail._id,
    toggle_dashboard: collapsed
  })

  dispatch(updateUser({ ...res.data, access_token: userDetail.access_token }))
}

console.log("TAB_SKILL",currentTab)
useEffect(()=>{
  if(userDetail?.toggle_dashboard){
    setCollapsed(userDetail?.toggle_dashboard)
  }
},[userDetail?.toggle_dashboard])

  return (
    <Layout className="min-h-screen 123">
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(collapsed) => handleCollapse(collapsed)}
        className="bg-white"
        width={250}
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
          {currentTab === TAB_SKILL && (
             <SkillEmployer />
          )}
        </Content>
      </Layout>
    </Layout>
  )
}
