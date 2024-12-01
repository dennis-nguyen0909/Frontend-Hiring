import { useRef, useEffect, useState } from "react";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";

interface ISalarySliderProps {
  handleChangeSelectedSalary: (salaryRange: { min: number; max: number } | { is_negotiable: boolean }) => void;
  selectedSalary: any;
}

export default function SliderSalary({
  handleChangeSelectedSalary,
  selectedSalary,
}: ISalarySliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const salaryRanges = [
    { value: "all", label: "Tất cả", range: "all" },
    { value: "under_10m", label: "Dưới 10 triệu", range: { min: 0, max: 10000000 } },
    { value: "10m_to_15m", label: "Từ 10-15 triệu", range: { min: 10000000, max: 15000000 } },
    { value: "15m_to_20m", label: "Từ 15-20 triệu", range: { min: 15000000, max: 20000000 } },
    { value: "20m_to_25m", label: "Từ 20-25 triệu", range: { min: 20000000, max: 25000000 } },
    { value: "25m_to_30m", label: "Từ 25-30 triệu", range: { min: 25000000, max: 30000000 } },
    { value: "30m_to_50m", label: "Từ 30-50 triệu", range: { min: 30000000, max: 50000000 } },
    { value: "above_50m", label: "Trên 50 triệu", range: { min: 50000000, max: Infinity } },
    { value: "thoa_thuan", label: "Thỏa thuận", range: "thoa_thuan" },
  ];

  // Set the initial selected salary to "Tất cả" if none is provided
  const [currentSelectedSalary, setCurrentSelectedSalary] = useState({ value: "all", label: "Tất cả", range: "all" });

  // Function to handle scrolling
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

  // Effect to handle the selected salary change
  useEffect(() => {
    if (selectedSalary) {
      setCurrentSelectedSalary(selectedSalary);
    }
  }, [selectedSalary]);
  console.log("currentSelectedSalary",currentSelectedSalary)
  return (
    <div className="relative max-w-screen-lg">
      <div className="relative flex justify-between px-[40px]">
        {/* Left scroll button */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-[-20px] top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 focus:outline-none focus:ring-2 focus:ring-[#d3464f]"
          aria-label="Scroll left"
        >
          <ArrowLeftOutlined className="h-6 w-6 text-gray-600" />
        </button>

        {/* Salary range slider */}
        <div
          ref={sliderRef}
          className="flex overflow-x-auto scrollbar-hide space-x-4 py-[10px]"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {salaryRanges.map((range,idx) => (
            <button
              key={idx}
              onClick={() => {
                handleChangeSelectedSalary(range.value);
                setCurrentSelectedSalary(range.value); 
              }}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#d3464f] transition duration-200 ease-in-out 
                ${currentSelectedSalary === range.value && `bg-[#d3464f] text-white`}
              `}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* Right scroll button */}
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
