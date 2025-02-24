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

const FeatureJobV2 = () => {
  const [jobs, setJobs] = useState([]);
  const [pageSize, setPageSize] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [meta, setMeta] = useState<Meta>({});
  const [cities, setCities] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("dia_diem");
  const userDetail = useSelector((state) => state.user);
  const [selectedSalary, setSelectedSalary] = useState("all");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  // Fetch cities data
  const handleGetCities = async () => {
    try {
      const res = await CitiesAPI.getCitiesByCode(
        "79",
        userDetail.access_token
      );
      if (res.data) {
        setCities(res.data);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  // Fetch jobs with the query parameters
  const handleGetAllJobs = async ({
    current = 1,
    pageSize = 10,
    query = {},
  }) => {
    try {
      setIsLoading(true);
      const params = {
        current,
        pageSize,
        query: {
          is_active: true,
          ...query,
        },
      };

      // Add city and district filters only when 'dia_diem' is selected
      if (selectedFilter === "dia_diem") {
        params.query.city_id = selectedCity;
        params.query.district_id = selectedDistrict;
      }

      const res = await JobApi.getAllJobs(params, userDetail.access_token);
      if (res.data) {
        setJobs(res.data.items);
        setMeta(res.data.meta);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle city selection change
  const handleChangeSelectedLocation = (location: string) => {
    setSelectedCity(location);
  };

  // Handle pagination change
  const onChangePagination = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      handleGetAllJobs({ current: page, pageSize });
    }
  };

  const handleChangeFilter = (value: string) => {
    setSelectedFilter(value);
    if (value === "dia_diem") {
      handleGetCities();
    } else {
      setSelectedCity("");
      setSelectedDistrict("");
    }
  };

  useEffect(() => {
    handleGetCities();
  }, []);

  useEffect(() => {
    handleGetAllJobs({
      query: { city_id: selectedCity, district_id: selectedDistrict },
    });
  }, [selectedCity, selectedDistrict, selectedFilter]);

  const onViewAll = () => {
    navigate("/jobs");
  };
  const handleChangeSelectedSalary = async (salaryRange: {
    min?: number;
    max?: number;
    is_negotiable?: boolean;
    value?: string;
  }) => {
    setSelectedSalary(salaryRange);
    let query: any = {};
    // Handle salary ranges
    switch (salaryRange) {
      case "all":
        query = {};
        break;
      case "thoa_thuan":
        query = { is_negotiable: true };
        break;
      case "under_10m":
        query = { salary_range_min: 0, salary_range_max: 10000000 };
        break;
      case "10m_to_15m":
        query = { salary_range_min: 10000000, salary_range_max: 15000000 };
        break;
      case "15m_to_20m":
        query = { salary_range_min: 15000000, salary_range_max: 20000000 };
        break;
      case "20m_to_25m":
        query = { salary_range_min: 20000000, salary_range_max: 25000000 };
        break;
      case "25m_to_30m":
        query = { salary_range_min: 25000000, salary_range_max: 30000000 };
        break;
      case "30m_to_50m":
        query = { salary_range_min: 30000000, salary_range_max: 50000000 };
        break;
      case "above_50m":
        query = { salary_range_min: 50000000, salary_range_max: Infinity };
        break;
      default:
        query = {
          salary_range_min: salaryRange.min,
          salary_range_max: salaryRange.max,
        };
    }
    await handleGetAllJobs({ query });
  };

  return (
    <div className="px-5 md:px-primary h-auto mb-[20px] bg-[#f3f5f7] pb-[100px] pt-[10px]">
      <div
        className="flex justify-between items-center"
        // style={{ margin: "50px 0" }}
      >
        <h1 className="text-textBlack text-[20px] font-medium">
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
                // { value: "muc_luong", label: <span className="!text-[12px]">Mức lương</span> },
                // { value: "kinh_nghiem", label: <span className="!text-[12px]">Kinh Nghiệm</span> },
                // { value: "nghe_nghiep", label: <span className="!text-[12px]">Nghề nghiệp</span> },
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
            {jobs?.map((job, idx) => (
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
