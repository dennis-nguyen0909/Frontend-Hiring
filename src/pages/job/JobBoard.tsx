import { useEffect, useState } from "react";
import { Button, Empty, Layout, Select } from "antd";
import {
  Search,
  Grid2X2,
  LayoutList,
  CircleChevronLeft,
  CircleChevronRight,
} from "lucide-react";
import { useJobType } from "../../hooks/useJobType";
import { useContractType } from "../../hooks/useContractType";
import { useCities } from "../../hooks/useCities";
import { JobApi } from "../../services/modules/jobServices";
import { useSelector } from "react-redux";
import CustomPagination from "../../components/ui/CustomPanigation/CustomPanigation";
import LoadingComponentSkeleton from "../../components/Loading/LoadingComponentSkeleton";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatCurrencyWithSymbol } from "../../untils";
import { useQuery } from "@tanstack/react-query";
import { RootState } from "../../redux/store/store";
import { useDebounce } from "../../hooks/useDebounce";

interface Job {
  _id: string;
  title: string;
  user_id: {
    avatar_company: string;
    company_name: string;
  };
  city_id: {
    name: string;
  };
  is_negotiable: boolean;
  salary_range_min: number;
  salary_range_max: number;
  type_money: {
    code: string;
  };
  job_type: {
    key: string;
  };
  job_contract_type: {
    key: string;
  };
  skills: Array<{
    name: string;
  }>;
}

interface JobResponse {
  items: Job[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
  };
}

const { Sider } = Layout;
const popularSearches = [
  "Front-end",
  "Back-end",
  "Development",
  "PHP",
  "Laravel",
  "Bootstrap",
  "Developer",
  "Team Lead",
  "Product Testing",
  "JavaScript",
];

