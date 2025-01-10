import { useEffect, useState } from "react";
import { JobCard } from "./JobCard";
import { JobApi } from "../../../services/modules/jobServices";
import { useSelector } from "react-redux";
import { Meta } from "../../../types";
import CustomPagination from "../../../components/ui/CustomPanigation/CustomPanigation";
import { Empty } from "antd";
import LoadingComponentSkeleton from "../../../components/Loading/LoadingComponentSkeleton";

export default function SuggestionJobCity() {

  const [jobSuggestionCity, setJobSuggestionCity] = useState<[]>([]);
  const [metaSuggestionCity, setMetaSuggestionCity] = useState<Meta>({});
  const [isLoading,setIsLoading]=useState<boolean>(false)

  const userDetail = useSelector((state) => state.user);

  const handleSaveJob = (jobId: string) => {
    setJobs(
      jobs.map((job) =>
        job.id === jobId ? { ...job, isSaved: !job.isSaved } : job
      )
    );
  };

  const getJobSuggestionCity = async (current = 1, pageSize = 12) => {
    try {
      setIsLoading(true)
      const params = {
        current,
        pageSize,
      };
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
      setIsLoading(false)
    }
  };
  useEffect(() => {
    getJobSuggestionCity();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[16px] font-bold text-gray-900">Việc làm gần bạn</h1>
      </div>
     <LoadingComponentSkeleton isLoading={isLoading}>
     {jobSuggestionCity.length> 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Use data from the query hoặc fallback to the FEATURED_JOBS */}
        {(jobSuggestionCity?.length ? jobSuggestionCity : jobSuggestionCity).map((job) => (
          <JobCard key={job?._id} job={job} onSave={handleSaveJob} />
        ))}
      </div>
      ):(
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={`Không có việc làm nào gần bạn`} />
      )}
      {jobSuggestionCity.length > 0 && <CustomPagination
        currentPage={metaSuggestionCity.current_page}
        total={metaSuggestionCity.total}
        perPage={metaSuggestionCity.per_page}
        onPageChange={(current, pageSize) =>
          getJobSuggestionCity(current, pageSize)
        }
      />}
     </LoadingComponentSkeleton>
    </div>
  );
}
