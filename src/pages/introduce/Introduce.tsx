import { EnvironmentOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Image, Input } from "antd";
import introduceBackground from "../../assets/images/introduce.png";
import { jobItems, suggestion } from "../../helper";
import JobItems from "../../components/ui/JobItems";

const Introduce = () =>{

    return (
        <div className="h-auto bg-[#f7f7f7] px-4 md:px-primary pb-20">
            <div className="flex w-full flex-col h-auto ">
            {/* Container */}
                <div className="flex md:flex-row flex-col w-full mt-10">
                    {/* Left */}
                    <div className=" md:w-1/2 md:gap-12 h-auto flex flex-col justify-center items-start gap-[50px]">
                    <div>
                        <h1 className=" md:text-[45px] text-[39px] md:text-left text-center font-semibold whitespace-pre-wrap" >
                        Find a job that suits your interest & skills.
                        </h1>
                        <p className="text-title text-sm mt-5  md:text-left text-center">
                        Aliquam vitae turpis in diam convallis finibus in at risus.
                        Nullam
                        <br /> in scelerisque leo, eget sollicitudin velit bestibulum.
                        </p>
                    </div>
                    <div>
                        <div
                        className="flex items-center w-[95%] p-2 rounded-lg bg-white"
                        style={{ border: "1px solid #ccc" }}
                        >
                        <div className="relative w-full rounded-l-lg">
                            <SearchOutlined className="absolute text-[24px] left-3 top-1/2 transform -translate-y-1/2 text-blue-500 z-10" />
                            <Input
                            className="border-0 focus:border-0 focus:ring-0 rounded-l-lg text-lg"
                            size="large"
                            placeholder="Job title, keyword, company"
                            style={{ paddingLeft: "50px", height: "50px" }}
                            />
                        </div>
        
                        <div className="w-[1px] h-[40px] bg-gray-300 mx-2"></div>
        
                        <div className="relative w-full rounded-r-lg">
                            <EnvironmentOutlined className="absolute text-[24px] left-3 top-1/2 transform -translate-y-1/2 text-blue-500 z-10" />
                            <Input
                            className="border-0 focus:border-0 focus:ring-0 rounded-r-lg text-lg"
                            size="large"
                            placeholder="Location, city"
                            style={{ paddingLeft: "50px", height: "50px" }}
                            />
                        </div>
        
                        <Button
                            type="primary"
                            size="large"
                            className="ml-4"
                            style={{ height: "50px", borderRadius: "8px" }} // Larger button with height and border-radius
                        >
                            Find Job
                        </Button>
                        </div>
                        <div className="mt-5">
                        <p className="flex gap-2 text-[#9199A3] flex-wrap justify-center items-center md:justify-start md:items-start">
                            Suggestion:{" "}
                            {suggestion
                            .map((suggest, index) => (
                                <span key={index} style={{ color: suggest.color }}>
                                {suggest.name}
                                </span>
                            ))
                            .reduce((prev, curr) => [prev, ",", curr])}
                        </p>
                        </div>
                    </div>
                    </div>
                    {/* Right */}
                    <div className="w-2/2 md:w-1/2 h-[450px] flex items-center justify-center">
                    <Image src={introduceBackground} preview={false} />
                    </div>
                    
                </div>
                <div className="flex items-center gap-5 md:justify-between mt-10 flex-wrap justify-center ">
                {jobItems.map((item, idx) => {
                return (
                    <JobItems key={idx} count={item.count} label={item.name} image={item.image} />
                );
                })}
            </div>
            </div>
      </div>
    )
}

export default Introduce;