import { Button, Image } from "antd";
import { popularCategorys } from "../../helper";
import arrowRight from '../../assets/icons/arrowRight.png'
const PopularCategory = ()=>{
    return (
        <div className="px-5 md:px-primary h-full border-b-2">
            <div className="flex justify-between items-center h-1/3" style={{margin:'50px 0'}}>
                <h1 className="text-textBlack text-3xl font-medium">
                Popular category
                </h1>
                <div className="relative flex items-center ">
                    <Button   className="text-primary w-[130px] h-[40px]">View all  </Button>
                    <Image  src={arrowRight} preview={false} className="z-100 absolute" />
                </div>
            </div>
            <div className="h-2/3 flex justify-between items-center flex-wrap gap-[30px] mb-10">
                {popularCategorys.map((item,idx)=>{
                    return (
                        <div className="w-full md:w-[300px] h-[116px] rounded-lg  flex flex-wrap items-center gap-5 hover:bg-white hover:shadow-custom  cursor-pointer">
                            <Image width={60} height={60} src={item.icon} preview={false} style={{margin:'0 20px'}}/>
                            <div className="flex flex-col" style={{margin:'0 20px'}}>
                                <p className="text-textBlack font-medium">{item.name}</p>
                                <p className="text-[14px] text-grayText">{item.position}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )

}


export default PopularCategory