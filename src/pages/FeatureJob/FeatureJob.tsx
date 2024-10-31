import { Button, Image } from "antd";
import React, { useEffect, useState } from "react";
import arrowRight from "../../assets/icons/arrowRight.png";
import * as jobServices from "../../services/modules/jobServices";
import defaultImage from "../../assets/images/company/default.png";
import { ArrowRightOutlined, EnvironmentOutlined } from "@ant-design/icons";
import JobCard from "../../components/ui/JobCard";
const FeatureJob = () => {
  const [jobs, setJobs] = useState([]);
  const [pageSize,setPageSize]=useState(6)
const [isHover,setIsHover]=useState(false)
  const handleGetAllJobs = async () => {
    try {
      const res = await jobServices.getAllJobs({pageSize:pageSize});
      if (res.data) {
        setJobs(res.data.items);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetAllJobs();
  }, []);

  
  return (
    <div className="px-5 md:px-primary h-auto mb-[150px]">
      <div className="flex justify-between items-center h-1/4" style={{margin:'50px 0'}}>
        <h1 className="text-textBlack text-3xl font-medium">Featured job</h1>
        <div className="relative flex items-center ">
          <Button className="text-primary w-[130px] h-[40px]">View all <ArrowRightOutlined className="font-bold" /> </Button>
          <Image src={arrowRight} preview={false} className="z-100 absolute" />
        </div>
      </div>
      <div className="h-2/3 flex flex-col gap-7">
        {jobs?.map((job, idx) => {
          return (
          <JobCard job={job} key={idx}/>
          );
        })}
      </div>
    </div>
  );
};

export default FeatureJob;
