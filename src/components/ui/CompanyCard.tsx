import { Button, Image } from "antd";
import avtDefault from "../../assets/images/company/default.png";
import locationIcon from "../../assets/icons/location.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CompanyCard = ({ item }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate(`/employer-detail/${item?._id}`);
  };

  return (
    <div className="w-full sm:w-[300px] md:w-[350px] lg:w-[400px] h-auto rounded-lg flex flex-col justify-between p-3 sm:p-4 shadow-custom bg-white hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center gap-3 sm:gap-4 flex-1">
        <Image
          className="rounded-full"
          width={40}
          height={40}
          src={item?.avatar_company || avtDefault}
          preview={false}
        />
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm sm:text-base font-semibold text-textBlack md:text-lg truncate max-w-[150px] sm:max-w-[200px]">
              {item?.company_name}
            </p>
            <p className="font-light text-[10px] sm:text-xs bg-[#fbf0e8] text-[#de5057] px-2 py-1 rounded-full whitespace-nowrap">
              {t("featured")}
            </p>
          </div>
          {item?.city_id?.name && (
            <div className="flex items-center gap-2">
              <Image
                width={12}
                height={12}
                src={locationIcon}
                preview={false}
              />
              <p className="text-xs sm:text-sm text-graySecondary truncate max-w-[120px] sm:max-w-[200px]">
                {item?.city_id?.name || item?.address}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center mt-2 sm:mt-3">
        <Button
          onClick={handleNavigate}
          size="middle"
          className="!bg-black text-white !w-auto font-semibold rounded-full border-none py-1 sm:py-2 hover:!text-primaryColor text-xs sm:text-sm"
        >
          {t("location_open")}
        </Button>
      </div>
    </div>
  );
};

export default CompanyCard;
