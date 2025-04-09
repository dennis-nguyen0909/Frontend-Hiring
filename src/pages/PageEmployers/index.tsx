import { Empty, Image, Input } from "antd";
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

interface Company {
  _id: string;
  avatar_company: string;
  company_name: string;
  district_id?: { name: string };
  city_id?: { name: string };
  jobs_ids?: { _id: string }[];
}

interface RootState {
  user: {
    access_token: string;
  };
}

export default function EmployeesPage() {
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchCity, setSearchCity] = useState<string>("");
  const userDetail = useSelector((state: RootState) => state.user);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [meta, setMeta] = useState<Meta>();
  const [roleEmployer, setRoleEmployer] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGetEmployerRole = async () => {
    try {
      const res = await ROLE_API.getEmployerRole(userDetail?.access_token);
      if (res.data) {
        setRoleEmployer(res.data._id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async (
    query: Record<string, string>,
    current = 1,
    pageSize = 15
  ) => {
    try {
      setIsLoading(true);
      const params = {
        current,
        pageSize,
        query,
      };
      const response = await USER_API.getAllCompany(
        params,
        userDetail?.access_token
      );
      if (response.data) {
        setCompanies(response.data.items);
        setMeta(response.data.meta);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetEmployerRole();
    const query = {
      role: roleEmployer,
    };
    if (roleEmployer) {
      handleSearch(query);
    }
  }, [roleEmployer]);

  const debounceSearchValue = useDebounce(searchValue, 500);
  const onSearch = async () => {
    await handleSearch({
      company_name: debounceSearchValue,
      city_name: searchCity,
    });
  };

  const handleNavigate = (id: string) => {
    navigate(`/employer-detail/${id}`);
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
            <button
              onClick={onSearch}
              className="text-[12px] rounded-lg bg-primaryColor px-8 py-2 text-white transition-colors hover:bg-gray-700"
            >
              {t("search")}
            </button>
          </div>
        </div>

        {/* Job Listings Grid */}
        <LoadingComponentSkeleton isLoading={isLoading}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {companies?.length > 0 &&
              companies?.map((company, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-gray-800">
                        <Image
                          src={company?.avatar_company}
                          alt={company?.avatar_company}
                          width={48}
                          height={48}
                          preview={false}
                          className="object-cover"
                        />
                      </div>
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
                      className="rounded-full px-2 py-1 text-xs text-white text-[12px]"
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
        {companies?.length === 0 && (
          <Empty
            description={t("no_data")}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}

        {/* Pagination */}
        {companies.length > 0 && (
          <div className="mt-8 flex justify-center">
            <CustomPagination
              currentPage={meta?.current_page || 1}
              perPage={meta?.per_page || 15}
              total={meta?.total || 0}
              onPageChange={(current, pageSize) =>
                handleSearch({}, current, pageSize)
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
