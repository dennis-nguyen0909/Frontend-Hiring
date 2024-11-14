import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search, Info } from "lucide-react";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  InfoOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const locations = [
  "Thành phố Hồ Chí Minh",
  "Quận 1",
  "Quận 2",
  "Quận 3",
  "Quận 4",
  "Quận 5",
  "Quận 6",
  "Quận 7",
  "Quận 8",
  "Quận 9",
  "Quận 10",
  "Quận 11",
  "Quận 12",
];

type District = {
  code: string;
  codename: string;
  division_type: string;
  name: string;
  short_codename: string;
  wards: [];
  _id: string;
};

type IDataCityProps = {
  code: string;
  codename: string;
  districts_id: District[];
  division_type: string;
  name: string;
  phone_code: string;
  _id: string;
};

interface ILocationProps {
  handleChangeSelectedLocation: (location: string) => void;
  setSelectedLocation: (location: string) => void;
  selectedLocation: string;
  dataCity: IDataCityProps;
}

export default function LocationSlider({
  handleChangeSelectedLocation,
  setSelectedLocation,
  selectedLocation,
  dataCity,
}: ILocationProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  // Update selectedLocation to use 'code' instead of 'codename'
  useEffect(() => {
    if (!selectedLocation && dataCity?.code) {
      setSelectedLocation(dataCity.code); // Set code of the city
    }
  }, [selectedLocation, dataCity, setSelectedLocation]);

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      sliderRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (sliderRef.current) {
        sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      handleChangeSelectedLocation(selectedLocation); // Update location when it changes
    }
  }, [selectedLocation, handleChangeSelectedLocation]);

  return (
    <div className="relative max-w-screen-xl">
      <div className="relative flex justify-between px-[40px]">
        <button
          onClick={() => scroll("left")}
          className="absolute left-[-20px] top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 focus:outline-none focus:ring-2 focus:ring-[#d3464f]"
          aria-label="Scroll left"
        >
          <ArrowLeftOutlined className="h-6 w-6 text-gray-600" />
        </button>
        <div
          ref={sliderRef}
          className="flex overflow-x-auto scrollbar-hide space-x-4 py-[10px]"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* Show the city as a selectable item */}
          <button
            key={dataCity?._id}
            onClick={() => setSelectedLocation(dataCity?.code)} // Set selectedLocation with city code
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#d3464f] ${
              selectedLocation === dataCity?.code
                ? "bg-[#d3464f] text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {dataCity?.name} {/* City name */}
          </button>
{console.log('datacity',dataCity)}
          {/* Map over districts and display each as a button */}
          {dataCity?.districts_id?.map((district) => (
            <button
              key={district._id}
              onClick={() => setSelectedLocation(district.code)} // Set selectedLocation with district code
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#d3464f] ${
                selectedLocation === district.code
                  ? "bg-[#d3464f] text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {district.name} {/* District name */}
            </button>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 focus:outline-none focus:ring-2 focus:ring-[#d3464f]"
          aria-label="Scroll right"
        >
          <ArrowRightOutlined className="h-6 w-6 text-gray-600" />
        </button>
      </div>
    </div>
  );
}

