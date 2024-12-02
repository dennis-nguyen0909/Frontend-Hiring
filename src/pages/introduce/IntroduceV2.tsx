import { SearchOutlined } from "@ant-design/icons";
import { Button, Select, Spin } from "antd";
import { useEffect, useRef, useState } from "react";
import { JobApi } from "../../services/modules/jobServices";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

const IntroduceV2 = () => {
  const [jobSuggestions, setJobSuggestions] = useState([]);
  const [searchValue, setSearchValue] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Tạo thêm biến cho trạng thái tải thêm
  const userDetail = useSelector((state) => state.user);
  const debouncedSearchValue = useDebounce(searchValue, 500); // Debounce cho search value
  const navigate = useNavigate();

  const handleJobSearch = async (value, page = 1) => {
    const params = {
      query: {
        keyword: value,
      },
      current: page,
      pageSize: 10,
    };

    if (page === 1) {
      setIsLoading(true); 
    } else {
      setIsLoadingMore(true); // Bắt đầu loading khi cuộn xuống
    }

    try {
      const res = await JobApi.getAllJobsQuery(params, userDetail?._id);
      if (page === 1) {
        setJobSuggestions(res.data.items); 
      } else {
        setJobSuggestions((prevJobs) => [...prevJobs, ...res.data.items]); 
      }
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching jobs: ", error);
    } finally {
      setIsLoading(false); 
      setIsLoadingMore(false); // Kết thúc loading khi đã tải xong dữ liệu
    }
  };

  useEffect(() => {
    if (debouncedSearchValue) {
      handleJobSearch(debouncedSearchValue, 1);
    } else {
      setJobSuggestions([]); 
      handleJobSearch({}, 1);
    }
  }, [debouncedSearchValue]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (dropdownRef.current) {
      dropdownRef.current.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (dropdownRef.current) {
        dropdownRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [dropdownRef, isLoading, isLoadingMore, currentPage]);
  const handleSearch = (value) => {
    setSearchValue(value);
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isBottom = scrollHeight - scrollTop === clientHeight;
  
    if (isBottom && !isLoadingMore && !isLoading) {
      handleJobSearch(debouncedSearchValue, currentPage + 1);
    }
  };

  const handleChange = (value) => {
    navigate(`/job-information/${value}`);
  };

  return (
    <div className="h-auto bg-white px-4 md:px-primary pb-20 my-[150px]">
      <div className="flex w-full flex-col h-auto">
        <div className="w-full h-full flex items-center justify-center flex-col gap-4">
          <h1 className="text-4xl text-black font-bold">Find Your Perfect Tech Job</h1>
          <section className="text-center">Connect with top companies and build your career in tech</section>
        {/* <SearchBar /> */}
          <div
            className="flex items-center w-[90%] p-2 rounded-lg bg-white"
            style={{ border: "1px solid #ccc" }}
          >
            <div className="relative w-full rounded-l-lg">
              <SearchOutlined className="absolute text-[24px] left-3 top-1/2 transform -translate-y-1/2 text-primaryColorH z-10" />
              <Select
                className="border-0 focus:border-0 focus:ring-0 rounded-l-lg text-lg w-[80%]"
                size="large"
                placeholder="Job title, keyword, company"
                style={{ marginLeft: "50px" }}
                value={searchValue}
                onChange={handleChange}
                onSearch={handleSearch}
                showSearch
                filterOption={false}
                loading={isLoading}
                dropdownRender={(menu) => (
                  <div ref={dropdownRef} onScroll={handleScroll}>
          {menu}
          {isLoadingMore && (
            <div className="text-center p-2">
              <Spin size="small" />
            </div>
          )}
        </div>
                )}
              >
                {jobSuggestions.map((job) => (
                  <Select.Option key={job._id} value={job._id}>
                    {job.title} - {job.user_id.company_name}
                  </Select.Option>
                ))}
              </Select>
            </div>

            <div className="w-[1px] h-[40px] bg-gray-300 mx-2"></div>

            <Button
              size="large"
              className="ml-4"
              style={{
                height: "50px",
                borderRadius: "8px",
                backgroundColor: "#d3464f",
                color: "white",
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

