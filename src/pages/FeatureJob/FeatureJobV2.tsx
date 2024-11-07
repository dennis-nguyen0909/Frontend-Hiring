import { Button, Image, Pagination, Select } from "antd";
import React, { useEffect, useState } from "react";
import arrowRight from "../../assets/icons/arrowRight.png";
import * as jobServices from "../../services/modules/jobServices";
import defaultImage from "../../assets/images/company/default.png";
import { AlignLeftOutlined, ArrowRightOutlined, EnvironmentOutlined } from "@ant-design/icons";
import JobCard from "../../components/ui/JobCard";
import LocationSlider from "../../components/LocationSlider/LocationSlider";
import JobItem from "../../components/ui/JobItem";
const FeatureJobV2 = () => {
  const [jobs, setJobs] = useState([]);
  const [pageSize,setPageSize]=useState(12)
  const [currentPage,setCurrentPage]=useState(1)
  const [meta,setMeta]=useState({})
const [isHover,setIsHover]=useState(false)
  const handleGetAllJobs = async () => {
    try {
      const res = await jobServices.getAllJobs({pageSize:pageSize});
      if (res.data) {
        setJobs(res.data.items);
        setMeta(res.data.meta)
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetAllJobs();
  }, []);

  const onChangePanigation: PaginationProps['onChange'] = (page) => {
    console.log(page);
    setCurrentPage(page);
    
  };

  const handleChange = ()=>{

  } 
  return (
    <div className="px-5 md:px-primary h-auto mb-[150px] bg-[#f3f5f7] pb-[100px] pt-[10px]">
      <div className="flex justify-between items-center h-1/4" style={{margin:'50px 0'}}>
        <h1 className="text-textBlack text-3xl font-medium">Featured job</h1>
        <div className="relative flex items-center ">
          <Button className="text-primary w-[130px] h-[40px]">View all <ArrowRightOutlined className="font-bold" /> </Button>
          <Image src={arrowRight} preview={false} className="z-100 absolute" />
        </div>
      </div>
      {/* filter */}
      <div className="mb-4">
          <div className="flex items-center justify-center ">
           <div className="w-1/3"> 
            <Select
              size="large"
              suffixIcon={<AlignLeftOutlined />}
                defaultValue="0"
                style={{ width: 200 }}
                onChange={handleChange}
                options={[
                  { value: '0', label: 'Địa điểm' },
                  { value: '1', label: 'Mức lương' },
                  { value: '2', label: 'Kinh Nghiệm' },
                  { value: '3', label: 'Nghề nghiệp', disabled: true },
                ]}
              />
           </div>
            <div className="w-2.5/3">  
            <LocationSlider />
            </div>
          </div>
          <div>

          </div>
      </div>
      {/* <div className="h-2/3 flex flex-col gap-7 ">
        {jobs?.map((job, idx) => {
          return (
          <JobCard job={job} key={idx}/>
          );
        })}
      </div> */}

      <div className="grid grid-cols-3 gap-4" >
      {jobs?.map((job, idx) => {
          return (
          <JobItem item={job} key={idx}/>
          );
        })}
      </div>

      <div className="panigation">
       <Pagination current={currentPage} onChange={onChangePanigation} total={meta.total} />
      </div>
    </div>
  );
};

export default FeatureJobV2;
