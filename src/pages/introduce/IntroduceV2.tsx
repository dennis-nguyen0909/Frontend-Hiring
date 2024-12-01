import { SearchOutlined } from "@ant-design/icons";
import { Button, Select } from "antd";
import { useEffect, useState } from "react";
import { JobApi } from "../../services/modules/jobServices";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import { useNavigate } from "react-router-dom";

const IntroduceV2 = () => {
  const [jobSuggestions, setJobSuggestions] = useState([]);
  const [searchValue, setSearchValue] = useState(""); // Lưu trữ giá trị tìm kiếm
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading để tránh gọi API nhiều lần
  const userDetail = useSelector((state) => state.user);
  const debouncedSearchValue = useDebounce(searchValue, 500); // Áp dụng debounce với 500ms
  const navigate = useNavigate();

  // Hàm gọi API tìm kiếm công việc
  const handleJobSearch = async (value, page = 1) => {
    const params = {
      query: {
        keyword: value,
      },
      current: page,
      pageSize: 10,
    };

    setIsLoading(true); // Bật trạng thái loading khi gọi API

    try {
      const res = await JobApi.getAllJobsQuery(params, userDetail?._id);
      if (page === 1) {
        setJobSuggestions(res.data.items); // Nếu là trang đầu, thay thế toàn bộ kết quả
      } else {
        setJobSuggestions((prevJobs) => [...prevJobs, ...res.data.items]); // Nếu không, thêm các kết quả mới vào
      }
      setCurrentPage(page); // Cập nhật lại trang hiện tại
    } catch (error) {
      console.error("Error fetching jobs: ", error);
    } finally {
      setIsLoading(false); // Tắt trạng thái loading
    }
  };

  // Gọi handleJobSearch mỗi khi debouncedSearchValue thay đổi
  useEffect(() => {
    if (debouncedSearchValue) {
      handleJobSearch(debouncedSearchValue, 1); // Gọi API tìm kiếm khi có giá trị tìm kiếm
    } else {
      setJobSuggestions([]); // Xóa gợi ý khi không có từ khóa
    }
  }, [debouncedSearchValue]);

  // Khi người dùng nhập tìm kiếm, cập nhật giá trị và kích hoạt debounce
  const handleSearch = (value) => {
    setSearchValue(value); // Cập nhật giá trị tìm kiếm
  };

  // Xử lý cuộn xuống và gọi API nếu đã cuộn tới cuối
  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
    if (bottom && !isLoading) {
      // Nếu đã cuộn đến cuối, và không đang gọi API
      handleJobSearch(debouncedSearchValue, currentPage + 1); // Gọi API để lấy trang kế tiếp
    }
  };

  // Khi người dùng chọn công việc, chuyển hướng đến trang thông tin công việc
  const handleChange = (value) => {
    navigate(`/job-information/${value}`);
  };

  return (
    <div className="h-auto bg-white px-4 md:px-primary pb-20 my-[150px]">
      <div className="flex w-full flex-col h-auto">
        {/* Container */}
        <div className="w-full h-full flex items-center justify-center flex-col gap-4">
          <h1 className="text-4xl text-black font-bold">
            Find Your Perfect Tech Job
          </h1>
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
                loading={isLoading} // Hiển thị trạng thái loading khi gọi API
                dropdownRender={(menu) => (
                  <div onScroll={handleScroll}>
                    {menu}
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
