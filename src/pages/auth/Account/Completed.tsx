import { ArrowRightOutlined } from "@ant-design/icons";
import { Button } from "antd"
import { CheckIcon } from "lucide-react"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Completed = () => {
  const userDetail = useSelector(state=>state.user)
  const navigate = useNavigate()
    return (
      <div className="bg-white min-h-[calc(100vh-theme(spacing.32))] flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-8">
          <CheckIcon className="w-10 h-10 text-blue-500" />
        </div>
        
        <h1 className="text-2xl font-semibold text-center mb-2">
          🎉 Congratulations, Your profile is 100% complete!
        </h1>
        
        <p className="text-gray-500 text-center max-w-lg mb-8">
          Donec hendrerit, ante mattis pellentesque eleifend, tortor urna
          malesuada ante, eget aliquam nulla augue hendrerit ligula. Nunc
          mauris arcu, mattis sed sem vitae.
        </p>
        
        <div className="flex gap-4">
          <Button onClick={()=>navigate(`/dashboard/${userDetail?._id}`)} size="large">
            View Dashboard
          </Button>
          <Button onClick={()=>navigate(`/dashboard/${userDetail?._id}`)} type="primary" size="large" className="flex items-center">
            Post Job
            <ArrowRightOutlined className="ml-2" />
          </Button>
        </div>
      </div>
    )
  }

  export default Completed;