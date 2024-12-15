import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, notification, Select } from "antd";
import { useEffect, useState } from "react";
import { SOCIAL_LINK_API } from "../../../../../services/modules/SocialLinkService";
import { useSelector } from "react-redux";

const SocialEmployer = () => {
  const userDetail = useSelector((state) => state.user);

  // State lưu các social links và tiểu sử
  const [socialLinks, setSocialLinks] = useState([
  ]);
// Cập nhật handleSocialLinkChange để chắc chắn giá trị được cập nhật đúng
const handleSocialLinkChange = (index, field, value) => {
  const updatedLinks = [...socialLinks];
  updatedLinks[index][field] = value;

  // Đảm bảo là nếu link đã tồn tại thì cập nhật hasChanged
  if (updatedLinks[index].isExisting) {
    updatedLinks[index].hasChanged = true;
  } else {
    updatedLinks[index].hasChanged = true;
    updatedLinks[index].isExisting = false; // Đánh dấu là link mới
  }

  setSocialLinks(updatedLinks);
};


  // Thêm một link mới
  const addNewSocialLink = () => {
    setSocialLinks([...socialLinks, { type: "", url: "" }]);
  };



  // Lấy các social links hiện tại từ server
  const handleGetSocialLinks = async (current = 1, pageSize = 10) => {
    try {
      const params = {
        current,
        pageSize,
        query: {
          user_id: userDetail?.id,
        },
      };
      const res = await SOCIAL_LINK_API.getAll(params, userDetail?.access_token);
      if (res.data) {
        // Đánh dấu các link lấy về từ server là "đã tồn tại"
        const existingLinks = res.data.items.map((link) => ({
          ...link,
          isExisting: true, // Đánh dấu là đã tồn tại
          hasChanged: false, // Ban đầu chưa có thay đổi
        }));
        setSocialLinks([...existingLinks]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Gọi hàm lấy dữ liệu ban đầu
  useEffect(() => {
    handleGetSocialLinks();
  }, []);

  // Hàm lưu thay đổi
  const handleSaveChanges = async () => {
    if (socialLinks.length <= 0) {
      notification.error({
        message: "Thông báo",
        description: "Vui lòng chọn link",
      });
      return;
    }

    try {
      // Lọc ra những social links cần tạo mới hoặc đã thay đổi
      const requests = socialLinks
        .filter((social) => social.hasChanged || !social.isExisting)
        .map((social) => {
          const params = {
            user_id: userDetail?.id,
            type: social?.type,
            url: social?.url,
          };
          return SOCIAL_LINK_API.create(params, userDetail?.access_token); // Gọi API tạo mới hoặc cập nhật
        });
      // Nếu có yêu cầu nào cần thực hiện
      if (requests.length > 0) {
        const results = await Promise.all(requests);

        // Kiểm tra kết quả của tất cả các lần gọi API
        if (results.every((res) => res.data)) {
          notification.success({
            message: "Thông báo",
            description: "Lưu thay đổi thành công!",
          });
        }
      } else {
        notification.info({
          message: "Thông báo",
          description: "Không có thay đổi nào để lưu.",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra, vui lòng thử lại.",
      });
    }
  };
const onDeleted = async(id)=>{
  const res = await SOCIAL_LINK_API.deleteMany([id],userDetail?.access_token);
  if(+res.statusCode === 200){
    notification.success({
      message:"Thông báo",
      description:"Xóa thành công"
    })
    handleGetSocialLinks()
  }
}
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Social Links</h2>
      {socialLinks.map((link, index) => (
        <div key={index} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Social Link {index + 1}
          </label>
          <div className="flex items-center space-x-2">
            <Select
              style={{ width: "150px" }}
              value={link.type}
              onChange={(value) =>
                handleSocialLinkChange(index, "type", value)
              }
            >
              <Select.Option value="Facebook">Facebook</Select.Option>
              <Select.Option value="Twitter">Twitter</Select.Option>
              <Select.Option value="Instagram">Instagram</Select.Option>
              <Select.Option value="Youtube">Youtube</Select.Option>
              <Select.Option value="LinkedIn">LinkedIn</Select.Option>
            </Select>
            <Input
              placeholder="Profile link/url..."
              value={link.url}
              onChange={(e) =>
                handleSocialLinkChange(index, "url", e.target.value)
              }
              style={{ flex: 1 }}
            />
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => onDeleted(link?._id)}
            />
          </div>
        </div>
      ))}
      <Button
        type="dashed"
        onClick={addNewSocialLink}
        className="w-full mt-4"
        icon={<PlusOutlined />}
      >
        Add New Social Link
      </Button>
      <Button
        type="primary"
        className="mt-4 bg-blue-500 hover:bg-blue-600"
        onClick={handleSaveChanges}
      >
        Save Changes
      </Button>
    </div>
  );
};

export default SocialEmployer;
