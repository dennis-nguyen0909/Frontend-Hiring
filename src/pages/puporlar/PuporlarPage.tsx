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
      {/* <div className="px-5 md:px-primary h-[530px] h-auto ">
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
      </div> */}
    </div>
  );
};

export default Puporlar;
