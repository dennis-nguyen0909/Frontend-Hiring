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

export default function SuggestionJob() {
  const { t } = useTranslation();
  const [jobsSuggests, setJobSuggests] = useState<Job[]>([]);
  const [meta, setMeta] = useState<Meta>({
    current_page: 1,
    per_page: 12,
    total: 0,
    count: 0,
    total_pages: 0,
  });
  const userDetail = useSelector((state: any) => state.user);

  const handleSaveJob = (jobId: string) => {
    setJobSuggests((prevJobs) =>
      prevJobs.map((job) =>
        job._id === jobId ? { ...job, isSaved: !job.isSaved } : job
      )
    );
  };

  const { data: jobSuggestionsData, isLoading: isLoadingJobSuggestions } =
    useQuery({
      queryKey: [
        "jobSuggestions",
        userDetail?._id,
        meta.current_page,
        meta.per_page,
      ],
      queryFn: async () => {
        const params = { current: meta.current_page, pageSize: meta.per_page };
        const res = await JobApi.getJobSuggestions(
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

  const {
    data: jobSuggestionsCityData,
    isLoading: isLoadingJobSuggestionsCity,
  } = useQuery({
    queryKey: ["jobSuggestionsCity", userDetail?._id],
    queryFn: async () => {
      const params = { current: 1, pageSize: 12 };
      const res = await JobApi.getJobSuggestsByCity(
        params,
        userDetail?._id,
        userDetail?.access_token
      );
      return res.data;
    },
    enabled: !!userDetail?._id,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (jobSuggestionsData) {
      setJobSuggests(jobSuggestionsData.items);
      setMeta(jobSuggestionsData.meta);
    }
  }, [jobSuggestionsData]);

  const handlePageChange = (current: number, pageSize: number) => {
    setMeta((prev) => ({ ...prev, current_page: current, per_page: pageSize }));
  };

  return (
    <div className="container mx-auto py-8 mt-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[20px] font-bold text-gray-900">
          {t("job_suggestion")}
        </h1>
      </div>

      <LoadingComponentSkeleton isLoading={isLoadingJobSuggestions}>
        {jobsSuggests.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobsSuggests.map((job) => (
                <JobCard key={job._id} job={job} onSave={handleSaveJob} />
              ))}
            </div>

            <div className="mt-8">
              <CustomPagination
                currentPage={meta.current_page}
                total={meta.total}
                perPage={meta.per_page}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-[400px]">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-gray-500 text-sm">
                  {t("no_job_suggestion")}
                </span>
              }
            />
          </div>
        )}
      </LoadingComponentSkeleton>
    </div>
  );
}
