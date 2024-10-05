import { jobpilots } from "../../helper";
import arrowTop from "../../assets/icons/arrowTop.png";
import arrowBottom from "../../assets/icons/arrowBottom.png";
import { Image } from "antd";

const JobWork = () => {
  return (
    <div className="px-5 md:px-primary h-[500px] bg-gray-50 overflow-y-auto">
      {/* Title Section */}
      <div className="h-1/3 flex items-center justify-center">
        <h1 className="text-textBlack text-3xl font-medium">How jobpilot works</h1>
      </div>

      {/* Job Pilots Section */}
      <div className="h-2/3 flex flex-wrap justify-between relative items-center gap-4 md:gap-6">
        {jobpilots.map((item, idx) => (
          <div
            key={idx}
            className="w-full sm:w-[48%] md:w-[30%] lg:w-[23%] h-[220px] rounded-lg flex flex-col items-center justify-center py-4 bg-white"
            style={{ backgroundColor: item.isBg ? "white" : "" }}
          >
            {/* Icon */}
            <div className="flex flex-col items-center justify-center gap-[10px] flex-1">
              <Image preview={false} src={item.icon} width={50} height={50} />
            </div>

            {/* Description */}
            <div className="flex flex-col items-center justify-center gap-[10px] px-5 text-center">
              <p className="text-textBlack">{item.name}</p>
              <span className="text-grayText">{item.description}</span>
            </div>
          </div>
        ))}

        {/* Arrows */}
        <div className="absolute top-[64px] left-[239px] hidden xl:block">
          <Image preview={false} src={arrowTop} className="text-4xl z-10" />
        </div>
        <div className="absolute bottom-[135px] left-[570px] hidden xl:block">
          <Image
            preview={false}
            src={arrowBottom}
            className="text-4xl z-10"
            sizes="large"
            style={{ fontSize: "30px" }}
          />
        </div>
        <div className="absolute top-[72px] right-[221px] hidden xl:block">
          <Image preview={false} src={arrowTop} className="text-4xl z-10" />
        </div>
      </div>
    </div>
  );
};

export default JobWork;
