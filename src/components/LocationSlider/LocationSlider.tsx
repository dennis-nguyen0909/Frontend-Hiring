import { useRef, useEffect } from "react";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";

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
  districts: District[];
  division_type: string;
  name: string;
  phone_code: string;
  _id: string;
};

interface ILocationProps {
  handleChangeSelectedLocation: (location: string) => void;
  setSelectedCity: (location: string) => void;
  selectedCity: string;
  dataCity: IDataCityProps;
  setSelectedDistrict: (location: string) => void;
  selectedDistrict: string;
}

export default function LocationSlider({
  handleChangeSelectedLocation,
  setSelectedCity,
  selectedCity,
  dataCity,
  selectedDistrict,
  setSelectedDistrict,
}: ILocationProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  // Update selectedCity to use 'code' of the city if no district is selected
  useEffect(() => {
    if (!selectedCity && dataCity?._id) {
      setSelectedCity(dataCity._id); // Set code of the city
    }
  }, [selectedCity, dataCity, setSelectedCity]);

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
    if (selectedCity) {
      handleChangeSelectedLocation(selectedCity); // Update location when it changes
    }
  }, [selectedCity, handleChangeSelectedLocation]);

  return (
    <div className="relative max-w-screen-lg">
      <div className="relative flex justify-between px-[25px] mx-5">
        <button
          onClick={() => scroll("left")}
          className="!text-[12px] absolute left-[-20px] top-1/2 transform -translate-y-1/2 bg-white lg:p-2 p-1 rounded-full shadow-md z-10 focus:outline-none focus:ring-2 focus:ring-[#d3464f]"
          aria-label="Scroll left"
        >
          <ArrowLeftOutlined className="h-6 w-6 text-gray-600" />
        </button>
        <div
  ref={sliderRef}
  className="flex overflow-x-auto scrollbar-hide space-x-4 py-[10px]"
  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
>
  {/* Nút chọn thành phố */}
  <button
    key={dataCity?._id}
    onClick={() => {
      setSelectedCity(dataCity?._id); // Chọn thành phố
      setSelectedDistrict(""); // Reset quận/huyện khi thành phố được chọn
    }}
    className={`flex-shrink-0 px-4 py-2 rounded-full text-[12px] font-medium focus:outline-none focus:ring-2 focus:ring-[#d3464f] ${
      selectedCity === dataCity?._id && !selectedDistrict // Khi chỉ có thành phố được chọn
        ? "bg-[#d3464f] text-white"
        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
    }`}
  >
    {dataCity?.name} {/* Tên thành phố */}
  </button>

  {/* Lặp qua các quận/huyện */}
  {dataCity?.districts?.map((district) => (
    <button
      key={district?._id}
      onClick={() => setSelectedDistrict(district?._id)} // Chọn quận/huyện
      className={`flex-shrink-0 lg:px-4 lg:py-2 px-2 py-[1px] rounded-full text-[12px] font-medium focus:outline-none focus:ring-2 focus:ring-[#d3464f] ${
        selectedDistrict === district?._id // Khi quận/huyện được chọn
          ? "bg-[#d3464f] text-white"
          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
      }`}
    >
      {district?.name} {/* Tên quận/huyện */}
    </button>
  ))}
</div>


        <button
          onClick={() => scroll("right")}
          className="!text-[12px] absolute lg:right-0 right-[-18px] top-1/2 transform -translate-y-1/2 bg-white lg:p-2 p-1  rounded-full shadow-md z-10 focus:outline-none focus:ring-2 focus:ring-[#d3464f]"
          aria-label="Scroll right"
        >
          <ArrowRightOutlined className="h-6 w-6 text-gray-600" size={12} />
        </button>
      </div>
    </div>
  );
}
