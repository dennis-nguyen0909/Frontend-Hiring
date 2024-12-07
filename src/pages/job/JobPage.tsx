import {
  Input,
  Select,
  Button,
  Card,
  Tag,
  Switch,
  Image,
  Checkbox,
  Empty,
} from "antd";
import { Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import { JobApi } from "../../services/modules/jobServices";
import { useNavigate, useNavigationType } from "react-router-dom";
import { useDebounce } from "../../hooks/useDebounce";
import { useSelector } from "react-redux";
import { useCities } from "../../hooks/useCities";
import { useLevels } from "../../hooks/useLevels";
import { useContractType } from "../../hooks/useContractType";
import { Meta } from "../../types";
import LoadingComponent from "../../components/Loading/LoadingComponent";
import CustomPagination from "../../components/ui/CustomPanigation/CustomPanigation";
import JobCard from "./Card";
const { Option } = Select;
export default function JobSearchPage() {
  const { data: listLevels } = useLevels();
  const { data: listContractTypes } = useContractType();
  const [jobSuggestions, setJobSuggestions] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const [searchCity, setSearchCity] = useState("all-locations");
  const [searchContractJob, setSearchContractJob] = useState(
    "tat_ca_loai_hop_dong"
  );
  const [meta, setMeta] = useState<Meta>({});
  const [listJobs, setListJobs] = useState<[]>([]);
  const [searchLevels, setSearchLevels] = useState<string[]>(["all_levels"]);
  const [isLoadingJob, setIsLoadingJob] = useState<boolean>(false);
  const userDetail = useSelector((state) => state.user);
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const { cities } = useCities();

  const handleJobSearch = async (query?: any, current = 1, pageSize = 10) => {
    const params = {
      current: current,
      pageSize: pageSize,
      query: {
        ...query,
      },
    };

    try {
      setIsLoadingJob(true);
      const res = await JobApi.findJobsByCompanyName(params, userDetail?._id);
      if (res.data) {
        setJobSuggestions(res.data.items);
        setListJobs(res.data.items);
        setMeta(res.data.meta);
      }
      setIsLoadingJob(false);
    } catch (error) {
      console.error("Error fetching jobs: ", error);
    } finally {
      setIsLoadingJob(false);
    }
  };

  useEffect(() => {
    if (debouncedSearchValue) {
      const query = {
        title: debouncedSearchValue,
      };
      handleJobSearch(query, 1);
    } else {
      setJobSuggestions([]);
    }
  }, [debouncedSearchValue]);

  useEffect(() => {
    handleJobSearch();
  }, []);
  const handleSearch = (value) => {
    setSearchValue(value);
  };

  const handleChange = (value: string) => {
    setSearchValue(value);
  };
  const onSearch = async () => {
    const query = {
      title: searchValue,
      city_id: {
        codename: searchCity,
      },
      job_contract_type: searchContractJob,
      level: searchLevels[0],
    };
    await handleJobSearch(query);
  };
  const handleChangeCity = (value: string) => {
    setSearchCity(value);
  };

  const handleChangeLevels = (value: string[]) => {
    setSearchLevels(value); // Cập nhật giá trị khi người dùng chọn cấp bậc
  };
  const handleChangeContractJob = (value: string) => {
    setSearchContractJob(value);
  };
  const onRemoveFilter = () => {
    setSearchCity("all-locations");
    setSearchContractJob("tat_ca_loai_hop_dong");
    setSearchLevels(["all_levels"]);
    setSearchValue("")
    handleJobSearch()
  };

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
            loading={isLoadingJob} // Hiển thị trạng thái loading khi gọi API
          >
            {jobSuggestions?.map((job) => (
              <Select.Option key={job?._id} value={job?.title}>
                {job?.title} - {job?.user_id?.company_name}
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
            value={searchLevels} // Đảm bảo giá trị được chọn đồng bộ với trạng thái
            style={{ width: 200 }}
            onChange={handleChangeLevels}
            placeholder="Chọn cấp bậc"
          >
            {listLevels.map((level) => {
              return (
                <Option key={level.key} value={level.key}>
                  <Checkbox checked={searchLevels.includes(level.key)}>
                    {level.name}
                  </Checkbox>
                </Option>
              );
            })}
          </Select>
          <Select
            onChange={handleChangeContractJob}
            value={searchContractJob}
            style={{ width: 200 }}
          >
            {listContractTypes.map((item, idx) => {
              return (
                <Option key={item.key} value={item.key}>
                  {item.name}
                </Option>
              );
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
          <LoadingComponent isLoading={isLoadingJob}>
            <div className="space-y-4">
              {listJobs.length > 0 ? (
                listJobs?.map((item) => {
                  return (
                    <JobCard
                      id={item._id}
                      company={item?.user_id?.company_name}
                      logo={item?.user_id?.avatar_company}
                      title={item?.title}
                      location={
                        item?.ward_id?.name +
                        ", " +
                        item?.district_id?.name +
                        ", " +
                        item?.city_id?.name
                      }
                      // tags={item.skills}
                      level={item?.level?.name?.toUpperCase()}
                      postedDays={item.createdAt}
                      description={item?.benefit}
                      type_of_work={item?.type_of_work}
                      skills={item?.skills}
                    />
                  );
                })
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </div>
          </LoadingComponent>
        </div>

        {/* Sidebar */}
        {/* <div className="w-80">
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
        </div> */}
      </div>
     {listJobs.length >0 &&  <CustomPagination
        currentPage={meta.current_page}
        total={meta.total}
        perPage={meta.per_page}
        onPageChange={(current, pageSize) => {
            const query = {
              title: searchValue,
              city_id: {
                codename: searchCity,
              },
              job_contract_type: searchContractJob,
              level: searchLevels[0],
            };
            handleJobSearch(query, current, pageSize);
        }}
      />}
    </div>
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
