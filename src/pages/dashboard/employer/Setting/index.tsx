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
        <span className="flex items-center gap-2">
          <UserOutlined />
          Company Info
        </span>
      ),
      content: (
       <CompanyInfo />
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
      content: (
        <Founding />
      )
    },
    {
      key: '3',
      label: (
        <span className="flex items-center gap-2">
          <WifiOutlined />
          Social Media Profile
        </span>
      ),
      content: (
        <SocialEmployer />
      )
    },
    {
      key: '4',
      label: (
        <span className="flex items-center gap-2">
          <SettingOutlined />
          Account Setting
        </span>
      ),
      content: (
        <AccountSettingEmployer />
      )
    },
  ]

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className=" mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Settings</h1>
        <div className="bg-white rounded-lg shadow-sm">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems.map(({ key, label }) => ({
              key,
              label,
            }))}
            className="px-6 pt-4"
          />
          <div className="p-6">
            {tabItems.find((item) => item.key === activeTab)?.content}
          </div>
        </div>
      </div>
    </div>
  )
}
