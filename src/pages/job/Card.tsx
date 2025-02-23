import { Card, Divider, Image, Tag } from "antd";
import { Bookmark } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "moment/locale/vi";
import useMomentFn from "../../hooks/useMomentFn";
interface JobCardType {
  id: string;
  company: string;
  logo: string;
  title: string;
  location: string;
  tags: [];
  level: string;
  postedDays: string;
  isHot: boolean;
  description: string;
  type_of_work: any;
  skills: [];
}
export default function JobCard({
  id,
  company,
  logo,
  title,
  location,
  tags,
  level,
  postedDays,
  isHot = false,
  description,
  type_of_work,
  skills,
}: JobCardType) {
  const navigate = useNavigate();
  const userDetail = useSelector((state) => state.user);
  const onItemClick = () => {
    navigate(`/job-information/${id}`);
  };
  const { formatDate } = useMomentFn();
  return (
    <Card
      className="relative bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onItemClick(id)}
    >
      {isHot && (
        <div className="absolute top-4 right-4">
          <Tag color="red" className="font-bold">
            HOT JOB
          </Tag>
        </div>
      )}
      <div className="flex gap-4">
        <Image
          src={logo}
          alt={company}
          width={60}
          height={60}
          className="rounded"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-red-600 hover:underline cursor-pointer">
              {title}
            </h3>
            <Bookmark className="text-gray-400 text-xl" />
          </div>
          <div className="text-sm text-gray-600 mb-2">{company}</div>
          <div className="text-sm mb-2 flex items-center gap-1">
            <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
            {location} ({type_of_work?.name})
          </div>
          {userDetail?.access_token ? (
            <div className="text-sm mb-2 flex items-center gap-1">
              <span className="w-2 h-2 bg-gray-500 rounded-full"></span>

              <span>{level}</span>
            </div>
          ) : (
            <div className="text-sm mb-2">
              <span className="font-medium">Đăng nhập để xem mức lương</span> •{" "}
              <span className="font-medium">{level}</span> •{" "}
            </div>
          )}
          <ul className="list-disc list-inside text-sm text-gray-600 mb-2">
            {description.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <div className="flex gap-2 flex-wrap mb-2">
            {tags?.map((tag) => (
              <Tag
                key={tag}
                className="bg-blue-50 text-blue-600 border-blue-100"
              >
                {tag?.name}
              </Tag>
            ))}
          </div>
          <div className="text-sm text-gray-500">
            Đăng {formatDate(postedDays)}
          </div>
          {skills.length > 0 && <Divider />}
          {skills?.length > 0 &&
            skills.map((skill, idx) => (
              <>
                <Tag color="blue" key={idx}>
                  {skill?.name}
                </Tag>
              </>
            ))}
        </div>
      </div>
    </Card>
  );
}
