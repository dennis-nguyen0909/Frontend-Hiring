import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
  width?: string;
  height?: string;
  placeholder?: string;
  color?: string; // Thêm prop color cho nút
  borderColor?: string; // Thêm prop borderColor cho viền
}

export default function SearchInput({
  value,
  onChange,
  onClick,
  width = "30%",
  height = "32px",
  placeholder = "Tìm kiếm",
  color = "#4CD964", // Màu nền mặc định cho nút
  borderColor = "#D1D5DB", // Màu viền mặc định (xám nhạt)
}: SearchInputProps) {
  return (
    <div style={{ width }} className="w-full">
      <div className="relative">
        <Input
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="pl-4 pr-16 rounded-xl focus:border-[#4CD964] focus:shadow-none hover:border-gray-300 transition-colors"
          style={{
            backgroundColor: "white",
            fontSize: "16px",
            height,
            borderColor: borderColor, // Sử dụng borderColor cho viền input
          }}
        />
        <button
          className="absolute right-0 top-0 transition-colors flex items-center justify-center rounded-r-xl"
          style={{
            height,
            width: height,
            backgroundColor: color, // Sử dụng color cho màu nền nút
            borderColor: borderColor, // Sử dụng borderColor cho viền nút
            borderLeftWidth: "1px", // Để tránh trùng viền giữa Input và nút
          }}
          onClick={onClick}
        >
          <SearchOutlined className="text-white text-xl" />
        </button>
      </div>
    </div>
  );
}
