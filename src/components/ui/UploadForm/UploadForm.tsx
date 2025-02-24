import { Upload, Button } from "antd";
import { UploadOutlined, LinkOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { t } from "i18next";

const UploadForm = ({ onFileChange, setLink, link }) => {
  const uploadProps = {
    beforeUpload: (file) => {
      onFileChange(file); // Gọi hàm callback truyền từ props để trả về file
      return false; // Không upload ngay lập tức
    },
  };
  const [visibleInput, setVisibleInput] = useState<boolean>(false);

  useEffect(() => {
    if (link) {
      setVisibleInput(true);
    }
  }, [link]);
  return (
    <div className="flex flex-col items-center gap-4 p-6 border rounded-md shadow-sm">
      <h3 className="text-[13px] text-[#777] font-semibold">
        {t("add_link_or_upload_image_to_certificate")}
      </h3>
      <div className="flex gap-4">
        {/* Nút tải ảnh */}
        <Upload {...uploadProps} className="ant-upload">
          <Button
            icon={<UploadOutlined />}
            className="flex items-center gap-2 text-green-500 border-green-500 hover:border-green-600 hover:text-green-600"
          >
            {t("upload_image")}
          </Button>
        </Upload>
        {/* Nút tải liên kết */}
      </div>
      <div className="flex gap-2 flex-col w-full ">
        <Button
          icon={<LinkOutlined />}
          className="flex items-center gap-2 text-green-500 border-green-500 hover:border-green-600 hover:text-green-600"
          onClick={() => setVisibleInput(!visibleInput)}
        >
          {t("upload_link")}
        </Button>
        {visibleInput && (
          <input
            type="text"
            placeholder="Nhập liên kết"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="px-2 py-1 border rounded-md focus:outline-none focus:ring focus:border-green-500"
          />
        )}
      </div>
    </div>
  );
};

export default UploadForm;
