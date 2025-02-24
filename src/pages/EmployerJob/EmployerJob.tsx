import type React from "react";
import {
  List,
  Typography,
  Space,
  Tag,
  Avatar,
  Empty,
  Image,
  Card,
  Select,
  Input,
  Button,
} from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { JobApi } from "../../services/modules/jobServices";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { useEffect, useState } from "react";
import { Job, Meta } from "../../types";
import CustomPagination from "../../components/ui/CustomPanigation/CustomPanigation";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDebounce } from "../../hooks/useDebounce"; // Assuming you have a debounce hook
import { getRandomColor } from "../../utils/color.utils";
import { useJobType } from "../../hooks/useJobType";
import { useContractType } from "../../hooks/useContractType";
import useMomentFn from "../../hooks/useMomentFn";
import { useTranslation } from "react-i18next";

const { Title } = Typography;
const { Option } = Select;

const EmployerJob: React.FC = () => {
  const { t } = useTranslation();
  const { formatDate } = useMomentFn();
  const userDetail = useSelector((state: RootState) => state.user);
  const params = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [meta, setMeta] = useState<Meta>();
  const [sortOrder, setSortOrder] = useState<string>("newest");
  const [keyword, setKeyword] = useState<string>("");
  const [selectedJobType, setSelectedJobType] = useState<string | undefined>(
    undefined
  );
  const [selectedJobContractType, setSelectedJobContractType] = useState<
    string | undefined
  >(undefined);
  const { data: jobType } = useJobType();
  const { data: jobContractType } = useContractType();
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const debouncedKeyword = useDebounce(keyword, 500);

  const handleJobClick = (job: Job) => {
    console.log("Job clicked:", job);
    navigate(`/job-information/${job._id}`);
  };

  const handleGetJob = async (
    current = 1,
    pageSize = 5,
    order = "newest",
    searchKeyword = "",
    jobTypeFilter = "",
    jobContractTypeFilter = ""
  ) => {
    try {
      const res = await JobApi.getAllJobsQuery(
        {
          current,
          pageSize,
          query: {
            user_id: params.id,
            sort: order === "newest" ? "-createdAt" : "createdAt",
            keyword: searchKeyword,
            job_type: jobTypeFilter,
            job_contract_type: jobContractTypeFilter,
          },
        },
        userDetail?.access_token
      );
      if (res?.data) {
        setJobs(res.data.items);
        setMeta(res.data.meta);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetJob(
      1,
      5,
      sortOrder,
      debouncedKeyword,
      selectedJobType,
      selectedJobContractType
    );
  }, [sortOrder, debouncedKeyword, selectedJobType, selectedJobContractType]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          height={500}
          width={2000}
          src={state?.banner_company}
          alt="Company banner"
          className="object-cover w-full h-full brightness-50"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
          <h2 className="text-3xl font-bold">{state?.company_name}</h2>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
        <Card className="shadow-lg mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <Avatar src={state?.avatar_company} size={64} />
              <div>
                <h1 className="text-2xl font-semibold">
                  {state?.company_name}
                </h1>
                <p className="text-gray-500">
                  {state?.organization?.industry_type}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="text-2xl font-semibold max-w-7xl mx-auto px-4">
        {t("location_open")}
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-5">
        <Button
          type="primary"
          icon={<FilterOutlined />}
          onClick={() => setShowFilters(!showFilters)}
          className="mb-4 !bg-black"
        >
          {t("filter")}
        </Button>
        <div
          className={`flex flex-col sm:flex-row flex-wrap gap-4 mb-4 transition-all duration-500 ${
            showFilters ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden ${
            window.innerWidth > 678 ? "justify-between" : "md:justify-start"
          }`}
        >
          <Input
            placeholder={t("search_job")}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ width: 300, marginBottom: 20 }}
          />
          <Select
            defaultValue="newest"
            style={{ width: 200, marginBottom: 20 }}
            onChange={(value) => setSortOrder(value)}
          >
            <Option value="newest">{t("newest")}</Option>
            <Option value="oldest">{t("oldest")}</Option>
          </Select>
          <Select
            placeholder={t("job_type")}
            style={{ width: 200, marginBottom: 20 }}
            onChange={(value) => setSelectedJobType(value)}
            allowClear
          >
            {jobType?.map((type) => (
              <Option key={type._id} value={type._id}>
                {type.name}
              </Option>
            ))}
          </Select>
          <Select
            placeholder={t("job_contract_type")}
            style={{ width: 200, marginBottom: 20 }}
            onChange={(value) => setSelectedJobContractType(value)}
            allowClear
          >
            {jobContractType?.map((type) => (
              <Option key={type._id} value={type._id}>
                {type.name}
              </Option>
            ))}
          </Select>
        </div>
        {jobs.length > 0 ? (
          <List
            itemLayout="vertical"
            size="large"
            dataSource={jobs}
            renderItem={(job) => (
              <List.Item
                key={job._id}
                onClick={() => handleJobClick(job)}
                className="bg-white border border-gray-200 rounded-lg mb-4 p-4 cursor-pointer hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                  <Title level={4} className="text-black m-0">
                    {job?.title}
                  </Title>
                  <div>
                    <Tag color="black" className="mt-2 sm:mt-0">
                      {t(job?.job_type?.key)}
                    </Tag>
                    <Tag color="black" className="mt-2 sm:mt-0">
                      {t(job?.job_contract_type?.key)}
                    </Tag>
                  </div>
                </div>
                <Space className="flex-col items-start md:flex-row md:items-center">
                  <div className="flex items-center gap-2">
                    <EnvironmentOutlined />
                    {job?.district_id?.name},{job?.city_id?.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarOutlined />
                    {t("posted_date")} {formatDate(job?.createdAt)}
                  </div>
                </Space>
                <div className="mt-2">
                  {job?.skills?.map((skill, idx) => {
                    return (
                      <Tag key={idx} color={getRandomColor()}>
                        {skill?.name}
                      </Tag>
                    );
                  })}
                </div>
              </List.Item>
            )}
          />
        ) : (
          <Empty
            description={t("no_data")}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </div>
      <div className="pb-20 pt-10">
        {jobs.length > 0 && (
          <CustomPagination
            currentPage={meta?.current_page || 1}
            perPage={meta?.per_page || 5}
            total={meta?.total || 0}
            onPageChange={(current, pageSize) =>
              handleGetJob(
                current,
                pageSize,
                sortOrder,
                debouncedKeyword,
                selectedJobType,
                selectedJobContractType
              )
            }
          />
        )}
      </div>
    </div>
  );
};

export default EmployerJob;
