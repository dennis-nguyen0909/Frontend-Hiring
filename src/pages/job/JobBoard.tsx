import { useEffect, useState } from "react";
import { Button, Empty, Layout, Select } from "antd";
import {
  Search,
  MapPin,
  Grid2X2,
  LayoutList,
  CircleChevronLeft,
  CircleChevronRight,
} from "lucide-react";
import { useJobType } from "../../hooks/useJobType";
import { useContractType } from "../../hooks/useContractType";
import { useCities } from "../../hooks/useCities";
import { useDegreeType } from "../../hooks/useDegreeType";
import { JobApi } from "../../services/modules/jobServices";
import { useSelector } from "react-redux";
import { Meta } from "../../types";
import CustomPagination from "../../components/ui/CustomPanigation/CustomPanigation";
import LoadingComponentSkeleton from "../../components/Loading/LoadingComponentSkeleton";
const { Sider } = Layout;
export default function JobBoard() {
  const [collapsed, setCollapsed] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [isLoading,setIsLoading]=useState<boolean>(false)
  const [listJobs, setListJobs] = useState<[]>([]);
  const [meta, setMeta] = useState<Meta>({});
  const handleCollapse = async () => {
    setCollapsed(!collapsed);
  };
  const userDetail = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Florence, Italy");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const { data: jobTypes } = useJobType();
  const { data: jobContractTypes } = useContractType();
  const { data: degreeTypes } = useDegreeType();
  const { cities } = useCities();
  const [searchCity,setSearchCity]=useState<string>('')
  const handleGetJob = async (current = 1, pageSize = 15, query?: any) => {
    const params = {
      current,
      pageSize,
      query: { ...query },
    };
    try {
      setIsLoading(true)
      const response = await JobApi.getAllJobs(
        params,
        userDetail?.access_token
      );
      if (response?.data) {
        setListJobs(response?.data.items);
        setMeta(response?.data?.meta);
      }
    } catch (e) {
      console.log(e);
    } finally{
      setIsLoading(false)
    }
  };
  useEffect(() => {
    handleGetJob();
  }, []);
  console.log("duydeptrai", cities);
  const filters = [
    {
      title: "Loại công việc",
      items: jobTypes
        ? jobTypes.map((type) => ({
            label: type.name,
            count: 0,
            value: type.key,
          }))
        : [],
    },
    {
      title: "Loại công việc",
      items: degreeTypes
        ? degreeTypes.map((type) => ({
            label: type.name,
            count: 0,
            value: type.key,
          }))
        : [],
    },
    {
      title: "Loại hợp đồng",
      items: jobContractTypes
        ? jobContractTypes.map((type) => ({
            label: type.name,
            count: 0,
            value: type.key,
          }))
        : [],
    },
    {
      title: "Categories",
      items: [
        { label: "Design", count: 24, value: "design" },
        { label: "Sales", count: 3, value: "sales" },
        { label: "Marketing", count: 3, value: "marketing" },
        { label: "Business", count: 3, value: "business" },
        { label: "Human Resource", count: 6, value: "hr" },
      ],
    },
  ];
  const handleChange = (value: string) => {
    console.log(`Selected city: ${value}`);
    setSearchCity(value)
  };
  const handleSearch = async () => {
    const query = {
      keyword: searchTerm,
    };
    await handleGetJob(1, 15, query);
  };
  const onFilter = async()=>{
    const query = {
      city_id:searchCity
    }
    await handleGetJob(1,15,query);
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white px-0 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center mb-2">
            Find your{" "}
            <span className="relative">
              dream job
              <span className="absolute bottom-0 left-0 w-full h-2 bg-blue-200 -z-10"></span>
            </span>
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Find your next career at companies like HubSpot, Nike, and Dropbox
          </p>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-lg shadow-sm border">
              <div className="flex-1 flex items-center">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Job title or keyword"
                  className="w-full border-none focus:ring-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex-1 flex items-center border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4">
                <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full border-none focus:ring-0"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                />
              </div>
              <Button
                onClick={handleSearch}
                type="primary"
                className="bg-indigo-600"
              >
                Search
              </Button>
            </div>
          </div>
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
                {!collapsed && <Button onClick={onFilter} className="ml-2">Lọc</Button>}
              </div>

              {/* Hiển thị nội dung lọc */}
              {!collapsed && (
                <div>
                  <div className="pb-3">
                    <h3 className="font-semibold mb-4">Lọc theo thành phố</h3>
                    <Select
                      defaultValue="thanh_pho_ho_chi_minh"
                      style={{ width: "100%" }}
                      onChange={handleChange}
                      placeholder="Chọn thành phố"
                    >
                      {cities.map((city) => (
                        <Select.Option key={city._id}>
                          {city.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                  {filters.map((section) => (
                    <div key={section.title} className="pb-3">
                      <h3 className="font-semibold mb-4">{section.title}</h3>
                      <div className="space-y-2">
                        {section.items.map((item) => (
                          <label key={item.value} className="flex items-center">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-indigo-600"
                            />
                            <span className="ml-2 text-sm">{item.label}</span>
                            <span className="ml-auto text-sm text-gray-500">
                              ({item.count})
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
              <h2 className="text-lg font-semibold">All Jobs</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select
                  className="text-sm border-gray-300 rounded-md"
                  onChange={(e) => {
                    const selectedSort = e.target.value; // Get selected sort option
                    setSortBy(selectedSort); // Update the sort option

                    let sortCriteria = {};

                    if (selectedSort === "Newest") {
                      sortCriteria = { createdAt: -1 }; // Sort by 'createdAt' in descending order
                    } else if (selectedSort === "Oldest") {
                      sortCriteria = { createdAt: 1 }; // Sort by 'createdAt' in ascending order
                    } else {
                      sortCriteria = {}; // Default case for 'Most relevant' (no sort)
                    }

                    const params = {
                      query: {
                        ...sortCriteria, // Add the sort criteria to the query
                      },
                    };

                    handleGetJob(1, 15, params); // Refetch jobs with new sort criteria
                  }}
                >
                  <option>Most relevant</option>
                  <option>Newest</option>
                  <option>Oldest</option>
                </select>
                <div className="flex gap-1 ml-4">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${
                      viewMode === "grid" ? "bg-gray-100" : ""
                    }`}
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
              {listJobs?.length>0 ? (
                <div>
                  <div
                    className={`grid ${
                      viewMode === "grid" ? "grid-cols-2" : "grid-cols-1"
                    } gap-4`}
                  >
                    {listJobs?.map((job) => (
                      <div
                        key={job?.id}
                        className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={job?.user_id?.avatar_company}
                            alt={"ảnh"}
                            className="w-12 h-12 rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold">{job.title}</h3>
                            <div className="text-sm text-gray-500 mt-1">
                              {job?.user_id?.company_name} •{" "}
                              {job?.user_id?.city_id?.name}
                            </div>
                            <div className="flex gap-2 mt-3">
                              <span className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-600">
                                {job?.job_type?.name}
                              </span>
                              {job?.skills?.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600"
                                >
                                  {tag?.name}
                                </span>
                              ))}
                            </div>
                          </div>
                          <Button type="primary" className="bg-indigo-600">
                            Apply
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <CustomPagination
                    currentPage={meta?.current_page}
                    total={meta?.total}
                    perPage={meta?.per_page}
                    onPageChange={(current, pageSize) => {
                      handleGetJob(current, pageSize);
                    }}
                  />
                </div>
              ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={`Không có dữ liệu`} />}
            </LoadingComponentSkeleton>
          </div>
        </div>
      </main>
    </div>
  );
}
