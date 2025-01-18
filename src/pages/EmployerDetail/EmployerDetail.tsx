import { Button, Card, Avatar, Image } from "antd";
import {
  InstagramOutlined,
  FacebookOutlined,
  TwitterOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import { USER_API } from "../../services/modules/userServices";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import parse from "html-react-parser";
import { JobApi } from "../../services/modules/jobServices";
import JobCard from "./JobCard";
import LoadingComponentSkeleton from "../../components/Loading/LoadingComponentSkeleton";
import SocialLogin from "../../components/ui/SocialLogin/SocialLogin";

export default function EmployerDetail() {
  const { id } = useParams();
  const userDetail = useSelector((state) => state.user);
  const [employerDetail, setEmployerDetail] = useState();
  const [loading, setLoading] = useState<boolean>(false);
  const [jobs, setJobs] = useState<Array<any>>([]);
  const navigate = useNavigate();
  
  useEffect(()=>{
    if(!userDetail?.access_token){
      navigate('/')
    }
  },[userDetail?.access_token])

  const handleGetDetailEmployerDetail = async () => {
    try {
      setLoading(true)
      const res = await USER_API.getDetailUser(id, userDetail?.access_token);
      if (res.data) {
        setEmployerDetail(res.data.items);
      }
    } catch (error) {
      console.error(error);
    } finally{
      setLoading(false)
    }
  };
  useEffect(() => {
    if (id) {
      handleGetDetailEmployerDetail();
    }
  }, [id]);

  const handleGetJob = async (current = 1, pageSize = 10) => {
    try {
      const params = {
        current,
        pageSize,
        query: {
          user_id: id,
        },
      };
      const res = await JobApi.getAllJobs(params, userDetail?.access_token);
      if (res.data) {
        setJobs(res.data.items);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    handleGetJob();
  }, []);

  const facebookLink = employerDetail?.social_links?.find(
    (link) => link.type === "Facebook"
  );
  const twitterLink = employerDetail?.social_links?.find(
    (link) => link.type === "Twitter"
  );
  const instagramLink = employerDetail?.social_links?.find(
    (link) => link.type === "Instagram"
  );
  const youtubeLink = employerDetail?.social_links?.find(
    (link) => link.type === "Youtube"
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <LoadingComponentSkeleton isLoading={loading}>
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          height={500}
          width={2000} 
          src={employerDetail?.banner_company}
          alt="Company banner"
          className="object-cover w-full h-full brightness-50"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30"></div>{" "}
        {/* Mờ tối phần overlay */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
          <h2 className="text-3xl font-bold">{employerDetail?.company_name}</h2>
          {/* <p className="text-lg mt-2">Khẩu hiệu hoặc Mô tả</p> */}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
        <Card className="shadow-lg mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <Avatar src={employerDetail?.avatar_company} size={64} />
              <div>
                <h1 className="text-2xl font-semibold">
                  {employerDetail?.company_name}
                </h1>
                <p className="text-gray-500">
                  {employerDetail?.organization?.industry_type}
                </p>
              </div>
            </div>
            <Button type="primary" size="large" className="bg-blue-600">
              Xem vị trí mở→
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-8">
            {/* Mô tả */}
            <Card title="Mô tả" className="shadow-sm">
              <p className="text-gray-600">
                {parse(employerDetail?.description || "")}
              </p>
            </Card>

            {/* Lợi ích công ty */}
            <Card title="Lợi ích công ty" className="shadow-sm">
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>In hac habitasse platea dictumst.</li>
                <li>
                  Sed aliquet, arcu eget pretium bibendum, odio enim rutrum
                  arcu.
                </li>
                <li>Vestibulum id vestibulum odio.</li>
                <li>
                  Etiam libero ante accumsan id tellus venenatis rhoncus
                  volutpate velit.
                </li>
                <li>Nam condimentum sit amet ipsum id malesuada.</li>
              </ul>
            </Card>

            {/* Tầm nhìn công ty */}
            <Card title="Tầm nhìn công ty" className="shadow-sm">
              <p className="text-gray-600">
                {parse(employerDetail?.organization?.company_vision || "")}
              </p>
            </Card>

            {/* Share Profile */}
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Share profile:</span>
              <div className="flex gap-4 ">
                {facebookLink && (
                  <Link
                    to={facebookLink.url}
                    target="_blank"
                    className="text-blue-600 hover:text-blue-800 items-center justify-center"
                  >
                    <FacebookOutlined className="text-2xl" />
                  </Link>
                )}
                {twitterLink && (
                  <Link
                    to={twitterLink.url}
                    target="_blank"
                    className="text-blue-400 hover:text-blue-600 items-center justify-center"
                  >
                    <TwitterOutlined className="text-2xl" />
                  </Link>
                )}
                {instagramLink && (
                  <Link
                    to={instagramLink.url}
                    target="_blank"
                    className="text-pink-600 hover:text-pink-800 items-center justify-center"
                  >
                    <InstagramOutlined className="text-2xl" />
                  </Link>
                )}
                {youtubeLink && (
                  <Link
                    to={youtubeLink.url}
                    target="_blank"
                    className="text-red-600 hover:text-red-800 items-center justify-center"
                  >
                    <YoutubeOutlined className="text-2xl" />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Thông tin liên hệ */}
            <Card title="Thông tin liên hệ" className="shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">🌐</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">WEBSITE</p>
                    <Link
                      href="https://www.estheroward.com"
                      className="text-blue-600 hover:underline"
                    >
                      {employerDetail?.organization?.company_website}
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">📞</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">PHONE</p>
                    <p>{employerDetail?.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">✉️</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">EMAIL ADDRESS</p>
                    <p>{employerDetail?.email}</p>
                  </div>
                </div>
              </div>
            </Card>


            {/* Thông tin công ty */}
            <Card className="shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">📅</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">ĐƯỢC THÀNH LẬP</p>
                    <p className="font-medium">
                      {employerDetail?.organization?.year_of_establishment}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">🏢</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">LOẠI TỔ CHỨC</p>
                    <p className="font-medium">
                      {employerDetail?.organization?.organization_type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">👥</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">QUY MÔ</p>
                    <p className="font-medium">
                      {employerDetail?.organization?.team_size}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">💻</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">LOẠI NGÀNH</p>
                    <p className="font-medium">
                      {employerDetail?.organization?.industry_type}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Social Media */}
            <Card title="Theo dõi chúng tôi trên :" className="shadow-sm">
              <div className="flex gap-4">
                {facebookLink && (
                  <Link
                    to={facebookLink.url}
                    target="_blank"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FacebookOutlined className="text-2xl" />
                  </Link>
                )}
                {twitterLink && (
                  <Link
                    to={twitterLink.url}
                    target="_blank"
                    className="text-blue-400 hover:text-blue-600"
                  >
                    <TwitterOutlined className="text-2xl" />
                  </Link>
                )}
                {instagramLink && (
                  <Link
                    to={instagramLink.url}
                    target="_blank"
                    className="text-pink-600 hover:text-pink-800"
                  >
                    <InstagramOutlined className="text-2xl" />
                  </Link>
                )}
                {youtubeLink && (
                  <Link
                    to={youtubeLink.url}
                    target="_blank"
                    className="text-red-600 hover:text-red-800"
                  >
                    <YoutubeOutlined className="text-2xl" />
                  </Link>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Open Positions */}
        <div className="mt-12 pb-10">
          <h2 className="text-2xl font-semibold mb-6">Vị trí mở({jobs.length || 0})</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {jobs.map((job, idx) => {
              return (
                <>
                <JobCard
                  id={job?._id}
                  avatar={job?.user_id?.avatar_company}
                  title={job?.title}
                  type={job?.job_contract_type?.name}
                  salary={
                    job?.is_negotiable
                    ? "Negotiable"
                    : `Salary : ${job?.salary_range?.min}${job?.type_money?.symbol} - ${job?.salary_range?.min}${job?.type_money?.symbol}`
                  }
                  company={job?.user_id?.company_name}
                  location={`${job?.user_id?.district_id?.name},${job?.user_id?.city_id?.name}`}
                  />
                  </>
              );
            })}
          </div>
        </div>
      </div>
      </LoadingComponentSkeleton>
    </div>
  );
}

