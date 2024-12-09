import { useEffect, useState } from "react";
import { JobCard } from "./JobCard";
import { JobApi } from "../../../services/modules/jobServices";
import { useSelector } from "react-redux";
import { Job, Meta } from "../../../types";
import CustomPagination from "../../../components/ui/CustomPanigation/CustomPanigation";
import { current } from "@reduxjs/toolkit";

export default function SuggestionJob() {
  const [jobsSuggests, setJobSuggests] = useState<[]>([]);
  const [meta, setMeta] = useState<Meta>({});
  const [jobSuggestionCity, setJobSuggestionCity] = useState<[]>([]);
  const [metaSuggestionCity, setMetaSuggestionCity] = useState<Meta>({});

  const userDetail = useSelector((state) => state.user);

  const handleSaveJob = (jobId: string) => {
    setJobs(
      jobs.map((job) =>
        job.id === jobId ? { ...job, isSaved: !job.isSaved } : job
      )
    );
  };

  const getJobSuggestionSkills = async (current = 1, pageSize = 12) => {
    try {
      const params = { current, pageSize };
      const res = await JobApi.getJobSuggestions(
        params,
        userDetail._id,
        userDetail?.access_token
      );
      if (res.data) {
        setJobSuggests(res.data.items);
        setMeta(res.data.meta);
      } else {
        setJobSuggests([]);
        setMeta({});
      }
      return res; // return the fetched data
    } catch (error) {
      console.error(error);
      return []; // return an empty array in case of an error
    }
  };
  useEffect(() => {
    getJobSuggestionSkills();
  }, []);

  const getJobSuggestionCity = async (current = 1, pageSize = 12) => {
    try {
      const params = {
        current,
        pageSize,
      };
      const res = await JobApi.getJobSuggestsByCity(
        params,
        userDetail?._id,
        userDetail?.access_token
      );
      console.log("res,res", res);
      if (res.data) {
        setJobSuggestionCity(res.data.items);
        setMetaSuggestionCity(res.data.meta);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getJobSuggestionCity();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Gợi ý việc làm</h1>
        {/* <a href="#" className="text-blue-500 hover:text-blue-600 flex items-center gap-1">
          View All
          <span className="text-lg">→</span>
        </a> */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Use data from the query or fallback to the FEATURED_JOBS */}
        {(jobsSuggests?.length ? jobsSuggests : jobsSuggests).map((job) => (
          <JobCard key={job?._id} job={job} onSave={handleSaveJob} />
        ))}
      </div>

      <CustomPagination
        currentPage={meta.current_page}
        total={meta.total}
        perPage={meta.per_page}
        onPageChange={(current, pageSize) =>
          getJobSuggestionSkills(current, pageSize)
        }
      />
    </div>
  );
}
