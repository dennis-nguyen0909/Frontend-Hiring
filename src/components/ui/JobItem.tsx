import { Image } from "antd";
import React from "react";
import defaultImage from "../../assets/images/company/default.png";
import { CircleDollarSign, DollarSign, Heart, MapPin } from "lucide-react";
import { convertHtmlToText, formatCurrency } from "../../untils";
import { useNavigate } from "react-router-dom";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";

interface IJobItemProps {
  item: any;
  key: number;
}

const JobItem = ({ item }: IJobItemProps) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/job-information/${item._id}`)}
      className="bg-white flex h-[130px] rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg"
    >
      {/* Left Content */}
      <div className="flex items-center justify-center pl-4">
        <Image
          preview={false}
          src={item?.user_id?.avatar_company || defaultImage}
          className="object-cover rounded-md"
          width={100}
          height={100}
        />
      </div>
      {/* Right Content */}
      <div className="flex-grow p-4 max-w-[370px] flex flex-col  justify-evenly">
        <h3 className="text-lg font-semibold">{item.title}</h3>
        <p className="text-gray-600 truncate">
          {convertHtmlToText(item?.description)}
        </p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <MapPin size={18} />
            <span className="text-sm text-gray-500">
              {item?.city_id?.name} , {item?.district_id.name}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 justify-between">
          <div className="flex items-center gap-1">
            <CircleDollarSign size={18} />
            {item.is_negotiable ? (
              <span className="text-sm text-gray-500">Lương thỏa thuận</span>
            ) : (
              <div className="flex items-center">
                <span className="text-sm text-gray-500">
                  {formatCurrency(item.salary_range_min)}
                  {item?.type_money?.symbol}
                </span>
                <span className="text-sm text-gray-500"> - </span>
                <span className="text-sm text-gray-500">
                  {formatCurrency(item.salary_range_max)}
                  {item?.type_money?.symbol}
                </span>
              </div>
            )}
          </div>
          <div className="mr-2 transition-colors duration-200 hover:text-[#cf4850]">
            {/* <Heart size={18} className="cursor-pointer" /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobItem;
