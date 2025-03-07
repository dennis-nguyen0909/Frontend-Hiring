import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const popularSearches = [
  "Front-end",
  "Back-end",
  "Development",
  "PHP",
  "Laravel",
  "Bootstrap",
  "Developer",
  "Team Lead",
  "Product Testing",
  "JavaScript",
];
const IntroduceV2 = () => {
  const [searchValue, setSearchValue] = useState("");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const onNavigate = () => {
    navigate("/jobs", {
      state: {
        keyword: searchValue, // Dữ liệu muốn truyền
      },
    });
  };
  const onSearchPopular = (value: string) => {
    setSearchValue(value);
    navigate("/jobs", {
      state: {
        keyword: value, // Dữ liệu muốn truyền
      },
    });
  };
  return (
    <div className="h-auto bg-white px-4 md:px-primary pb-20">
      <div className="flex w-full flex-col h-auto">
        <div className="bg-white px-0 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-[18px] font-bold text-center mb-2">
              {t("find_job")}{" "}
              <span className="relative">
                {t("dream")}
                <span className="absolute bottom-0 left-0 w-full h-2 bg-blue-200 -z-10"></span>
              </span>
            </h1>
            <p className="text-center text-gray-600 mb-8 text-[10px]">
              {t("find_job_description")}
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 bg-white rounded-lg shadow-sm border">
                <div className="flex-1 flex items-center ml-2">
                  <Search className="w-4 h-4 text-gray-400 mr-" />
                  <input
                    type="text"
                    placeholder={t("job_title_or_keyword")}
                    className="w-full border-none pl-1 py-1 text-[10px] focus:outline-none focus:border-none h-8"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                  <Button
                    onClick={onNavigate}
                    type="primary"
                    className="!bg-primaryColor h-6 text-[10px] px-3 mr-2 text-center"
                  >
                    {t("find_job")}
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-2 mt-5">
              <span className="text-[12px] text-gray-500">
                {t("popular_searches")}
              </span>
              {popularSearches.map((term) => (
                <button
                  onClick={() => onSearchPopular(term)}
                  key={term}
                  className=" !text-[12px] rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-200"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroduceV2;
