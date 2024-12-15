import { Avatar, Button, Form, Image, Input, notification, Popconfirm } from "antd";
import {
  Edit2,
  Share2,
  Download,
  Trash2,
  Star,
  Share2Icon,
  DownloadCloud,
  Forward,
  Trash,
  Pencil,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CV_API } from "../../../services/modules/CvServices";
import { useEffect, useState } from "react";
import { Meta } from "../../../types";
import moment from "moment";
import avtDefault from "../../../assets/avatars/avatar-default.jpg";
import GeneralModal from "../../../components/ui/GeneralModal/GeneralModal";

interface CV {
  _id: string;
  name: string;
  lastUpdated: string;
  isPrimary?: boolean;
}

const CVCard = ({ cv, userDetail,onDelete,onUpdate,handleShare }: { cv: CV; userDetail: any,onDelete:any,onUpdate:any ,handleShare}) => {
    const onDownloadCV = () => {
        const link = document.createElement('a');
        link.href = cv?.cv_link;
        link.download = cv?.cv_name;
        link.click();
    }
  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-b from-green-100/80 to-gray-800 max-w-lg shadow-lg mt-5">
      {/* Avatar and Badge */}
      <div className="relative p-6 bg-gradient-to-b from-green-100/50 to-transparent">
        <div>
          <Avatar src={userDetail?.avatar || avtDefault} size={80} />
        </div>
        {cv?.isPrimary && (
          <div className="absolute top-6 right-6 flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md">
            <Star className="w-5 h-5" />
            <span className="text-sm font-semibold">Đặt làm CV chính</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 pt-0">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-xl font-semibold text-white truncate">
            {cv.cv_name}
          </h3>
          <div onClick={onUpdate} className="bg-[#5c6674] hover:bg-[#ccc] cursor-pointer px-1 py-1 rounded-full">
          <Pencil  size={14} color="white" />
            
          </div>
        </div>
        <p className="text-[12px] text-white/80 mb-5">
          Cập nhật lần cuối {moment(cv.updatedAt).format("DD/MM/YYYY HH:mm")}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div onClick={handleShare} className="bg-[#5c6674] w-[90px] rounded-full flex items-center justify-center gap-2 px-2 py-1 hover:bg-[#ccc] cursor-pointer">
              <Forward size={14} color="white" />
              <p className="text-[10px] text-white ">Chia sẻ</p>
            </div>
            <div onClick={onDownloadCV} className="bg-[#5c6674] w-[90px] rounded-full flex items-center justify-center gap-2 px-2 py-1 hover:bg-[#ccc] cursor-pointer">
              <Download size={14} color="white" />
              <p className="text-[10px] text-white ">Tải xuống</p>
            </div>
          </div>
          <div className="hover:bg-[#ccc] cursor-pointer px-1 py-1 rounded-full">
            <Popconfirm onConfirm={onDelete} title={'Bạn có chắc xóa ?'}>
            <Trash size={14} color="white" />
            </Popconfirm>
          </div>
        </div>
      </div>
    </div>
  );
};
interface CV {
    _id:string
  user_id: string;
  createdAt: string;

  cv_link: string;

  cv_name: string;

  public_id: string;

  updatedAt: string;
}
export default function ListCV() {
  const navigate = useNavigate();
  const userDetail = useSelector((state) => state.user);
  const [listCv, setListCv] = useState<CV[]>([]);
  const [meta, setMeta] = useState<Meta>({});
  const [visible,setVisible] = useState<boolean>(false)
  const [cv,setCv] = useState<CV>({} as CV)
  const handleGetCvByUserId = async (current = 1, pageSize = 10) => {
    try {
      const params = {
        current,
        pageSize,
        query: {
          user_id: userDetail?._id,
        },
      };
      const res = await CV_API.getAll(params, userDetail?.access_token);
      if (res.data) {
        setListCv([...res.data.items]);
        setMeta(res.data.meta);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const onClose = () => {
    setVisible(false)
    setCv({} as CV)
  }
  useEffect(() => {
    handleGetCvByUserId();
  }, []);

  const handleShare = () => {
    notification.info({
        message:'Thông báo',
        description:'Tính năng chưa phát triển'
    })
}
  const onDelete = async (id:string) => {
    try {
        const res = await CV_API.deleteByUser(id,userDetail?.access_token)
        if(+res.statusCode === 200){
            notification.success({
                message: "Notification",
                description:'Xóa thành công'
            })
            handleGetCvByUserId()
        }
    } catch (error) {
        notification.error({
            message: "Thông báo",
            description: "Xóa thất bại",
        })
    }
}
const handleSubmit = async () => {
    try {
        const res = await CV_API.update(cv._id,form.getFieldsValue(),userDetail?.access_token)
        if(res.data){
            notification.success({
                message: "Notification",
                description:'Tạo CV thành công'
            })
            handleGetCvByUserId()
            onClose()
        }
    } catch (error) {
        notification.error({
            message: "Thông báo",
            description: "Cập nhật thất bại",
        })
    }
}
const [form]=Form.useForm()
const renderBody = ()=>{
    return (
        <Form
        form={form}
        layout="vertical"
        className="mt-4"
      >
        <Form.Item
          label="Tên CV (thường là vị trí ứng tuyển)"
          name="cv_name"
          rules={[
            { required: true, message: 'Vui lòng nhập tên CV' }
          ]}
        >
          <Input
            placeholder="Nhập tên CV"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
          />
        </Form.Item>

        <div className="flex justify-end gap-3 mt-6">
          <Button 
            onClick={onClose}
            className="px-6 hover:bg-gray-100"
          >
            Hủy
          </Button>
          <Button 
            type="primary" 
            onClick={handleSubmit}
            className="px-6 bg-green-500 hover:bg-green-600 border-none"
          >
            Cập nhật
          </Button>
        </div>
      </Form>
    )
}
const onUpdate = async (id:string) => {
    try {
        const res = await CV_API.findById(id,userDetail?.access_token)
        if(res.data){
            setVisible(true)
            setCv(res.data)
            form.setFieldsValue({
                cv_name:res.data.cv_name
            })
        }
    } catch (error) {
        notification.error({
            message: "Thông báo",
            description: "Cập nhật thất bại",
        })
    }
}
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">CV đã tải lên HireDev</h2>
        <Button
          onClick={() => navigate("/upload-cv")}
          type="primary"
          className="!bg-primaryColor cursor-pointer"
        >
          Tải CV lên
        </Button>
      </div>
      <div className="flex gap-10 flex-wrap">
        {listCv.map((cv) => (
          <div key={cv._id} className="w-[300px] ">
            <CVCard handleShare={handleShare} cv={cv} userDetail={userDetail} onDelete={()=>onDelete(cv._id)} onUpdate={()=>onUpdate(cv._id)} />
          </div>
        ))}
      </div>
      <GeneralModal 
      
        visible={visible}
        title="Chỉnh sửa"
        renderBody={renderBody}
        onCancel={onClose}
        onOk={onClose}
      />
    </div>
  );
}
