import { Button, Empty, Image, Pagination, Select } from "antd";
import { useEffect, useState } from "react";
import arrowRight from "../../assets/icons/arrowRight.png";
import {
  AlignLeftOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import LocationSlider from "../../components/LocationSlider/LocationSlider";
import JobItem from "../../components/ui/JobItem";
import { JobApi } from "../../services/modules/jobServices";
import { CitiesAPI } from "../../services/modules/citiesServices";
import { useSelector } from "react-redux";
import { Meta } from "../../types";


const FeatureJobV2 = () => {
  const [jobs, setJobs] = useState([]);
  const [pageSize, setPageSize] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [meta, setMeta] = useState<Meta>({});
  const [cities,setCities]=useState(null)
  const userDetail = useSelector(state=>state.user)
  const handleGetAllJobs = async (params?:any) => {
    try {
      const res = await JobApi.getAllJobs({ pageSize: pageSize,current:currentPage,...params});
      if (res.data) {
        setJobs(res.data.items);
        setMeta(res.data.meta);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleGetCities=async()=>{
    try {
      const res = await CitiesAPI.getCitiesByCode('79',userDetail.access_token);
      if(res.data){
        setCities(res.data);
      }
    } catch (error) {
      console.error(error)
    }
  }


  useEffect(() => {
    handleGetCities();
    handleGetAllJobs();
  }, [pageSize, currentPage]);

  useEffect(()=>{
    if(selectedDistrict.trim()==='' && selectedCity.trim() !==''){
      handleGetAllJobs({city_id:selectedCity});
    }else{
      handleGetAllJobs({district_id:selectedDistrict})
    }
  },[selectedCity,selectedDistrict])

  const handleChangeSelectedLocation = (location: string) => {
    setSelectedCity(location); // Cập nhật state selectedCity
  };

  const onChangePanigation: PaginationProps["onChange"] = (page) => {
    setCurrentPage(page);
  };

  const handleChangeFilter = (value: string) => {
    console.log("Filter Value:", value);
  };

  return (
    <div className="px-5 md:px-primary h-auto mb-[150px] bg-[#f3f5f7] pb-[100px] pt-[10px]">
      <div className="flex justify-between items-center h-1/4" style={{ margin: "50px 0" }}>
        <h1 className="text-textBlack text-3xl font-medium">Việc làm tốt nhất</h1>
        <div className="relative flex items-center">
          <Button className="text-primary w-[130px] h-[40px]">
            Xem tất cả
            <ArrowRightOutlined className="font-bold" />
          </Button>
          <Image src={arrowRight} preview={false} className="z-100 absolute" />
        </div>
      </div>

      {/* filter */}
      <div className="mb-4">
        <div className="flex items-center justify-center">
          <div className="w-1/3">
            <Select
              size="large"
              suffixIcon={<AlignLeftOutlined />}
              defaultValue="0"
              style={{ width: 200 }}
              onChange={handleChangeFilter}
              options={[
                { value: "0", label: "Địa điểm" },
                { value: "1", label: "Mức lương" },
                { value: "2", label: "Kinh Nghiệm" },
                { value: "3", label: "Nghề nghiệp", disabled: true },
              ]}
            />
          </div>
          <div className="w-2.5/3">
            <LocationSlider
              dataCity={cities}
              selectedDistrict={selectedDistrict}
              setSelectedDistrict={setSelectedDistrict}
              setSelectedCity={setSelectedCity} 
              selectedCity={selectedCity}
              handleChangeSelectedLocation={handleChangeSelectedLocation}
            />
          </div>
        </div>
      </div>

      {jobs?.length>0 ?(
        <div className="grid grid-cols-3 gap-4">
        {jobs?.map((job, idx) => (
          <JobItem item={job} key={idx} />
        ))}
      </div>
      ):
      <div className="min-h-[300px] flex items-center justify-center">
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    </div>
      }

      <div className="flex justify-center mt-10">
        {jobs.length>0 && <Pagination
          current={currentPage}
          onChange={onChangePanigation}
          total={meta.total}
        />}
      </div>
    </div>
  );
};

export default FeatureJobV2;


