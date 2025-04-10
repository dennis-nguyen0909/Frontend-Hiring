import { useEffect, useState } from "react";
import { JobCard } from "./JobCard";
import { JobApi } from "../../../services/modules/jobServices";
import { useSelector } from "react-redux";
import { Job, Meta } from "../../../types";
import CustomPagination from "../../../components/ui/CustomPanigation/CustomPanigation";
import { Empty } from "antd";
import LoadingComponentSkeleton from "../../../components/Loading/LoadingComponentSkeleton";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

export default function SuggestionJobCity() {
  const { t } = useTranslation();
  const [metaSuggestionCity, setMetaSuggestionCity] = useState<Meta>({
    current_page: 1,
    per_page: 12,
    total: 0,
    count: 0,
    total_pages: 0,
  });

  const userDetail = useSelector((state: any) => state.user);

  const {
    data: jobSuggestionsCityData,
    isLoading: isLoadingJobSuggestionsCity,
  } = useQuery({
    queryKey: [
      "jobSuggestionsCity",
      userDetail?._id,
      metaSuggestionCity.current_page,
      metaSuggestionCity.per_page,
    ],
    queryFn: async () => {
      const params = {
        current: metaSuggestionCity.current_page,
        pageSize: metaSuggestionCity.per_page,
      };
      const res = await JobApi.getJobSuggestsByCity(
        params,
        userDetail?._id,
        userDetail?.access_token
      );
      return res.data;
    },
    enabled: !!userDetail?._id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  const handleSaveJob = (jobId: string) => {
    // This will be handled by the backend API
    console.log("Save job:", jobId);
  };

  const handlePageChange = (current: number, pageSize: number) => {
    setMetaSuggestionCity((prev) => ({
      ...prev,
      current_page: current,
      per_page: pageSize,
    }));
  };

  useEffect(() => {
    if (jobSuggestionsCityData) {
      setMetaSuggestionCity(jobSuggestionsCityData.meta);
    }
  }, [jobSuggestionsCityData]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[20px] font-bold text-gray-900">
          {t("job_suggestion_city")}
        </h1>
      </div>

      <LoadingComponentSkeleton isLoading={isLoadingJobSuggestionsCity}>
        {jobSuggestionsCityData?.items?.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobSuggestionsCityData.items.map((job) => (
                <JobCard key={job._id} job={job} onSave={handleSaveJob} />
              ))}
            </div>

            <div className="mt-8">
              <CustomPagination
                currentPage={metaSuggestionCity.current_page}
                total={metaSuggestionCity.total}
                perPage={metaSuggestionCity.per_page}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-[400px]">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-sm text-gray-500">
                  {t("no_job_near_you")}
                </span>
              }
            />
          </div>
        )}
      </LoadingComponentSkeleton>
    </div>
  );
}
