import {
  Input,
  Select,
  Button,
  Card,
  Tag,
  Switch,
  Image,
  Checkbox,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import { JobApi } from "../../services/modules/jobServices";
import { useNavigationType } from "react-router-dom";
import { useDebounce } from "../../hooks/useDebounce";
import { useSelector } from "react-redux";
import { useCities } from "../../hooks/useCities";
const { Option } = Select;

export default function JobSearchPage() {
  const [jobSuggestions, setJobSuggestions] = useState([]);
  const [searchValue, setSearchValue] = useState(""); // Lưu trữ giá trị tìm kiếm
  const navigate = useNavigationType();
  const [searchCity, setSearchCity] = useState("all-locations"); // Lưu trữ giá trị tìm kiếm
  const [searchContractJob, setSearchContractJob] = useState("all-contracts"); // Lưu trữ giá trị tìm kiếm
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [searchLevels,setSearchLevels]=useState<string[]>(["all-levels"])
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading để tránh gọi API nhiều lần
  const userDetail = useSelector((state) => state.user);
  const debouncedSearchValue = useDebounce(searchValue, 500); // Áp dụng debounce với 500ms
  const { cities } = useCities();
  const jobModes = [{
    id:"all-contracts",
    value:"Tất cả loại hợp đồng"
  },{
    id:"hybird",
    value:"Hybrid"
  }, {
    id:'in_office',
    value:"In-office"
  }, {
    id:"freelance",
    value:"Freelance"
  }, {
    id:"remote",
    value:"Remote"
  }];
  // Hàm gọi API tìm kiếm công việc
  const handleJobSearch = async (query:any, page = 1) => {
    const params = {
      current: page,
      pageSize: 10,
      query:{
        ...query
      }
    };

    setIsLoading(true);

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
    }
  };

  useEffect(() => {
    if (debouncedSearchValue) {
        const query = {
            keyword:debouncedSearchValue
        }
      handleJobSearch(query, 1);
    } else {
      setJobSuggestions([]);
    }
  }, [debouncedSearchValue]);

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  const handleChange = (value:string) => {
    setSearchValue(value);
  };
  const onSearch = async () => {
    console.log("search 1",searchValue);
    console.log("search 2",searchCity);
    console.log("search 3",searchContractJob);
    console.log("search 4",searchLevels);
    const query = {
        title:searchValue,
        city_id:{
            codename:searchCity
        },
        type_of_work:searchCity,
        level:searchLevels
    }
    await handleJobSearch(query);
  };
  const handleChangeCity = (value:string) => {
    setSearchCity(value);
  };
  const handleChangeLevels = (value: string[]) => {
    console.log("value", value);
    setSearchLevels([...value])
  };
  const handleChangeContractJob =(value:string)=>[
    setSearchContractJob(value)
  ]
  const onRemoveFilter  = ()=>{
    setSearchCity("all-locations")
    setSearchContractJob("all-contracts")
    setSearchLevels(["all-levels"])
  }

  return (
    <div className="min-h-screen bg-[#fff7f5] p-4 mx-primaryx2">
      {/* Search Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-xl font-semibold">Tìm kiếm</h1>
          <Tag color="red">Javascript</Tag>
        </div>

        <div className="flex items-center  gap-4 mb-6">
          <Select
            className="border-0 focus:border-0 focus:ring-0 rounded-l-lg text-lg w-[80%]"
            size="large"
            placeholder="Job title, keyword, company"
            value={searchValue}
            onChange={handleChange}
            onSearch={handleSearch}
            showSearch
            filterOption={false}
            loading={isLoading} // Hiển thị trạng thái loading khi gọi API
          >
            {jobSuggestions.map((job) => (
              <Select.Option key={job._id} value={job.title}>
                {job.title} - {job.user_id.company_name}
              </Select.Option>
            ))}
          </Select>
          <Button onClick={onSearch} size="large">
            Tìm kiếm
          </Button>
        </div>

        <div className="flex gap-4 items-center">
          <Select
            defaultValue="all-locations"
            value={searchCity}
            onChange={(value) => handleChangeCity(value)}
            style={{ width: 200 }}
          >
            <Option value="all-locations">Tất cả địa điểm</Option>
            {cities?.map((city, idx) => {
              return <Option value={city.codename}>{city.name}</Option>;
            })}
          </Select>

          <Select
            mode="multiple"
            // defaultValue={["all-levels"]}
            value={searchLevels}
            style={{ width: 200 }}
            onChange={handleChangeLevels}
            placeholder="Chọn cấp bậc"
          >
            <Option value="all-levels">
              <Checkbox checked={true}>Tất cả cấp bậc</Checkbox>
            </Option>
            <Option value="intern">
              <Checkbox>Intern</Checkbox>
            </Option>
            <Option value="fresher">
              <Checkbox>Fresher</Checkbox>
            </Option>
            <Option value="middle">
              <Checkbox>Middle</Checkbox>
            </Option>
            <Option value="junior">
              <Checkbox>Junior</Checkbox>
            </Option>
            <Option value="senior">
              <Checkbox>Senior</Checkbox>
            </Option>
          </Select>
          <Select onChange={handleChangeContractJob} value={searchContractJob} style={{ width: 200 }}>
            <Option value="all-job-type">Tất cả loại hợp đồng</Option>
            {jobModes.map((item,idx)=>{
                    return(
                        <Option key={idx} value={item.id}>{item.value}</Option>
                    )
            })}
          </Select>
          <Button onClick={onRemoveFilter} className="flex items-center">
 Xóa bộ lọc
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-300">
        <div className="flex gap-8">
          <button className="px-4 py-2 text-red-600 border-b-2 border-red-600 font-medium">
            Tất cả
          </button>
          <button className="px-4 py-2 text-gray-600">Việc làm</button>
        </div>
      </div>

      {/* Job Alert Switch */}
      <Card className="mb-6 bg-gray-100 border-gray-300">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Tạo thông báo việc làm ngay</span>
          <Switch />
        </div>
      </Card>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Job Listings */}
        <div className="flex-1">
          <div className="mb-4">
            <span className="font-medium text-gray-700">16 việc làm</span>
            <Tag className="ml-2 bg-blue-100 text-blue-800 border-blue-200">
              Back-End
            </Tag>
          </div>

          {/* Job Cards */}
          <div className="space-y-4">
            <JobCard
              company="MBBANK"
              logo="/placeholder.svg?height=60&width=60"
              title="Kỹ Sư Phát Triển BackEnd - Khối Công nghệ thông tin (HCLT.03)"
              location="Quận Cầu Giấy, Hà Nội"
              tags={["Oracle", "Java", "PostgreSQL", "Spring Boot", "Kafka"]}
              level="Junior, Middle, Senior"
              postedDays={3}
              description={[
                "Trải nghiệm Thu nhập hấp dẫn với gói đãi ngộ toàn diện:",
                "Thưởng tháng lương 13; Thưởng thành tích 06 tháng; 1 năm ; Thưởng các...",
                "Du lịch nghỉ dưỡng hàng năm, Khám sức khỏe định kì; Gói bảo hiểm sức...",
              ]}
            />

            <JobCard
              company="Sacombank"
              logo="/placeholder.svg?height=60&width=60"
              title="CHUYÊN VIÊN TÍCH HỢP HỆ THỐNG (JAVA DEVELOPER / ENGINEE..."
              location="Quận 3, Hồ Chí Minh"
              tags={["Java", "Back-End", "Oracle Middleware"]}
              level="Fresher, Trưởng Nhóm, Junior, Middle, Senior"
              postedDays={3}
              isHot={true}
              description={[
                "Chế độ Lương và thu nhập hấp dẫn: các khoản thưởng vào nhiều dịp Lễ, Tết...",
                "Được đào tạo nghiệp vụ, kiến thức công việc liên quan;",
                "Cơ hội nghề nghiệp & lộ trình thăng tiến rõ ràng;",
              ]}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80">
          <Card className="bg-white">
            <h2 className="text-lg font-medium mb-4">Tiêu điểm</h2>
            <div className="space-y-4">
              <FeaturedCompany
                name="Allexceed Việt Nam"
                logo="/placeholder.svg?height=200&width=300"
                location="Quận Bình Thạnh, Hồ Chí Minh"
                tags={["PHP", "Java", ".NET"]}
                description="Attractive IT Jobs for developers of all levels"
                employeeCount="25-99 Nhân Viên"
                positions={["Phần Mềm"]}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function JobCard({
  company,
  logo,
  title,
  location,
  tags,
  level,
  postedDays,
  isHot = false,
  description,
}) {
  return (
    <Card className="relative bg-white shadow-sm hover:shadow-md transition-shadow">
      {isHot && (
        <div className="absolute top-4 right-4">
          <Tag color="red" className="font-bold">
            HOT JOB
          </Tag>
        </div>
      )}
      <div className="flex gap-4">
        <Image
          src={logo}
          alt={company}
          width={60}
          height={60}
          className="rounded"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-red-600 hover:underline cursor-pointer">
              {title}
            </h3>
            <Bookmark className="text-gray-400 text-xl" />
          </div>
          <div className="text-sm text-gray-600 mb-2">{company}</div>
          <div className="text-sm mb-2 flex items-center gap-1">
            <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
            {location} (In Office)
          </div>
          <div className="text-sm mb-2">
            <span className="font-medium">Đăng nhập để xem mức lương</span> •{" "}
            {level}
          </div>
          <ul className="list-disc list-inside text-sm text-gray-600 mb-2">
            {description.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <div className="flex gap-2 flex-wrap mb-2">
            {tags.map((tag) => (
              <Tag
                key={tag}
                className="bg-blue-50 text-blue-600 border-blue-100"
              >
                {tag}
              </Tag>
            ))}
          </div>
          <div className="text-sm text-gray-500">
            Đăng {postedDays} ngày trước
          </div>
        </div>
      </div>
    </Card>
  );
}

function FeaturedCompany({
  name,
  logo,
  location,
  tags,
  description,
  employeeCount,
  positions,
}) {
  return (
    <div className="space-y-2">
      <div className="relative h-40 rounded-lg overflow-hidden">
        <Image src={logo} alt={name} fill className="object-cover" />
        <Bookmark className="absolute top-2 right-2 text-white text-xl" />
      </div>
      <h3 className="font-medium">{name}</h3>
      <div className="text-sm text-gray-600">{location}</div>
      <p className="text-sm">{description}</p>
      <div className="text-sm text-gray-600">{employeeCount}</div>
      <div className="flex gap-2">
        {positions.map((position) => (
          <Tag
            key={position}
            className="bg-gray-100 text-gray-600 border-gray-200"
          >
            {position}
          </Tag>
        ))}
      </div>
      <div className="flex gap-2">
        {tags.map((tag) => (
          <Tag key={tag} className="bg-blue-50 text-blue-600 border-blue-100">
            {tag}
          </Tag>
        ))}
      </div>
      <Button type="primary" className="bg-blue-500 hover:bg-blue-600 w-full">
        2 vị trí tuyển dụng
      </Button>
    </div>
  );
}
