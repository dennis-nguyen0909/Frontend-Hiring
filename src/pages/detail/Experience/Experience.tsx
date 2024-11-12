import { useState, useEffect, useRef } from "react";
import {
  Form,
  Input,
  Checkbox,
  Button,
  notification,
  Card,
  Typography,
  Select,
  Image,
} from "antd";
import { EditOutlined, LinkOutlined, PictureOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import GeneralModal from "../../../components/ui/GeneralModal/GeneralModal";
import { BookOpen, Briefcase, Edit, Pencil } from "lucide-react";
import { ExperienceApi } from "../../../services/modules/experienceServices";
import { MediaApi } from "../../../services/modules/mediaServices";
import LoadingComponent from "../../../components/Loading/LoadingComponent";
const { TextArea } = Input;

interface WorkExperienceProps {
    company: string
    position: string
    start_date: string
    end_date: string | null
    currently_working: boolean
    description: string
    image?: string
    id: string
  }

const ExperienceComponent = () => {
    const [currentlyWorking, setCurrentlyWorking] = useState(false)
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `Tháng ${i + 1}`
  }))

  const years = Array.from({ length: 30 }, (_, i) => ({
    value: 2024 - i,
    label: `${2024 - i}`
  }))
  const userDetail = useSelector((state) => state.user);
  const[isLoading,setIsLoading]=useState<boolean>(false);
  const inputRef = useRef(null);
  const dispatch =useDispatch()
  const [form] = Form.useForm();
  const user = useSelector((state: any) => state.user);
  const [listWorkExperiences, setListWorkExperiences] = useState([]);
  const [selectedId,setSelectedId]=useState<string>('')
  const [workExperience,setWorkExperience]=useState<WorkExperienceProps | null >(null);
  const [selectedFile,setSelectedFile]=useState<string>('')
  const [visibleModal, setVisibleModal] =
    useState<boolean>(false);
  const [actionType, setActionType] = useState<string>("create");
  const handleOpenExperience = (type: string, id?: string) => {
    setVisibleModal(true);
    setActionType(type);
    setSelectedId(id);
  };
  const closeModal = () => {
    setVisibleModal(false);
    setWorkExperience(null);
    setSelectedId('');
    form.resetFields();
    setActionType("")
  };


  const handleDeleteManyExperience = async (ids:Array<string>,accessToken:string)=>{
    try {
        const res = await ExperienceApi.deleteManyExperience(ids,accessToken);
        return res;
    } catch (error) {
        notification.error({
          message:'Notification',
          description:error.message
        })
    }
  }
  const handleCreateWorkExperience = async (params:any,accessToken:string) => {
    try {
        const res = await ExperienceApi.postExperience(params, accessToken);
        return res;
    } catch (error) {
        notification.error({
            message: "Notification",
            description: error.message,
        })
    }
  };

  const onFinish = async (values: any) => {
    const {currently_working, company, position, description} = values;
    
    // Sử dụng moment.utc để đảm bảo thời gian không bị thay đổi do múi giờ
    const start_date = moment.utc(`${values.startYear}-${values.startMonth}-01`, "YYYY-MM-DD").toDate();
    const end_date = !currently_working
      ? moment.utc(`${values.endYear}-${values.endMonth}-01`, "YYYY-MM-DD").toDate()
      : null;
  
    const params = {
      company,
      position,
      user_id: user._id,
      start_date: start_date,
      end_date: end_date,
      currently_working,
      description
    };
    
    const res = await handleCreateWorkExperience(params, userDetail.access_token);
    if(res.data){
      handleGetWorkExperiencesByUser();
      notification.success({
        message: "Notification",
        description: "Thêm kinh nghiệm thành công!",
      })
      closeModal();
    }else{
      notification.error({
        message: "Notification",
        description: res.message
      })
      closeModal();
    }
  }

  useEffect(()=>{
    handleGetWorkExperiencesByUser();
  },[])
  const handleGetWorkExperiencesByUser = async () => {
    try {
            const res = await ExperienceApi.getExperienceByUserId(userDetail?.access_token);
            if(res.data){
                setListWorkExperiences(res.data);
            }
    } catch (error) {
        notification.error({
            message: "Notification",
            description: error.message,
        })
    }
  }
  const handleGetDetailExperience = async(selectedId:string)=>{
    try {
      const res = await ExperienceApi.getExperienceById(selectedId, userDetail.access_token);
      if(res.data){
        setWorkExperience(res.data)
      }
    } catch (error) {
      notification.error({
        message: "Notification",
        description: error.message
      })
    }
  }

  
  useEffect(()=>{
    if(workExperience){
      const startDate = new Date(workExperience.start_date);
      const endDate = new Date(workExperience.end_date);
    const startMonth = startDate.getMonth() + 1; 
    const startYear = startDate.getFullYear();
      let endMonth, endYear;
      if (!workExperience.currently_working) {
        endMonth = endDate.getMonth() + 1;
        endYear = endDate.getFullYear();
      }
      form.setFieldsValue({
        company: workExperience.company,
        position: workExperience.position,
        startMonth: startMonth,
        startYear: startYear,
        end_date: workExperience.end_date,
        currently_working: workExperience.currently_working,
        description: workExperience.description,
        image: workExperience.image,
        endYear,
        endMonth
      });
    }
  },[workExperience])

  useEffect(()=>{
      if(selectedId){
        handleGetDetailExperience(selectedId);
      }
  },[selectedId])

  const handleDeleteExperience = async ()=>{
    const res = await handleDeleteManyExperience([selectedId],userDetail.access_token);
    if(res.data){
     await handleGetWorkExperiencesByUser()
      notification.success({
        message:'Notification',
        description:'Xóa thành công'
      })
      closeModal();
    }else{
      notification.error({
        message:'Notification',
        description:'Xóa thất bại '
      })
      closeModal();
    }
  }

  const handleUpdateExperience = async ()=>{
    let data = form.getFieldsValue();
    if(selectedFile){
      data = {
        ...data,
        image_url:selectedFile
      };
    }
    const res = await ExperienceApi.updateExperience(selectedId,data,userDetail?.access_token);
    if(res.data){
      await handleGetWorkExperiencesByUser();
      notification.success({
        message:'Notification',
        description:'Cập nhật thành công'
      })
      closeModal();
    }else{
      notification.error({
        message:'Notification',
        description:'Cập nhật thất bại'
      })
      closeModal();
    }
  }
  const handleOnClickImage = ()=>{
    inputRef.current.click();
  }

  const handleChangeFile =async (e)=>{
    setIsLoading(true)
      // Chuyển sang async để chờ kết quả upload
      const file = e.target.files[0];
      if (file) {
        try {
          const res = await MediaApi.postMedia(file,userDetail.access_token); 
          if (res?.data?.url) {
            setSelectedFile(res?.data?.url);
          }
          setIsLoading(false)
        } catch (error) {
          console.error("Error handling file change:", error);
          setIsLoading(false)
        }
      }
  }

  const renderBody = () => {
    return (
      <LoadingComponent isLoading={isLoading}>
        <Form onFinish={onFinish} form={form}  layout="vertical">
          <Form.Item
            label="Công ty"
            name="company"
            required
            rules={[{ required: true, message: 'Vui lòng nhập tên công ty' }]}
          >
            <Input placeholder="Công ty" />
          </Form.Item>
  
          <Form.Item
            label="Chức vụ"
            name="position"
            required
            rules={[{ required: true, message: 'Vui lòng nhập chức vụ' }]}
          >
            <Input placeholder="Nhân viên văn phòng" />
          </Form.Item>
  
          <Form.Item name="currently_working" valuePropName="checked">
            <Checkbox
              checked={currentlyWorking}
              onChange={(e) => setCurrentlyWorking(e.target.checked)}
            >
              Tôi đang làm việc ở đây
            </Checkbox>
          </Form.Item>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Typography.Text>Bắt đầu</Typography.Text>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Form.Item name="startMonth">
                  <Select placeholder="Chọn tháng" options={months} />
                </Form.Item>
                <Form.Item name="startYear">
                  <Select placeholder="Chọn năm" options={years} />
                </Form.Item>
              </div>
            </div>
  
            <div>
              <Typography.Text>Kết thúc</Typography.Text>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Form.Item name="endMonth">
                  <Select 
                    placeholder="Chọn tháng" 
                    options={months}
                    disabled={workExperience?.currently_working || currentlyWorking}
                  />
                </Form.Item>
                <Form.Item name="endYear">
                  <Select 
                    placeholder="Chọn năm" 
                    options={years}
                    disabled={workExperience?.currently_working ||currentlyWorking}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
  
          <Form.Item
            label="Mô tả chi tiết"
            name="description"
          >
            <TextArea
              placeholder="Mô tả chi tiết công việc, những gì đạt được trong quá trình làm việc"
              rows={4}
            />
          </Form.Item>
  
          <Typography.Text italic className="block mb-4">
            Thêm liên kết hoặc tải lên hình ảnh về kinh nghiệm của bạn
          </Typography.Text>
  
          <div className="flex gap-4 mb-6">
            <Button onClick={handleOnClickImage} icon={<PictureOutlined />}>Tải ảnh</Button>
            <Button icon={<LinkOutlined />}>Tải liên kết</Button>
          </div>
  
          <Form.Item>
            {actionType === "create" ? (
              <Button type="primary" htmlType="submit" className="w-full bg-green-500 hover:bg-green-600">
              Thêm 
            </Button>
            ):(
              <div className="flex items-center justify-between gap-4">
              <Button
              className="!bg-primaryColorH text-white"
                danger
                onClick={()=>handleDeleteExperience()}
                style={{
                  width: "100%",
                }}
              >
                Xóa
              </Button>
              <Button
                type="primary"
                onClick={()=>handleUpdateExperience()}
                style={{
                  width: "100%",
                  backgroundColor: "black",
                  borderColor: "#4CAF50",
                }}
              >
                Cập nhật
              </Button>
            </div>
            )}
          </Form.Item>
          <input ref={inputRef} onChange={handleChangeFile}  type="file"  style={{display:'none'}}/>
        </Form>
      </LoadingComponent>
    );
  };
   const  WorkExperience =({
    company,
    position,
    start_date,
    end_date,
    image,
    id
  }: WorkExperienceProps) =>{
    const formatDate = (date: string | null) => {
      if (!date) return 'Hiện tại'
      return moment(date).format('MM/YYYY')
    }
    console.log("company",company)
    console.log("company",position)
  
    return (
      <Card 
      className="mt-3"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <Briefcase className="text-xl text-gray-600" />
          </div>
          
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <p style={{ margin: 0 }}>{company}</p>
                <p className="block text-gray-600 text-[10px]">{position}</p>
                <p className="block text-gray-500 text-[10px]">
                  {formatDate(start_date)} - {formatDate(end_date)}
                </p>
              </div>
              <Pencil className="text-primaryColor cursor-pointer" onClick={() => handleOpenExperience("edit",id)} />
            </div>

            {image && (
              <div className="mt-4 border rounded-lg p-2 max-w-[200px]">
                <Image
                  src={image}
                  alt="Work experience attachment"
                  className="rounded"
                />
              </div>
            )}
          </div>
        </div>
      </Card>
    )
  }



  return (
    <div>
      {listWorkExperiences.length > 0 ? (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-[#d3464f]" />
              <h2 className="font-semibold">Kinh nghiệm</h2>
            </div>
            <Button onClick={() => handleOpenExperience("create")}>
              Thêm mục
            </Button>
          </div>
          {/* <div className="flex items-center justify-start"> */}
          <div>
            {listWorkExperiences?.map((item: any, index: number) => (
              <WorkExperience
                id={item._id}
                key={index}
                company={item.company}
                position={item.position}
                start_date={item.start_date}
                end_date={item.end_date}
                currently_working={item.currently_working}
                image={item.image_url}
              />
            ))}
            {console.log("listWorkExperiences",listWorkExperiences)}
          </div>
          {/* </div> */}
        </Card>
      ) : (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-[#d3464f]" />
              <h2 className="font-semibold">Kinh nghiệm</h2>
            </div>
            <Button onClick={() => handleOpenExperience("create")}>Thêm mục</Button>
          </div>
          <p className="text-sm text-gray-500">
            Nếu bạn đã có CV trên DevHire, bấm Cập nhật để hệ thống tự động điền
            phần này theo CV.
          </p>
        </Card>
      )}
      <GeneralModal
        visible={visibleModal}
        onCancel={closeModal}
        onOk={closeModal}
        renderBody={renderBody}
        title={
          actionType === "create"
            ? "Thêm Kinh nghiệm"
            : actionType === "edit"
            ? "Chỉnh sửa Kinh nghiệm"
            : "Xóa Kinh nghiệm"
        }
      />
    </div>
  );
};

export default ExperienceComponent;
