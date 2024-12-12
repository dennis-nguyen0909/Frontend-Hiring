import { Button, Image } from 'antd'
import avtDefault from '../../assets/images/company/default.png'
import locationIcon from '../../assets/icons/location.png'
import { useNavigate } from 'react-router-dom'

const CompanyCard = ({ item }) => {
  const navigate = useNavigate()
  const handleNavigate = () => {
    navigate(`/employer-detail/${item?._id}`)
  }

  return (
    <div className="w-full md:w-[400px] h-[120px] rounded-lg flex flex-col justify-between p-3" style={{ border: '1px solid #ccc' }}>
      <div className="flex items-center gap-[8px] flex-1">
        <Image className="rounded-md" width={35} height={35} src={item?.avatar_company || avtDefault} preview={false} />
        <div className="flex flex-col gap-[2px]">
          <div className='flex items-center gap-[15px] justify-between md:justify-start'>
            <p className="text-sm font-medium">{item?.company_name}</p>
            <p className="font-light text-[10px] bg-[#fbf0e8] text-[#de5057] px-2 py-[1px] rounded-full">Featured</p>
          </div>
          <div className="flex items-center gap-[4px]">
            <Image width={12} height={12} src={locationIcon} preview={false} />
            <p className="text-xs text-[#a8a9bc]">{item?.city_id?.name || item?.address}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-1">
        <Button onClick={handleNavigate} size="small" style={{ backgroundColor: "#E7F0FA" }} className="text-primaryBlue w-full font-semibold !rounded-lg border-none">
          Open Position
        </Button>
      </div>
    </div>
  )
}

export default CompanyCard
