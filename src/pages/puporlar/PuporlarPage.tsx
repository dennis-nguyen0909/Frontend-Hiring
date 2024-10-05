import React from "react";
import { jobpilots, vacancies } from "../../helper";
import Vacancies from "../../components/ui/Vacancies";
import { Image } from "antd";
import arrowTop from "../../assets/icons/arrowTop.png";
import arrowBottom from "../../assets/icons/arrowBottom.png";
import PopularCategory from "../../components/PopularCategory.tsx/PopularCategory";
const Puporlar = () => {
  return (
    <div className="w-full h-auto">
      <div className="px-5 md:px-primary h-[530px]">
        <div className="flex h-1/3 items-center justify-start text-textBlack text-3xl font-medium">
          <h1>Most Popular Vacancies</h1>
        </div>
        <div className="h-2/3 flex flex-wrap justify-between items-center ">
          {vacancies.map((item, idx) => (
            <Vacancies
              name={item.name}
              idx={idx}
              position={item.position}
              amount={item.amount}
            />
          ))}
        </div>
      </div>
      <div className="px-5 md:px-primary h-[500px] bg-gray-50">
        <div className=" h-1/3 flex items-center justify-center ">
          <h1 className="text-textBlack text-3xl font-medium">
            How jobpilot work
          </h1>
        </div>
        <div className="h-2/3  flex flex-row justify-between relative  flex-wrap items-center">
          {jobpilots.map((item, idx) => {
            return (
              <>
                <div
                  key={idx}
                  className=" w-[312px] h-[220px] rounded-lg flex flex-col items-center justify-center py-4 "
                  style={{ backgroundColor: item.isBg && "white" }}
                >
                  <div className="flex flex-col items-center justify-center gap-[10px]  flex-1 ">
                    <Image
                      preview={false}
                      src={item.icon}
                      width={50}
                      height={50}
                    />
                  </div>
                    <div className="flex flex-col items-center justify-center gap-[10px]  " style={{padding:'0 20px'}}>
                        <p className="text-textBlack">{item.name}</p>
                        <span className="text-grayText text-center">
                        {item.description}
                        </span>
                    </div>
                </div>
              </>
            );
          })}
          <div className="absolute top-[64px] left-[239px] ">
            <Image
              preview={false}
              src={arrowTop}
              className=" text-4xl top-0 z-10 "
            />
          </div>
          <div className="absolute bottom-[135px] left-[570px] ">
            <Image

              preview={false}
              src={arrowBottom}
              className=" text-4xl top-0 z-10 "
              sizes="large"
              style={{fontSize:'30px'}}
            />
          </div>
          <div className="absolute top-[64px] right-[233px] ">
            <Image
              preview={false}
              src={arrowTop}
              className=" text-4xl top-0 z-10 "
            />
          </div>
        </div>
      </div>
      <PopularCategory />
    </div>
  );
};

export default Puporlar;
