import { EnvironmentOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Image, Input } from "antd";
import introduceBackground from "../../assets/images/introduce.png";
import { jobItems, suggestion } from "../../helper";
import JobItems from "../../components/ui/JobItems";

const IntroduceV2 = () =>{

    return (
        <div className="h-auto bg-white px-4 md:px-primary pb-20 my-[150px]">
            <div className="flex w-full flex-col h-auto ">
            {/* Container */}
                <div className="w-full h-full flex items-center justify-center flex-col gap-4">
                    <h1 className="text-4xl text-black font-bold">Find Your Perfect Tech Job</h1>
                    <section className="text-center">Connect with top companies and build your career in tech</section>
                    {/* Input Search */}
                    <div
                            className="flex items-center w-[90%] p-2 rounded-lg bg-white"
                            style={{ border: "1px solid #ccc" }}
                            >
                            <div className="relative w-full rounded-l-lg">
                                <SearchOutlined className="absolute text-[24px] left-3 top-1/2 transform -translate-y-1/2 text-primaryColorH z-10" />
                                <Input
                                className="border-0 focus:border-0 focus:ring-0 rounded-l-lg text-lg"
                                size="large"
                                placeholder="Job title, keyword, company"
                                style={{ paddingLeft: "50px", height: "50px" }}
                                />
                            </div>
            
                            <div className="w-[1px] h-[40px] bg-gray-300 mx-2"></div>
            
                            <div className="relative w-full rounded-r-lg">
                                <EnvironmentOutlined className="absolute text-[24px] left-3 top-1/2 transform -translate-y-1/2 text-primaryColorH z-10" />
                                <Input
                                className="border-0 focus:border-0 focus:ring-0 rounded-r-lg text-lg"
                                size="large"
                                placeholder="Location, city"
                                style={{ paddingLeft: "50px", height: "50px" }}
                                />
                            </div>
            
                            <Button
                                size="large"
                                className="ml-4"
                                style={{ height: "50px", borderRadius: "8px",backgroundColor:'#d3464f',color:'white' }} // Larger button with height and border-radius
                            >
                                Find Job
                            </Button>
                    </div>
                </div>
            </div>
      </div>
    )
}

export default IntroduceV2;