
import { Button, Upload, message, notification } from 'antd'
import { InboxOutlined, BarChartOutlined, SendOutlined, MessageOutlined, FileTextOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import * as userServices from '../../../services/modules/userServices'
import { CV_API } from '../../../services/modules/CvServices'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { File } from 'buffer'
const { Dragger } = Upload

export default function UploadPDF() {
    const userDetail= useSelector(state=>state.user)
    const [fileUrl,setFileUrl]=useState<string>('')
    const [fileName,setFileName]=useState<string>('')
    const [publicId,setPublicId]=useState<string>('')
    const [bytes,setBytes]=useState<number>(0)
  const props: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.doc,.docx,.pdf',
    action: `http://localhost:8082/api/v1/media/upload-pdf`,
    onChange(info) {
      const { status } = info.file
      if (status === 'done') {
        setFileUrl(info.file.response.data.url)
        setPublicId(info.file.response.data.result.public_id)
        setFileName(info.file.response.data.originalName)
        setBytes(info.file.response.data.result.bytes)
        message.success(`${info.file.name} đã được tải lên thành công.`)
      } else if (status === 'error') {
        notification.error({
          message:'Notification',
          description:'Tải lên thất bại'
        })
        message.error(`${info.file.name} tải lên thất bại.`)
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
  }

  const onUpdate = async()=>{
    try {
        const params ={
            user_id:userDetail._id,
            cv_name:fileName,
            cv_link:fileUrl,
            public_id:publicId,
            bytes:bytes
        }
        const res = await CV_API.create(params,userDetail.access_token);
        if(res.data){
            notification.success({
                message:'Notification',
                description:'Cập nhật thành công'
            })
        }
    } catch (error) {
        notification.error({
            message:'Notification',
            description:error.message
        })
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto mt-4">
      {/* Header Banner */}
      <div className="bg-green-600 text-white p-8 rounded-t-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-2">
            Upload CV để các cơ hội việc làm tự tìm đến bạn
          </h1>
          <p className="text-green-100">
            Giảm đến 50% thời gian cần thiết để tìm được một công việc phù hợp
          </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3">
          <div className="relative h-full w-full">
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <div className="w-32 h-32 relative">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-green-400/20 transform rotate-45"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-green-400/20 transform -rotate-45"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white p-8 border border-gray-200 rounded-b-lg">
        <p className="text-gray-600 mb-6 text-center max-w-2xl mx-auto">
          Bạn đã có sẵn CV của mình, chỉ cần tải CV lên, hệ thống sẽ tự động đề xuất CV của bạn tới những nhà tuyển dụng uy tín.
          Tiết kiệm thời gian, tìm việc thông minh, nắm bắt cơ hội và làm chủ đường đua nghề nghiệp của chính mình.
        </p>

        <Dragger {...props} className="mb-8">
          <p className="ant-upload-drag-icon">
            <InboxOutlined className="text-green-500 text-4xl" />
          </p>
          <p className="ant-upload-text font-medium">
            Tải lên CV từ máy tính, chọn hoặc kéo thả
          </p>
          <p className="ant-upload-hint text-gray-500">
            Hỗ trợ định dạng .doc, .docx, pdf có kích thước dưới 5MB
          </p>
        </Dragger>
        <div className='mt-5 flex items-center'>
        <Button onClick={onUpdate}>Cập nhật</Button>
    </div>
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="p-6 border border-gray-100 rounded-lg text-center">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileTextOutlined className="text-2xl text-green-500" />
            </div>
            <h3 className="font-medium mb-2">Nhận về các cơ hội tốt nhất</h3>
            <p className="text-gray-500 text-sm">
              CV của bạn sẽ được ưu tiên hiển thị với các nhà tuyển dụng đã xác thực. Nhận được lời mời với những cơ hội việc làm hấp dẫn từ các doanh nghiệp uy tín.
            </p>
          </div>

          <div className="p-6 border border-gray-100 rounded-lg text-center">
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChartOutlined className="text-2xl text-orange-500" />
            </div>
            <h3 className="font-medium mb-2">Theo dõi số liệu, tối ưu CV</h3>
            <p className="text-gray-500 text-sm">
              Theo dõi số lượt xem CV. Biết chính xác nhà tuyển dụng nào trên TopCV đang quan tâm đến CV của bạn.
            </p>
          </div>

          <div className="p-6 border border-gray-100 rounded-lg text-center">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <SendOutlined className="text-2xl text-blue-500" />
            </div>
            <h3 className="font-medium mb-2">Chia sẻ CV bất cứ nơi đâu</h3>
            <p className="text-gray-500 text-sm">
              Upload một lần và sử dụng đường link gửi tới nhiều nhà tuyển dụng.
            </p>
          </div>

          <div className="p-6 border border-gray-100 rounded-lg text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageOutlined className="text-2xl text-red-500" />
            </div>
            <h3 className="font-medium mb-2">Kết nối nhanh chóng với nhà tuyển dụng</h3>
            <p className="text-gray-500 text-sm">
              Dễ dàng kết nối với các nhà tuyển dụng nào xem và quan tâm tới CV của bạn
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

