import React from "react";
import { Select } from "antd";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const dateFormats = [
  { label: "DD/MM/YYYY", format: "DD/MM/YYYY" },
  { label: "DD/MM/YY", format: "DD/MM/YY" },
  { label: "MM/DD/YYYY", format: "MM/DD/YYYY" },
  { label: "MM/DD/YY", format: "MM/DD/YY" },
  { label: "DD/MMM/YY", format: "DD/MMM/YY" },
  { label: "ISO 8601", format: "YYYY-MM-DD" },
  { label: "DD/MM/YYYY HH:mm", format: "DD/MM/YYYY HH:mm" },
  { label: "DD/MM/YYYY hh:mm A", format: "DD/MM/YYYY hh:mm A" },
  { label: "MM/DD/YYYY HH:mm", format: "MM/DD/YYYY HH:mm" },
  { label: "MM/DD/YYYY hh:mm A", format: "MM/DD/YYYY hh:mm A" },
  { label: "ISO 8601 with time", format: "YYYY-MM-DDTHH:mm:ssZ" },
];

const DateFormatSelect: React.FC<{
  selectedFormat: string;
  setSelectedFormat: (format: string) => void;
  handleChange: (value: string) => void;
}> = ({ selectedFormat, setSelectedFormat, handleChange }) => {
  const { t } = useTranslation();
  return (
    <div style={{ width: 300 }}>
      <label>{t("date_format")}:</label>
      <Select
        defaultValue={selectedFormat}
        onChange={handleChange}
        className="mt-2"
        style={{ width: "100%", fontSize: "12px" }}
      >
        {dateFormats.map((format) => (
          <Option key={format.format} value={format.format}>
            <span className="text-[12px]">{format.label}</span>
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default DateFormatSelect;
