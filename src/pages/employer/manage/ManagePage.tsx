import React, { useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps, MenuTheme } from 'antd';
import { Menu, Switch } from 'antd';
import { Users } from 'lucide-react';
import './styles.css'
import TabCandidate from '../Tab/TabCandidate';
import TabJobs from '../Tab/TabJobs';
import { TAB_CANDIDATE, TAB_JOB, TAB_LEVEL, TAB_SKILL } from '../../../utils/role.utils';
import SkillEmployer from '../Skill/Skill';
type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: TAB_CANDIDATE,
    label: <span className="text-primaryColor">Quản lý ứng viên</span>,
    icon: <Users className='w-5 h-5 !text-primaryColor' />,
  },
  {
    key: TAB_JOB,
    label: <span className="text-primaryColor">Quản lý bài đăng</span>,
    icon: <AppstoreOutlined className='w-5 h-5 !text-primaryColor' />,
  },
  {
    key: 'sub4',
    label: 'Navigation Three',
    icon: <SettingOutlined />,
    children: [
      { key: TAB_SKILL, label: 'Quản lý kỹ năng' },
      { key: TAB_LEVEL, label: 'Quản lý cấp độ' },
      { key: '11', label: 'Option 11' },
      { key: '12', label: 'Option 12' },
    ],
  },
];

const ManagePage: React.FC = () => {
  const [theme, setTheme] = useState<MenuTheme>('light');
  const [current, setCurrent] = useState(TAB_CANDIDATE);

  const handleGetCities = async () => {
    
  }
  const changeTheme = (value: boolean) => {
    setTheme(value ? 'dark' : 'light');
  };

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
  };


  return (
    <div className="menu-setting h-screen  border-r-2 border-gray-300 flex">
    <Menu
      className="h-full"
      theme={theme}
      onClick={onClick}
      style={{ width: 256 }}
      defaultOpenKeys={[TAB_CANDIDATE]}
      selectedKeys={[current]}
      mode="inline"
      items={items}
    />
    <div className="flex-grow h-full bg-white p-4"> {/* Cột nội dung */}
      {current === TAB_CANDIDATE && (
        <div className="h-full w-full">
          <TabCandidate />
        </div>
      )}
      {current === TAB_JOB && (
        <div className="h-full w-full">
          <TabJobs />
        </div>
      )}
      {current===TAB_SKILL&& (
          <div className="h-full w-full">
          <SkillEmployer />
        </div>
      )}
      {current===TAB_LEVEL&& (
          <div className="h-full w-full">
          LEVEL
        </div>
      )}
    </div>
  </div>
  );
};

export default ManagePage;


    {/* <Switch
        checked={theme === 'dark'}
        onChange={changeTheme}
        checkedChildren="Dark"
        unCheckedChildren="Light"
      />
      <br />
      <br /> */}