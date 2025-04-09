import { useEffect, useState } from "react";
import { JobCard } from "./JobCard";
import { JobApi } from "../../../services/modules/jobServices";
import { useSelector } from "react-redux";
import { Job, Meta } from "../../../types";
import CustomPagination from "../../../components/ui/CustomPanigation/CustomPanigation";
import { Empty } from "antd";
import LoadingComponentSkeleton from "../../../components/Loading/LoadingComponentSkeleton";
import { useTranslation } from "react-i18next";

export default function SuggestionJobCity() {
  const { t } = useTranslation();
  const [jobSuggestionCity, setJobSuggestionCity] = useState<Job[]>([]);
  const [metaSuggestionCity, setMetaSuggestionCity] = useState<Meta>({
    current_page: 1,
    per_page: 12,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const userDetail = useSelector((state: any) => state.user);

  const handleSaveJob = (jobId: string) => {
    setJobSuggestionCity((prevJobs) =>
      prevJobs.map((job) =>
        job._id === jobId ? { ...job, isSaved: !job.isSaved } : job
      )
    );
  };

  const getJobSuggestionCity = async (current = 1, pageSize = 12) => {
    try {
      setIsLoading(true);
      const params = { current, pageSize };
      const res = await JobApi.getJobSuggestsByCity(
        params,
        userDetail?._id,
        userDetail?.access_token
      );

      if (res.data) {
        setJobSuggestionCity(res.data.items);
        setMetaSuggestionCity(res.data.meta);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getJobSuggestionCity();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[20px] font-bold text-gray-900">
          {t("job_suggestion_city")}
        </h1>
      </div>

      <LoadingComponentSkeleton isLoading={isLoading}>
        {jobSuggestionCity.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobSuggestionCity.map((job) => (
                <JobCard key={job._id} job={job} onSave={handleSaveJob} />
              ))}
            </div>

            <div className="mt-8">
              <CustomPagination
                currentPage={metaSuggestionCity.current_page}
                total={metaSuggestionCity.total}
                perPage={metaSuggestionCity.per_page}
                onPageChange={(current, pageSize) =>
                  getJobSuggestionCity(current, pageSize)
                }
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
