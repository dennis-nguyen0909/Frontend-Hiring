import { useState } from 'react'
import { Tabs } from 'antd'
import { UserOutlined, GlobalOutlined, WifiOutlined, SettingOutlined } from '@ant-design/icons'
import CompanyInfo from './Company'
import Founding from './Founding'
import SocialEmployer from './Social'
import AccountSettingEmployer from './Account'

export default function SettingEmployer() {
  const [activeTab, setActiveTab] = useState('1')

  const tabItems = [
    {
      key: '1',
      label: (
        <span className="!text-black flex items-center gap-2">
          <UserOutlined />
          Thông tin công ty
        </span>
      ),
      content: (
       <CompanyInfo />
      ),
    },
    {
      key: '2',
      label: (
        <span className="!text-black flex items-center gap-2">
          <GlobalOutlined />
          Thông tin thành lập
        </span>
      ),
      content: (
        <Founding />
      )
    },
    {
      key: '3',
      label: (
        <span className="!text-black flex items-center gap-2">
          <WifiOutlined />
          Hồ sơ truyền thông xã hội
        </span>
      ),
      content: (
        <SocialEmployer />
      )
    },
    {
      key: '4',
      label: (
        <span className="!text-black flex items-center gap-2">
          <SettingOutlined />
          Cài đặt tài khoản
        </span>
      ),
      content: (
        <AccountSettingEmployer />
      )
    },
  ]

  return (
    <div className="setting-employer lg:p-6 p-2 bg-gray-50 min-h-screen">
      <div className=" mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Cài đặt</h1>
        <div className="bg-white rounded-lg shadow-sm">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems.map(({ key, label }) => ({
              key,
              label,
            }))}
            className="px-6 pt-4 !text-primaryColor"
          />
          <div className="p-6">
            {tabItems.find((item) => item.key === activeTab)?.content}
          </div>
        </div>
      </div>
    </div>
  )
}
