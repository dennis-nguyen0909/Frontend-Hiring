import { Button, Image } from "antd";
import React, { useEffect, useState } from "react";
import arrowRight from '../../assets/icons/arrowRight.png'
import * as jobServices from '../../services/jobServices'
import defaultImage from '../../assets/images/company/default.png'
import { ArrowRightOutlined, EnvironmentOutlined } from "@ant-design/icons";
import dollarIcon from '../../assets/icons/dollar.png'
import locationIcon from '../../assets/icons/location.png'
import bagIcon from '../../assets/icons/bagFeatured.png'
import bookmark from '../../assets/images/company/bookmark.png'
const FeatureJob = () => {
    const [jobs,setJobs]=useState([])

    const handleGetAllJobs = async()=>{
        try {
            const res = await jobServices.getAllJobs({});
            if(res.data){
                setJobs(res.data.items)
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(()=>{
        handleGetAllJobs()
    },[])
    console.log("jobs",jobs)
    return (
        <div className="px-primary h-auto  h-screen">
            <div className="flex justify-between items-center h-1/3">
                <h1 className="text-textBlack text-3xl font-medium">
                Featured job
                </h1>
                <div className="relative flex items-center ">
                    <Button   className="text-primary w-[130px] h-[40px]">View all  </Button>
                    <Image  src={arrowRight} preview={false} className="z-100 absolute" />
                </div>
            </div>
            <div className="h-2/3 flex flex-col gap-7">
                    {
                        jobs?.map((job,idx)=>{
                            return (
                                <div className="flex   justify-between items-center  gap-5 rounded-lg" style={{padding:'20px 20px',border:'1px solid #ccc'}}>
                                    <div className="flex">
                                        <Image width={50} height={50} src={job?.image  || defaultImage}  preview={false}/>
                                        <div className="flex flex-col ml-[20px] gap-[10px]">
                                            <p>{job?.title}</p>
                                            <div className="flex gap-2">
                                                {job?.location && <p className="flex items-center gap-1 text-[14px]"><Image width={20} height={20} src={locationIcon} preview={false} />{job?.location}</p>}
                                                <p className="flex items-center gap-1 text-[14px]"><Image width={20} height={20} src={dollarIcon} preview={false} />{job?.salary_range.min} - {job?.salary_range.max}</p>
                                                <p className="flex items-center gap-1 text-[14px]"><Image width={20} height={20} src={bagIcon} preview={false} />{job?.benefit[0]}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center">
    <Image src={bookmark} preview={false} />
    <Button 
        size="large" 
        className="!border-none !text-[#0A65CC] !font-medium !bg-[#EDEFF5] hover:!bg-[#0A65CC] hover:!text-white !cursor-pointer"
    >
        Apply Now <ArrowRightOutlined className="font-bold" />
    </Button>
</div>

                                </div>
                            )
                        })
                    }
            </div>
        </div>
    );
};




export default FeatureJob;