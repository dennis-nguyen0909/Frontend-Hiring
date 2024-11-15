import { DeleteOutlined, UploadOutlined } from "@ant-design/icons"
import { Editor } from "@tinymce/tinymce-react"
import { Button, Input, message, Upload, UploadFile } from "antd"
import { useState } from "react"

const CompanyInfo = ()=>{
    const [logoFile, setLogoFile] = useState<UploadFile | null>(null)
    const [bannerFile, setBannerFile] = useState<UploadFile | null>(null)
    const [companyName, setCompanyName] = useState('')
    const [aboutUs, setAboutUs] = useState('')
    const handleLogoChange = (info: any) => {
        if (info.file.status === 'done') {
          setLogoFile(info.file)
          message.success(`${info.file.name} file uploaded successfully`)
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`)
        }
      }
    
      const handleBannerChange = (info: any) => {
        if (info.file.status === 'done') {
          setBannerFile(info.file)
          message.success(`${info.file.name} file uploaded successfully`)
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`)
        }
      }

  const handleSave = () => {
    message.success('Changes saved successfully!')
  }
    return (
        <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Logo & Banner Image</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="mb-2">Upload Logo</p>
            <Upload
              listType="picture-card"
              className="w-full"
              showUploadList={false}
              onChange={handleLogoChange}
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
            {logoFile && (
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-500">3.5 MB</span>
                <div className="flex gap-2">
                  <Button
                    size="small" 
                    icon={<DeleteOutlined />}
                    onClick={() => setLogoFile(null)}
                  >
                    Remove
                  </Button>
                  <Button size="small" type="link">Replace</Button>
                </div>
              </div>
            )}
          </div>

          <div>
            <p className="mb-2">Banner Image</p>
            <Upload
              listType="picture-card"
              className="w-full"
              showUploadList={false}
              onChange={handleBannerChange}
            >
              {bannerFile ? (
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
            {bannerFile && (
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
                  <Button size="small" type="link">Replace</Button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Company name</label>
          <Input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter company name"
            className="max-w-md"
          />
        </div>
        <div>
          <label className="block mb-2">About us</label>
          <Editor
            value={aboutUs}
            onEditorChange={(content) => setAboutUs(content)}
            init={{
              height: 200,
              menubar: false,
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount'
              ],
              toolbar:
                'bold italic underline strikethrough | link | alignleft aligncenter alignright alignjustify | bullist numlist | removeformat',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
          />
        </div>
        <Button 
            type="primary" 
            onClick={handleSave}
            className="bg-blue-500"
          >
            Save Changes
          </Button>
      </div>
    )
}


export default CompanyInfo