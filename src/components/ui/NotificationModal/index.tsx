
import { Badge, Button, Card, Empty } from 'antd'
import { Bell } from 'lucide-react'
import { useEffect, useState } from 'react';
import { NOTIFICATION_API } from '../../../services/modules/NotificationService';
import { useSelector } from 'react-redux';
import { Meta } from '../../../types';
import moment from 'moment';
export interface INotification {
  _id:string;
  candidateId: any; // Ứng viên
  employerId: any; // Nhà tuyển dụng
  applicationId: any; // Đơn ứng tuyển
  jobId: any; // Công việc
  message: string; // Tin nhắn thông báo
  isRead: boolean; // Trạng thái đã đọc
  createdAt: Date; // Thời gian tạo thông báo
}

export default function NotificationModal() {
  const [notifications,setNotifications]=useState<Notification[]>([])
  const [meta,setMeta]=useState<Meta>({})
  const userDetail = useSelector(state=>state.user);
  const getNotificationsForCandidate=async()=>{
    try {
      const res = await NOTIFICATION_API.getNotificationsForCandidate(userDetail?._id,userDetail?.access_token);
      if(res.data){
        setNotifications(res.data.items);
        setMeta(res.data.meta);
      }
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(()=>{
    if(userDetail?.role?.role_name === 'USER' && userDetail?.access_token){
      getNotificationsForCandidate();
    }
  },[])
  return (
    <div className="min-w-min max-w-sm  bg-white rounded-lg  w-[250px]">
      <div className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="text-[12px] font-bold ">Thông báo</div>
        <div className="flex items-center gap-2">
          <Button  className="text-green-600 text-[12px] border-none hover:text-green-700 p-0">
            Đánh dấu là đã đọc
          </Button>
        </div>
      </div>
      <div className="max-h-[300px] w-full overflow-y-auto">
        <div className="space-y-2">
          {notifications.length> 0 ? notifications?.map((notification) => (
            <div
              key={notification?._id}
              className="rounded-lg bg-slate-50 p-3 hover:bg-slate-100 transition-colors cursor-pointer px-2"
            >
              <h3 className="font-semibold text-slate-900 text-[10px]">
                {notification.title}
              </h3>
              <p className="mt-1 text-[10px] text-slate-700">
                {notification.message}
              </p>
              <p className="mt-2 text-[10px] text-slate-500">
              {moment(notification.createdAt).fromNow()}
              </p>
            </div>
          )):(
            <Empty />
          )}
        </div>
      </div>
    </div>
  )
}

