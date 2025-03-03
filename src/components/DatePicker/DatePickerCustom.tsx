import React, { useState } from "react";
import { DatePicker, Button } from "antd";
import { useTranslation } from "react-i18next";
import useMomentFn from "../../hooks/useMomentFn";

const { RangePicker } = DatePicker;

interface CustomDateRangePickerProps {
  onSubmit?: (dates: any) => void;
  onChange: (dates: any, dateStrings: any) => void;
  isShowSubmit?: boolean;
}

const CustomDateRangePicker: React.FC<CustomDateRangePickerProps> = ({
  onSubmit,
  onChange,
  isShowSubmit = false,
}) => {
  const [formattedDates, setFormattedDates] = useState<string[]>([]);
  const { formatDate, dateFormat } = useMomentFn();
  const { t } = useTranslation();

  const handleDateChange = (dates: any, dateStrings: any) => {
    const formattedDateStrings = dates
      ? [formatDate(dates[0]), formatDate(dates[1])]
      : [];

    setFormattedDates(formattedDateStrings); // Chỉ dùng format để hiển thị
    console.log("Formatted dates for display: ", formattedDateStrings);

    if (onChange) {
      onChange(dates, dateStrings); // Trả về giá trị thực tế trong onChange
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(formattedDates);
    }
    console.log("Submitted date range: ", formattedDates);
  };

  return (
    <div>
      <RangePicker onChange={handleDateChange} />
      {isShowSubmit && (
        <Button
          type="primary"
          onClick={handleSubmit}
          style={{ marginLeft: 10 }}
        >
          {t("submit")}
        </Button>
      )}
    </div>
  );
};

export default CustomDateRangePicker;
