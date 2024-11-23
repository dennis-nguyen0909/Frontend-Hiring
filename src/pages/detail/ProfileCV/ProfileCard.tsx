import { Avatar, Button } from 'antd'
import { Edit, Eye, Star } from 'lucide-react'
import moment from 'moment'
import avatarDefault from '../../../assets/avatars/avatar-default.jpg'
import { useNavigate } from 'react-router-dom'
export default function ProfileCard({userDetail}:any) {
console.log("duydeptrai",userDetail?.updatedAt)
const navigate=useNavigate()
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">TopCV Profile</h2>
        <span className="text-gray-500">
          Cập nhật lần cuối {moment(userDetail?.updatedAt).format('DD/MM/YYYY HH:mm')}
        </span>
      </div>

      <div className="rounded-lg overflow-hidden bg-white border">
        {/* Banner */}
        <div className="h-48 bg-gradient-to-r  to-green-400 relative">
          <div className="absolute inset-0 opacity-30">
            <div className="w-full h-full" style={{
              backgroundImage: `url(${userDetail?.background})`,
              backgroundSize: 'cover',
            }} />
          </div>
        </div>

        {/* Profile Content */}
        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="relative -mt-16 mb-4">
            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-100">
              <Avatar 
               src={userDetail?.avatar || avatarDefault}
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <h1 className="text-2xl font-bold mb-4">{userDetail?.full_name}</h1>
          
          {/* Actions */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Button 
            onClick={()=>{
              navigate(`/profile/${userDetail?._id}`)
            }}
              icon={<Edit className="w-4 h-4" />}
              className="flex items-center gap-2 bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
            >
              Chỉnh sửa
            </Button>
            <Button
              icon={<Star className="w-4 h-4" />}
              className="flex items-center gap-2 bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
            >
              Đặt làm CV chính
            </Button>
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-2">
            TopCV Profile là tính năng giúp bạn giới thiệu với mọi người mình là ai, đã làm gì và những thành tích nổi bật của bạn.
          </p>
          <a href="#" className="text-green-600 hover:text-green-700 font-medium">
            Tìm hiểu ngay
          </a>
        </div>
      </div>
    </div>
  )
}

