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
import { useNavigate } from "react-router-dom";
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
  const [searchValue, setSearchValue] = useState([]);
  const [searchCity, setSearchCity] = useState("all-locations");
  const [searchContractJob, setSearchContractJob] = useState("tat_ca_loai_hop_dong");
  const [meta, setMeta] = useState<Meta>({});
  const [listJobs, setListJobs] = useState<[]>([]);
  const [searchLevels, setSearchLevels] = useState<string[]>(["all_levels"]);
  const [isLoadingJob, setIsLoadingJob] = useState<boolean>(false);
  const userDetail = useSelector((state) => state.user);
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const { cities } = useCities();
  const handleJobSearch = async (query?: any, current = 1, pageSize = 10) => {
    const params = {
      current,
      pageSize,
      query: { ...query },
    };

    try {
      setIsLoadingJob(true);
      const res = await JobApi.findJobsByCompanyName(params, userDetail?._id);
      if (res.data) {
        setJobSuggestions(res.data.items);
        setListJobs(res.data.items);
        setMeta(res.data.meta);
      }
    } catch (error) {
      console.error("Error fetching jobs: ", error);
    } finally {
      setIsLoadingJob(false);
    }
  };

  // Combined useEffect for initial load and debounced search
  useEffect(() => {
    const query = {
      title: debouncedSearchValue,
      city_id: { codename: searchCity },
      job_contract_type: searchContractJob,
      level: searchLevels[0],
    };
    handleJobSearch(query, 1, 10);
  }, [searchCity, searchContractJob, searchLevels]);

  const onSearch = async () => {
    const query = {
      title: searchValue,
      city_id: { codename: searchCity },
      job_contract_type: searchContractJob,
      level: searchLevels[0],
    };
    handleJobSearch(query);
  };

  const handleSearchValueChange = (value: string[]) => {
    setSearchValue(value);
  };

  const handleCityChange = (value: string) => {
    setSearchCity(value);
  };

  const handleLevelsChange = (value: string[]) => {
    setSearchLevels(value);
  };

  const handleContractJobChange = (value: string) => {
    setSearchContractJob(value);
  };

  const onRemoveFilter = () => {
    setSearchCity("all-locations");
    setSearchContractJob("tat_ca_loai_hop_dong");
    setSearchLevels(["all_levels"]);
    setSearchValue([]);
    handleJobSearch({}, 1, 10); // Reset search
  };

  return (
    <div className="min-h-screen bg-[#fff7f5] p-4 mx-primaryx2">
      {/* Search Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-xl font-semibold">Tìm kiếm</h1>
          <Tag color="red">Javascript</Tag>
        </div>

        <div className="flex items-center gap-4 mb-6">
            <Input
            value={searchValue}
            onChange={(e) => handleSearchValueChange(e.target.value)}
            onPressEnter={onSearch} // Thực hiện tìm kiếm khi nhấn Enter
            placeholder="Nhập công việc, công ty..."
            size="large"
            style={{ width: "80%" }}
            allowClear
          />
          <Button onClick={onSearch} size="large">Tìm kiếm</Button>
        </div>

        <div className="flex gap-4 items-center">
          <Select
            defaultValue="all-locations"
            value={searchCity}
            onChange={handleCityChange}
            style={{ width: 200 }}
          >
            <Option value="all-locations">Tất cả địa điểm</Option>
            {cities?.map((city) => (
              <Option key={city.codename} value={city.codename}>
                {city.name}
              </Option>
            ))}
          </Select>

          <Select
            mode="multiple"
            value={searchLevels}
            style={{ width: 200 }}
            onChange={handleLevelsChange}
            placeholder="Chọn cấp bậc"
          >
            {listLevels.map((level) => (
              <Option key={level.key} value={level.key}>
                <Checkbox checked={searchLevels.includes(level.key)}>
                  {level.name}
                </Checkbox>
              </Option>
            ))}
          </Select>

          <Select
            onChange={handleContractJobChange}
            value={searchContractJob}
            style={{ width: 200 }}
          >
            {listContractTypes.map((item) => (
              <Option key={item.key} value={item.key}>
                {item.name}
              </Option>
            ))}
          </Select>

          <Button onClick={onRemoveFilter} className="flex items-center">Xóa bộ lọc</Button>
        </div>
      </div>

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
                listJobs.map((item) => (
                  <JobCard
                    key={item._id}
                    id={item._id}
                    company={item?.user_id?.company_name}
                    logo={item?.user_id?.avatar_company}
                    title={item?.title}
                    location={`${item?.ward_id?.name}, ${item?.district_id?.name}, ${item?.city_id?.name}`}
                    level={item?.level?.name?.toUpperCase()}
                    postedDays={item.createdAt}
                    description={item?.benefit}
                    type_of_work={item?.type_of_work}
                    skills={item?.skills}
                  />
                ))
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </div>
          </LoadingComponent>
        </div>
      </div>

      {/* Pagination */}
      {listJobs.length > 0 && (
        <CustomPagination
          currentPage={meta.current_page}
          total={meta.total}
          perPage={meta.per_page}
          onPageChange={(current, pageSize) => {
            const query = {
              title: searchValue,
              city_id: { codename: searchCity },
              job_contract_type: searchContractJob,
              level: searchLevels[0],
            };
            handleJobSearch(query, current, pageSize);
          }}
        />
      )}
    </div>
  );
}
