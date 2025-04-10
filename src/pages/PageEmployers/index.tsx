import { Avatar, Empty, Image, Input } from "antd";
import { Search, MapPin } from "lucide-react";
import { USER_API } from "../../services/modules/userServices";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { Meta } from "../../types";
import CustomPagination from "../../components/ui/CustomPanigation/CustomPanigation";
import { useNavigate } from "react-router-dom";
import { ROLE_API } from "../../services/modules/RoleServices";
import LoadingComponentSkeleton from "../../components/Loading/LoadingComponentSkeleton";
import { getRandomColor } from "../../utils/color.utils";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { RootState } from "../../redux/store/store";

interface Company {
  _id: string;
  avatar_company: string;
  company_name: string;
  district_id?: { name: string };
  city_id?: { name: string };
  jobs_ids?: { _id: string }[];
}

interface CompanyResponse {
  items: Company[];
  meta: Meta;
}

export default function EmployeesPage() {
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchCity, setSearchCity] = useState<string>("");
  const userDetail = useSelector((state: RootState) => state.user);
  const [roleEmployer, setRoleEmployer] = useState<string>("");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const debouncedSearchValue = useDebounce(searchValue, 500);

  // Fetch employer role
  const { data: employerRoleData } = useQuery({
    queryKey: ["employerRole"],
    queryFn: async () => {
      const res = await ROLE_API.getEmployerRole(userDetail?.access_token);
      return res.data;
    },
    enabled: !!userDetail?.access_token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  useEffect(() => {
    if (employerRoleData) {
      setRoleEmployer(employerRoleData._id);
    }
  }, [employerRoleData]);

  // Fetch companies with React Query
  const { data: companiesData, isLoading } = useQuery<CompanyResponse>({
    queryKey: [
      "companies",
      currentPage,
      pageSize,
      debouncedSearchValue,
      searchCity,
      roleEmployer,
    ],
    queryFn: async () => {
      const params = {
        current: currentPage,
        pageSize,
        query: {
          company_name: debouncedSearchValue,
          city_name: searchCity,
          role: roleEmployer,
        },
      };
      const response = await USER_API.getAllCompany(
        params,
        userDetail?.access_token
      );
      return response.data;
    },
    enabled: !!userDetail?.access_token && !!roleEmployer,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const handleNavigate = (id: string) => {
    navigate(`/employer-detail/${id}`);
  };

  const handlePageChange = (current: number, size: number) => {
    setCurrentPage(current);
    setPageSize(size);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Search Section */}
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-6 rounded-lg bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <Input
                size="large"
                placeholder={t("search_company")}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                prefix={<Search className="text-gray-400" size={20} />}
                className="w-full text-[12px]"
              />
            </div>
            <div className="flex-1">
              <Input
                size="large"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder={t("city")}
                prefix={<MapPin className="text-gray-400" size={20} />}
                className="w-full text-[12px]"
              />
            </div>
          </div>
        </div>

        {/* Job Listings Grid */}
        <LoadingComponentSkeleton isLoading={isLoading}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {companiesData?.items &&
              companiesData.items.length > 0 &&
              companiesData.items.map((company, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Image
                        src={company?.avatar_company}
                        alt={company?.company_name}
                        width={60}
                        height={60}
                        preview={false}
                        className="rounded-lg !object-contain"
                        style={{ objectFit: "contain" }}
                      />
                      <div>
                        <h3 className="font-medium text-black">
                          {company?.company_name}
                        </h3>
                        {company?.district_id && company?.city_id && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin size={14} />
                            <span className="text-[12px] text-black">{`${company?.district_id?.name},${company?.city_id?.name}`}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <span
                      className="rounded-full px-2 py-1 text-xs text-white text-[12px] whitespace-nowrap"
                      style={{ backgroundColor: getRandomColor() }}
                    >
                      {t("featured")}
                    </span>
                  </div>
                  <button
                    onClick={() => handleNavigate(company?._id)}
                    className="!text-[12px] w-full rounded-lg bg-black py-2 text-center text-sm font-medium text-white transition-colors hover:bg-gray-700"
                  >
                    {t("location_open")} ({company?.jobs_ids?.length || 0})
                  </button>
                </div>
              ))}
          </div>
        </LoadingComponentSkeleton>
        {(!companiesData?.items || companiesData.items.length === 0) && (
          <Empty
            description={t("no_data")}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}

        {/* Pagination */}
        {companiesData?.items && companiesData.items.length > 0 && (
          <div className="mt-8 flex justify-center">
            <CustomPagination
              currentPage={currentPage}
              perPage={pageSize}
              total={companiesData?.meta?.total || 0}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
