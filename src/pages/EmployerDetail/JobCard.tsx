import { Avatar, Button, Card } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function JobCard({
  title,
  type,
  salary,
  company,
  location,
  avatar,
  id,
}: {
  id: string;
  title: string;
  type: string;
  salary: string;
  company: string;
  location: string;
  avatar: string;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <Card
      onClick={() => navigate(`/job-information/${id}`)}
      className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`
                  text-xs px-2 py-1 rounded-full
                  ${
                    type?.toLocaleUpperCase() === "PART TIME"
                      ? "bg-green-100 text-green-600"
                      : type?.toLocaleUpperCase() === "FULL TIME"
                      ? "bg-blue-100 text-blue-600"
                      : type?.toLocaleUpperCase() === "INTERNSHIP"
                      ? "bg-purple-100 text-purple-600"
                      : "bg-gray-100 text-gray-600" // Màu mặc định nếu không có type
                  }
                `}
              >
                {type || "Unknown"}{" "}
                {/* Nếu không có type, hiển thị "Unknown" */}
              </span>
              <span className="text-sm text-gray-500">{salary}</span>
            </div>
          </div>
          <Button type="text" icon={<span className="text-gray-400">☆</span>} />
        </div>

        <div className="flex items-center gap-2">
          <Avatar
            src={avatar}
            size="small"
            className="bg-gray-200 text-gray-700"
          ></Avatar>
          <div>
            <p className="font-medium">{company}</p>
            <p className="text-sm text-gray-500">📍 {location}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
