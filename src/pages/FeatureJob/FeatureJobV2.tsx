import { Empty, Select } from "antd";
import { useEffect, useState } from "react";
import { AlignLeftOutlined } from "@ant-design/icons";
import LocationSlider from "../../components/LocationSlider/LocationSlider";
import { JobApi } from "../../services/modules/jobServices";
import { CitiesAPI } from "../../services/modules/citiesServices";
import { useSelector } from "react-redux";
import CustomPagination from "../../components/ui/CustomPanigation/CustomPanigation";
import SliderSalary from "../../components/SalarySlider/SalarySlider";
import { JobCard } from "../home/SuggestionJob/JobCard";
import LoadingComponentSkeleton from "../../components/Loading/LoadingComponentSkeleton";
import ButtonComponent from "../../components/Button/ButtonComponent";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Meta } from "../../types";
import { useQuery } from "@tanstack/react-query";

const FeatureJobV2 = () => {
  const [pageSize, setPageSize] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("dia_diem");
  const userDetail = useSelector((state) => state.user);
  const [selectedSalary, setSelectedSalary] = useState("all");
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Fetch cities data with React Query
  const { data: cities } = useQuery({
    queryKey: ["cities", "79"],
    queryFn: () => CitiesAPI.getCitiesByCode("79", userDetail.access_token),
    enabled: selectedFilter === "dia_diem",
    select: (data) => data.data,
  });

  // Build query parameters for jobs
  const buildJobQuery = () => {
    const baseQuery = { is_active: true };

    if (selectedFilter === "dia_diem") {
      return {
        ...baseQuery,
        city_id: selectedCity,
        district_id: selectedDistrict,
      };
    }

    if (selectedSalary !== "all") {
      switch (selectedSalary) {
        case "thoa_thuan":
          return { ...baseQuery, is_negotiable: true };
        case "under_10m":
          return {
            ...baseQuery,
            salary_range_min: 0,
            salary_range_max: 10000000,
          };
        case "10m_to_15m":
          return {
            ...baseQuery,
            salary_range_min: 10000000,
            salary_range_max: 15000000,
          };
        case "15m_to_20m":
          return {
            ...baseQuery,
            salary_range_min: 15000000,
            salary_range_max: 20000000,
          };
        case "20m_to_25m":
          return {
            ...baseQuery,
            salary_range_min: 20000000,
            salary_range_max: 25000000,
          };
        case "25m_to_30m":
          return {
            ...baseQuery,
            salary_range_min: 25000000,
            salary_range_max: 30000000,
          };
        case "30m_to_50m":
          return {
            ...baseQuery,
            salary_range_min: 30000000,
            salary_range_max: 50000000,
          };
        case "above_50m":
          return {
            ...baseQuery,
            salary_range_min: 50000000,
            salary_range_max: Infinity,
          };
        default:
          return baseQuery;
      }
    }

    return baseQuery;
  };

  // Fetch jobs with React Query
  const { data: jobsData, isLoading } = useQuery({
    queryKey: [
      "jobs",
      currentPage,
      pageSize,
      selectedCity,
      selectedDistrict,
      selectedFilter,
      selectedSalary,
    ],
    queryFn: () =>
      JobApi.getAllJobs(
        {
          current: currentPage,
          pageSize,
          query: buildJobQuery(),
        },
        userDetail.access_token
      ),
    select: (data) => data.data,
  });

  const jobs = jobsData?.items || [];
  const meta = jobsData?.meta || {};

  // Handle city selection change
  const handleChangeSelectedLocation = (location: string) => {
    setSelectedCity(location);
  };

  // Handle pagination change
  const onChangePagination = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const handleChangeFilter = (value: string) => {
    setSelectedFilter(value);
    if (value !== "dia_diem") {
      setSelectedCity("");
      setSelectedDistrict("");
    }
  };

  const onViewAll = () => {
    navigate("/jobs");
  };

  const handleChangeSelectedSalary = (salaryRange: {
    min?: number;
    max?: number;
    is_negotiable?: boolean;
    value?: string;
  }) => {
    setSelectedSalary(salaryRange.value || "all");
  };

  return (
    <div className="px-5 md:px-primary h-auto mb-[20px] bg-white pb-[100px] pt-[10px]">
      <div className="flex justify-between items-center">
        <h1 className="text-[20px] font-bold text-gray-900">
          {t("feature_job")}
        </h1>
        <ButtonComponent onClick={onViewAll}>
          <div className="text-[12px]">{t("view_all")}</div>
        </ButtonComponent>
      </div>

      {/* Filter Section */}
      <div className="mb-4 mt-5">
        <div className="flex flex-wrap items-center">
          <div className="w-full md:w-1/3">
            <Select
              size="middle"
              suffixIcon={<AlignLeftOutlined />}
              defaultValue={"dia_diem"}
              style={{ width: "100%", fontSize: "12px" }}
              className="!text-[12px]"
              onChange={handleChangeFilter}
              options={[
                {
                  value: "dia_diem",
                  label: <span className="!text-[12px]">{t("location")}</span>,
                },
              ]}
            />
          </div>
          {selectedFilter === "dia_diem" && (
            <div className="w-full md:w-2/3">
              <LocationSlider
                dataCity={cities}
                selectedDistrict={selectedDistrict}
                setSelectedDistrict={setSelectedDistrict}
                setSelectedCity={setSelectedCity}
                selectedCity={selectedCity}
                handleChangeSelectedLocation={handleChangeSelectedLocation}
              />
            </div>
          )}
          {selectedFilter === "muc_luong" && (
            <div className="w-full md:w-2/3">
              <SliderSalary
                selectedSalary={selectedSalary}
                handleChangeSelectedSalary={handleChangeSelectedSalary}
              />
            </div>
          )}
        </div>
      </div>

      <LoadingComponentSkeleton isLoading={isLoading}>
        {/* Job Listing */}
        {jobs?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs?.map((job) => (
              <JobCard key={job?._id} job={job} />
            ))}
          </div>
        ) : (
          <div className="min-h-[300px] flex items-center justify-center">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={"Không có dữ liệu"}
            />
          </div>
        )}

        {/* Pagination */}
        {jobs?.length > 0 && (
          <CustomPagination
            currentPage={meta?.current_page}
            total={meta?.total}
            perPage={meta?.per_page}
            onPageChange={onChangePagination}
          />
        )}
      </LoadingComponentSkeleton>
    </div>
  );
};

export default FeatureJobV2;
