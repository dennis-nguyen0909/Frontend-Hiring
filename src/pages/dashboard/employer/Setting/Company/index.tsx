import { DeleteOutlined, UploadOutlined } from "@ant-design/icons"
import { Editor } from "@tinymce/tinymce-react"
import { Button, Form, Image, Input, message, notification, Upload, UploadFile } from "antd"
import { useRef, useState } from "react"
import * as userServices from '../../../../../services/modules/userServices'
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { updateUser } from "../../../../../redux/slices/userSlices"
import { MediaApi } from "../../../../../services/modules/mediaServices"
const CompanyInfo = ()=>{
    const uploadRef=useRef(null)
    const [logoFile, setLogoFile] = useState<UploadFile | null>(null)
    const [bannerFile, setBannerFile] = useState<UploadFile | null>(null)
    const [form] = Form.useForm();
    const userDetail = useSelector(state=>state.user)
    const dispatch = useDispatch()
    const [isLoading,setIsLoading]=useState(false)
    const handleUploadFile =async (file:File,type:string)=>{
      setIsLoading(true)
        if (file) {
          try {
            const res = await MediaApi.postMedia(file,userDetail.access_token); 
            if (res?.data?.url) {
              let params;
              if (type === "banner"){
                params = {
                  id:userDetail?._id,
                  banner_company:res?.data?.url
                }
              }else{
                params = {
                  id:userDetail?._id,
                  avatar_company:res?.data?.url
                }
              }
              const responseUpdate = await userServices.updateUser(params);
              if(responseUpdate.data){
                notification.success({
                  message: "Notification",
                  description: "Cập nhật thành công"
                })
                dispatch(updateUser({ ...responseUpdate.data, access_token: userDetail.access_token }))
              }
            }
            
            setIsLoading(false)
          } catch (error) {
            console.error("Error handling file change:", error);
            setIsLoading(false)
          }
        }
    }
    const handleLogoChange = (info: any) => {
       handleUploadFile(info.file,"logo")
      }
    
      const handleBannerChange = (info: any) => {
        handleUploadFile(info.file,"banner")
      }

  const handleSave = async(values: any) => {
    const {company_name,description} = values
    const params={
      company_name,
      description:description?.level?.content,
      id:userDetail?._id
    }
    const res = await userServices.updateUser(params);
    if(res.data){
      notification.success({
        message: "Notification",
        description: "Cập nhật thành công"
      })
      dispatch(updateUser({ ...res.data, access_token: userDetail.access_token }))
    }
  }
  const handleReplaceLogo = () => {
    if (uploadRef.current) {
      uploadRef.current.click(); // Mở hộp thoại file khi nhấn nút Replace
    }
  };
  const handleDeleteAvatar = async()=>{
    try {
      const res = await userServices.updateUser({
        id:userDetail?._id,
        avatar_company:""
      })
      if(res.data){
        notification.success({
          message: "Notification",
          description: "Xóa avatar"
        })
        dispatch(updateUser({ ...res.data, access_token: userDetail.access_token }))
      }
    } catch (error) {
      
    }
  }
    return (
      <Form form={form} layout="vertical" onFinish={handleSave}>
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Logo & Banner Image</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="mb-2">Upload Logo</p>
          {userDetail?.avatar_company ? (
            <Image
            className="px-2 py-2"
              src={userDetail?.avatar_company}
              alt="Logo"
              width={200}
              height={200}
              preview={false}
            />
          ):(
            <Form.Item name="logo" >
            <Upload
            ref={uploadRef}
              listType="picture-card"
              className="w-full"
              showUploadList={false}
              onChange={handleLogoChange}
              beforeUpload={()=>false}
            >
              {logoFile ? (
                <img
                  src="/placeholder.svg?height=200&width=200"
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <UploadOutlined className="text-2xl" />
                  <div className="mt-2">Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
          )}
          {userDetail?.avatar_company && (
            <div className="flex items-center mt-2 gap-4">
              <span className="text-sm text-gray-500">3.5 MB</span>
              <div className="flex gap-2">
                <Button
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() =>  handleDeleteAvatar()}
                >
                  Remove
                </Button>
                <Button onClick={handleReplaceLogo} size="small" type="link">
        Replace
      </Button>
      <Input 
        type="file" 
        ref={uploadRef} 
        style={{ display: "none" }} 
        onChange={(e) => {
          // Xử lý sự kiện khi người dùng chọn file
          const file = e.target.files[0];
        }} 
      />
              </div>
            </div>
          )}
          </div>

          <div>
            <p className="mb-2">Banner Image</p>
          {userDetail?.banner_company ? (
            <Image
            className="px-2 py-2"
              src={userDetail?.banner_company}
              alt="Banner"
              preview={false}
              width={'60%'}
              height={'80%'}
            />
          ):(
            <Form.Item name="banner">
            <Upload
              listType="picture-card"
              className="w-full"
              showUploadList={false}
              onChange={handleBannerChange}
              beforeUpload={()=>false}
            >
              {userDetail?.banner_company ? (
                <img
                  src="/placeholder.svg?height=200&width=400"
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <UploadOutlined className="text-2xl" />
                  <div className="mt-2">Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
          )}
            {userDetail?.banner_company && (
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-500">4.3 MB</span>
                <div className="flex gap-2">
                  <Button
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => setBannerFile(null)}
                  >
                    Remove
                  </Button>
                  <Button size="small" type="link">
                    Replace
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <Form.Item
            label="Company Name"
            name="company_name"
            initialValue={userDetail?.company_name}
            rules={[{ required: true, message: 'Please enter company name' }]}
          >
            <Input placeholder="Enter company name" className="max-w-md" />
          </Form.Item>
        </div>

        <div>
          <Form.Item
            label="About Us"
            name="description"
            initialValue={userDetail?.description}
            rules={[{ required: true, message: 'Please write about us' }]}
          >
            <Editor
            // apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
            apiKey="px41kgaxf4w89e8p41q6zuhpup6ve0myw5lzxzlf0gc06zh3"
              value={userDetail?.description}
              onEditorChange={(content) => form.setFieldsValue({ description: content })}
              init={{
                height: 200,
                menubar: false,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code help wordcount',
                ],
                toolbar:
                  'bold italic underline strikethrough | link | alignleft aligncenter alignright alignjustify | bullist numlist | removeformat',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
              }}
            />
          </Form.Item>
        </div>

        <Form.Item>
        <Button htmlType="submit"  className="px-4 !bg-[#201527] !text-primaryColor !border-none !hover:text-white">
          Save & Next
        </Button>
        </Form.Item>
      </div>
    </Form>
    )
}


export default CompanyInfo