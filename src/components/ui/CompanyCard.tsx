import { Button, Image } from 'antd'
import avtDefault from '../../assets/images/company/default.png'
import locationIcon from '../../assets/icons/location.png'

const CompanyCard = ({ item }) => {
  return (
    <div className="w-full md:w-[300px] h-[200px] rounded-xl flex flex-col justify-between p-4 " style={{ border: '1px solid #ccc' }}>
      <div className="flex items-center gap-[10px] mt-[20px] flex-1
      ">
        <Image className="rounded-lg" width={50} height={50} src={item?.avatar_company || avtDefault} preview={false} />
        <div className="flex flex-col gap-[5px]">
         <div className='flex   items-center gap-[20px] justify-between md:justify-start'>
            <p className="text-lg font-medium">{item?.company_name}</p>
            <p className="font-light text-[14px] bg-[#fbf0e8] text-[#de5057] px-2 rounded-full">Featured</p>
         </div>
          <div className="flex items-center gap-[5px]">
            <Image  width={16} height={16} src={locationIcon} preview={false} />
            <p className="text-sm text-[#a8a9bc] text-[12px]">{item?.city_id?.name || item?.address}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center ">
        <Button size='large' style={{backgroundColor:"#E7F0FA"}} className="text-primaryBlue border-none w-full  font-semibold rounded-sm">Open Position</Button>
      </div>
    </div>
  )
}

export default CompanyCard
