import { Button } from "antd"
import { CheckIcon } from "lucide-react"
interface ICompletedProps {
  handleCompleted:()=>void;
}
const Completed = ({handleCompleted}:ICompletedProps) => {

    return (
      <div className="bg-white flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-8">
          <CheckIcon className="w-10 h-10 text-blue-500" />
        </div>
        
        <h1 className="text-2xl font-semibold text-center mb-2">
          🎉 Xin chúc mừng, hồ sơ của bạn đã hoàn tất 100%!
        </h1>
        
        <p className="text-gray-500 text-center max-w-lg mb-8">
          Hãy nhấn "Bắt đầu" để khám phá thêm các cơ hội tuyển dụng và những thông tin hữu ích khác.
        </p>
        
        <div className="flex gap-4">
          <Button onClick={handleCompleted} size="large">
          Bắt đầu
          </Button>
        </div>
      </div>
    )
  }

  export default Completed;