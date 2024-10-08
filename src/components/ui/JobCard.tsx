import { Button, Image } from "antd";
import { useState } from "react";
import dollarIcon from "../../assets/icons/dollar.png";
import locationIcon from "../../assets/icons/location.png";
import bagIcon from "../../assets/icons/bagFeatured.png";
import bookmark from "../../assets/images/company/bookmark.png";
import defaultImage from "../../assets/images/company/default.png";
import { ArrowRightOutlined } from "@ant-design/icons";

const JobCard = ({ job }) => {
  const [isHover, setIsHover] = useState<boolean>(false);
  
  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="flex flex-col sm:flex-row cursor-pointer justify-between items-start sm:items-center gap-5 rounded-lg"
      style={{ padding: "20px", border: isHover ? '1px solid #0A65CC' : '1px solid #ccc' }}
    >
      <div className="flex sm:items-center w-full">
        <Image
          width={50}
          height={50}
          src={job?.image || defaultImage}
          preview={false}
        />
        <div className="flex flex-col ml-4 gap-2 w-full">
          <div className="flex items-center gap-3 justify-between md:justify-start">
            <p className="text-base font-semibold">{job?.title}</p>
            <div className="bg-[#E8F1FF] text-primaryBlue px-2 py-1 rounded-full text-xs hidden md:block">Contact Base</div>
                <div className={`bg-white ${isHover ? 'bg-[#E8F1FF]' : ''} w-10 h-10 cursor-pointer rounded-md block md:hidden `}>
            <Image src={bookmark} preview={false} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 w-max flex-col md:flex-row">
          <div className="bg-[#E8F1FF] text-primaryBlue px-2 py-1 rounded-full text-xs text-center block md:hidden ">Contact Base</div>
            {job?.location && (
              <p className="flex items-center gap-1 text-sm">
                <Image
                  width={20}
                  height={20}
                  src={locationIcon}
                  preview={false}
                />
                {job?.location}
              </p>
            )}
            <p className="flex items-center gap-1 text-sm">
              <Image
                width={20}
                height={20}
                src={dollarIcon}
                preview={false}
              />
              {job?.salary_range.min} - {job?.salary_range.max}
            </p>
            <p className="flex items-center gap-1 text-sm">
              <Image
                width={20}
                height={20}
                src={bagIcon}
                preview={false}
              />
              {job?.benefit[0]}
            </p>

          </div>
        </div>
      </div>
      <div className=" w-full  flex items-center md:justify-end gap-3 mt-4 sm:mt-0 justify-between">
        <div className={`bg-white ${isHover ? 'bg-[#E8F1FF]' : ''} w-10 h-10 cursor-pointer rounded-md hidden md:block `}>
          <Image src={bookmark} preview={false} />
        </div>
        <Button
          size="large"
          className={`!border-none !font-medium !bg-[#EDEFF5] !cursor-pointer rounded-md ${
              isHover
              ? "!bg-[#0A65CC] !text-white"
              : "!text-[#0A65CC] !bg-[#EDEFF5]"
          } flex-1 md:flex-none` }
        >
          Apply Now <ArrowRightOutlined className="font-bold" />
        </Button>
      </div>
    </div>
  );
}

export default JobCard;
