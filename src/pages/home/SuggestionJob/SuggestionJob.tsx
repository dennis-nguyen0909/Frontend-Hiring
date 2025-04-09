import { useEffect, useState } from "react";
import { JobCard } from "./JobCard";
import { JobApi } from "../../../services/modules/jobServices";
import { useSelector } from "react-redux";
import { Job, Meta } from "../../../types";
import CustomPagination from "../../../components/ui/CustomPanigation/CustomPanigation";
import { Empty } from "antd";
import LoadingComponentSkeleton from "../../../components/Loading/LoadingComponentSkeleton";
import { useTranslation } from "react-i18next";

export default function SuggestionJob() {
  const { t } = useTranslation();
  const [jobsSuggests, setJobSuggests] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingCity, setLoadingCity] = useState<boolean>(false);
  const [meta, setMeta] = useState<Meta>({
    current_page: 1,
    per_page: 12,
    total: 0,
  });
  const [jobSuggestionCity, setJobSuggestionCity] = useState<Job[]>([]);
  const userDetail = useSelector((state: any) => state.user);

  const handleSaveJob = (jobId: string) => {
    setJobSuggests((prevJobs) =>
      prevJobs.map((job) =>
        job._id === jobId ? { ...job, isSaved: !job.isSaved } : job
      )
    );
  };

  const getJobSuggestionSkills = async (current = 1, pageSize = 12) => {
    try {
      setLoading(true);
      const params = { current, pageSize };
      const res = await JobApi.getJobSuggestions(
        params,
        userDetail?._id,
        userDetail?.access_token
      );

      if (res.data) {
        setJobSuggests(res.data.items);
        setMeta(res.data.meta);
      } else {
        setJobSuggests([]);
        setMeta({
          current_page: 1,
          per_page: 12,
          total: 0,
        });
      }
      return res;
    } catch (error) {
      console.error(error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getJobSuggestionSkills();
  }, []);

  const getJobSuggestionCity = async (current = 1, pageSize = 12) => {
    try {
      setLoadingCity(true);
      const params = { current, pageSize };
      const res = await JobApi.getJobSuggestsByCity(
        params,
        userDetail?._id,
        userDetail?.access_token
      );

      if (res.data) {
        setJobSuggestionCity(res.data.items);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingCity(false);
    }
  };

  useEffect(() => {
    getJobSuggestionCity();
  }, []);

  return (
    <div className="container mx-auto py-8 mt-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[20px] font-bold text-gray-900">
          {t("job_suggestion")}
        </h1>
      </div>

      <LoadingComponentSkeleton isLoading={loading}>
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
                onPageChange={(current, pageSize) =>
                  getJobSuggestionSkills(current, pageSize)
                }
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
