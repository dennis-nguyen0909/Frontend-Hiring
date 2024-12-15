import { useEffect, useState } from 'react'
import { Layout, Menu, Typography } from 'antd'
import {
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { updateUser } from '../../../redux/slices/userSlices'
import * as userServices from '../../../services/modules/userServices'
import { TAB_CURRENCY_TYPE, TAB_DEGREE_TYPE, TAB_JOB_CONTRACT_TYPE, TAB_JOB_TYPE, TAB_LEVEL } from '../../../utils/role.utils'
import JobTypeComponent from '../../employer/JobType/JobTypeComponent'
import JobContractTypeComponent from '../../employer/JobContractType/JobContractTypeComponent'
import DegreeTypeComponent from '../../employer/DegreeType/DegreeTypeComponent'
import CurrenciesComponent from '../../employer/Currencies/CurrenciesComponent'
import SkillLevel from '../../employer/SkillLevel/SkillLevel'

const { Sider, Content } = Layout
const { Title, Text } = Typography

export default function DashBoardAdmin() {
  const [collapsed, setCollapsed] = useState(false)
  const [currentTab, setCurrentTab] = useState(TAB_LEVEL) // Initialize state for the current tab with a default value
  const userDetail = useSelector(state => state.user)
  const dispatch = useDispatch()

  const menuItems = [
    {
      key: '1',
      label: 'Quản lý người dùng',
      icon: <SettingOutlined />,
      children: [
        { key: 'users_candidate', label: 'Ứng viên' },
        { key: 'users_employer', label: 'Nhà tuyển dụng' },
      ],
    },
    {
      key: '2',
      label: 'Quản lý tin tuyển dụng',
      icon: <SettingOutlined />,
      children: [
        { key: TAB_LEVEL, label: 'Quản lý cấp độ' },
        { key: TAB_JOB_TYPE, label: 'Quản lý loại hình làm việc' },
        { key: TAB_JOB_CONTRACT_TYPE, label: 'Quản lý loại hợp đồng' },
        { key: TAB_DEGREE_TYPE, label: 'Quản lý loại bằng cấp' },
        { key: TAB_CURRENCY_TYPE, label: 'Quản lý loại tiền tệ' },
      ],
    },
  ]

  const handleCollapse = async (collapsed) => {
    setCollapsed(collapsed)
    const res = await userServices.updateUser({
      id: userDetail?._id,
      toggle_dashboard: collapsed
    })
    dispatch(updateUser({ ...res.data, access_token: userDetail.access_token }))
  }

  useEffect(() => {
    if (userDetail?.toggle_dashboard) {
      setCollapsed(userDetail?.toggle_dashboard)
    }
  }, [userDetail?.toggle_dashboard])

  const renderContent = () => {
    switch (currentTab) {
      case 'users_candidate':
        return <div>Ứng viên</div>
      case 'users_employer':
        return <div>Nhà tuyển dụng</div>
      case TAB_LEVEL:
        return  <SkillLevel />
      case TAB_JOB_TYPE:
        return <JobTypeComponent />
      case TAB_JOB_CONTRACT_TYPE:
        return <JobContractTypeComponent />
      case TAB_DEGREE_TYPE:
        return <DegreeTypeComponent />
      case TAB_CURRENCY_TYPE:
        return <CurrenciesComponent />
      default:
        return <div>Vui lòng chọn tab</div>
    }
  }

  return (
    <Layout className="min-h-screen">
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={handleCollapse}
        className="bg-white"
        width={250}
      >
        <div className="p-4 text-xl font-bold text-center border-b">
          {!collapsed && "ADMIN DASHBOARD"}
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
          {renderContent()} {/* Render content based on currentTab */}
        </Content>
      </Layout>
    </Layout>
  )
}
