import { Button, Image } from "antd"
import { ArrowRightOutlined } from "@ant-design/icons"
import notfound from '../../assets/images/notfound.png'
import { useNavigate } from "react-router-dom"

export default function NotFound() {
  const navigate = useNavigate()

  const handleGoBack = () => {
    if (window.history.length > 2) {
      navigate(-1) 
    } else {
      navigate("/")  
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-start space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Oops! Page not found</h1>
          <p className="text-gray-600 text-lg max-w-md">
            Something went wrong. It looks like the link is broken or the page is removed.
          </p>
          <div className="flex gap-4 mt-4">
            <Button onClick={()=>navigate('/')} type="primary" size="large" className="flex items-center">
              Home
              <ArrowRightOutlined className="ml-1" />
            </Button>
            <Button size="large" onClick={handleGoBack}>
              Go Back
            </Button>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <Image
          preview={false}
            src={notfound}
            alt="404 Illustration"
            width={400}
            height={400}
            className="max-w-full h-auto"
          />
        </div>
      </div>
    </div>
  )
}
