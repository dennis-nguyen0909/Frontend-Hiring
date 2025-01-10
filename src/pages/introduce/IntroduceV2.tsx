import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useState } from "react";

const IntroduceV2 = () => {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const onNavigate = () => {
    navigate("/jobs", {
      state: {
        keyword: searchValue, // Dữ liệu muốn truyền
      },
    });
  };
  return (
    <div className="h-auto bg-white px-4 md:px-primary pb-20">
      <div className="flex w-full flex-col h-auto">
        <div className="bg-white px-0 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-[18px] font-bold text-center mb-2">
              Tìm công việc{" "}
              <span className="relative">
                mơ ước của bạn
                <span className="absolute bottom-0 left-0 w-full h-2 bg-blue-200 -z-10"></span>
              </span>
            </h1>
            <p className="text-center text-gray-600 mb-8 text-[10px]">
              Tiếp cận 40,000+ tin tuyển dụng việc làm mỗi ngày từ hàng nghìn
              doanh nghiệp uy tín tại Việt Nam
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 bg-white rounded-lg shadow-sm border">
                <div className="flex-1 flex items-center ml-2">
                  <Search className="w-4 h-4 text-gray-400 mr-" />
                  <input
                    type="text"
                    placeholder="Job title or keyword"
                    className="w-full border-none pl-1 py-1 text-[10px] focus:outline-none focus:border-none h-8"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                  <Button
                    onClick={onNavigate}
                    type="primary"
                    className="!bg-primaryColor h-6 text-[10px] px-3 mr-2 text-center"
                  >
                    Tìm kiếm
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroduceV2;
