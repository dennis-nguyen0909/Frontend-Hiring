import { EnvironmentOutlined, SearchOutlined } from "@ant-design/icons";
import { AutoComplete, Button, Input } from "antd";
import { useEffect, useState } from "react";
import { JobApi } from "../../services/modules/jobServices";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";

const IntroduceV2 = () => {
  const [jobSuggestions, setJobSuggestions] = useState([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const userDetail = useSelector((state) => state.user);
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const handleJobSearch = async (value) => {
    const params = {
      query: {
        keyword: value,
      },
      current: 1,
      pageSize: 10,
    };

    try {
      const res = await JobApi.getAllJobsQuery(params, userDetail?._id); 
      const jobData = res?.data?.items || [];
      setJobSuggestions(jobData.map((job) => job.title));
      console.log("res", res);
    } catch (error) {
      console.error("Error fetching jobs: ", error);
    }
  };

  // Gọi handleJobSearch mỗi khi debouncedSearchValue thay đổi
  useEffect(() => {
    if (debouncedSearchValue) {
      handleJobSearch(debouncedSearchValue);
    } else {
      setJobSuggestions([]);
    }
  }, [debouncedSearchValue]);

  // Hàm tìm kiếm gợi ý địa điểm
  const handleLocationSearch = (value) => {
    const locationData = ['New York', 'San Francisco', 'Los Angeles', 'Hanoi', 'Ho Chi Minh'];
    setLocationSuggestions(locationData.filter((item) => item.toLowerCase().includes(value.toLowerCase())));
  };

  return (
    <div className="h-auto bg-white px-4 md:px-primary pb-20 my-[150px]">
      <div className="flex w-full flex-col h-auto">
        {/* Container */}
        <div className="w-full h-full flex items-center justify-center flex-col gap-4">
          <h1 className="text-4xl text-black font-bold">Find Your Perfect Tech Job</h1>
          <section className="text-center">
            Connect with top companies and build your career in tech
          </section>
          {/* Input Search */}
          <div
            className="flex items-center w-[90%] p-2 rounded-lg bg-white"
            style={{ border: "1px solid #ccc" }}
          >
            <div className="relative w-full rounded-l-lg">
              <SearchOutlined className="absolute text-[24px] left-3 top-1/2 transform -translate-y-1/2 text-primaryColorH z-10" />
              <AutoComplete
                className="border-0 focus:border-0 focus:ring-0 rounded-l-lg text-lg w-[80%]"
                size="large"
                placeholder="Job title, keyword, company"
                style={{ marginLeft: "50px" }}
                onSearch={(value) => setSearchValue(value)}
                value={searchValue}
                onChange={(value) => setSearchValue(value)}
                options={jobSuggestions.map((item) => ({ value: item }))} 
              >
                <Input className="border-0 focus:border-0 focus:ring-0 rounded-l-lg text-lg" />
              </AutoComplete>
            </div>

            <div className="w-[1px] h-[40px] bg-gray-300 mx-2"></div>

            <div className="relative w-full rounded-r-lg">
              <EnvironmentOutlined className="absolute text-[24px] left-3 top-1/2 transform -translate-y-1/2 text-primaryColorH z-10" />
              <AutoComplete
                className="border-0 focus:border-0 focus:ring-0 rounded-r-lg text-lg w-[80%]"
                size="large"
                placeholder="Location, city"
                style={{ marginLeft: "50px" }}
                onSearch={handleLocationSearch}
                options={locationSuggestions.map((item) => ({ value: item }))}
              >
                <Input className="border-0 focus:border-0 focus:ring-0 rounded-r-lg text-lg" />
              </AutoComplete>
            </div>

            <Button
              size="large"
              className="ml-4"
              style={{
                height: "50px",
                borderRadius: "8px",
                backgroundColor: '#d3464f',
                color: 'white',
              }} 
            >
              Find Job
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroduceV2;
