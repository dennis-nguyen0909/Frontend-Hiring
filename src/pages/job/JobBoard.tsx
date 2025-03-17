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
import { Meta } from "../../types";
import CustomPagination from "../../components/ui/CustomPanigation/CustomPanigation";
import LoadingComponentSkeleton from "../../components/Loading/LoadingComponentSkeleton";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { formatCurrencyWithSymbol } from "../../untils";
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
  const userDetail = useSelector((state) => state.user);
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState("newest");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listJobs, setListJobs] = useState<[]>([]);
  const [meta, setMeta] = useState<Meta>({});
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string[];
  }>({}); // Store selected checkbox values
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const { data: jobTypes } = useJobType();
  const { data: jobContractTypes } = useContractType();
  const { cities } = useCities();
  const [searchCity, setSearchCity] = useState<string>("");
  const dispatch = useDispatch();
  const location = useLocation();
  const { t } = useTranslation();
  const { keyword } = location.state || {}; // Nhận dữ liệu từ state
  const handleGetJob = async (
    current = 1,
    pageSize = 9,
    query?: any,
    sort?: any
  ) => {
    const params = {
      current,
      pageSize,
      query: { ...query },
      sort,
    };
    try {
      setIsLoading(true);
      const response = await JobApi.getAllJobs(
        params,
        userDetail?.access_token
      );
      if (response?.data) {
        setListJobs(response?.data.items);
        setMeta(response?.data?.meta);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // Giả sử màn hình nhỏ hơn 768px sẽ dùng chế độ "list"
        setViewMode("list");
      } else {
        setViewMode("grid");
      }
    };

    window.addEventListener("resize", handleResize);

    // Gọi handleResize lần đầu tiên khi component mount
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handleCollapse = async () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
  };

  useEffect(() => {
    if (keyword) {
      const params = {
        keyword,
      };
      setSearchTerm(keyword);
      handleGetJob(1, 9, params);
    } else {
      handleGetJob();
    }
  }, [keyword]);

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
  const handleSearch = async () => {
    const query = {
      keyword: searchTerm,
    };
    await handleGetJob(1, 9, query);
  };
  const onFilter = async () => {
    const query = {
      city_id: searchCity,
      keyword: searchTerm,
      job_type: selectedFilters?.job_type || [], // Add job_type filter if selected
      job_contract_type: selectedFilters?.job_contract_type || [], // Add job_contract_type filter if selected
    };
    await handleGetJob(1, 9, query);
  };
  const handleOnCheckbox = (code: string, label: string) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (updatedFilters[code]) {
        // If the filter already exists, toggle the selected label
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
  const onSearchPopular = async (value: string) => {
    const query = {
      keyword: value,
    };
    setSearchTerm(value);
    await handleGetJob(1, 9, query);
  };
  console.log("job", listJobs);
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
          <p className="text-center text-gray-600 mb-8 text-[10px]">
            {t("find_job_description")}
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button
                  onClick={handleSearch}
                  type="primary"
                  className="!bg-primaryColor h-6 text-[10px] px-3 mr-2 text-center"
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
              {/* Hiển thị biểu tượng Filter khi thu gọn */}
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

              {/* Hiển thị nội dung lọc */}
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
                  defaultValue="desc" // Giá trị mặc định là 'Cũ nhất'
                  className="text-[12px] border-gray-300 rounded-md"
                  onChange={(e) => {
                    const selectedSort = e.target.value; // Lấy giá trị của option đã chọn
                    setSortBy(selectedSort); // Cập nhật lựa chọn sort

                    let sortCriteria = {}; // Mặc định là không có sắp xếp

                    // Cập nhật sortCriteria dựa trên lựa chọn
                    if (selectedSort === "desc") {
                      sortCriteria = { createdAt: "desc" }; // Sắp xếp theo createdAt mới nhất
                    } else if (selectedSort === "asc") {
                      sortCriteria = { createdAt: "asc" }; // Sắp xếp theo createdAt cũ nhất
                    }

                    // Tạo params cho query
                    const paramsSort = {
                      sort: sortCriteria,
                    };

                    // Gọi hàm handleGetJob với các tham số mới
                    handleGetJob(1, 9, {}, paramsSort); // 1: trang đầu, 15: số lượng item trên mỗi trang
                  }}
                >
                  <option value={"desc"}>{t("newest")}</option>
                  <option value={"asc"}>{t("oldest")}</option>
                </select>

                <div className="flex gap-1 ml-4">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded  ${
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
              {listJobs?.length > 0 ? (
                <div>
                  <div
                    className={`grid ${
                      viewMode === "grid"
                        ? "grid-cols-3 gap-2"
                        : "grid-cols-1 gap-3"
                    }`} // Giảm gap giữa các cột khi ở chế độ grid
                  >
                    {listJobs?.map((job) => (
                      <div
                        key={job?.id}
                        className={`bg-white p-4 rounded-lg border hover:shadow-md transition-shadow ${
                          viewMode === "grid" ? "p-3" : "p-4"
                        }`} // Ở dạng grid, giảm padding hơn nữa
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={job?.user_id?.avatar_company}
                            alt={"ảnh"}
                            className={`rounded-lg ${
                              viewMode === "grid" ? "w-10 h-10" : "w-10 h-10"
                            }`} // Giảm kích thước avatar hơn khi ở grid
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
                            </h3>{" "}
                            {/* Giảm kích thước chữ tiêu đề trong chế độ grid */}
                            <div
                              className={`text-gray-500 mt-1 ${
                                viewMode === "grid"
                                  ? "text-[12px]"
                                  : "text-[12px]"
                              }`}
                            >
                              {job?.user_id?.company_name} •{" "}
                              {job?.city_id?.name}
                            </div>
                            <div
                              className={`text-gray-500 mt-1 ${
                                viewMode === "grid"
                                  ? "text-[10px]"
                                  : "text-[12px]"
                              }`}
                            >
                              {t("salary")} :{" "}
                              {job?.is_negotiable
                                ? t("negotiable")
                                : `${formatCurrencyWithSymbol(
                                    job?.salary_range_min,
                                    job?.type_money?.code
                                  )} - ${formatCurrencyWithSymbol(
                                    job?.salary_range_max,
                                    job?.type_money?.code
                                  )}`}
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="px-2 py-1 text-[10px] rounded-full bg-blue-50 text-blue-600">
                                {t(job?.job_type?.key)}
                              </span>
                              <span className="px-2 py-1 text-[10px] rounded-full bg-blue-50 text-blue-600">
                                {t(job?.job_contract_type?.key)}
                              </span>
                              {job?.skills?.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 text-[10px] rounded-full bg-gray-100 text-gray-600"
                                >
                                  {tag?.name}
                                </span>
                              ))}
                            </div>
                          </div>
                          <Button
                            onClick={() => onApply(job?._id)}
                            type="primary"
                            className={`!bg-primaryColor !cursor-pointer ${
                              viewMode === "grid"
                                ? "text-[10px] py-1 px-2"
                                : "text-[12px] py-1 px-3"
                            }`} // Giảm padding và kích thước nút khi ở chế độ grid
                          >
                            {t("apply")}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <CustomPagination
                    sizeArrow={30}
                    currentPage={meta?.current_page}
                    total={meta?.total}
                    perPage={meta?.per_page}
                    onPageChange={(current, pageSize) => {
                      handleGetJob(current, pageSize);
                    }}
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
