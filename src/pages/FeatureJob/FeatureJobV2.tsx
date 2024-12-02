import { Button, Empty, Image, Select } from "antd";
import { useEffect, useState } from "react";
import arrowRight from "../../assets/icons/arrowRight.png";
import { AlignLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import LocationSlider from "../../components/LocationSlider/LocationSlider";
import JobItem from "../../components/ui/JobItem";
import { JobApi } from "../../services/modules/jobServices";
import { CitiesAPI } from "../../services/modules/citiesServices";
import { useSelector } from "react-redux";
import CustomPagination from "../../components/ui/CustomPanigation/CustomPanigation";
import SliderSalary from "../../components/SalarySlider/SalarySlider";

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

  // Hàm handle khi thay đổi mức lương
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

  const handleChangeSelectedSalary = async (salaryRange: {
    min?: number;
    max?: number;
    is_negotiable?: boolean;
    value?: string;
  }) => {
    setSelectedSalary(salaryRange);
    let query: any = {};
    // Kiểm tra nếu chọn tất cả
    if (salaryRange === "all") {
      query = {}; // Không thêm filter về salary
    } else if (salaryRange === "thoa_thuan") {
      query = { is_negotiable: true }; // Thỏa thuận
    } else if (salaryRange === "under_10m") {
      query = {
        salary_range_min: 0,
        salary_range_max: 10000000,
      };
    }
    else if (salaryRange === "10m_to_15m") {
      query = {
        salary_range_min: 10000000,
        salary_range_max: 15000000,
      };
    }
    else if (salaryRange === "15m_to_20m") {
      query = {
        salary_range_min: 15000000,
        salary_range_max: 20000000,
      };
    }
    else if (salaryRange === "20m_to_25m") {
      query = {
        salary_range_min: 20000000,
        salary_range_max: 25000000,
      };
    }
    else if (salaryRange === "25m_to_30m") {
      query = {
        salary_range_min: 25000000,
        salary_range_max: 30000000,
      };
    }
    else if (salaryRange === "30m_to_50m") {
      query = {
        salary_range_min: 30000000,
        salary_range_max: 50000000,
      };
    }
    else if (salaryRange === "above_50m") {
      query = {
        salary_range_min: 50000000,
        salary_range_max: Infinity,
      };
    }
    else {
      query = {
        salary_range_min: salaryRange.min,
        salary_range_max: salaryRange.max,
      };
    }

    await handleGetAllJobs({ query });
  };

  return (
    <div className="px-5 md:px-primary h-auto mb-[150px] bg-[#f3f5f7] pb-[100px] pt-[10px]">
      <div
        className="flex justify-between items-center h-1/4"
        style={{ margin: "50px 0" }}
      >
        <h1 className="text-textBlack text-3xl font-medium">
          Việc làm tốt nhất
        </h1>
        <div className="relative flex items-center">
          <Button className="text-primary w-[130px] h-[40px]">
            Xem tất cả
            <ArrowRightOutlined className="font-bold" />
          </Button>
          <Image src={arrowRight} preview={false} className="z-100 absolute" />
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-4">
        <div className="flex items-center">
          <div className="w-1/3">
            <Select
              size="large"
              suffixIcon={<AlignLeftOutlined />}
              defaultValue={"dia_diem"}
              style={{ width: 200 }}
              onChange={handleChangeFilter}
              options={[
                { value: "dia_diem", label: "Địa điểm" },
                { value: "muc_luong", label: "Mức lương" },
                { value: "kinh_nghiem", label: "Kinh Nghiệm" },
                { value: "nghe_nghiep", label: "Nghề nghiệp", disabled: true },
              ]}
            />
          </div>
          {selectedFilter === "dia_diem" && (
            <div className="w-2.5/3">
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
            <div className="w-2.5/3">
              <SliderSalary
                selectedSalary={selectedSalary}
                handleChangeSelectedSalary={handleChangeSelectedSalary}
              />
            </div>
          )}
        </div>
      </div>

      {/* Job Listing */}
      {jobs?.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {jobs.map((job, idx) => (
            <JobItem item={job} key={idx} />
          ))}
        </div>
      ) : (
        <div className="min-h-[300px] flex items-center justify-center">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      )}

      {/* Pagination */}
      <CustomPagination
        currentPage={meta?.current_page}
        total={meta?.total}
        perPage={meta?.per_page}
        onPageChange={onChangePagination}
      />
    </div>
  );
};

export default FeatureJobV2;
