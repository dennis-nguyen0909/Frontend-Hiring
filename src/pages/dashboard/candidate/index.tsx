import React, { useState } from 'react'
import { Button, notification, Table } from 'antd'
import { BellOutlined, BookOutlined, FileTextOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons'
import OverViewCandidate from './overview'
import Applied from './applied'
import FavoriteJob from './FavoriteJob'
import AlertJob from './AlertJob'
import SettingCandidate from './setting'
import * as authServices from '../../../services/modules/authServices'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { resetUser } from '../../../redux/slices/userSlices'
const DashboardCandidate = () => {
  const [currentTab, setCurrentTab] = useState('overview')
    const user = useSelector(state => state.user)
    const navigate = useNavigate();
    const dispatch = useDispatch();
  const handleTabClick = (tab) => {
    setCurrentTab(tab)
  }
  const handleLogout = async () => {
    try {
      // Giả sử có một hàm API để đăng xuất
      const res = await authServices.logout(user.access_token);
      if(res.data === true){
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        dispatch(resetUser())
        navigate("/");
        notification.success({
          message: "Thông báo",
          description: "Đăng xuất thành công",
        })
      }
    } catch (error) {
      notification.error({
        message: "Thông báo",
        description: error.message,
      })
      console.error("Đăng xuất thất bại:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 text-xl font-bold border-b text-center">ỨNG VIÊN</div>
        <nav className="mt-4">
          <a 
            href="#"
            className={`flex items-center px-4 py-2 ${currentTab === 'overview' ? 'text-blue-600 bg-blue-100' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={() => handleTabClick('overview')}
          >
            <FileTextOutlined className="mr-3" />
            Tổng quan
          </a>
          <a 
            href="#"
            className={`flex items-center px-4 py-2 ${currentTab === 'appliedJobs' ? 'text-blue-600 bg-blue-100' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={() => handleTabClick('appliedJobs')}
          >
            <FileTextOutlined className="mr-3" />
            Việc làm đã ứng tuyển
          </a>
          <a 
            href="#"
            className={`flex items-center px-4 py-2 ${currentTab === 'favoriteJobs' ? 'text-blue-600 bg-blue-100' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={() => handleTabClick('favoriteJobs')}
          >
            <BookOutlined className="mr-3" />
            Việc làm đã lưu
          </a>
          <a 
            href="#"
            className={`flex items-center px-4 py-2 ${currentTab === 'jobAlert' ? 'text-blue-600 bg-blue-100' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={() => handleTabClick('jobAlert')}
          >
            <BellOutlined className="mr-3" />
            Thông báo việc làm
            <span className="ml-auto bg-blue-500 text-white text-xs px-2 rounded-full">09</span>
          </a>
          <a 
            href="#"
            className={`flex items-center px-4 py-2 ${currentTab === 'settings' ? 'text-blue-600 bg-blue-100' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={() => handleTabClick('settings')}
          >
            <SettingOutlined className="mr-3" />
            Cài đặt
          </a>
        </nav>
        <div className="absolute bottom-4 left-4 flex items-center text-gray-700">
          <LogoutOutlined className="mr-2" onClick={handleLogout} />
          Đăng xuất
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        {currentTab === 'overview' && <OverViewCandidate userDetail={user} />}
        {currentTab === 'appliedJobs' && <Applied />}
        {currentTab === 'favoriteJobs' && <FavoriteJob />}
        {currentTab === 'jobAlert' && <AlertJob />}
        {currentTab === 'settings' && <SettingCandidate />}
      </div>
    </div>
  )
}

export default DashboardCandidate