export default function JobBoard() {
  const userDetail = useSelector((state: RootState) => state.user);
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState("newest");
  const navigate = useNavigate();
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string[];
  }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const { data: jobTypes } = useJobType();
  const { data: jobContractTypes } = useContractType();
  const { cities } = useCities();
  const [searchCity, setSearchCity] = useState<string>("");
  const location = useLocation();
  const { t } = useTranslation();
  const { keyword } = location.state || {};
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);

  // React Query for fetching jobs
  const { data: jobsData, isLoading } = useQuery<JobResponse>({
    queryKey: [
      "jobs",
      currentPage,
      pageSize,
      debouncedSearchTerm,
      searchCity,
      selectedFilters,
      sortBy,
      keyword,
    ],
    queryFn: async () => {
      const params = {
        current: currentPage,
        pageSize,
        query: {
          keyword: debouncedSearchTerm || keyword,
          city_id: searchCity,
          job_type: selectedFilters?.job_type || [],
          job_contract_type: selectedFilters?.job_contract_type || [],
        },
        sort:
          sortBy === "newest" ? { createdAt: "desc" } : { createdAt: "asc" },
      };

      const response = await JobApi.getAllJobs(
        params,
        userDetail?.access_token
      );
      return response.data;
    },
    enabled: !!userDetail?.access_token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode("list");
      } else {
        setViewMode("grid");
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const filters = [
    {
      title: "Loại công việc",
      code: "job_type",
      items: jobTypes
        ? jobTypes.map((type) => ({
            label: type.name,
            count: 0,
            value: type.key,
            id: type._id,
          }))
        : [],
    },
    {
      title: "Loại hợp đồng",
      code: "job_contract_type",
      items: jobContractTypes
        ? jobContractTypes.map((type) => ({
            label: type.name,
            count: 0,
            value: type.key,
            id: type._id,
          }))
        : [],
    },
  ];

  const handleChange = (value: string) => {
    setSearchCity(value);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const onFilter = () => {
    setCurrentPage(1);
  };

  const handleOnCheckbox = (code: string, label: string) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (updatedFilters[code]) {
        if (updatedFilters[code].includes(label)) {
          updatedFilters[code] = updatedFilters[code].filter(
            (item) => item !== label
          );
        } else {
          updatedFilters[code].push(label);
        }
      } else {
        updatedFilters[code] = [label];
      }
      return updatedFilters;
    });
  };

  const onApply = (jobId: string) => {
    navigate(`/job-information/${jobId}`);
  };

  const onSearchPopular = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (current: number, size: number) => {
    setCurrentPage(current);
    setPageSize(size);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white px-0 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-[18px] font-bold text-center mb-2">
            {t("find_job")}{" "}
            <span className="relative">
              {t("dream")}
              <span className="absolute bottom-0 left-0 w-full h-2 bg-blue-200 -z-10"></span>
            </span>
          </h1>
          <p className="text-center text-gray-600 mb-8 text-[12px]">
            {t("find_job_description")}
          </p>
          {/* Search Bar */}
          <div className="max-w-4xl w-full mx-auto">
            <div className="flex flex-col md:flex-row gap-4 bg-white rounded-full shadow-lg border border-gray-200 hover:border-primaryColor transition-all duration-300">
              <div className="flex-1 flex items-center px-4">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder={t("job_title_or_keyword")}
                  className="w-full border-none pl-1 py-2 text-[14px] focus:outline-none focus:border-none h-10 placeholder-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button
                  onClick={handleSearch}
                  type="primary"
                  className="!bg-primaryColor h-8 text-[14px] px-6 text-center !rounded-full hover:!bg-primaryColor/90 transition-all duration-300"
                >
                  {t("find_job")}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-2 mt-5">
          <span className="text-[12px] text-gray-500">
            {t("popular_searches")}:
          </span>
          {popularSearches.map((term) => (
            <button
              onClick={() => onSearchPopular(term)}
              key={term}
              className=" !text-[12px] rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-200"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters */}
          <Sider collapsed={collapsed} className="bg-transparent" width={250}>
            <div className="w-full lg:w-64 space-y-6">
              <div className="flex items-center justify-between">
                {collapsed ? (
                  <CircleChevronLeft onClick={handleCollapse} />
                ) : (
                  <CircleChevronRight onClick={handleCollapse} />
                )}
                {!collapsed && (
                  <Button onClick={onFilter} className="ml-2">
                    {t("filter")}
                  </Button>
                )}
              </div>

              {!collapsed && (
                <div>
                  <div className="pb-3">
                    <h3 className="font-semibold mb-4 text-[12px]">
                      {t("filter_by_city")}
                    </h3>
                    <Select
                      defaultValue={cities[0]?._id}
                      style={{ width: "100%" }}
                      onChange={handleChange}
                      placeholder={t("choose_city")}
                    >
                      {cities.map((city) => (
                        <Select.Option key={city._id}>
                          {city.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                  {filters?.map((section) => (
                    <div key={section.title} className="pb-3">
                      <h3 className="font-semibold mb-4 text-[12px]">
                        {section.title}
                      </h3>
                      <div className="space-y-2">
                        {section?.items?.map((item) => (
                          <label key={item.value} className="flex items-center">
                            <input
                              onClick={() =>
                                handleOnCheckbox(section?.code, item?.id)
                              }
                              type="checkbox"
                              className="rounded border-gray-300 text-indigo-600"
                            />
                            <span className="ml-2 text-[12px]">
                              {item.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Sider>

          {/* Job Listings */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[20px] font-semibold">{t("all_jobs")}</h2>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-gray-500">
                  {t("sort_by")}:
                </span>
                <select
                  defaultValue="desc"
                  className="text-[12px] border-gray-300 rounded-md"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value={"desc"}>{t("newest")}</option>
                  <option value={"asc"}>{t("oldest")}</option>
                </select>

                <div className="flex gap-1 ml-4">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${
                      viewMode === "grid" ? "bg-gray-100" : ""
                    } ${window.innerWidth < 768 ? "hidden" : ""}`}
                  >
                    <Grid2X2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded ${
                      viewMode === "list" ? "bg-gray-100" : ""
                    }`}
                  >
                    <LayoutList className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <LoadingComponentSkeleton isLoading={isLoading}>
              {jobsData?.items && jobsData.items.length > 0 ? (
                <div>
                  <div
                    className={`grid ${
                      viewMode === "grid"
                        ? "grid-cols-3 gap-2"
                        : "grid-cols-1 gap-3"
                    }`}
                  >
                    {jobsData.items.map((job: Job) => (
                      <div
                        key={job._id}
                        className={`bg-white p-4 rounded-lg border hover:shadow-md transition-shadow ${
                          viewMode === "grid" ? "p-3" : "p-4"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={job.user_id?.avatar_company}
                            alt={"ảnh"}
                            className={`rounded-lg ${
                              viewMode === "grid" ? "w-10 h-10" : "w-10 h-10"
                            }`}
                          />
                          <div className="flex-1">
                            <h3
                              className={`font-semibold ${
                                viewMode === "grid"
                                  ? "text-[12px]"
                                  : "text-[12px]"
                              }`}
                            >
                              {job.title}
                            </h3>
                            <div
                              className={`text-gray-500 mt-1 ${
                                viewMode === "grid"
                                  ? "text-[12px]"
                                  : "text-[12px]"
                              }`}
                            >
                              {job.user_id?.company_name} • {job.city_id?.name}
                            </div>
                            <div
                              className={`text-gray-500 mt-1 ${
                                viewMode === "grid"
                                  ? "text-[10px]"
                                  : "text-[12px]"
                              }`}
                            >
                              {t("salary")} :{" "}
                              {job.is_negotiable
                                ? t("negotiable")
                                : `${formatCurrencyWithSymbol(
                                    job.salary_range_min,
                                    job.type_money?.code
                                  )} - ${formatCurrencyWithSymbol(
                                    job.salary_range_max,
                                    job.type_money?.code
                                  )}`}
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="px-2 py-1 text-[10px] rounded-full bg-blue-50 text-blue-600">
                                {t(job.job_type?.key)}
                              </span>
                              <span className="px-2 py-1 text-[10px] rounded-full bg-blue-50 text-blue-600">
                                {t(job.job_contract_type?.key)}
                              </span>
                              {job.skills?.map((tag: { name: string }) => (
                                <span
                                  key={tag.name}
                                  className="px-2 py-1 text-[10px] rounded-full bg-gray-100 text-gray-600"
                                >
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                          </div>
                          <Button
                            onClick={() => onApply(job._id)}
                            type="primary"
                            className={`!bg-primaryColor !cursor-pointer ${
                              viewMode === "grid"
                                ? "text-[10px] py-1 px-2"
                                : "text-[12px] py-1 px-3"
                            }`}
                          >
                            {t("apply")}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <CustomPagination
                    sizeArrow={30}
                    currentPage={currentPage}
                    total={jobsData?.meta?.total || 0}
                    perPage={pageSize}
                    onPageChange={handlePageChange}
                  />
                </div>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={t("no_data")}
                />
              )}
            </LoadingComponentSkeleton>
          </div>
        </div>
      </main>
    </div>
  );
}
